(ns k8scvt.flat-to-k8s
  (:require [clojure.string :as str]
            [clojure.set :refer :all]
            [clojure.edn :as edn]
            [clj-yaml.core :as yaml]
            [engine.core :refer :all]
            [k8scvt.util :refer [id-insert! id-remove!]]
            [k8scvt.k8s-to-flat
             :refer [selector-selects filled-in? empty-field? assoc-if-filled
                     label-key-name label-name trim-edge-dashes
                     trim-right-dashes ingress-has-key-instances
                     substitute-ingress-attributes
                     add-namespace remove-namespace get-namespace
                     *validation* *adjustment* *cleanup*]])
  (:import java.util.UUID))

(def ipPattern #"^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$")

(def ipv6Pattern #"^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$")

(def SLASH "-slash")

(defancestor [:config :port-mapping :label-group :network-ref :volume-ref
              :container-group :app-info :extra-port-info :top-label
              :replication :secret-volume :secret-ref :namespace-ref
              :config-ref :host-path-volume :deployment-spec]
  :leftover)

(defancestor [:podspec :podtemplatespec :deploymentSpec
              :deployment :daemonset :pod :statefulset]
  :podval)

(defancestor [:deployment :daemonset :statefulset :cronjob] :controller)

(defancestor [:deployment :daemonSet :statefulSet :cronJob] :k8s-controller)

(defancestor [:k8s-controller :controller :k8s-service :service
              :persistent-volume-claim :k8s-namespace :pod :ingress]
  :k8s-annotatable)

(defancestor [:replication :label] :group-property)

(defancestor [:volume :empty-dir-volume] :referable-volume)

(defancestor [:persistent-volume-claim :persistentVolumeClaim
              :statefulset :statefulSet
              :daemonset :daemonSet
              :cronjob :cronJob
              :service :k8s-service
              :deployment
              :pod
              :ingress
              :unknown-k8s-kind]
  :namespaced)

(defn safe-name [x]
  (if x (name x) x))

(defn generate-constraint-error [constraint]
  (insert! {:type :validation-error
            :validation-type :constraint-violation
            :constraint constraint}))

(defn first-filled [& vals]
  (or (first (filter #(and % (not= % "")) vals))
      ""))

(defn intval [x]
  (cond (or (nil? x) (empty-field? x) (= x "*")) nil
        (integer? x) x
        :else (Integer/parseInt x)))

(defn intval-or-name [x]
  (cond (or (nil? x) (empty-field? x) (= x "*")) nil
        (integer? x) x
        :else (try (Integer/parseInt x)
                   (catch Exception e
                     x))))

(defn octal-intval [x]
  (cond (or (nil? x) (empty-field? x)) nil
        (integer? x) x
        :else (Integer/parseInt x 8)))

(defn assoc-if [m k val]
  (if val (assoc m k val) m))

(defn assoc-in-if-filled [m k val]
  (if (and (some? val) (not= val "")) (assoc-in m k val) m))

(defn dissoc-unless-filled [m k]
  (if-let [v (get m k)]
    (if (= v "")
      (dissoc m k)
      m)
    (dissoc m k)))

(defn merge-when-not-default [m1 m2 defaults]
  (merge m1
         (reduce-kv (fn [m k v] (if (and v (filled-in? v) (not= v (k defaults)))
                                  (assoc m k v)
                                  m))
                    {}
                    m2)))

(defn extract-internal-ports [ports]
  (for [p ports]
    (second (str/split p #":"))))

(defn dns-name [name]
  (when (nil? name)
    (println (get-stack-trace)))
  (trim-edge-dashes (str/replace name #"[^a-zA-Z0-9\.\-]" "-")))

(defn safe-dns-name [item]
  (if-let [name (:name (:metadata item))]
    (dns-name name)))

(defn map-label-names [m]
  (into {} (for [[k v] m] [(label-key-name k) (label-name v)])))

(defn vol-name [name]
  (when name
    (trim-edge-dashes (str/replace (str/lower-case name) #"[^a-z0-9\.\-]" "-"))))

(defn port-name [svc port]
  (dns-name (str svc "-" port)))

(defn matching-index [s start-idx ch]
  (let [maxidx (count s)]
    (loop [idx start-idx]
      (if (>= idx maxidx)
        idx
        (let [char (get s idx)]
          (cond (= char \\) (if (= idx (dec maxidx))
                              maxidx
                              (recur (+ idx 2)))
                (= char ch) idx
                :else (recur (inc idx))))))))

(defn nonspace-index [s start-idx]
  (let [maxidx (count s)]
    (loop [idx start-idx]
      (cond (>= idx maxidx) idx
            (re-matches #"[\s]" (subs s idx (inc idx))) (recur (inc idx))
            :else idx))))

(defn split-string-array [s]
  (let [maxidx (count s)]
    (loop [idx 0 lastidx 0 result []]
      (if (>= idx maxidx)
        (if (not= idx lastidx)
          (conj result (subs s lastidx idx))
          result)
        (let [ch (get s idx)]
          (case ch
            \space (let [nsidx (nonspace-index s idx)]
                     (recur nsidx nsidx (conj result (subs s lastidx idx))))

            (\" \') (let [midx (matching-index s (inc idx) ch)
                          nsidx (nonspace-index s (inc midx))]
                      (recur nsidx nsidx (conj result (subs s (inc idx) midx))))
            (recur (inc idx) lastidx result)))))))

(defn to-string-array [str-or-array]
  (if (or (seq? str-or-array) (vector? str-or-array))
    str-or-array
    (split-string-array str-or-array)))

(defn volume-name [s cname]
  (let [name (str/replace (str/lower-case s) #"[^a-z0-9\-]" "-")]
    (condp re-matches name
      #"-" (str cname SLASH)
      #"-[a-z0-9\-]+" (str cname "-slash-" (trim-edge-dashes name))
      #"[a-z0-9]+[a-z0-9\-]*" (trim-right-dashes name))))

(defn after [sub s]
  (let [start (+ (str/index-of s sub) (count sub))]
    (str "/" (subs s start))))

(defn volume-path [s]
  (let [esc-path (after SLASH s)
        path (str/replace esc-path #"-" "/")]
    (loop [st path]
      (if (nil? (str/index-of st "//"))
        st
        (recur (str/replace st #"\/\/" "/"))))))

(defn service-selects-populated-controller [k8s-svc cont]
  (let [selector (:selector k8s-svc)
        label-map (get-in cont
                          (if (= (:type cont) :cronJob)
                            [:spec :jobTemplate :spec :template :metadata :labels]
                            [:spec :template :metadata :labels]))]
    (selector-selects selector label-map)))

(defn service-selects-populated-pod [k8s-svc pod]
  (let [selector (:selector k8s-svc)
        label-map (:matchLabels (:selector pod))]
    (selector-selects selector label-map)))

(defn parse-exposed [p]
  "Parse the :exposed port into port and protocol"
  (let [parts (str/split (:internal p) #"/" 2)
        port (intval (first parts))
        proto (if (= 2 (count parts)) (str/upper-case (last parts)) "TCP")]
    {:port port :protocol proto}))

(defn canonicalize-protocol [proto]
  (if (filled-in? proto)
    (str/upper-case proto)
    "TCP"))

(defn all-containers [spec]
  (concat (:containers spec) (:initContainers spec)))

(defn assign-top-labels [dspec]
  (assoc-if {:name (dns-name (:name dspec))} :labels (:top-labels dspec)))

(defn translate-val-or-percent [m field]
  (when-let [vop (field m)]
    (if (or (number? vop) (re-matches #".*%$" vop))
      vop
      (edn/read-string vop))))

(defn translate-strategy [strat]
  (if-let [strat-type (:type strat)]
    (if (= (name strat-type) "RollingUpdate")
      (let [rustrat (:rollingUpdate strat)]
        (assoc-if-filled
         (dissoc strat :rollingUpdate)
         :rollingUpdate
         (assoc-if-filled
          rustrat
          {:maxSurge (translate-val-or-percent rustrat :maxSurge)
           :maxUnavailable (translate-val-or-percent rustrat
                                                     :maxUnavailable)})))
        strat)
      strat))

(defn get-claim-name [vol]
  (or (:claim-name vol) (str (:name vol) "-claim")))

(defrule apply-model-namespace
  {:priority *adjustment*}
  "Associate the global model namespace with each top-level item"
  [?mns :model-namespace]
  [?ns :namespaced
   (not (string? (:body ?ns)))
   (not= (get-namespace ?ns) (:name ?mns))]
  =>
  (remove! ?ns)
  (insert! (add-namespace ?ns (:name ?mns))))

(defrule apply-lack-of-model-namespace
  {:priority *adjustment*}
  "If there is no global model namespace, denamespacify top level objects"
  [?ns :namespaced (filled-in? (:namespace (:metadata ?ns)))]
  [:not [? :model-namespace]]
  =>
  (remove! ?ns)
  (insert! (remove-namespace ?ns)))

(defrule fix-missing-container-groups
  {:priority 200}
  "If we have an old style yipee without container groups, add them."
  [?cont :container (not (:cgroup ?cont))]
  =>
  (remove! ?cont)
  (insert! (assoc ?cont
                  :cgroup
                  (id-insert! {:type :container-group
                               :name (:name ?cont)
                               :source "auto"
                               :controller-type :Deployment
                               :containers [(:id ?cont)]
                               :container-names [(:name ?cont)]}))))

(defrule fix-missing-container-group-properties
  {:priority 200}
  "If we have an old style yipee, move group properties to container groups"
  [?cont :container]
  [?cgroup :container-group (= (:id ?cgroup) (:cgroup ?cont))]
  [?gprop :group-property (= (:container ?gprop) (:id ?cont))]
  =>
  (remove! ?gprop)
  (insert! (assoc (dissoc ?gprop :container) :cgroup (:id ?cgroup))))

(defrule insert-namespace
  {:priority 75}
  "Insert top level namespaces"
  [?ns :k8s-namespace]
  =>
  (remove! ?ns)
  (insert! {:type :namespace
            :apiVersion "v1"
            :kind "Namespace"
            :metadata {:name (:name ?ns)
                       :labels {:name (:label-name ?ns)}}}))

(defrule insert-persistent-volume-claim
  {:priority 75}
  "Insert top-level persistent volume claim"
  [?vol :volume (not (:is-template ?vol))]
  [?volref :volume-ref
   (= (volume-name (:volume-name ?volref)
                   (vol-name (:container-name ?volref)))
      (:name ?vol))
   (not (:inserted-pvclaim ?volref))]
  =>
  (remove! ?vol)
  (remove! ?volref)
  (let [pvc {:type :persistent-volume-claim
             :apiVersion "v1" :kind "PersistentVolumeClaim"
             :metadata {:name (get-claim-name ?vol)}
             :spec (merge-when-not-default
                       {}
                     {:volumeName (:physical-volume-name ?vol)
                      :accessModes (:access-modes ?vol)
                      :storageClassName (:storage-class ?vol)
                      :resources {:requests {:storage (:storage ?vol)}}
                      :selector (:selector ?vol)
                      :volumeMode (:volume-mode ?vol)}
                     {:accessModes [:ReadWriteOnce]
                      :resources {:requests {:storage ""}}
                      :selector {:matchLabels {}}
                      :storageClassName ""
                      :volumeMode :Filesystem})}]
    (insert! pvc)
    (insert! (assoc ?volref :inserted-pvclaim true))))

(defrule insert-persistent-volume-for-host-mounts
  {:priority 75}
  "Insert persistent-volume for host-mounted volumes"
  [?pvc :persistent-volume-claim
   (not
    (nil?
     (str/index-of
      (get-in ?pvc [:metadata :name]) SLASH)))]
  =>
  (let [pvname (get-in ?pvc [:spec :volumeName])]
    (insert! {:type :persistent-volume
              :apiVersion "v1" :kind "PersistentVolume"
              :metadata {:name pvname}
              :spec {:hostPath
                     {:path (volume-path pvname)}}})))

(defrule insert-saved-unknown-kind
  {:priority 100}
  "Add an unknown object into the k8s output"
  [?ukk :unknown-k8s-kind]
  =>
  (remove! ?ukk)
  (let [body (:body ?ukk) typ (keyword (:kind body))]
    (insert! (assoc body :type typ))))

(defrule translate-string-body
  {:priority *adjustment*}
  "If a YAML body comes in as a string from the UI, parse it"
  [?ukk :unknown-k8s-kind (string? (:body ?ukk))]
  =>
  (remove! ?ukk)
  (try
    (insert! (assoc ?ukk :body (yaml/parse-string (:body ?ukk))))
    (catch Exception _
      (generate-constraint-error
       (str "Invalid custom type: " (:body ?ukk))))))

(defrule insert-security-context-into-container
  {:priority 100}
  "Add a security context into a container being constructed"
  [?container :container]
  [?context :security-context (= (:container ?context) (:id ?container))]
  =>
  (remove! ?container)
  (remove! ?context)
  (insert! (assoc ?container
                  :securityContext (dissoc ?context :type :id :__id
                                           :container))))

(defrule insert-resources-into-container
  {:priority 100}
  "Add resource limits and/or requests into a container being constructed"
  [?container :container]
  [?res :container-resources (= (:container ?res) (:id ?container))]
  =>
  (remove! ?container)
  (remove! ?res)
  (insert! (assoc ?container
                  :resources (dissoc ?res :type :id :__id :container))))

(defrule insert-lifecycle-into-container
  {:priority 100}
  "Add lifecycle events into a container being constructed"
  [?container :container]
  [?clife :container-lifecycle (= (:container ?clife) (:id ?container))]
  =>
  (remove! ?container)
  (remove! ?clife)
  (insert! (assoc ?container
                  :lifecycle (dissoc ?clife :type :id :__id :container))))

(defrule insert-image-into-container
  {:priority 100}
  "Add an image into a container being constructed"
  [?container :container]
  [?image :image (= (:container ?image) (:id ?container))]
  =>
  (remove! ?container)
  (remove! ?image)
  (insert! (assoc ?container :image (:value ?image))))

(defrule insert-ports-into-container
  {:priority 100}
  "Insert ports into a container being constructed"
  [?pmap :port-mapping
   (filled-in? (:internal ?pmap))
   (filled-in? (:container-references ?pmap))]
  [?container :container
   (= (:container ?pmap) (:id ?container))
   (not (some #(= (intval (:internal ?pmap)) (intval (:containerPort %)))
              (:ports ?container)))]
  =>
  (remove! ?container)
  (insert! (update
            ?container :ports
            #(cons
             (assoc-if-filled
               {:containerPort (intval (:internal ?pmap))
                :protocol (if (empty-field? (:protocol ?pmap))
                            "TCP"
                            (str/upper-case (:protocol ?pmap)))}
              :name
              (:name ?pmap))
              %))))

(defrule insert-exposed-ports-into-container
  {:priority 100}
  "Inserted docker 'exposed' ports into a container being constructed"
  [?exposed :exposed-port]
  [?container :container
   (= (:container ?exposed) (:id ?container))
   (not (some #(= (:port (parse-exposed ?exposed)) (intval (:containerPort %)))
           (:ports ?container)))]
  =>
  (remove! ?container)
  (let [epmap (parse-exposed ?exposed)]
    (insert! (update
              ?container :ports
              #(cons
                {:containerPort (intval (:port epmap))
                 :protocol (:protocol epmap)} %)))))

(defrule insert-args-into-container
  {:priority 90}
  "Insert args (equiv to Docker CMD) into a container being constructed"
  [?container :container]
  [?args :command (= (:container ?args) (:id ?container))]
  =>
  (remove! ?container)
  (remove! ?args)
  (insert! (assoc ?container :args (to-string-array (:value ?args)))))

(defrule insert-command-into-container
  {:priority 90}
  "Insert command (equiv to Docker entrypoint) into a container being constructed"
  [?container :container]
  [?cmd :entrypoint (= (:container ?cmd) (:id ?container))]
  =>
  (remove! ?container)
  (remove! ?cmd)
  (insert! (assoc ?container :command (to-string-array (:value ?cmd)))))

(defrule insert-envvar-into-container
  {:priority 90}
  "Insert environment variables into a container being constructed"
  [?container :container]
  [?envvar :environment-var (= (:container ?envvar) (:id ?container))]
  =>
  (let [cont-id (:id ?container)
        vars (collect! :environment-var #(= (:container %) cont-id))]
    (remove! ?container)
    (doseq [evar vars] (remove! evar))
    (insert!
     (assoc
      ?container :env
      (sort-by :name
               (vec (map (fn [evar] (merge {:name (:key evar)}
                                           (when-let [v (:value evar)]
                                             {:value v})
                                           (when-let [vf (:valueFrom evar)]
                                             {:valueFrom vf})))
                          vars)))))))

(defrule insert-both-probes-into-container
  {:priority 90}
  "Insert liveness and readiness probes from containers with both"
  [?container :container]
  [?hcheck :healthcheck
   (= (:check-type ?hcheck) "both")
   (= (:container ?hcheck) (:id ?container))]
  =>
  (id-remove! ?hcheck)
  (id-insert! (assoc ?hcheck :check-type "liveness"))
  (id-insert! (assoc ?hcheck :check-type "readiness")))

(defrule insert-probe-into-container
  {:priority 90}
  "Insert probe configuration into container being constructed"
  [?container :container]
  [?hcheck :healthcheck
   (or (= (:check-type ?hcheck) "liveness")
       (= (:check-type ?hcheck) "readiness"))
   (= (:container ?hcheck) (:id ?container))]
  =>
  (remove! ?container)
  (remove! ?hcheck)
  (let [km {:healthcmd :exec
            :retries :failureThreshold
            :interval :periodSeconds
            :timeout :timeoutSeconds}
        hc (rename-keys ?hcheck km)
        hcheck (if (:exec hc) (assoc hc :exec {:command (:exec hc)}) hc)]
    (insert!
     (assoc ?container (if (= (:check-type ?hcheck) "liveness")
                         :livenessProbe
                         :readinessProbe)
            (dissoc hcheck :type :id :__id :check-type :protocol :processed
                    :container)))))

(defrule insert-vol-ref-into-container
  {:priority 90}
  "Insert volume references into container being constructed"
  [?container :container]
  [?volref :volume-ref
   (= (:container ?volref) (:id ?container))
   (not (:inserted-volref ?volref))]
  =>
  (remove! ?container)
  (remove! ?volref)
  (let [volname (volume-name (:volume-name ?volref) (vol-name (:name ?container)))
        base {:mountPath (:path ?volref) :name volname}]
    (insert!
     (update ?container :volumeMounts
             conj
             (assoc-if-filled
              (if (= (safe-name (:access-mode ?volref)) "ReadOnlyMany")
                (assoc base :readOnly true)
                base)
              :subPath (:sub-path ?volref))))
    (insert! (assoc ?volref :inserted-volref true))
    (when (str/index-of volname SLASH)
      (insert! {:type :volume
                :is-template false
                :name volname
                :physical-volume-name ""
                :volume-mode :Filesystem
                :accessModes [:ReadWriteOnce]
                :claim-name ""
                :storage-class ""
                :storage ""
                :selector {:matchLabels {}}
                :annotations {}}))))

(defrule insert-config-volmount-into-container
  {:priority 91}
  "Insert config volume mount into container being constructed"
  [?config :config]
  [?spec :podspec]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?spec))]
  [?configref :config-ref (= (:id ?config) (:config ?configref))]
  [?container :container
   (= (:id ?container) (:container ?configref))
   (= (:cgroup ?container) (:id ?cgroup))
   (not (some #(= (:name %) (:name ?configref)) (:volumeMounts ?container)))]
  =>
  (let [cmount
        (assoc-if-filled {:name (:name ?config) :mountPath (:path ?configref)}
                         {:readOnly (:readonly ?configref)
                          :subPath (:sub-path ?configref)})]
    (remove! ?container)
    (insert! (update ?container :volumeMounts conj cmount))))

(defrule insert-secret-volmount-into-container
  {:priority 91}
  "Insert secret volume mount into container being constructed"
  [?secretref :secret-ref]
  [?svol :secret-volume (= (:id ?svol) (:secret-volume ?secretref))]
  [?container :container
   (= (:id ?container) (:container ?secretref))
   (not (some #(= (:name %) (:name ?svol)) (:volumeMounts ?container)))]
  =>
  (remove! ?container)
  (insert!
   (update ?container :volumeMounts conj {:mountPath (:mount-path ?secretref)
                                          :name (:name ?svol)
                                          :readOnly true})))

(defrule restore-saved-cronjob-podspec
  {:priority *adjustment*}
  "Store saved cronjob data into podspec."
  [?pspec :podspec]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pspec))]
  [?cjdata :cronjob-data (= (:cgroup ?cjdata) (:id ?cgroup))]
  =>
  (id-remove! ?cjdata)
  (id-remove! ?pspec)
  (id-insert! (merge ?pspec (select-keys ?cjdata [:cronjob-spec :job-spec]))))

(defrule create-new-podspec-from-container-group-with-existing-pod-ref
  {:priority 80}
  "Create a new podspec"
  [?cont :container]
  [?cgroup :container-group
   (= (:cgroup ?cont) (:id ?cgroup))
   (filled-in? (:pod ?cgroup))]
  [:not [?podval :podval (= (:id ?podval) (:pod ?cgroup))]]
  =>
  (id-insert! {:type :podspec :name (dns-name (:name ?cgroup)) :containers []
               :id (:pod ?cgroup)}))

(defrule create-new-podspec-from-container-group
  {:priority 80}
  "Create a new podspec"
  [?cont :container]
  [?cgroup :container-group
   (= (:cgroup ?cont) (:id ?cgroup))
   (empty-field? (:pod ?cgroup))]
  =>
  (id-remove! ?cgroup)
  (let [pspec {:type :podspec :name (dns-name (:name ?cgroup)) :containers []}
        pid (id-insert! pspec)]
    (id-insert! (assoc ?cgroup :pod pid))))

(defrule insert-container-into-existing-podspec
  {:priority 80}
  "Insert a container into an existing Podspec"
  [?container :container]
  [?cgroup :container-group (= (:cgroup ?container) (:id ?cgroup))]
  [?podspec :podspec (= (:id ?podspec) (:pod ?cgroup))]
  =>
  (id-remove! ?container)
  (id-remove! ?podspec)
  (if (= (:position ?container) -1)
    (id-insert! (update ?podspec :containers conj
                        (dissoc ?container :id :__id :type :cgroup :position)))
    (id-insert!
     (update ?podspec :initContainers
             (fn [iconts]
               (map #(dissoc % :id :__id :type :cgroup :position)
                    (sort-by :position (conj iconts ?container))))))))

(defrule insert-image-pull-policy
  {:priority 90}
  "Insert an image pull policy into a container"
  [?container :container]
  [?ipp :image-pull-policy (= (:container ?ipp) (:id ?container))]
  =>
  (id-remove! ?container)
  (id-remove! ?ipp)
  (id-insert! (assoc ?container :imagePullPolicy (:value ?ipp))))

(defrule insert-volume-claim-template-into-podspec
  {:priority 80}
  "Insert a volume claim template into a PodSpec"
  [?vol :volume (:is-template ?vol)]
  [?spec :podspec
   (some #(contains? % :volumeMounts) (all-containers ?spec))
   (some #(some (fn [vm] (= (:name vm) (:name ?vol)))
                (:volumeMounts %))
         (all-containers ?spec))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?spec))]
  [?ref :volume-ref
   (= (:id ?vol) (:volume ?ref))
   (some #(= % (:container ?ref)) (all-containers ?cgroup))]
  =>
  (remove! ?spec)
  (remove! ?vol)
  (let [base {:metadata {:name (:name ?vol)}
              :spec (assoc-in-if-filled
                     (assoc-if-filled
                      {:accessModes (or (:access-modes ?vol) [:ReadWriteOnce])
                       :volumeMode (or (:volume-mode ?vol) :Filesystem)}
                      :storageClassName
                      (:storage-class ?vol))
                     [:resources :requests :storage]
                     (:storage ?vol))}
        newspec (update ?spec :claim-templates conj base)]
    (insert! newspec)))

(defrule insert-volume-into-podspec
  {:priority 80}
  "Insert a volume into a PodSpec"
  [?vol :volume
   (not (:is-template ?vol))]
  [?spec :podspec
   (some #(contains? % :volumeMounts) (all-containers ?spec))
   (some #(some (fn [vm] (= (:name vm) (:name ?vol)))
                (:volumeMounts %))
         (all-containers ?spec))
   (not (some #(= (:name ?vol) (:name %)) (:volumes ?spec)))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?spec))]
  [?ref :volume-ref
   (= (:id ?vol) (:volume ?ref))
   (some #(= % (:container ?ref)) (all-containers ?cgroup))]
  =>
  (remove! ?spec)
  (let [base {:name (:name ?vol)
              :persistentVolumeClaim {:claimName (get-claim-name ?vol)}}
        newbase (if (= (safe-name (:access-mode ?ref)) "ReadOnlyMany")
                  (assoc-in base [:persistentVolumeClaim :readOnly] true)
                  base)
        newspec (update ?spec :volumes conj newbase)]
    (insert! newspec)))

(defrule insert-empty-dir-volume-into-podspec
  {:priority 80}
  "Insert an empty dir volume into a PodSpec"
  [?vol :empty-dir-volume]
  [?spec :podspec
   (some #(contains? % :volumeMounts) (all-containers ?spec))
   (some #(some (fn [vm] (= (:name vm) (:name ?vol)))
                (:volumeMounts %))
         (all-containers ?spec))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?spec))]
  [?ref :volume-ref
   (= (:id ?vol) (:volume ?ref))
   (some #(= % (:container ?ref)) (all-containers ?cgroup))]
  =>
  (remove! ?spec)
  (remove! ?vol)
  (remove! ?ref)
  (let [base {:name (:name ?vol)
              :emptyDir (if (not= (:medium ?vol) "") {:medium "Memory"} {})}
        newspec (update ?spec :volumes conj base)]
    (insert! newspec)))

(defrule insert-host-path-volume-into-podspec
  {:priority 80}
  "Insert a host path volume into a PodSpec"
  [?vol :host-path-volume (not (:inserted-into-podspec ?vol))]
  [?spec :podspec
   (some #(contains? % :volumeMounts) (all-containers ?spec))
   (some #(some (fn [vm] (= (:name vm) (:name ?vol)))
                (:volumeMounts %))
         (all-containers ?spec))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?spec))]
  [?ref :volume-ref
   (= (:id ?vol) (:volume ?ref))
   (some #(= % (:container ?ref)) (all-containers ?cgroup))]
  =>
  (remove! ?spec)
  (remove! ?vol)
  (remove! ?ref)
  (let [base {:name (:name ?vol)
              :hostPath (merge
                         {:path (:host-path ?vol)}
                         (when-let [hpt (:host-path-type ?vol)]
                           {:type hpt}))}
        newspec (update ?spec :volumes conj base)]
    (insert! newspec)
    (insert! (assoc ?vol :inserted-into-podspec true))))

(defn create-secret-item [s sr]
  (assoc-if-filled
   {:key (:source sr)
    :path (if-let [target (:target sr)]
            (if (re-find #"/" target)
              target
              (str "secrets/" target))
            (str "secrets/" (:source sr)))}
   :mode
   (or (octal-intval (:mode sr)) (octal-intval (:default-mode s)))))

(defrule insert-secret-volume-into-podspec-volumes
  {:priority 81}
  "Insert a secret volume into a PodSpec"
  [?svol :secret-volume]
  [?spec :podspec
   (some (comp seq :volumeMounts) (all-containers ?spec))
   (not (some #(= (:name %) (:name ?svol)) (:volumes ?spec)))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?spec))]
  [?secretref :secret-ref
   (= (:secret-volume ?secretref) (:id ?svol))
   (some #(= % (:container ?secretref)) (all-containers ?cgroup))]
  =>
  (id-remove! ?spec)
  (id-insert!
   (update ?spec :volumes conj
           {:name (:name ?svol)
            :secret (assoc-if-filled {:secretName (:secret-name ?svol)}
                                     :defaultMode (octal-intval
                                                   (:default-mode ?svol)))})))


(defrule insert-secret-item-into-secret-volume
  {:priority 100}
  "Insert explicit secret entry into secret-volume"
  [?svol :secret-volume]
  [?secretref :secret-ref
   (= (:secret-volume ?secretref) (:id ?svol))
   (filled-in? (:secret ?secretref))]
  [?secret :secret (= (:id ?secret) (:secret ?secretref))]
  [?spec :podspec
   (some #(= (:name %) (:name ?svol))
         (mapcat :volumeMounts (all-containers ?spec)))
   (some #(= (:name %) (:name ?svol)) (:volumes ?spec))
   (not (some (fn [vol]
                (some #(= (:key %) (:source ?secretref))
                      (get-in vol [:secret :items])))
              (:volumes ?spec)))]
  =>
  (let [{matching true non-matching false}
        (group-by #(= (:name %) (:name ?svol)) (:volumes ?spec))
        vol (first matching)
        item {:key (:source ?secretref)
              :mode (or (octal-intval (:mode ?secretref))
                        (octal-intval (:default-mode ?secret)))
              :path (if (= (:source ?svol) "auto")
                      (if-let [target (:target ?secretref)]
                        (if (re-find #"/" target)
                          target
                          (str "secrets/" target))
                        (str "secrets/" (:source ?secretref)))
                      (:target ?secretref))}]
    (id-remove! ?spec)
    (id-remove! ?secret)
    (id-insert! (assoc ?spec
                       :volumes (conj non-matching
                                      (if (:items (:secret vol))
                                        (update-in vol [:secret :items]
                                                   conj item)
                                        (assoc-in vol [:secret :items]
                                                  [item])))))))

(defrule insert-config-into-podspec-volumes
  {:priority 81}
  "Insert a config volume into a PodSpec"
  [?config :config]
  [?spec :podspec
   (some (comp seq :volumeMounts) (all-containers ?spec))
   (some #(= (:name %) (:name ?config))
         (mapcat :volumeMounts (all-containers ?spec)))
   (not (some #(= (:name %) (:name ?config)) (:volumes ?spec)))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?spec))]
  [?ref :config-ref
   (= (:id ?config) (:config ?ref))
   (some #(= % (:container ?ref)) (all-containers ?cgroup))]
  =>
  (remove! ?spec)
  (remove! ?ref)
  (let [cvol {:name (:name ?config)
              :configMap (assoc-if-filled
                          {:name (:map-name ?config)}
                          :defaultMode (octal-intval
                                        (:default-mode ?config)))}]
    (insert! (update ?spec :volumes conj cvol))))

(defrule insert-config-entry-path-into-configMap
  {:priority 100}
  "Insert explicit config entry into configMap"
  [?config :config]
  [?entry-path :config-entry-path (= (:config ?entry-path) (:id ?config))]
  [?spec :podspec (some #(= (:name %) (:name ?config)) (:volumes ?spec))]
  =>
  (let [{matching true non-matching false}
        (group-by #(= (:name %) (:name ?config)) (:volumes ?spec))
        vol (first matching)
        item {:key (:name ?entry-path)
              :path (:path ?entry-path)}]
    (id-remove! ?spec)
    (id-remove! ?entry-path)
    (id-insert! (assoc ?spec
                       :volumes (conj non-matching
                                      (if (:items (:configMap vol))
                                        (update-in vol [:configMap :items]
                                                   conj item)
                                        (assoc-in vol [:configMap :items]
                                                  [item])))))))


(defrule insert-node-selector-into-podspec
  {:priority 80}
  "Insert a selector for podspec to constrain where it will be deployed"
  [?spec :podspec]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?spec))]
  [?selector :node-selector (= (:cgroup ?selector) (:id ?cgroup))]
  =>
  (remove! ?selector)
  (remove! ?spec)
  (insert! (assoc ?spec :nodeSelector
                  (dissoc ?selector :cgroup :type :id :__id))))

(defrule insert-host-aliases-into-podpsec
  {:priority 80}
  "Insert hostAliases in PodSpec"
  [?spec :podspec]
  [?aliases :extra_hosts (= (:id ?spec) (:container ?aliases))]
  =>
  (remove! ?aliases)
  (when (not (empty? (:value ?aliases)))
    (loop [spec ?spec
           aliases (:value ?aliases)
           haliases '()]
      (if (empty? aliases)
        (do
          (remove! ?spec)
          (insert!
           (assoc ?spec :hostAliases (reverse haliases))))
        (let [alias (first aliases)
              host (first (keys alias))
              ip (host alias)
              m {:ip ip :hostnames [(safe-name host)]}]
          (recur spec (rest aliases) (cons m haliases)))))))

(defrule insert-restart-policy-from-restart-policy-into-podspec
  {:priority 80}
  "insert the restart policy into podspec"
  [?spec :podspec]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?spec))]
  [?restart :restart-policy (= (:cgroup ?restart) (:id ?cgroup))]
  =>
  (remove! ?spec)
  (remove! ?restart)
  (let [vm {"always" "Always"
            "none" "Never"
            "no" "Never"
            "on-failure" "OnFailure"
            "unless-stopped" "OnFailure"}
        ;; XXX: compose-to-flat stores a map for restart-value.
        ;; We should change that (along with many other things, like
        ;; getting rid of hold_for_compose) if/when
        ;; we commit to "wheelhouse".
        ;;
        ;; This test for map is easy (and hopefully harmless...?) in
        ;; the meantime.
        restart-value (if (map? (:value ?restart))
                        (:condition (:value ?restart))
                        (:value ?restart))
        restart-policy (vm restart-value)]
    (when (nil? restart-policy)
      (throw (RuntimeException.
              (str "Unknown restart type: " restart-value))))
    (insert!
     (assoc ?spec :restartPolicy (vm restart-value)))))

(defrule insert-restart-policy-from-restart-into-podspec
  {:priority 80}
  "insert the restart policy into podspec"
  [?spec :podspec (nil? (:restartPolicy ?spec))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?spec))]
  [?restart :restart (= (:cgroup ?restart) (:id ?cgroup))]
  [:not [?restart-policy :restart-policy
         (= (:cgroup ?restart-policy) (:id ?cgroup))]]
  =>
  (remove! ?spec)
  (remove! ?restart)
  (let [vm {"always" "Always"
            "none" "Never"
            "no" "Never"
            "on-failure" "OnFailure"
            "unless-stopped" "OnFailure"}
        restart-value (:value ?restart)
        restart-policy (vm restart-value)]
    (when (nil? restart-policy)
      (throw (RuntimeException.
              (str "Unknown restart type: " restart-value))))
    (insert!
     (assoc ?spec :restartPolicy (vm restart-value)))))

(defrule insert-podspec-into-pod
  {:priority 75}
  "Insert Podpec into Pod"
  [?spec :podspec (= (:restartPolicy ?spec) "Never")]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?spec))]
  [?replica :replication (= (:cgroup ?replica) (:id ?cgroup))]
  =>
  (remove! ?spec)
  (remove! ?replica)
  (id-insert!
   {:type :pod
    :id (:id ?spec)
    :apiVersion "v1"
    :name (:name ?spec)
    :kind "Pod"
    :spec (assoc-if-filled
           (dissoc ?spec
                   :name
                   :claim-templates
                   :controller-type
                   :service-name
                   :termination-grace-period
                   :image-pull-secrets
                   :service-account-name
                   :automount-service-account-token
                   :update-strategy
                   :pod-management-policy
                   :type
                   :id
                   :__id)
           {:serviceAccountName (:service-account-name ?spec)
            :automountServiceAccountToken
            (:automount-service-account-token ?spec)
            :imagePullSecrets (:image-pull-secrets ?spec)})}))

(defrule insert-common-labels-into-pod
  {:priority 70}
  "Insert 'name:' and 'component:' labels into pod"
  [?pod :pod (:name ?pod)]
  [?ai :app-info]
  =>
  (remove! ?pod)
  (let [baselabels (map-label-names {:name (:name ?pod) :component (:name ?ai)})]
      (insert!
       (assoc (dissoc ?pod :name)
              :metadata {:labels baselabels :name (:name ?pod)}))))

(defrule insert-custom-labels-into-pod
  {:priority 70}
  "Insert any custom labels from the yipee service into the pod"
  [?pod :pod (:metadata ?pod)]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pod))]
  [?label :label (= (:id ?cgroup) (:cgroup ?label))]
  =>
  (remove! ?label)
  (remove! ?pod)
  (insert!
   (assoc-in ?pod [:metadata :labels (label-key-name (:key ?label))]
             (label-name (:value ?label)))))

(defrule insert-podspec-into-podtemplatespec
  {:priority 70}
  "Insert PodSpec into a (new) PodTemplateSpec"
  [?spec :podspec (not (= (:restartPolicy ?spec) "Never"))]
  =>
  (remove! ?spec)
  (insert! {:type :podtemplatespec :name (:name ?spec)
            :id (:id ?spec)
            :controller-type (:controller-type ?spec)
            :service-name (:service-name ?spec)
            :claim-templates (:claim-templates ?spec)
            :image-pull-secrets (:image-pull-secrets ?spec)
            :service-account-name (:service-account-name ?spec)
            :automount-service-account-token
            (:automount-service-account-token ?spec)
            :cronjob-spec (:cronjob-spec ?spec)
            :job-spec (:job-spec ?spec)
            :spec (dissoc ?spec :name :type :service-name
                          :controller-type
                          :controller-uid
                          :cronjob-spec
                          :job-spec
                          :claim-templates
                          :termination-grace-period
                          :image-pull-secrets
                          :service-account-name
                          :automount-service-account-token
                          :update-strategy
                          :pod-management-policy
                          :id :__id)}))

(defrule insert-common-labels-into-podtemplatespec
  {:priority 65}
  "Insert 'name:' and 'component:' labels to podtemplatespec"
  [?ptspec :podtemplatespec (not (:metadata ?ptspec))]
  [?ai :app-info]
  =>
  (remove! ?ptspec)
  (let [baselabels
        (map-label-names {:name (:name ?ai) :component (:name ?ptspec)})]
    (insert! (assoc-in ?ptspec [:metadata :labels] baselabels))))

(defrule insert-custom-labels-into-podtemplatespec
  {:priority 60}
  "Insert any custom labels from the yipee service into the podtemplatespec"
  [?ptspec :podtemplatespec (:metadata ?ptspec)]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?ptspec))]
  [?label :label (= (:id ?cgroup) (:cgroup ?label))]
  [?ai :app-info]
  =>
  (remove! ?ptspec)
  (remove! ?label)
  (insert!
   (assoc-in ?ptspec [:metadata :labels (label-key-name (:key ?label))]
             (label-name (:value ?label)))))

(defn build-deployment-spec-template [ptspec]
  (let [base (dissoc ptspec :name
                     :type :controller-type
                     :termination-grace-period
                     :image-pull-secrets
                     :service-account-name
                     :automount-service-account-token
                     :update-strategy
                     :claim-templates
                     :cronjob-spec
                     :job-spec
                     :pod-management-policy
                     :service-name :id :__id)]
    (-> base
        (assoc-in-if-filled [:spec :imagePullSecrets]
                            (:image-pull-secrets ptspec))
        (assoc-in-if-filled [:spec :serviceAccountName]
                            (:service-account-name ptspec))
        (assoc-in-if-filled [:spec :automountServiceAccountToken]
                            (:automount-service-account-token ptspec)))))

(defrule create-deployment-spec
  {:priority 50}
  "Create a new DeploymentSpec (and assign a podtemplatespec)"
  [?ptspec :podtemplatespec
   (not (or (= (:restartPolicy (:spec ?ptspec)) "no")
            (= (:restartPolicy (:spec ?ptspec)) "Never")))]
  =>
  (remove! ?ptspec)
  (insert! (assoc-if-filled
            {:type :deploymentSpec :name (:name ?ptspec)
             :id (:id ?ptspec)
             :claim-templates (:claim-templates ?ptspec)
             :selector {:matchLabels (:labels (:metadata ?ptspec))}
             :rollbackTo {:revision 0}
             :strategy (or (:strategy ?ptspec)
                           {:type "RollingUpdate"
                            :rollingUpdate {:maxSurge 1 :maxUnavailable 1}})
             :template (build-deployment-spec-template ?ptspec)}
            {:cronjob-spec (:cronjob-spec ?ptspec)
             :job-spec (:job-spec ?ptspec)
             :revisionHistoryLimit (:revisionHistoryLimit ?ptspec)})))

(defrule add-top-labels-to-deployment-spec
  {:priority 50}
  "Add any labels at the top level, rather than in the spec"
  [?dspec :deploymentSpec]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?dspec))]
  [?label :top-label (= (:id ?cgroup) (:cgroup ?label))]
  =>
  (id-remove! ?dspec)
  (id-remove! ?label)
  (id-insert!
   (assoc-in ?dspec [:top-labels (label-key-name (:key ?label))]
             (label-name (:value ?label)))))

(defrule insert-replica-count-into-deployment-spec
  {:priority 50}
  "Insert the replica count into deploymentSpec"
  [?dspec :deploymentSpec]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?dspec))]
  [?replica :replication (= (:cgroup ?replica) (:id ?cgroup))]
  =>
  (remove! ?replica)
  (remove! ?dspec)
  (insert! (assoc ?dspec :replicas (:count ?replica))))

(defrule update-deployment-spec-info
  {:priority 40}
  "Update a DeploymentSpec's info based on deployment-spec"
  [?depspec :deploymentSpec]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?depspec))]
  [?dspec :deployment-spec
   (= (:id ?cgroup) (:cgroup ?dspec))
   (= (:mode ?dspec) "replicated")]
  =>
  (remove! ?depspec)
  (remove! ?dspec)
  (let [val (assoc ?depspec :replicas (:count ?dspec 1))]
    (insert! (assoc-if-filled
              val
              {:strategy (translate-strategy (:update-strategy ?dspec))
               :revisionHistoryLimit (:revisionHistoryLimit ?dspec)}))))

(defrule add-controller-type-and-other-goodies-to-podspec
  {:priority 80}
  "Determine the type of controller to generate from the spec"
  [?pspec :podspec (nil? (:controller-type ?pspec))]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?pspec))]
  [?dspec :deployment-spec
   (and (:controller-type ?dspec) (filled-in? (:controller-type ?dspec)))
   (= (:id ?cgroup) (:cgroup ?dspec))]
  =>
  (remove! ?pspec)
  (insert! (assoc ?pspec
                  :controller-type (:controller-type ?dspec)
                  :service-name (:service-name ?dspec)
                  :service-account-name (:service-account-name ?dspec)
                  :automount-service-account-token
                  (:automount-service-account-token ?dspec)
                  :image-pull-secrets (:image-pull-secrets ?dspec))))


(defrule update-deployment-spec-to-daemonset
  {:priority 40}
  "Switch a DeploymentSpec to a DaemonSetSpec based on mode"
  [?depspec :deploymentSpec]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?depspec))]
  [?dspec :deployment-spec
   (= (:id ?cgroup) (:cgroup ?dspec))
   (= (:mode ?dspec) "allnodes")]
  =>
  (remove! ?depspec)
  (remove! ?dspec)
  (let [strategy (update (:strategy ?depspec) :rollingUpdate dissoc :maxSurge)
        depspec (assoc-if-filled
                 (assoc (dissoc ?depspec :replicas :rollbackTo :strategy
                               :claim-templates)
                        :updateStrategy strategy)
                 :revisionHistoryLimit (:revisionHistoryLimit ?dspec))]
    (insert! (assoc depspec :type :daemon-set-spec))))

(defrule update-deployment-spec-to-stateful-set
  {:priority 40}
  "Switch a deploymentSpec to a statefulSetSpec based on controller type"
  [?depspec :deploymentSpec]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?depspec))]
  [?dspec :deployment-spec
   (= (:id ?cgroup) (:cgroup ?dspec))
   (= (keyword (:controller-type ?dspec)) :StatefulSet)]
  =>
  (remove! ?depspec)
  (remove! ?dspec)
  (let [depspec (update-in (dissoc ?depspec
                                   :selector
                                   :rollbackTo
                                   :strategy
                                   :updateStrategy)
                           [:template :spec]
                           dissoc
                           :restartPolicy)]
    (insert!
     (assoc-if-filled
      (assoc-in
       (assoc depspec
              :type :stateful-set-spec
              :updateStrategy (:update-strategy ?dspec)
              :podManagementPolicy (:pod-management-policy ?dspec)
              :serviceName (:service-name ?dspec)
              :replicas (:count ?dspec)
              :selector (:selector ?depspec))
       [:template :spec :terminationGracePeriodSeconds]
       (:termination-grace-period ?dspec))
      :revisionHistoryLimit (:revisionHistoryLimit ?dspec)))))

(defrule update-deployment-spec-to-cron-job
  {:priority 40}
  "Switch a deploymentSpec to a cronJobSpec based on mode"
  [?depspec :deploymentSpec]
  [?cgroup :container-group (= (:pod ?cgroup) (:id ?depspec))]
  [?dspec :deployment-spec
   (= (:id ?cgroup) (:cgroup ?dspec))
   (= (keyword (:controller-type ?dspec)) :CronJob)]
  =>
  (remove! ?depspec)
  (remove! ?dspec)
  (let [depspec (dissoc ?depspec
                        :selector
                        :revisionHistoryLimit
                        :strategy
                        :updateStrategy
                        :claim-templates
                        :cronjob-spec
                        :job-spec
                        :podManagementPolicy
                        :serviceName
                        :replicas
                        :type
                        :rollbackTo
                        :selector
                        :name
                        :id
                        :__id)]
    (insert!
     (assoc-in
      (merge {:type :cronjob-spec
              :name (:name ?depspec)
              :id (:id ?depspec)}
             (:cronjob-spec ?depspec))
      [:jobTemplate :spec]
      (merge (:job-spec ?depspec) depspec)))))

(defrule create-deployment
  {:priority 30}
  "Create a Deployment from DeploymentSpec"
  [?dspec :deploymentSpec]
  =>
  (remove! ?dspec)
  (insert! {:type :deployment
            :id (:id ?dspec)
            :apiVersion "extensions/v1beta1" :kind "Deployment"
            :metadata (assign-top-labels ?dspec)
            :spec (dissoc ?dspec :name :type :labels :top-labels
                          :claim-templates :id :__id)}))

(defrule create-daemon-set
  {:priority 30}
  "Create a DaemonSet from a DaemonSetSpec"
  [?dsspec :daemon-set-spec]
  =>
  (remove! ?dsspec)
  (insert! {:type :daemonSet
            :id (:id ?dsspec)
            :apiVersion "extensions/v1beta1" :kind "DaemonSet"
            :metadata (assign-top-labels ?dsspec)
            :spec (dissoc ?dsspec :name :type :labels :top-labels :id :__id)}))

(defrule create-stateful-set
  {:priority 30}
  "Create a StatefulSet from a StatefulSetSpec"
  [?ssspec :stateful-set-spec]
  =>
  (remove! ?ssspec)
  (insert! {:type :statefulSet
            :id (:id ?ssspec)
            :apiVersion "apps/v1beta1" :kind "StatefulSet"
            :metadata (assign-top-labels ?ssspec)
            :spec (assoc-if-filled
                   (dissoc ?ssspec :name :type :labels :top-labels
                           :claim-templates :id :__id)
                   :volumeClaimTemplates
                   (:claim-templates ?ssspec))}))

(defrule create-cron-job
  {:priority 30}
  "Create a CronJob from a CronJobSpec"
  [?cjspec :cronjob-spec]
  =>
  (remove! ?cjspec)
  (insert! {:type :cronJob
            :id (:id ?cjspec)
            :apiVersion "batch/v1beta1" :kind "CronJob"
            :metadata {:name (dns-name (:name ?cjspec))}
            :spec (dissoc ?cjspec :name :type :id :__id)}))

(defn matches-port-mapping [exp pm]
  (let [extport (:port (parse-exposed exp))]
    (= (str extport) (:internal pm))))

(defrule create-generated-port-mapping-from-expose
  {:priority 24}
  "Create an internal port mapping from expose keyword"
  [?exposed :exposed-port]
  [?cgroup :container-group
   (some #(= (:container ?exposed) %) (all-containers ?cgroup))]
  [:not [?pm :port-mapping
         (= (:container ?pm) (:container ?exposed))
         (matches-port-mapping ?exposed ?pm)]]
  [:not [?ss :service-spec
         (some #(matches-port-mapping ?exposed %) (:ports ?ss))]]
  =>
  (remove! ?exposed)
  (let [epmap (parse-exposed ?exposed)]
    (insert! {:type :port-mapping
              :defining-service ""
              :svc-port-name ""
              :container-references true
              :container (:container ?exposed)
              :name (port-name (:name ?cgroup) (:port epmap))
              :internal (str (:port epmap))
              :external (str (:port epmap))
              :protocol (:protocol epmap)})))

(defrule create-service-spec-for-external-name
  {:priority 20}
  "Create a Service Spec"
  [?ks :k8s-service (= (:service-type ?ks) "ExternalName")]
  =>
  (insert! {:type :service-spec
            :name (:name ?ks)
            :externalName (:external-name ?ks)}))

(defn create-service-spec [obj]
  {:type :service-spec :name (:name (:metadata obj))
   :cont-id (:id obj)
   :selector (get-in obj [:spec :selector :matchLabels])})

(defrule create-service-spec-for-controller
  {:priority 20}
  "Create a ServiceSpec"
  [?cont :k8s-controller
   (some :ports (all-containers (:spec (:template (:spec ?cont)))))]
  [:not [?ks :k8s-service
         (or (service-selects-populated-controller ?ks ?cont)
             (= (:type (:spec ?ks)) "ExternalName"))]]
  [:not [?spec :service-spec (= (:cont-id ?spec) (:id ?cont))]]
  [:not [?svc :service (service-selects-populated-controller ?svc ?cont)]]
  =>
  (insert! (create-service-spec ?cont)))

(defrule create-service-spec-for-pod
  {:priority 20}
  "Create a ServiceSpec"
  [?pod :pod (some :ports (all-containers (:spec ?pod)))]
  [:not [?spec :service-spec (= (:cont-id ?spec) (:id ?pod))]]
  [:not [?svc :service (= (safe-dns-name ?svc)
                          (safe-dns-name ?pod))]]
  =>
  (insert! {:type :service-spec :name (:name (:metadata ?pod))
            :cont-id (:id ?pod)
            :selector (:labels (:metadata ?pod))}))

(defrule create-service-spec-for-controller-with-explicit-service
  {:priority 20}
  "Create a ServiceSpec"
  [?cont :k8s-controller]
  [?ks :k8s-service
   (service-selects-populated-controller ?ks ?cont)
   (not= (:service-type ?ks) "ExternalName")]
  [:not [?spec :service-spec (= (:name ?spec) (:name ?ks))]]
  [:not [?svc :service (= (safe-dns-name ?svc)
                          (safe-dns-name ?cont))]]
  =>
  (insert! (assoc-if-filled
            {:type :service-spec
             :name (:name ?ks)
             :cont-id (:id ?cont)}
            :selector
            (:selector ?ks))))

(defrule create-service-spec-for-pod-with-explicit-service
  {:priority 20}
  "Create a ServiceSpec"
  [?pod :pod (not (some :ports (all-containers (:spec ?pod))))]
  [?ks :k8s-service (service-selects-populated-pod ?ks ?pod)]
  [:not [?spec :service-spec (= (:cont-id ?spec) (:id ?pod))]]
  [:not [?svc :service (service-selects-populated-pod ?svc ?pod)]]
  =>
  (insert! (assoc-if-filled
            {:type :service-spec
             :name (get-in ?pod [:metadata :labels :component])
             :cont-id (:id ?pod)}
            :selector
            (:metadata ?pod))))

(defrule patch-old-port-mappings
  {:priority *adjustment*}
  "Make sure old model port mappings include 'container-references'"
  [?pmap :port-mapping (not (contains? ?pmap :container-references))]
  =>
  (remove! ?pmap)
  (insert! (assoc ?pmap
                  :container-references
                  (and (filled-in? (:container ?pmap))
                       (filled-in? (:internal ?pmap))))))

(defrule insert-ports-into-service-spec
  {:priority 20}
  "Insert ports into service spec"
  [?sspec :service-spec]
  [?cgroup :container-group (= (:pod ?cgroup) (:cont-id ?sspec))]
  [?pm :port-mapping
   (some #(= % (:container ?pm)) (:containers ?cgroup))
   (and (filled-in? (:external ?pm))
        (not= (:external ?pm) "*"))
   (not (some #(and (= (:port %) (intval (:external ?pm)))
                    (= (str (:targetPort %)) (:internal ?pm)))
              (:ports ?sspec)))]
  [:not [?ks :k8s-service
         (= (:name ?ks) (:name ?sspec))
         (= (:service-type ?ks) "ExternalName")]]
  =>
  (remove! ?sspec)
  (let [port {:port (intval (:external ?pm))
              :targetPort (or (intval-or-name (:internal ?pm))
                              (intval (:external ?pm)))
              :name (first-filled (:svc-port-name ?pm)
                                  (port-name (:name ?cgroup) (:external ?pm)))
              :protocol (canonicalize-protocol (:protocol ?pm))}]
    (insert! (update ?sspec :ports #(cons port %)))))

(defrule insert-ports-into-service-spec-without-container
  {:priority 20}
  "Insert ports into service spec"
  [?sspec :service-spec]
  [?ks :k8s-service
   (= (:name ?ks) (:name ?sspec))
   (not= (:service-type ?ks) "ExternalName")]
  [?pm :port-mapping
   (and (filled-in? (:external ?pm))
        (not= (:external ?pm) "*"))
   (= (:defining-service ?pm) (:id ?ks))
   (not (some #(and (= (:port %) (intval (:external ?pm)))
                    (= (str (:targetPort %)) (:internal ?pm)))
              (:ports ?sspec)))]
  =>
  (remove! ?sspec)
  (when (not (seq? (collect! :container #(= (:id %) (:container ?pm)))))
    (remove! ?pm))
  (let [port (assoc-if-filled
              {:port (intval (:external ?pm))
               :targetPort (or (intval-or-name (:internal ?pm))
                               (intval-or-name (:external ?pm)))
               :name (first-filled (:svc-port-name ?pm)
                                   (port-name (:name ?ks) (:external ?pm)))
               :protocol (canonicalize-protocol (:protocol ?pm))}
              :nodePort (intval (:node-port ?pm)))]
    (insert! (update ?sspec :ports #(cons port %)))))

(defrule create-ingress
  {:priority 20}
  "Create an ingress from flat k8s ingress"
  [?ingress :ingress (ingress-has-key-instances ?ingress :service-id)]
  [?ks :k8s-service]
  =>
  (let [svcs (collect! :k8s-service identity)
        f (fn [id ents] (:name (first (filter #(= (:id %) id) ents))))
        inkey :service-id
        outkey :serviceName]
    (remove! ?ingress)
    (insert!
     (merge {:apiVersion "extensions/v1beta1" :kind "Ingress"}
            (substitute-ingress-attributes ?ingress svcs f inkey outkey)))))

(defrule insert-service-spec-into-service
  {:priority 10}
  "Insert ServiceSpec into Service"
  [?sspec :service-spec]
  [:not [?ks :k8s-service (= (:name ?ks) (:name ?sspec))]]
  =>
  (remove! ?sspec)
  (let [sspec (dissoc ?sspec :name :type :id :__id :spec-type :cont-id)
        newsspec (if (contains? ?sspec :spec-type)
                   (assoc sspec :type (:spec-type ?sspec))
                   sspec)]
    (insert! {:type :service
              :apiVersion "v1" :kind "Service"
              :metadata {:name (dns-name (:name ?sspec))}
              :spec newsspec})))

(defrule insert-known-service-spec-into-service
  {:priority 10}
  "Insert ServiceSpec into Service"
  [?sspec :service-spec]
  [?ks :k8s-service
   (= (:name ?ks) (:name ?sspec))
   (:selector ?ks)
   (not= (:service-type ?ks) "ExternalName")]
  =>
  (remove! ?sspec)
  (remove! ?ks)
  (let [sspec (dissoc ?sspec :name :type :id :__id :spec-type :cont-id)]
    (insert! {:type :service
              :apiVersion "v1" :kind "Service"
              :metadata (assoc (:metadata ?ks)
                                :name (dns-name (:name ?sspec)))
              :spec (assoc-if-filled
                      (assoc sspec
                             :selector (:selector ?ks)
                             :type (:service-type ?ks))
                      :clusterIP
                      (:cluster-ip ?ks))})))

(defrule insert-known-headless-service-spec-into-service
  {:priority 10}
  "Insert Headless ServiceSpec into Service"
  [?sspec :service-spec]
  [?ks :k8s-service
   (= (:name ?ks) (:name ?sspec))
   (= (:service-type ?ks) "ExternalName")]
  =>
  (remove! ?sspec)
  (remove! ?ks)
  (let [sspec (dissoc ?sspec :name :type :id :__id :spec-type :cont-id)]
    (insert! {:type :service
              :apiVersion "v1" :kind "Service"
              :metadata (assoc (:metadata ?ks)
                                :name (dns-name (:name ?sspec)))
              :spec (assoc sspec :type "ExternalName")})))

(defn add-yipee-annotations [kc ma]
  (remove! kc)
  (insert! (assoc-in kc [:metadata :annotations]
                     (merge (get-in kc [:metadata :annotations])
                            (dissoc ma :type :__id :id)))))

(defn has-yipee-annos [kc]
  (when-let [annos (get-in kc [:metadata :annotations])]
    (seq (filter #(str/starts-with? (name (first %1)) "yipee.") annos))))

(defrule insert-k8s-annos
  ;; before insert-service-spec-into-service cuz that will
  ;; turn k8s-service to service before annos have been attached to k8s-service
  {:priority 11}
  [?anno :k8s-annotation]
  [?owner :k8s-annotatable
   ;; XXX: k8s-service name placement is different in UI flatfile
   ;; and imported flatfile
   (or (= (get-in ?owner [:metadata :name]) (:annotated-name ?anno))
       (= (:name ?owner) (:annotated-name ?anno)))
   (= (:type ?owner) (keyword (:annotated-type ?anno)))]
  =>
  (id-remove! ?anno)
  (id-remove! ?owner)
  (let [location (map keyword (:location ?anno))
        curannos (get-in ?owner location)]
    (id-insert! (assoc-in ?owner location
                          (merge curannos {(:key ?anno) (:value ?anno)})))))

(defrule add-k8s-yipee-annotations
  [?kc :k8s-annotatable (not (has-yipee-annos ?kc))]
  [?ma :model-annotations]
  =>
  (add-yipee-annotations ?kc ?ma))

(defrule remove-used-annotations
  {:priority *cleanup*}
  [:not [?kc :k8s-annotatable (not (has-yipee-annos ?kc))]]
  [?ma :model-annotations]
  =>
  (remove! ?ma))

(defrule remove-leftovers
  {:priority *cleanup*}
  =>
  (doseq [leftover (collect! :leftover identity)]
    (remove! leftover)))

