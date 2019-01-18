(ns k8scvt.cvt-test
  (:require [clojure.test :refer :all]
            [clojure.pprint :refer [pprint]]
            [clojure.stacktrace :as st]
            [clojure.string :as str]
            [clojure.walk :as walk]
            [clojure.java.io :refer [file]]
            [clojure.java.shell :refer [sh]]
            [clj-yaml.core :as yaml]
            [engine.core :refer :all]
            [k8scvt.validators :as v]
            [k8scvt.testutil :refer :all]
            [k8scvt.api-tests :refer [get-tar-entries]]
            [k8scvt.file-import :as fi]
            [k8scvt.util :as u]
            [k8scvt.flat-to-k8s]
            [k8scvt.k8s-to-flat]
            [k8scvt.flat-validator :as fv]
            [helm.core :as helm]
            [composecvt.compose-to-flat]
            [clojure.data.json :as json])
  (:import java.nio.file.FileSystems java.io.File))

(defn every-pair? [pred x y]
  (every? (fn [[a b]] (pred a b)) (map vector x y)))

(declare k8s-compare)
(def ^:dynamic *compare-trace* false)
(def ^:dynamic *trace-indent* "")
(def ^:dynamic *record-rule-output-flag* :norecord)

(def extra-indent "  ")

(defn valid-obj [o]
  (or (:kind o) (= (:type o) :validation-error)))

(def sort-cases
  (atom [[#(and (map? %) (= (:kind %) "Deployment"))
          #(assoc %
                  :kind "ReplicationController"
                  :apiVersion "v1")]]))

(defn name-if [x] (and x (name x)))

(defn sort-rep [x]
  (loop [cases @sort-cases]
    (if (empty? cases)
      (if (map? x)
        (try
          (str (into (sorted-map) x))
          (catch Exception _ (str x)))
        (str x))
      (let [[selector fun] (first cases)]
        (if (selector x)
          (str (fun x))
          (recur (rest cases)))))))

(defn check-recording [file]
  (if (vector? file)
    [(first file) :record]
    [file *record-rule-output-flag*]))

(defn instantiate [x]
  (walk/postwalk #(if (seq? %) (vec %) %) x))

(defn prune-yipee-labels [ilabels olabels]
  (if (not ilabels)
    (dissoc olabels :name :component)
    (loop [o olabels defaults [:name :component]]
      (if (empty? defaults)
        o
        (let [default (first defaults)]
          (if (some #{default} (keys ilabels))
            (recur o (rest defaults))
            (recur (dissoc o default) (rest defaults))))))))

(defn remove-check-type [container]
  (loop [c container probes [:livenessProbe :readinessProbe]]
    (if (empty? probes)
      c
      (let [pt (first probes)
            rest (rest probes)]
        (if (:check-type (pt c))
          (recur (update c pt dissoc :check-type) rest)
          (recur c rest))))))

(defn allow-for-secrets-not-specified-as-readonly [i o]
  (when (and (:containers @i) (:containers @o)
             (:volumes @i) (:volumes @o))
    (let [svols (filter :secret (:volumes @i))
          smounts (filter #(some (fn [sv] (= (:name sv) (:name %))) svols)
                          (mapcat :volumeMounts (:containers @i)))]
      (doseq [sm smounts]
        (when-not (:readOnly sm)
          (swap! o update :containers
                 (fn [conts]
                   (mapv (fn [c]
                           (update c
                                   :volumeMounts
                                   #(mapv (fn [vm] (if (= (:name vm) (:name sm))
                                                     (dissoc vm :readOnly)
                                                     vm))
                                          %)))
                         conts))))))))

(defn transform-maps [in out]
  (let [i (atom in) o (atom out)]
    (allow-for-secrets-not-specified-as-readonly i o)
    ;; ignore differing guid-based secret names
    (when (and (:secretName @i)
               (.startsWith (:secretName @i) "generated-")
               (:secretName @o)
               (.startsWith (:secretName @o) "generated-"))
      (swap! i assoc :secretName "secret")
      (swap! o assoc :secretName "secret"))
    ;; yipee annotations are dropped from imported input files so they
    ;; can't be expected in conversion outputs...
    (when (get-in @i [:metadata :annotations])
      (swap! i update-in [:metadata :annotations] dissoc
             :yipee.io.lastModelUpdate :yipee.io.modelId
             :yipee.io.contextId :yipee.io.modelURL))
    (when (and (get-in @i [:metadata :uid])
               (not (get-in @o [:metadata :uid])))
      (swap! i update :metadata dissoc :uid))
    (when (and (:component @o) (not (:component @i)))
      (swap! o dissoc :component))
    (when (and (or (= (:protocol @o) "TCP") (= (:protocol @o) "tcp"))
               (not (:protocol @i)))
      (swap! o dissoc :protocol))
    (when (or (and (:containerPort @o) (:containerPort @i))
              (and (:targetPort @o)
                   (not (:targetPort @i))
                   (= (:port @o) (:targetPort @o))))
      (when (not (:targetPort @i)) (swap! o dissoc :targetPort))
      (when (and (:name @o) (not (:name @i)))
        (swap! o dissoc :name)))
    (when (and (not (:volumes @i))
               (:volumes @o)
               (empty? (:volumes @o)))
      (swap! o dissoc :volumes))
    (doseq [field [:containerPort :targetPort :port]]
      (when (and (field @o)
                 (field @i)
                 (integer? (field @o))
                 (string? (field @i))
                 (= (str (field @o)) (field @i)))
        (swap! o update field str)))
    (when (and (= (:kind @o) "Service")
               (= (:kind @i) "Service")
               (not (:type (:spec @i)))
               (= (:type (:spec @o)) "ClusterIP"))
      (swap! o update :spec (fn [s] (dissoc s :type))))
    (when (and (:port @i) (not (:name @i)) (:port @o) (:name @o))
      (swap! o dissoc :name))
    (when (and (= (:kind @i) "Deployment")
               (= (:kind @o) "Deployment"))
      (when (and (= (:replicas (:spec @o)) 1)
                 (not (contains? (:spec @i) :replicas)))
        (swap! o update :spec dissoc :replicas))
      (when (and (not (contains? (:spec @i) :rollbackTo))
                 (= (:rollbackTo (:spec @o)) {:revision 0}))
        (swap! o update :spec #(dissoc % :rollbackTo)))
      (when (and (not (contains? (get-in @i [:spec :template :spec])
                                 :restartPolicy))
                 (= (get-in @o [:spec :template :spec :restartPolicy] "Always")))
        (swap! o update-in [:spec :template :spec] #(dissoc % :restartPolicy)))
      (when (and (not (contains? (:spec @i) :strategy))
                 (= (:strategy (:spec @o))
                    {:type "RollingUpdate",
                     :rollingUpdate {:maxSurge 1, :maxUnavailable 1}}))
        (swap! o update :spec #(dissoc % :strategy)))
      (when (and (not (contains? (:spec @i) :selector))
                 (contains? (:spec @o) :selector))
        (let [ilabels (get-in [:spec :template :spec :metadata :labels] @i)
              olabels (get-in [:spec :template :spec :metadata :labels] @o)
              ikeys (keys ilabels)
              okeys (keys olabels)]
          (when (and (every? (set okeys) ikeys)
                     (every? #(= (ilabels %) (olabels %)) ikeys))
            (swap! o update :spec #(dissoc % :selector)))))
      (let [imlabels (get-in @i [:spec :selector :matchLabels])
            omlabels (get-in @o [:spec :selector :matchLabels])]
        (when (and imlabels omlabels)
          (let [pruned (prune-yipee-labels imlabels omlabels)]
            (swap! o assoc-in [:spec :selector :matchLabels] pruned)))))
    (when (= (:kind @o) "Deployment")
      (when (and (= (:kind @i) "Deployment")
                 (= (:apiVersion @i) "v1"))
        (swap! o assoc :apiVersion "v1"))
      (when (and (= (:kind @i) "Deployment")
                 (= (:apiVersion @i) "apps/v1"))
        (swap! o assoc :apiVersion "apps/v1"))
      (when (= (:kind @i) "ReplicationController")
        (swap! o update-in [:spec :template :spec] #(dissoc % :restartPolicy))
        (swap! o update :spec
               #(dissoc % :strategy :revisionHistoryLimit :rollbackTo))
        (swap! o assoc :apiVersion "v1")
        (swap! o update-in [:spec :selector] :matchLabels))
      (let [olabels (:labels (:metadata @o))
            ilabels (:labels (:metadata @i))
            pruned (prune-yipee-labels ilabels olabels)]
        (swap! o #(if (empty? pruned)
                    (update-in % [:metadata] (fn [m] (dissoc m :labels)))
                    (assoc-in % [:metadata :labels] pruned))))
      (let [olabels (:labels (:metadata (:template (:spec @o))))
            ilabels (:labels (:metadata (:template (:spec @i))))
            pruned (prune-yipee-labels ilabels olabels)]
        (swap! o #(if (empty? pruned)
                    (update-in %
                               [:spec :template :metadata]
                               (fn [m] (dissoc m :labels)))
                    (assoc-in % [:spec :template :metadata :labels] pruned))))
      (let [olabels (:selector (:spec @o))
            ilabels (:selector (:spec @i))]
        (when (and olabels ilabels)
          (let [pruned (prune-yipee-labels ilabels olabels)]
            (swap! o #(if (empty? pruned)
                        (update-in % [:spec :selector]
                                   (fn [m] (dissoc m :labels)))
                        (assoc-in % [:spec :selector] pruned))))))
      (let [oconts (get-in @o [:spec :template :spec :containers])
            fixed (map remove-check-type oconts)]
        (swap! o assoc-in [:spec :template :spec :containers] fixed)))
    (when (and (= (:kind @i) "PersistentVolumeClaim")
               (= (:kind @o) "PersistentVolumeClaim")
               (not (contains? @i :resources))
               (contains? @o :resources))
      (swap! o dissoc :resources))
    (when (and (= (:kind @i) "StatefulSet")
               (= (:kind @o) "StatefulSet"))
      (let [iclaims (get-in @i [:spec :volumeClaimTemplates])
            oclaims (get-in @o [:spec :volumeClaimTemplates])]
        (when (and iclaims oclaims)
          (doseq [ic iclaims]
            (if (not (get-in ic [:spec :volumeMode]))
              (let [idx (atom 0) done (atom false)]
                (doseq [oc oclaims]
                  (when (and (not @done)
                             (= (:name (:metadata oc))
                                (:name (:metadata ic)))
                             (= (name-if (get-in oc [:spec :volumeMode]))
                                "Filesystem"))
                    (swap! o assoc-in
                           [:spec :volumeClaimTemplates]
                           (vec
                            (concat
                             (keep-indexed (fn [i v] (when (not= i @idx) v))
                                           oclaims)
                             (list (update oc :spec dissoc :volumeMode)))))
                    (reset! done true))
                  (swap! idx inc)))))))
      (let [olabels (:labels (:metadata (:template (:spec @o))))
            ilabels (:labels (:metadata (:template (:spec @i))))
            pruned (prune-yipee-labels ilabels olabels)]
        (swap! o #(if (empty? pruned)
                    (update-in %
                               [:spec :template :metadata]
                               (fn [m] (dissoc m :labels)))
                    (assoc-in % [:spec :template :metadata :labels] pruned))))
      (let [olabels (:selector (:spec @o))
            ilabels (:selector (:spec @i))
            pruned (prune-yipee-labels ilabels olabels)]
        (swap! o #(if (empty? pruned)
                    (update-in % [:spec :selector] (fn [m] (dissoc m :labels)))
                    (assoc-in % [:spec :selector] pruned))))
      (when (and (:selector (:spec @o))
                 (not (:selector (:spec @i))))
        (swap! o update :spec #(dissoc % :selector)))
      (doseq [[field val] [[:updateStrategy
                            {:type "RollingUpdate"
                             :rollingUpdate {:partition 0}}]
                           [:podManagementPolicy "OrderedReady"]]]
        (when (and (not (contains? (:spec @i) field))
                   (= (field (:spec @o)) val))
          (swap! o update :spec dissoc field)))
      (when (and (not (contains? (:spec (:template (:spec @i)))
                                 :terminationGracePeriodSeconds))
                 (= (:terminationGracePeriodSeconds
                     (:spec (:template (:spec @o))))
                    10))
        (swap! o update-in [:spec :template :spec]
               dissoc :terminationGracePeriodSeconds)))
    (when (and (:volumeName @i)
               (:volumeName @o)
               (not (or (contains? @i :accessModes)
                        (contains? @i :storageClass)
                        (contains? @i :selector)))
               (and (contains? @o :accessModes)
                    (contains? @o :storageClass)
                    (contains? @o :selector)))
      (swap! o dissoc :accessModes :storageClass :selector))
    (when (and (= (:kind @i) "PersistentVolumeClaim")
               (= (:kind @o) "PersistentVolumeClaim")
               (= (:accessModes (:spec @o)) ["ReadWriteOnce"])
               (not (contains? (:spec @i) :accessModes)))
      (swap! o update :spec dissoc :accessModes))
    ;; If the input contains the default value, it's okay that the output doesn't
    (when (and (:volumeName @i)
               (:volumeName @o)
               (contains? @i :volumeMode)
               (= (:volumeMode @i) "Filesystem")
               (not (contains? @o :volumeMode)))
      (swap! i dissoc :volumeMode))

    (when (and (= (:namespace @i) "default")
               (or (not (:namespace @o)) (= (:namespace @o) "")))
      (swap! o assoc :namespace "default"))
    (doseq [field fi/output-only-metadata]
      (when (and (contains? @i field)
                 (not (contains? @o field)))
        (swap! i dissoc field)))
    [@i @o]))

(defn display-string [x]
  (with-out-str (pprint (instantiate x))))

(defn trace-display [fun input output]
  (when *compare-trace*
    (let [indent (str *trace-indent* extra-indent)
          trace-str (str "\n" (display-string input)
                         "------"
                         "\n" (display-string output)
                         "------")]
      (print (str *trace-indent* fun " {\n" indent "------"))
      (println (str/replace trace-str #"[\n]" #(str % indent))))))

(defn trace-finish [result]
  (when *compare-trace*
    (if result
      (println (str *trace-indent* "}"))
      (println (str *trace-indent* "}: FALSE")))))

(defn k8s-comp-string [input output]
  (let [res (and (string? output)
                 (or (= input output)
                     (and (= input "ReplicationController")
                          (= output "Deployment"))))]
    res))

(defn k8s-comp-map [input-map output-map]
  (let [res (atom false)]
    (when (map? output-map)
      (let [[input output] (transform-maps input-map output-map)]
        (binding [*trace-indent* (str *trace-indent* extra-indent)]
          (reset! res
                  (and (map? output)
                       (= (count (keys input)) (count (keys output)))
                       (let [vinput (sort-by str (vec input))
                             voutput (sort-by str (vec output))]
                         (every-pair?
                          #(and (k8s-compare (first %1) (first %2))
                                (k8s-compare (second %1) (second %2)))
                          vinput
                          voutput)))))))
    @res))

(defn k8s-comp-vec [input output]
  (let [res
        (binding [*trace-indent* (str *trace-indent* extra-indent)]
          (and (vector? output)
               (= (count input) (count output))
               (let [vinput (sort-by sort-rep input)
                     voutput (sort-by sort-rep output)]
                 (every-pair? k8s-compare vinput voutput))))]
    res))

(defn k8s-compare-body [input output]
  (cond (string? input) (k8s-comp-string input output)
        (map? input) (k8s-comp-map input output)
        (vector? input) (if (seq? output)
                          (k8s-comp-vec input (vec output))
                          (k8s-comp-vec input output))
        (seq? input) (and (or (seq? output) (vector? output))
                          (k8s-compare (vec input) (vec output)))
        :else (= input output)))

(defn k8s-compare [input output]
  (let [result (binding [*compare-trace* false]
                 (k8s-compare-body input output))]
    (when-not result
        (trace-display "k8s-compare" input output)
        (binding [*trace-indent* (str *trace-indent* extra-indent)]
          (k8s-compare-body input output))
        (trace-finish result))
    result))

(defn check-match [k8s1 k8s2]
  (let [matchval (k8s-compare k8s1 k8s2)]
    (when-not matchval
      (binding [*compare-trace* true]
        (k8s-compare k8s1 k8s2))
      (is matchval))))

(defn assert-match [index k8s1 k8s2]
  (let [matchval (k8s-compare k8s1 k8s2)]
    (when-not matchval
      (binding [*compare-trace* true]
        (k8s-compare k8s1 k8s2))
      (spit (str "./tmp/k8s-input" index)
            (with-out-str (pprint k8s1)))
      (spit (str "./tmp/k8s-output" index)
            (with-out-str (pprint k8s2))))
    (is matchval)))

(defn get-matching-files [glob]
  (let [newglob (str "glob:" glob)
        grammar-matcher (.getPathMatcher (FileSystems/getDefault) newglob)]
    (->> "test/k8scvt/testdata"
         file
         file-seq
         (filter #(.isFile %))
         (filter #(.matches grammar-matcher (.getFileName (.toPath %))))
         (mapv #(.getName %)))))

(defn flat-to-wme-list [flat]
  (map #(assoc % :type (keyword (:type %)))
       (mapcat second flat)))

(defn keywordize-type [x] (mapv #(update % :type keyword) x))

(deftest cvt-test
  (testing "convert k8s to flat"
    (binding [u/*wmes-by-id* (atom {})]
      (let [to-flat (engine :k8scvt.k8s-to-flat)
            from-flat (engine :k8scvt.flat-to-k8s)
            flat-validator (engine :k8scvt.flat-validator)
            index (atom 0)]
        (doseq [file [
                      "racket.yaml"
                      "racket-with-secret.yaml"
                      "racket-with-secret-and-volume.yaml"
                      "racket-with-secret-volume-and-env.yaml"
                      "racket-with-secret-volume-env-and-label.yaml"
                      "racket-with-secret-volume-env-label-and-replicated.yaml"
                      "racket-with-secret-volume-env-label-and-all-nodes.yaml"
                      "new-secrets.yaml"
                      "rwsvelhn-entrypoint.yaml"
                      "yah-for-k8s.yaml"
                      "cluster-dns.yaml"
                      "multi-container.yaml"
                      "multi-volume-ref.yaml"
                      "redis.yaml"
                      "mongo-stateful.yaml"
                      "mongo-stateful-with-extras.yaml"
                      "redis-example.yaml"
                      "pods.yaml"
                      "complete-demo.yaml"
                      "wordpress-with-both-probes.yaml"
                      "no-volume-name.yaml"
                      "mongo-init-containers.yaml"
                      "import-annotations.yaml"
                      "env-configmap.yaml"
                      "env-secretref.yaml"
                      "kubectl-edit.yaml"
                      "ingress-issues.yaml"
                      "unknown-kinds.yaml"
                      ]]
          (println (str "\n========== PROCESSING: " file "(./tmp/<to|from>flat"
                        (inc @index) ") ==========\n"))
          (try
            (let [[fname record] (check-recording file)]
              (binding [*record-rule-output-flag* record]
                (let [k8s (fi/get-k8s-from-yaml-testdata fname)
                      raw (apply concat
                                 (vals (dissoc k8s :type :app-name :id :__id)))
                      serrors (v/validate
                               raw
                               (map-indexed (fn [idx val] (str "element" idx))
                                            raw))
                      _ (to-flat :configure
                                 {*record-rule-output-flag*
                                  (str "./tmp/toflat" (swap! index inc))})
                      _ (from-flat
                         :configure {*record-rule-output-flag*
                                     (str "./tmp/fromflat" @index)})
                      _ (System/gc)
                      wmes (time (to-flat :run-list [k8s]))
                      verrors (:validation-error (flat-validator :run wmes))
                      _ (System/gc)
                      results (time
                               (map #(dissoc % :type :id)
                                    (apply concat
                                           (vals (u/k8skeys
                                                  (from-flat :run-map wmes))))))]
                  (println "-----------------------------------------")
                  (is (empty? serrors))
                  (is (empty? verrors))
                  (is (empty? (filter (comp fi/output-only-metadata :metadata)
                                      results)))
                  (is (empty? (filter #(fi/output-only-toplevel (keys %))
                                      results)))
                  (assert-match @index
                                (apply concat (vals (dissoc k8s :type :app-name)))
                                results))))
            (catch Exception e
              (println (.getMessage e))
              (is false))))))))

(deftest yipee-annotations-for-service
  (testing "yipee annotations are added for services"
    (binding [u/*wmes-by-id* (atom {})]
      (let [to-flat (engine :k8scvt.k8s-to-flat)
            from-flat (engine :k8scvt.flat-to-k8s)]
        (let [k8s (fi/get-k8s-from-yaml-testdata "racket.yaml")
              flats (to-flat :run-list [k8s])
              results (apply concat
                             (vals (u/k8skeys (from-flat :run-map flats))))
              new-wmes (conj results
                             {:type :model-annotations
                              :yipee.generatedAt "2018-05-16T23:44:24Z"})
              k8s-results (from-flat :run new-wmes)
              svcs (:service k8s-results)]
          (doseq [svc svcs]
            (is (seq (:annotations (:metadata svc))))))))))

(deftest retain-pod-annotations
  (testing "k8s annotations are retained when Pod is translated to Deployment"
    (binding [u/*wmes-by-id* (atom {})]
      (let [to-flat (engine :k8scvt.k8s-to-flat)
            from-flat (engine :k8scvt.flat-to-k8s)]
        (let [k8s (fi/get-k8s-from-yaml-testdata "plain-old-pod.yaml")
              flats (to-flat :run-list [k8s])
              results (map #(dissoc % :type :id)
                           (apply concat
                                  (vals (u/k8skeys
                                         (from-flat :run-map flats)))))
              ;; converting a "plain old pod" yields both a Service and a
              ;; Deployment.  Annotations are retained with the deployment
              podannos (get-in (first (:pods k8s)) [:metadata :annotations])
              deployment (first (filter #(= "Deployment" (:kind %)) results))
              deplannos (get-in deployment [:metadata :annotations])]
          (is (= podannos deplannos)))))))

(defn strip-namespaces [stuff]
  (vec (map #(update % :metadata dissoc :namespace) stuff)))

(deftest namespaces
  (testing "only one namespace per model"
    (binding [u/*wmes-by-id* (atom {})]
      (let [to-flat (engine :k8scvt.k8s-to-flat)
            from-flat (engine :k8scvt.flat-to-k8s)]
        (doseq [f ["one-namespace-plus-default.yaml" "two-namespaces.yaml"]]
          (let [k8s (fi/get-k8s-from-yaml-testdata f)
                flats (to-flat :run-list [k8s])
                results (apply concat (vals (u/k8skeys (from-flat :run-map flats))))
                errors (filter #(= (:type %) :validation-error) results)]
            (is (= (count errors) 1))
            (is (= (first errors)
                   {:type :validation-error
                    :validation-type :constraint-violation
                    :constraint "Only one namespace may be included in a model"})))))))
  (testing "adding a single namespace flat object to a model causes
  all the top-level components to reside in that namespace"
    (binding [u/*wmes-by-id* (atom {})]
      (let [to-flat (engine :k8scvt.k8s-to-flat)
            from-flat (engine :k8scvt.flat-to-k8s)
            _ (to-flat :configure {*record-rule-output-flag* "./tmp/k8stoflatx"})
            _ (from-flat :configure {*record-rule-output-flag*
                                     "./tmp/k8sfromflatx"})]
        (doseq [f ["mongo-stateful-with-extras.yaml" "complete-demo.yaml"]]
          (let [k8s (fi/get-k8s-from-yaml-testdata f)
                wmes (to-flat :run-list [k8s])
                flats (conj (filterv #(not= (:type %) :model-namespace)
                                     wmes)
                            {:type :model-namespace :name "neighmspayz"})
                results (map #(dissoc % :type :id)
                             (apply concat
                                    (vals (u/k8skeys
                                           (from-flat :run-map flats)))))]
            (is (every? #(= (:namespace (:metadata %)) "neighmspayz")
                        results))
            (assert-match 0
                          (strip-namespaces
                           (apply concat (vals (dissoc k8s :type :app-name))))
                          (strip-namespaces results))))
        (doseq [f ["mongo-stateful-with-extras.yaml" "complete-demo.yaml"]]
          (let [k8s (fi/get-k8s-from-yaml-testdata f)
                wmes (to-flat :run-list [k8s])
                flats (filter #(not= (:type %) :model-namespace) wmes)
                results (map #(dissoc % :type :id)
                             (apply concat
                                    (vals (u/k8skeys
                                           (from-flat :run-map flats)))))]
            (is (every? #(nil? (:namespace (:metadata %))) results))
            (assert-match 0
                          (strip-namespaces
                           (apply concat (vals (dissoc k8s :type :app-name))))
                          results)))))))

(defn combined-yaml-to-vec [combined-string]
  (vec (map yaml/parse-string (str/split combined-string #"\n---\n"))))

(defn unpack [entries]
  (map #(update % :contents combined-yaml-to-vec) entries))

(defn equal-to-line-ordering [str1 str2]
  (= (sort (str/split str1 #"[\n]"))
     (sort (str/split str2 #"[\n]"))))

(defn test-models-to-helm [helm-name template-name model-data]
  (let [tarfile (helm/model-files-to-helm helm-name
                                          (mapv (comp test-file-name :model)
                                                model-data))
        pwd (System/getProperty "user.dir")
        entries (get-tar-entries (helm/decode-bytes tarfile))
        testdir (str pwd "/" (test-file-name "_temp_dir_"))
        tfile #(str testdir "/" %)
        tfile64 #(str (tfile %) ".tgz64")
        tfilegz #(str (tfile %) ".tgz")
        _ (.mkdirs (File. testdir))
        tarfile-name (tfile64 helm-name)
        decoded-name (tfilegz helm-name)
        _ (spit tarfile-name tarfile)
        _ (spit decoded-name
                (:out (sh (str pwd "/" (test-file-name "unpack"))
                          tarfile-name
                          :dir testdir)))
        search (fn [name] (first (filter #(= (:name %) name) entries)))
        tname (str helm-name "/templates/" template-name ".yaml")
        template (search tname)
        value-file-name #(str helm-name "/" (:app-name %) "_values.yaml")
        vals (map (comp search value-file-name) model-data)
        inst-template #(:out (sh "helm" "template" (tfile helm-name)
                                 "-x" (tfile tname)
                                 "-f" (tfile %)))
        insts (map (comp inst-template value-file-name) model-data)
        entry-match #(equal-to-line-ordering (:contents %1) (test-slurp %2))
        ;; "helm template" adds an extra blank line...
        inst-match #(equal-to-line-ordering (str/replace %1 #"[\n][\n]" "\n")
                                            (test-slurp %2))]
    (is (entry-match template (str template-name ".yaml")))
    (doseq [[v fname] (map vector vals (map #(str (:app-name %) "_values.yaml")
                                            model-data))]
      (is (entry-match v fname)))

    (doseq [[i fname] (map vector insts (map #(str "Instantiated"
                                                   (helm/cap (:app-name %))
                                                   ".yaml")
                                             model-data))]
      (is (inst-match i fname)))
    (sh "rm" "-rf" testdir)))

(deftest diffing
  (testing "generating shared helm charts from multiple models"
    (test-models-to-helm "kavanope" "DeploymentJoomla"
                         [{:model "helm_model_1.yaml"
                           :app-name "joomla"}
                          {:model "helm_model_2.yaml"
                           :app-name "joomla2"}])
    (test-models-to-helm "no_overlap" "DeploymentRacket"
                         [{:model "sd.yaml"
                           :app-name "sd"}
                          {:model "sd2.yaml"
                           :app-name "sd"}])
    (test-models-to-helm "no_overlap" "ServiceMongo"
                         [{:model "sds.yaml"
                           :app-name "sds"}
                          {:model "sds2.yaml"
                           :app-name "sds"}])))

(deftest compose-generates-secrets
  (testing "secrets come through to k8s"
    (binding [u/*wmes-by-id* (atom {})]
      (let [composelist [(assoc
                          (yaml/parse-string
                           (slurp (str "test/composecvt/testdata/secrets.yml")))
                          :type :compose)]
            k8s (fi/get-k8s-from-yaml-testdata "new-secrets.yaml")
            to-flat (engine :composecvt.compose-to-flat)
            flatwmes (to-flat :run-list composelist)
            from-flat (engine :k8scvt.flat-to-k8s)
            results (map #(dissoc % :type :id)
                         (apply concat
                                (vals (u/k8skeys
                                       (from-flat :run-map flatwmes)))))]
        (assert-match 0
                      (apply concat (vals (dissoc k8s :type :app-name)))
                      results)))))
