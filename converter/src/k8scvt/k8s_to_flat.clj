(ns k8scvt.k8s-to-flat
  (:require [clojure.string :as str]
            [clojure.set :refer :all]
            [clojure.pprint :refer [pprint]]
            [clojure.walk :refer [postwalk]]
            [clj-yaml.core :as yaml]
            [engine.core :refer :all]
            [k8scvt.file-import :as fi]
            [k8scvt.util :refer [id-insert! id-remove!
                                 generate-constraint-error]])
    (:import [java.util UUID]))

(defancestor [:container :container-group] :unit)

(deforder (:with :k8s) (:with :unit))

(def known-types
  #{:type :__id :id :app-name :persistentvolumes :persistentvolumeclaims
    :services :daemonsets :deployments :pods :namespaces :statefulsets
    :configmaps
    :cronjobs :ingresses :replicationcontrollers :validation-errors})

(def default-k8s-secret-mode 420)

(def ^:dynamic *validation* 20000)
(def ^:dynamic *adjustment* 10000)
(def ^:dynamic *specs-created* -100)
(def ^:dynamic *cleanup* -10000)

(defn to-lower-if [s]
  (when s (str/lower-case s)))

(defn to-octal [n]
  (if (string? n)
    n
    (format "%o" n)))

(defn unknown-keys [m] (into #{} (filter #(not (known-types %)) (keys m))))

(defn trim-left-dashes [s]
  (loop [c s]
    (if (not (str/starts-with? c "-"))
      c
      (recur (str/replace-first c "-" "")))))

(defn trim-right-dashes [s]
  (if (not (str/ends-with? s "-"))
    s
    (str/reverse (trim-left-dashes (str/reverse s)))))

(def trim-edge-dashes
  (comp trim-left-dashes trim-right-dashes))

(defn add-namespace [wme ns]
  (if (= (:type wme) :unknown-k8s-kind)
    (update-in wme [:body :metadata] assoc :namespace ns)
    (update wme :metadata assoc :namespace ns)))

(defn remove-namespace [wme]
  (if (= (:type wme) :unknown-k8s-kind)
    (update-in wme [:body :metadata] dissoc :namespace)
    (update wme :metadata dissoc :namespace)))

(defn get-namespace [wme]
  (if (= (:type wme) :unknown-k8s-kind)
    (get-in wme [:body :metadata :namespace])
    (get-in wme [:metadata :namespace])))

(defn safe-str [kw-or-str]
  (if (keyword? kw-or-str)
    (subs (str kw-or-str) 1)
    kw-or-str))

(defn label-name [val]
  (let [protected (fi/protect-qualified-keywords val)
        new-val (trim-edge-dashes
                 (str/replace (safe-str protected) #"[^a-zA-Z0-9\.\-/]" "-"))]
    (if (keyword? protected)
      (keyword new-val)
      new-val)))

(defn label-key-name [val] (label-name (keyword val)))

(defn translate-controller-type [ct]
  (or ({:deployment "Deployment"
        :daemonset "DaemonSet"
        :statefulset "StatefulSet"
        :job "Job"
        :cronjob "CronJob"}
       ct)
      "Deployment"))

(defn get-id! [] (str (UUID/randomUUID)))

(defn to-number [n]
  (cond (number? n) n
        (string? n) (read-string n)
        :else (throw (RuntimeException. (str "Not a number: " n)))))

(defn empty-wme-with-id? [wme]
  (= (count wme) 3)) ; :type + :id + :__id

(defn get-proto [probe]
  "Gets protocol for httpGet or tcpSocket probes (exec already covered)"
  (cond
    (:httpGet probe) "http"
    (:tcpSocket probe) "tcp"
    :else (throw (RuntimeException. "invalid probe type"))))

(defn map-k8s-healthcmd [probe cont-id]
  (let [base (rename-keys probe {:exec :healthcmd
                                 :failureThreshold :retries
                                 :periodSeconds :interval
                                 :timeoutSeconds :timeout})]
    (assoc (dissoc base :httpGet :tcpSocket)
           :type :healthcheck
           :protocol "exec"
           :container cont-id
           :healthcmd (:command (:healthcmd base)))))

(defn map-k8s-other-healthcheck [probe cont-id]
  (let [base (rename-keys probe {:failureThreshold :retries
                                 :periodSeconds :interval
                                 :timeoutSeconds :timeout})]
    (assoc (dissoc base :healthcmd (if (= (:protocol probe) "tcp")
                                     :httpGet
                                     :tcpSocket))
           :type :healthcheck
           :protocol (get-proto probe)
           :container cont-id)))

(defn transform-hc [probe cont-id]
  (if (:exec probe)
    (map-k8s-healthcmd probe cont-id)
    (map-k8s-other-healthcheck probe cont-id)))

(defn selector-selects [selector labels]
  (every? (fn [[k v]] (= v (get labels k))) selector))

(defn assoc-if-filled
  ([m k val] (if (and (some? val) (not= val "")) (assoc m k val) m))
  ([m kv] (reduce-kv (fn [m k v] (assoc-if-filled m k v)) m kv)))

(defn filled-in? [val] (and val (not= val "")))

(defn empty-field? [val] (not (filled-in? val)))

(defn service-selects [k8s-svc label-group]
  (let [selector (:selector k8s-svc)]
    (selector-selects selector (:labels label-group))))

(defn get-restart-policy [pspec]
  (or ({"Always" "always"
        "Never" "none"
        "OnFailure" "unless-stopped"} (:restartPolicy pspec))
      "always"))

(defn get-named-volume-mount [container name]
  (loop [vms (:volumeMounts container)]
    (when-let [vm (first vms)]
      (if (= (:name vm) name)
        vm
        (recur (rest vms))))))

(defn select-first-value [val key m2]
  (cond (nil? val) (key m2)
        (empty-field? val) (or (key m2) val)
        :else val))

(defn first-value [key m1 m2]
  (select-first-value (key m1) key m2))

(defn merge-flats [m1 m2]
  (reduce-kv (fn [m k v] (assoc m k (select-first-value v k m2)))
             {}
             m1))

(defn count-ingress-key-instances [m k]
  (let [counter (atom 0)]
    (postwalk
     (fn [x]
       (if (and (map? x) (k x))
         (swap! counter inc)
         x))
     m) @counter))

(defn ingress-has-key-instances [m k]
  (> (count-ingress-key-instances m k) 0))

(defn substitute-ingress-attributes [ingress svcs f inkey outkey]
  "Substitute default and path-based service names for service ids"
  (postwalk
   (fn [x]
     (if (and (map? x) ((keyword inkey) x))
       (assoc (dissoc x inkey) outkey (f ((keyword inkey) x) svcs))
       x))
   ingress))

(defn strat-stringify [strat]
  (if-let [strat-type (:type strat)]
    (if (and (= (name strat-type) "RollingUpdate")
             (filled-in? (:rollingUpdate strat)))
      (update
       strat
       :rollingUpdate
       #(assoc-if-filled
         %
         {:maxSurge (str (:maxSurge strat))
          :maxUnavailable (str (:maxUnavailable strat))}))
      strat)
    strat))

(defrule remove-empty-k8s
  "Get rid of k8s shell after data has been extracted"
  [?k8s :k8s (empty-wme-with-id? ?k8s)]
  =>
  (id-remove! ?k8s))

(defrule add-app-info
  "Add a 'app-info' element"
  [?k8s :k8s]
  [:not [? :app-info]]
 =>
  ;; XXX: same values as existing golang converter
  (id-remove! ?k8s)
  (id-insert! {:name (:app-name ?k8s)
               :description "[insert app description here]"
               :logo "[insert name of app logo image here]"
               :type :app-info})
  (id-insert! (dissoc ?k8s :app-name)))

(defrule ignore-output-only-fields
  {:priority *adjustment*}
  "Runtime info should not be included in models. For now, we're just
  removing creationTimestamp but more will likely come later"
  [?k8s :k8s
   (some #(or (some fi/output-only-metadata (keys (:metadata %)))
              (some fi/output-only-toplevel (keys %)))
         (apply concat (vals (dissoc ?k8s :type :app-name :id :__id))))]
  =>
  (id-remove! ?k8s)
  (id-insert!
   (reduce-kv (fn [m k v]
                (assoc m k (vec (map fi/remove-output-only-fields v))))
              (select-keys ?k8s [:type :app-name :id :__id])
              (dissoc ?k8s :type :app-name :id :__id))))

(defrule check-for-single-namespace
  {:priority *validation*}
  "Ensure there are 0 or 1 namespaces referenced in the model."
  [?k8s :k8s
   (> (count (group-by #(or (get-namespace %)
                            (and (= (:kind %) "Namespace") (:name (:metadata %)))
                            "default")
                       (apply concat
                              (vals (dissoc ?k8s :id :__id :type :app-name)))))
      1)]
  =>
  (generate-constraint-error "Only one namespace may be included in a model")
  (id-remove! ?k8s))

(defrule extract-namespaces
  "Load namespaces from k8s into working memory"
  [?k8s :k8s (:namespaces ?k8s)]
  =>
  (id-remove! ?k8s)
  (doseq [ns (:namespaces ?k8s)]
    (id-insert! {:type :k8s-namespace
                 :name (:name (:metadata ns))
                 :label-name (:name (:labels (:metadata ns)))}))
  (id-insert! (dissoc ?k8s :namespaces)))

(defrule extract-cron-jobs
  "Get CronJob controllers out of a k8s model"
  [?k8s :k8s (:cronjobs ?k8s)]
  =>
  (id-remove! ?k8s)
  (doseq [cj (:cronjobs ?k8s)]
    (id-insert! (assoc cj :type :cronjob :name (:name (:metadata cj)))))
  (id-insert! (dissoc ?k8s :cronjobs)))

(defrule save-cron-data
  {:priority *cleanup*}
  [?podspec :podspec (filled-in? (:cronjob-spec ?podspec))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?podspec))]
  =>
  (remove ?podspec)
  (id-insert! {:type :cronjob-data
               :cgroup (:id ?cgroup)
               :cronjob-spec (:cronjob-spec ?podspec)
               :job-spec (:job-spec ?podspec)}))

(defrule extract-persistent-volume-claims
  "Load pvcs from k8s into working memory"
  [?k8s :k8s (:persistentvolumeclaims ?k8s)]
  =>
  (doseq [pvc (:persistentvolumeclaims ?k8s)]
    (let [spec (:spec pvc)]
      (id-insert! {:type :volume
                   :is-template false
                   :claim-name (:name (:metadata pvc))
                   :name (:name (:metadata pvc))
                   :physical-volume-name (or (:volumeName spec) "")
                   :volume-mode (or (:volumeMode spec) "Filesystem")
                   :access-modes (or (:accessModes spec) ["ReadWriteOnce"])
                   :storage-class (or (:storageClassName spec) "")
                   :storage (or (get-in spec [:resources :requests :storage]) "")
                   :selector (or (:selector spec) {:matchLabels {}})
                   :annotations {}})))
  (id-remove! ?k8s)
  (id-insert! (dissoc ?k8s :persistentvolumeclaims)))

(defrule extract-services
  "Load services from k8s into working memory"
  [?k8s :k8s (:services ?k8s)]
  =>
  (doseq [svc (:services ?k8s)]
    (let [meta (:metadata svc) name (:name meta) spec (:spec svc)]
      (id-insert! (assoc (update svc
                                 :spec #(dissoc % :selector :metadata :clusterIP))
                         :type :service :name name))
      (let [base {:type :k8s-service
                  :metadata meta
                  :name name
                  :selector (:selector spec)
                  :cluster-ip (or (:clusterIP spec) "")
                  :service-type (or (:type spec) "ClusterIP")}]
        (id-insert! (if (= (:service-type base) "ExternalName")
                      (assoc base :external-name (:externalName spec))
                      base)))))
  (id-remove! ?k8s)
  (id-insert! (dissoc ?k8s :services)))

(defrule extract-stateful-sets
  "Load stateful sets from k8s into working memory"
  [?k8s :k8s (:statefulsets ?k8s)]
  =>
  (doseq [ss (:statefulsets ?k8s)]
    (id-insert! (assoc ss :type :statefulset :name (:name (:metadata ss)))))
  (id-remove! ?k8s)
  (id-insert! (dissoc ?k8s :statefulsets)))

(defrule extract-deployments
  "Load deployments from k8s into working memory"
  [?k8s :k8s (:deployments ?k8s)]
  =>
  (doseq [dep (:deployments ?k8s)]
    (id-insert! (assoc dep :type :deployment :name (:name (:metadata dep)))))
  (id-remove! ?k8s)
  (id-insert! (dissoc ?k8s :deployments)))

(defrule extract-pods
  "Load bare pods from k8s into working memory"
  [?k8s :k8s (:pods ?k8s)]
  =>
  (doseq [pod (:pods ?k8s)]
    (id-insert! (assoc pod :type :pod :name (:name (:metadata pod)))))
  (id-remove! ?k8s)
  (id-insert! (dissoc ?k8s :pods)))

(defrule extract-replication-controllers-into-deployments
  "Load replication controllers from k8s into working memory"
  [?k8s :k8s (:replicationcontrollers ?k8s)]
  =>
  (doseq [rc (:replicationcontrollers ?k8s)]
    (id-insert! (assoc rc :type :deployment :kind "Deployment"
                       :metadata (:metadata rc)
                       :name (:name (:metadata rc)))))
  (id-remove! ?k8s)
  (id-insert! (dissoc ?k8s :replicationcontrollers)))

(defrule extract-daemonsets
  "Load daemonsets from k8s into working memory"
  [?k8s :k8s (:daemonsets ?k8s)]
  =>
  (doseq [dset (:daemonsets ?k8s)]
    (id-insert! (assoc dset :type :daemonset :name (:name (:metadata dset)))))
  (id-remove! ?k8s)
  (id-insert! (dissoc ?k8s :daemonsets)))

(defrule extract-ingresses
  "Load ingresses from k8s into working memory"
  [?k8s :k8s (:ingresses ?k8s)
   (some #(ingress-has-key-instances % :serviceName) (:ingresses ?k8s))]
  [?ks :k8s-service]
   =>
  (let [svcs (collect! :k8s-service identity)
        f (fn [nm ents] (:id (first (filter #(= (:name %) nm) ents))))
        inkey :serviceName
        outkey :service-id]
     (doseq [ingress (:ingresses ?k8s)]
       (id-insert!
        (assoc
         (substitute-ingress-attributes ingress svcs f inkey outkey)
         :type :ingress))))
  (id-remove! ?k8s)
  (id-insert! (dissoc ?k8s :ingresses)))

(defrule extract-unknown-kind
  "Save k8s objects we don't recognize"
  [?k8s :k8s (not= (unknown-keys ?k8s) #{})]
  =>
  (let [updated (atom ?k8s)]
    (doseq [unk (unknown-keys ?k8s)]
      (swap! updated dissoc unk)
      (doseq [obj (unk ?k8s)]
        (id-insert! {:type :unknown-k8s-kind
                     :body (yaml/generate-string
                            obj
                            :dumper-options {:flow-style :block})})))
    (id-remove! ?k8s)
    (id-insert! @updated)))

(defn stateful [cont field-chain default-val]
  (let [cont-type (translate-controller-type (:type cont))]
    (if (= cont-type "StatefulSet")
      (or (get-in (:spec cont) field-chain) default-val)
      default-val)))

(defn type-specific-fetch [cont field-chain-map default-map]
  (let [cont-type (translate-controller-type (:type cont))
        field-chain (or (get field-chain-map cont-type)
                        (:default field-chain-map))
        default-val (or (get default-map cont-type)
                        (:default default-map))]
    (or (get-in (:spec cont) field-chain) default-val)))

;; drop yipee and last-applied-config annotations
;; - yipee-annotations: we'll want to generate new ones on download.
;; - last-applied-config: generally doesn't play well with
;;   subsequent "kubectl apply".
(def last-applied-anno "kubectl.kubernetes.io/last-applied-configuration")
(defn filter-annos [annos]
  (let [annos (into {}
                    (filter
                     #(and
                       (not (str/starts-with? (name (first %)) "yipee."))
                       (not (str/starts-with?
                             (name (first %)) last-applied-anno)))
                     annos))]
    (when (not-empty annos)
      annos)))

(defn get-annotation-type [obj]
  (let [typ (:type obj)]
    (case typ
      :statefulset :statefulSet
      :daemonset :daemonSet
      :pod (if (= "Never" (get-in obj [:spec :restartPolicy]))
             :pod
             :deployment)
      typ)))

(defn flatten-annos [annos]
  (map (fn [[k v]] {:key k :value v}) annos))

(defrule extract-podspec-from-controller
  "Create podspec from a controller"
  [?cont :controller (:spec ?cont)]
  =>
  (let [cont-type (translate-controller-type (:type ?cont))
        ptemp (if (= cont-type "CronJob")
                (get-in ?cont [:spec :jobTemplate :spec :template])
                (:template (:spec ?cont)))
        pspec (:spec ptemp)]
    (id-remove! ?cont)
    (when-let [annos (filter-annos (:annotations (:metadata ptemp)))]
      (doseq [anno (flatten-annos annos)]
        (id-insert! (merge anno
                           {:type :k8s-annotation
                            :location [:spec :template :metadata :annotations]
                            :annotated-name (:name ?cont)
                            :annotated-type (get-annotation-type ?cont)}))))
    (id-insert!
     (assoc-if-filled
      (assoc pspec
             :type :podspec
             :controller-type cont-type
             :controller-uid (get-in ?cont [:metadata :uid])
             :service-name (stateful ?cont [:serviceName] "")
             :update-strategy (strat-stringify
                               (type-specific-fetch
                                ?cont
                                {"StatefulSet" [:updateStrategy]
                                 :default [:strategy]}
                                {"CronJob" ""
                                 "StatefulSet" {:type "RollingUpdate"
                                               :rollingUpdate
                                               {:partition 0}}
                                 "DaemonSet" {:type "RollingUpdate"
                                             :rollingUpdate
                                             {:maxUnavailable "1"}}
                                 :default {:type "RollingUpdate"
                                           :rollingUpdate
                                           {:maxSurge "1"
                                            :maxUnavailable "1"}}}))
             :pod-management-policy (type-specific-fetch
                                     ?cont
                                     {:default [:podManagementPolicy]}
                                     {"CronJob" "" :default "OrderedReady"})
             :termination-grace-period (type-specific-fetch
                                        ?cont
                                        {"StatefulSet"
                                         [:template :spec
                                          :terminationGracePeriodSeconds]
                                         :default [:-invalid-path-]}
                                        {"CronJob" "" :default 10})
             :claim-templates (stateful ?cont [:volumeClaimTemplates] "")
             :image-pull-secrets (or (:imagePullSecrets pspec) "")
             :service-account-name (or (:serviceAccountName pspec) "")
             :automount-service-account-token
             (:automountServiceAccountToken pspec "")
             :name (:name ?cont)
             :top-labels (or (:labels (:metadata ?cont)) "")
             :labels (or (:labels (:metadata ptemp)) "")
             :replicas (or (:replicas (:spec ?cont))
                           (if (= cont-type "DaemonSet") 0 1))
             :cronjob-spec (if (= cont-type "CronJob")
                             (assoc
                              (select-keys (:spec ?cont)
                                           [:suspend
                                            :startingDeadlineSeconds
                                            :failedJobsHistoryLimit
                                            :successfulJobsHistoryLimit
                                            :concurrencyPolicy])
                              :schedule (type-specific-fetch
                                         ?cont
                                         {"CronJob" [:schedule]
                                          :default [:-invalid-path-]}
                                         {:default ""}))
                             "")
             :job-spec (if (= cont-type "CronJob")
                         (select-keys
                          (get-in ?cont [:spec :jobTemplate :spec])
                          [:backoffLimit :activeDeadlineSeconds :parallelism
                           :completions])
                         ""))
      :revisionHistoryLimit (:revisionHistoryLimit (:spec ?cont))))))

(defrule extract-podspec-from-pod
  "Create podspec from a bare pod"
  [?pod :pod (:spec ?pod)]
  =>
  (let [pspec (:spec ?pod)]
    (id-remove! ?pod)
    (id-insert! (assoc pspec
                       :type :podspec
                       :controller-type "Deployment"
                       :image-pull-secrets (or (:imagePullSecrets pspec) "")
                       :service-account-name (or (:serviceAccountName pspec) "")
                       :automount-service-account-token
                       (:automountServiceAccountToken pspec "")
                       :service-name ""
                       :update-strategy ""
                       :pod-management-policy ""
                       :termination-grace-period ""
                       :claim-templates ""
                       :cronjob-spec ""
                       :job-spec ""
                       :name (:name ?pod)
                       :top-labels (:labels (:metadata ?pod))
                       :labels (:labels (:metadata ?pod))
                       :replicas 1))))

(defn add-if-present [orig-map new-map keys]
  (reduce (fn [m key] (if-let [val (new-map key)]
                        (assoc m key val)
                        m))
          orig-map
          keys))

(defrule extract-containers-from-podspec
  "Create individual containers from a podspec"
  [?pspec :podspec (:containers ?pspec)]
  =>
  (id-remove! ?pspec)
  (let [ids (atom []) names (atom [])
        cgroup (or (:controller-uid ?pspec) (get-id!))
        replica-count (:replicas ?pspec)]
    (doseq [ctype [:containers :initContainers]]
      (let [idx (atom -1)
            is-init-container? (= ctype :initContainers)]
        (doseq [cont (ctype ?pspec)]
          (let [base-cont {:type :container
                           :name (:name cont)
                           :image (:image cont)}
                gcont (assoc base-cont :cgroup cgroup)
                full-cont (add-if-present gcont cont
                                          [:env :livenessProbe :readinessProbe
                                           :args :command :volumeMounts
                                           :resources :securityContext
                                           :lifecycle])
                indexed-cont (assoc full-cont
                                    :position
                                    (if is-init-container?
                                      (swap! idx inc)
                                      -1))
                cid (id-insert! indexed-cont)]
            (when-let [ipp (:imagePullPolicy cont)]
              (id-insert! {:type :image-pull-policy :container cid
                           :value ipp}))
            (swap! ids #(conj % cid))
            (swap! names #(conj % (:name cont)))
            (id-insert! {:type :network-ref :aliases [] :container cid
                         :name "default"})
            (doseq [port (:ports cont)]
              (id-insert! {:type :port-mapping
                           :name (or (:name port) "")
                           :container cid
                           :defining-service ""
                           :container-references true
                           :internal (str (:containerPort port))
                           :external ""
                           :node-port ""
                           :protocol (or (to-lower-if (:protocol port))
                                         "tcp")}))))))
    (id-insert!
     (assoc-if-filled
      (apply assoc {:type :deployment-spec :cgroup cgroup
                    :update-strategy (:update-strategy ?pspec)
                    :pod-management-policy (:pod-management-policy ?pspec)
                    :termination-grace-period (:termination-grace-period ?pspec)
                    :image-pull-secrets (:image-pull-secrets ?pspec)
                    :controller-type (:controller-type ?pspec)
                    :service-name (:service-name ?pspec)}
             (if (= replica-count 0)
               [:mode "allnodes" :count 0]
               [:mode "replicated" :count replica-count]))
      {:revisionHistoryLimit (:revisionHistoryLimit ?pspec)
       :service-account-name (:service-account-name ?pspec)
       :automount-service-account-token
       (:automount-service-account-token ?pspec)}))

    (id-insert! {:type :restart-policy
                 :cgroup cgroup
                 :value (get-restart-policy ?pspec)})
    (id-insert! {:type :replication :cgroup cgroup :count replica-count})
    (id-insert! (dissoc ?pspec :containers :initContainers :replicas
                        :restartPolicy))
    (id-insert! {:type :container-group
                 :name (:name ?pspec)
                 :source "k8s"
                 :id cgroup
                 :controller-type (:controller-type ?pspec)
                 :containers @ids
                 :container-names @names
                 :pod (:id ?pspec)})))

(defrule extract-node-selector-from-podspec
  "Extract any deployment placement constraints from a podspec"
  [?pspec :podspec (:nodeSelector ?pspec)]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pspec))]
  =>
  (id-remove! ?pspec)
  (id-insert! (assoc (:nodeSelector ?pspec) :type :node-selector
                     :cgroup (:id ?cgroup)))
  (id-insert! (dissoc ?pspec :nodeSelector)))

(defrule extract-labels
  "Pull labels out of a podspec"
  {:priority 50}
  [?pspec :podspec (or (:labels ?pspec) (:top-labels ?pspec))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pspec))]
  =>
  (id-remove! ?pspec)
  (let [labels (:labels ?pspec)]
    (doseq [[k v] (vec labels)]
      (id-insert! {:type :label :cgroup (:id ?cgroup)
                   :key (name k) :value v})))
  (let [labels (:top-labels ?pspec)]
    (doseq [[k v] (vec labels)]
      (id-insert! {:type :top-label :cgroup (:id ?cgroup)
                   :key (name k) :value v}))
    (id-insert! (dissoc ?pspec :labels :top-labels))))

(defrule remove-empty-podspec
  "Get rid of podspec shell after data has been extracted"
  {:priority -100}
  [?pspec :podspec (empty-wme-with-id? (dissoc ?pspec :name))]
  =>
  (id-remove! ?pspec))

(defrule extract-service-ports
  "Pull port specifications out of a service"
  [?svc :service (:ports (:spec ?svc))]
  [?k8s :k8s-service (= (:name ?k8s) (:name ?svc))]
  =>
  (id-remove! ?svc)
  (doseq [port (:ports (:spec ?svc))]
    (id-insert! {:type :port-mapping-template
                 :defining-service (:id ?k8s)
                 :svc-port-name (or (:name port) "")
                 :name (or (:name port) "")
                 :container ""
                 :container-references ""
                 :internal (str (or (:targetPort port) (:port port)))
                 :external (str (:port port))
                 :node-port (str (or (:nodePort port) ""))
                 :protocol (or (to-lower-if (:protocol port)) "")}))
  (id-insert! (update ?svc :spec #(dissoc % :ports))))

(defrule update-service-defined-only-port-mappings
  {:priority *adjustment*}
  "Update port mappings for ports mentioned only in services"
  [?pmt :port-mapping-template]
  [?k8s :k8s-service (= (:id ?k8s) (:defining-service ?pmt))]
  [:not
   [?lg :label-group (service-selects ?k8s ?lg)]
   [?cgroup :container-group (= (:id ?cgroup) (:cgroup ?lg))]
   [?cont :container
    (= (:id ?cgroup) (:cgroup ?cont))
    (= (:id ?cont) (:container ?pmt))]]
  =>
  (id-remove! ?pmt)
  (id-insert! (assoc ?pmt :type :port-mapping)))

(defrule update-service-defined-port-mappings
  {:priority *adjustment*}
  "Update port mappings for ports mentioned in services"
  [?pmt :port-mapping-template]
  [?k8s :k8s-service (= (:id ?k8s) (:defining-service ?pmt))]
  [?lg :label-group (service-selects ?k8s ?lg)]
  [?cgroup :container-group (= (:id ?cgroup) (:cgroup ?lg))]
  [?cont :container (= (:id ?cgroup) (:cgroup ?cont))]
  [?pm :port-mapping
   (empty-field? (:defining-service ?pm))
   (= (:container ?pm) (:id ?cont))
   (= (str (:internal ?pm)) (str (:internal ?pmt)))]
  =>
  (id-remove! ?pmt)
  (id-remove! ?pm)
  (id-insert!
   (assoc-if-filled (merge-flats (assoc ?pmt :type :port-mapping) ?pm)
                    :name
                    (:name ?pm))))

(defrule extract-container-security-context
  "Extract any security settings associated with a container"
  [?cont :container (:securityContext ?cont)]
  =>
  (id-remove! ?cont)
  (id-insert! (assoc (:securityContext ?cont) :type :security-context
                     :container (:id ?cont)))
  (id-insert! (dissoc ?cont :securityContext)))

(defrule extract-container-resources
  "Extract any resource requests and/or limits associated with a container"
  [?cont :container (:resources ?cont)]
  =>
  (id-remove! ?cont)
  (id-insert! (assoc (:resources ?cont) :type :container-resources
                     :container (:id ?cont)))
  (id-insert! (dissoc ?cont :resources)))

(defrule extract-container-lifecycle
  "Extract any lifecycle event specifications from a container"
  [?cont :container (:lifecycle ?cont)]
  =>
  (id-remove! ?cont)
  (id-insert! (assoc (:lifecycle ?cont) :type :container-lifecycle
                     :container (:id ?cont)))
  (id-insert! (dissoc ?cont :lifecycle)))

(defrule extract-container-image
  "Take an image out of a container"
  [?cont :container (:image ?cont)]
  =>
  (id-remove! ?cont)
  (id-insert! {:type :image :container (:id ?cont) :value (:image ?cont)})
  (id-insert! (dissoc ?cont :image)))

(defrule extract-namespace-refs
  "Extract namespaces for each top-level non-namespace item"
  {:priority 50}
  [?item :namespaced (filled-in? (get-namespace ?item))]
  =>
  (let [ns (get-namespace ?item)]
    (when (and (not= ns "default") (empty? (collect! :model-namespace identity)))
      (id-insert! {:type :model-namespace :name ns})))
  (id-remove! ?item)
  (id-insert! (remove-namespace ?item)))

(defrule extract-container-environments
  "Pull environments out of a container"
  {:priority 50}
  [?cont :container (:env ?cont)]
  =>
  (let [id (:id ?cont) env (:env ?cont)]
    (doseq [{k :name v :value vf :valueFrom} env]
      (id-insert! (merge {:type :environment-var :container id :key (name k)}
                         (when v {:value (str v)})
                         (when vf {:valueFrom vf})))))
  (id-remove! ?cont)
  (id-insert! (dissoc ?cont :env)))

(defrule extract-container-probes
  "Extract liveness and readiness probes"
  [?cont :container
   (or (:livenessProbe ?cont) (:readinessProbe ?cont))]
  =>
  (id-remove! ?cont)
  (let [lp (:livenessProbe ?cont) rp (:readinessProbe ?cont) cid (:id ?cont)]
    (if (and lp rp (= lp rp))
      (id-insert! (assoc (transform-hc lp cid) :check-type "both"))
      (do (when lp
            (id-insert! (assoc (transform-hc lp cid) :check-type "liveness")))
          (when rp
            (id-insert!
             (assoc (transform-hc rp cid) :check-type "readiness"))))))
  (id-insert! (dissoc ?cont :livenessProbe :readinessProbe)))

(defrule extract-container-args
  "Pull any args from a container"
  {:priority 50}
  [?cont :container (:args ?cont)]
  =>
  (id-insert! {:type :command :container (:id ?cont) :value (:args ?cont)})
  (id-remove! ?cont)
  (id-insert! (dissoc ?cont :args)))

(defrule extract-container-command
  "Pull any command from a container"
  {:priority 50}
  [?cont :container (:command ?cont)]
  =>
  (id-insert! {:type :entrypoint :container (:id ?cont) :value (:command ?cont)})
  (id-remove! ?cont)
  (id-insert! (dissoc ?cont :command)))

(defrule start-collecting-labels
  "Gather all related labels to match a selector"
  {:priority *adjustment*}
  [?label :label]
  [:not [?lg :label-group (= (:cgroup ?lg) (:cgroup ?label))]]
  =>
  (id-insert! {:type :label-group :cgroup (:cgroup ?label)}))

(defrule collect-labels
  "Gather all related labels to match a selector"
  {:priority *adjustment*}
  [?lg :label-group]
  [?label :label
   (= (:cgroup ?label) (:cgroup ?lg))
   (not (contains? (:labels ?lg) (label-key-name (:key ?label))))]
  =>
  (id-remove! ?lg)
  (id-insert! (update ?lg :labels assoc
                      (label-key-name (:key ?label)) (:value ?label))))

(defrule remove-completed-service-without-ports
  {:priority *cleanup*}
  [?pspec :podspec]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pspec))]
  [?lg :label-group (= (:cgroup ?lg) (:id ?cgroup))]
  [?ks :k8s-service (service-selects ?ks ?lg)]
  [?svc :service (= (:name ?svc) (:name ?ks))]
  =>
  (id-remove! ?svc))

(defrule remove-completed-podspec-without-ports
  {:priority (dec *cleanup*)}
  [?pspec :podspec]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pspec))]
  [?lg :label-group (= (:cgroup ?lg) (:id ?cgroup))]
  [:nand
   [?ks :k8s-service (service-selects ?ks ?lg)]
   [?svc :service (= (:name ?svc) (:name ?ks))]]
  =>
  (id-remove! ?pspec))

(defrule extract-secret-volumes-from-podspec
  "Pull secret volumes out of a podspec"
  [?pspec :podspec (some :secret (:volumes ?pspec))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pspec))]
  [?container :container (= (:id ?cgroup) (:cgroup ?container))]
  =>
  (let [conts (atom #{})
        secret-volumes (filter :secret (:volumes ?pspec))
        svol-names (into #{} (map :name secret-volumes))]
    (doseq [vol secret-volumes]
      (let [volname (:name vol)
            default-mode (:defaultMode (:secret vol))
            svol-id (id-insert! {:type :secret-volume
                                 :name volname
                                 :source "k8s"
                                 :default-mode (if (filled-in? default-mode)
                                                 (to-octal default-mode)
                                                 "")
                                 :secret-name (:secretName (:secret vol))})]
        (if (filled-in? (:items (:secret vol)))
          (doseq [secret (:items (:secret vol))]
            (let [secret-name (:key secret)
                  secret-path (:path secret)
                  secret-id (id-insert!
                             {:type :secret
                              :name secret-name
                              :secret-volume svol-id
                              :default-mode (to-octal (or (:mode secret) default-mode ""))
                              :source ""
                              :alternate-name ""})]
              (doseq [cont (collect! :container #(= (:id ?cgroup) (:cgroup %)))]
                (when-let [mount (first (filter #(= (:name %) volname)
                                                (:volumeMounts cont)))]
                  (id-insert! {:type :secret-ref
                               :uid "0"
                               :gid "0"
                               :mode (to-octal (or (:mode secret)
                                                   default-mode
                                                   default-k8s-secret-mode))
                               :mount-path (:mountPath mount)
                               :source secret-name
                               :secret secret-id
                               :target secret-path
                               :secret-volume svol-id
                               :container (:id cont)})
                  (swap! conts conj cont)))))
          (doseq [cont (collect! :container #(= (:id ?cgroup) (:cgroup %)))]
            (when-let [mount (first (filter #(= (:name %) volname)
                                            (:volumeMounts cont)))]
              (id-insert! {:type :secret-ref
                           :uid "0"
                           :gid "0"
                           :mode (to-octal (or default-mode
                                               default-k8s-secret-mode))
                           :mount-path (:mountPath mount)
                           :source ""
                           :secret ""
                           :target ""
                           :secret-volume svol-id
                           :container (:id cont)})
                  (swap! conts conj cont))))))
    (doseq [cont @conts]
      (id-remove! cont)
      (let [mounts (remove (fn [v] (svol-names (:name v))) (:volumeMounts cont))]
        (id-insert! (if (empty? mounts)
                      (dissoc cont :volumeMounts)
                      (assoc cont :volumeMounts mounts))))))
  (id-remove! ?pspec)
  (id-insert! (update ?pspec :volumes #(remove :secret %))))

(defrule extract-config-volumes-from-podspec
  "Pull config volumes out of a podspec"
  [?pspec :podspec (and (not (some :secret (:volumes ?pspec)))
                        (some :configMap (:volumes ?pspec)))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pspec))]
  [?container :container (= (:id ?cgroup) (:cgroup ?container))]
  =>
  (let [volumes (filter :configMap (:volumes ?pspec))
        volnames (into #{} (map :name (filter :configMap (:volumes ?pspec))))
        conts (atom #{})]
    (doseq [vol volumes]
      (let [volname (:name vol)
            config-id (id-insert!
                       {:type :config
                        :name volname
                        :default-mode (if (contains? (:configMap vol)
                                                     :defaultMode)
                                        (to-octal (:defaultMode (:configMap vol)))
                                        "")
                        :map-name (:name (:configMap vol))})]
        (when-let [items (:items (:configMap vol))]
          (doseq [item items]
            (let [entry-name (:key item) entry-path (:path item)]
              (id-insert! {:type :config-entry-path
                           :config config-id
                           :name entry-name
                           :path entry-path
                           :pod (:id ?pspec)}))))
        (doseq [cont (collect! :container #(= (:id ?cgroup) (:cgroup %)))]
          (let [mount (get-named-volume-mount cont volname)]
            (when-let [path (:mountPath mount)]
              (id-insert! {:type :config-ref
                           :container (:id cont)
                           :container-name (:name cont)
                           :config config-id
                           :readonly (:readOnly mount)
                           :sub-path (or (:subPath mount) "")
                           :name volname
                           :path path})
              (swap! conts conj cont))))))
    (doseq [cont @conts]
      (id-remove! cont)
      (let [mounts (remove #(volnames (:name %)) (:volumeMounts cont))]
        (id-insert! (if (empty? mounts)
                      (dissoc cont :volumeMounts)
                      (assoc cont :volumeMounts mounts))))))
    (id-remove! ?pspec)
    (id-insert! (update ?pspec :volumes #(remove :configMap %))))

(defrule extract-empty-dir-volumes-from-podspec
  "Pull empty dir volumes out of a podspec"
  [?pspec :podspec (and (not (some :secret (:volumes ?pspec)))
                        (not (some :configMap (:volumes ?pspec)))
                        (some :emptyDir (:volumes ?pspec)))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pspec))]
  [?container :container (= (:id ?cgroup) (:cgroup ?container))]
  =>
  (let [volumes (filter :emptyDir (:volumes ?pspec))
        volnames (into #{} (map :name volumes))
        conts (atom #{})]
    (doseq [vol volumes]
      (let [volname (:name vol)
            empty-dir-id (id-insert!
                          {:type :empty-dir-volume
                           :name volname
                           :cgroup (:id ?cgroup)
                           :medium (or (:medium (:emptyDir vol)) "")})]
        (doseq [cont (collect! :container #(= (:id ?cgroup) (:cgroup %)))]
          (when-let [path (:mountPath (get-named-volume-mount cont volname))]
            (id-insert! {:type :volume-ref
                         :container (:id cont)
                         :container-name (:name cont)
                         :volume empty-dir-id
                         :volume-name volname
                         :path path
                         :access-mode "ReadWriteOnce"})
            (swap! conts conj cont)))))
    (doseq [cont @conts]
      (id-remove! cont)
      (let [mounts (remove #(volnames (:name %)) (:volumeMounts cont))]
        (id-insert! (if (empty? mounts)
                      (dissoc cont :volumeMounts)
                      (assoc cont :volumeMounts mounts))))))
  (id-remove! ?pspec)
  (id-insert! (update ?pspec :volumes #(remove :emptyDir %))))

(defrule extract-host-path-volumes-from-podspec
  "Pull hostpath volumes out of a podspec"
  [?pspec :podspec (and (not (some :secret (:volumes ?pspec)))
                        (not (some :configMap (:volumes ?pspec)))
                        (some :hostPath (:volumes ?pspec)))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pspec))]
  [?container :container (= (:id ?cgroup) (:cgroup ?container))]
  =>
  (let [volumes (filter :hostPath (:volumes ?pspec))
        volnames (into #{} (map :name volumes))
        conts (atom #{})]
    (doseq [vol volumes]
      (let [volname (:name vol)
            hostPath (:hostPath vol)
            host-path-id (id-insert!
                          (merge
                           {:type :host-path-volume
                            :name volname
                            :cgroup (:id ?cgroup)
                            :host-path (:path hostPath)}
                           (when-let [hpt (:type hostPath)]
                             {:host-path-type hpt})))]
        (doseq [cont (collect! :container #(= (:id ?cgroup) (:cgroup %)))]
          (when-let [path (:mountPath (get-named-volume-mount cont volname))]
            (id-insert! {:type :volume-ref
                         :container (:id cont)
                         :container-name (:name cont)
                         :volume host-path-id
                         :volume-name volname
                         :path path
                         :access-mode "ReadWriteOnce"})
            (swap! conts conj cont)))))
    (doseq [cont @conts]
      (id-remove! cont)
      (let [mounts (remove #(volnames (:name %)) (:volumeMounts cont))]
        (id-insert! (if (empty? mounts)
                      (dissoc cont :volumeMounts)
                      (assoc cont :volumeMounts mounts))))))
  (id-remove! ?pspec)
  (id-insert! (update ?pspec :volumes #(remove :hostPath %))))

(defrule extract-non-secret-volumes-from-podspec
  "Pull volumes out of a podspec"
  [?pspec :podspec (and (seq (:volumes ?pspec))
                        (not (some #(or (:secret %) (:configMap %)
                                        (:emptyDir %) (:hostPath %))
                                   (:volumes ?pspec))))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pspec))]
  [?container :container (= (:id ?cgroup) (:cgroup ?container))]
  =>
  (let [conts (atom #{})
        vols (atom #{})]
    (doseq [vol (filter #(not (some (fn [field] (field %))
                                    [:secret :configMap :emptyDir :hostPath]))
                        (:volumes ?pspec))]
      (let [volname (:name vol)
            claim-name (:claimName (:persistentVolumeClaim vol))]
        (doseq [cont (collect! :container #(= (:id ?cgroup) (:cgroup %)))]
          (let [mount (get-named-volume-mount cont volname)]
            (when-let [path (:mountPath mount)]
              (let [volume
                    (first (collect! :volume #(= (:claim-name %) claim-name)))]
                (swap! vols conj [volume volname])
                (id-insert! {:type :volume-ref
                             :container (:id cont)
                             :container-name (:name cont)
                             :volume (:id volume)
                             :volume-name volname
                             :path path
                             :sub-path (or (:subPath mount) "")
                             :access-mode (if (:readOnly mount)
                                            "ReadOnlyMany"
                                            "ReadWriteOnce")}))))
          (swap! conts conj cont))))
    (doseq [[v vname] @vols]
      (id-remove! v)
      (id-insert! (assoc v :name vname)))
    (doseq [cont @conts]
      (id-remove! cont)
      (id-insert! (dissoc cont :volumeMounts)))
    (id-remove! ?pspec)
    (id-insert! (assoc ?pspec :volumes []))))

(defrule extract-volume-claim-templates-from-podspec
  "Pull volume claim templates out of a podspec for a stateful set"
  [?pspec :podspec (and (= (:controller-type ?pspec) "StatefulSet")
                        (not= (:claim-templates ?pspec) "")
                        (not (seq (:volumes ?pspec))))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pspec))]
  [?container :container
   (= (:id ?cgroup) (:cgroup ?container))
   (seq (:volumeMounts ?container))]
  =>
  (let [conts (atom #{})]
    (doseq [vol (:claim-templates ?pspec)]
      (let [volname (:name (:metadata vol))
            spec (:spec vol)]
        (doseq [cont (collect! :container #(= (:id ?cgroup) (:cgroup %)))]
          (let [mount (get-named-volume-mount cont volname)]
            (when-let [path (:mountPath mount)]
              (let [vol-id
                    (id-insert!
                     {:type :volume
                      :is-template true
                      :name volname
                      :physical-volume-name ""
                      :claim-name ""
                      :access-modes (or (:accessModes spec) ["ReadWriteOnce"])
                      :storage-class (or (:storageClassName spec) "")
                      :storage (or (get-in spec [:resources :requests :storage])
                                   "")
                      :selector (or (:selector vol) {:matchLabels {}})
                      :volume-mode (or (:volumeMode spec) "Filesystem")
                      :annotations {}})]
                (id-insert! {:type :volume-ref
                             :container (:id cont)
                             :container-name (:name cont)
                             :volume vol-id
                             :volume-name volname
                             :path path
                             :access-mode (if (:readOnly mount)
                                            "ReadOnlyMany"
                                            "ReadWriteOnce")}))))
            (swap! conts conj cont))))
    (doseq [cont @conts]
      (id-remove! cont)
      (id-insert! (dissoc cont :volumeMounts)))))

(defrule extract-top-annotations
  {:priority *adjustment*}
  "Retain top-level annotations"
  [?k8sanno :k8s-annotatable (:annotations (:metadata ?k8sanno))]
  =>
  (id-remove! ?k8sanno)
  (id-insert! (update-in ?k8sanno [:metadata] dissoc :annotations))
  (when-let [annos (filter-annos (:annotations (:metadata ?k8sanno)))]
    (doseq [anno (flatten-annos annos)]
      (id-insert! (merge anno
                         {:type :k8s-annotation
                          :location [:metadata :annotations]
                          :annotated-name (:name (:metadata ?k8sanno))
                          :annotated-type (get-annotation-type ?k8sanno)})))))

;; Support for our layout-saving gambit that is common between
;; k8s-to-flat and flat-to-k8s.
(def layout-config-name "yipee-layout-data")

(defn string-to-hex [s]
  (apply str (map #(format "%02x" (int %)) s)))

(defn hex-to-string [hex]
  (apply str
    (map
      (fn [[x y]] (char (Integer/parseInt (str x y) 16)))
      (partition 2 hex))))

(defn decode-layout-value [v]
  (str/split (hex-to-string v) #"!" 2))

(defn encode-layout-value [part1 part2]
  (string-to-hex (str part1 "!" part2)))
;; end common

(defn get-layout-object [v]
  (let [[xstr ystr] (decode-layout-value v)
        xval (Integer/parseInt xstr 10)
        yval (Integer/parseInt ystr 10)]
    {:canvas {:position {:x xval :y yval}}}))

(defrule extract-config-maps
  [?k8s :k8s (:configmaps ?k8s)]
  =>
  (id-remove! ?k8s)
  (id-insert! (dissoc ?k8s :configmaps))
  (doseq [cm (:configmaps ?k8s)]
    (if (= layout-config-name (:name (:metadata cm)))
      (doseq [[k v] (:data cm)]
        (let [[typ nm] (decode-layout-value (name k))]
          (id-insert! {:type :annotation :key "ui"
                       :target {:type (keyword typ) :name nm}
                       :value (get-layout-object v)})))
      ;; treat any other configmaps as unknown kinds, same as they
      ;; would have been prior to this special canvas data config
      (id-insert! {:type :unknown-k8s-kind
                   :body (yaml/generate-string
                          cm
                          :dumper-options {:flow-style :block})}))))

(defrule resolve-ui-anno-target
  [?anno :annotation (:target ?anno)]
  [?wme :wme (and (= (:type ?wme) (get-in ?anno [:target :type]))
                  (= (:name ?wme) (get-in ?anno [:target :name])))]
  =>
  (id-remove! ?anno)
  (id-insert! (assoc (dissoc ?anno :target) :annotated (:id ?wme))))
