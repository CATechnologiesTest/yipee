(ns k8scvt.util
  (:gen-class)
  (:require [ring.adapter.jetty :as jetty]
            [clojure.java.io :as io]
            [clojure.string :as str]
            [inflections.core :as inf]
            [helm.core :as helm]
            [helm.tar-util :as tar]
            [k8scvt.file-import :as fi]
            [clj-yaml.core :as yaml]
            [clojure.data.json :as json]
            [clojure.walk :as walk]
            [flatland.ordered.map :as ordered]
            [engine.core :refer [engine ppwrap insert! remove! collect!]])
  (:import [java.io File] [java.util UUID]))

(def test-port 8890)
(def base-url (format "http://localhost:%d" test-port))

(def ^:dynamic *engine-conf* {})
(def ^:dynamic *conversion-index* 0)
(def ^:dynamic *wmes-by-id* nil)

;; Order output manifests so that kinds with lower numbers appear
;; ahead of those with higher ones in our downloads.
;; Kinds at the same level are output in arbitrary order, and kinds not
;; named in our map all have the same (default) value which is higher
;; than all others.
;;
;; Note the mix of camelCase (or, perhaps more properly, "PascalCase")
;; and lower-case kinds.  This seems to be mostly related to "unknown kinds"
(def kind-output-order {:namespace 0
                        :ServiceAccount 1
                        :CustomResourceDefinition 1
                        :ConfigMap 1
                        :Secret 1
                        :ClusterRole 2
                        :ClusterRoleBinding 3
                        :persistent-volume-claim 3
                        :service 4})

(def unordered-output 99)

(defn get-output-order [kind]
  (get kind-output-order kind unordered-output))

(defn k8skeys [m]
  (let [omap (ordered/ordered-map)
        base (filter #(or (= (first %) :validation-error)
                          (some :kind (second %)))
                     m)]
    (into omap (sort-by #(get-output-order (first %)) base))))

(defn gen-id [] (str (UUID/randomUUID)))

(defn id-insert! [input-wme]
  (let [to-insert
        (if (:id input-wme)
          input-wme
          (assoc input-wme
                 :id
                 (if-let [uid (get-in input-wme [:metadata :uid])]
                   uid
                   (gen-id))))]
    (swap! *wmes-by-id* #(assoc % (:id to-insert) to-insert))
    (insert! to-insert)
    (:id to-insert)))

(defn id-remove! [wme]
  (swap! *wmes-by-id* #(dissoc % (:id wme)))
  (remove! wme))

(defn get-wme-by-id [id]
  (first (collect! #(= (:id %) id))))

(defn get-data [file-or-json func]
  (if (string? file-or-json)
    (func file-or-json)
    file-or-json))

(defn replace-dashes [item]
  (str/replace item "-" "_"))

(defn ^:dynamic *format-path-segment* [item]
  (cond (map? item)
        (str (first (vals item)))

        (keyword? item)
        (replace-dashes (name item))

        true
        (replace-dashes (str item))))

(defn ^:dynamic *format-error-path* [path]
  (str/join "." (map *format-path-segment* path)))

(defn format-validation-error [error]
  (case (:validation-type error)
    :invalid-type (format "Invalid type: %s -- expected: %s, got: %s"
                          (*format-error-path* (:path error))
                          (:expected error)
                          (pr-str (:got error)))
    :missing-required-field (format "Missing required field: %s"
                                    (*format-error-path* (:path error)))
    :constraint-violation (format "Constraint violation -- %s"
                                  (:constraint error))
    (str "Unknown error -- " error)))

(defn generate-constraint-error [constraint]
  (insert! {:type :validation-error
            :validation-type :constraint-violation
            :constraint constraint}))

(defn get-engine [module & others]
  (let [eng (apply engine module others)]
    (when *engine-conf*
      (if (contains? *engine-conf* :record)
        (eng :configure (update *engine-conf* :record
                                str
                                (swap! *conversion-index* inc)
                                "-"
                                (name module)))
        (eng :configure *engine-conf*)))
    eng))

(defn remove-types [k8smap]
  (reduce-kv (fn [m k v] (assoc m k (map #(dissoc % :type :id) v))) {} k8smap))

(defn convert-k8s-to-flat [file-or-yaml]
  (let [data (if (string? file-or-yaml)
               (get-data file-or-yaml fi/get-k8s-from-raw-yaml)
               (assoc (group-by #(keyword (inf/plural (str/lower-case (:kind %))))
                                file-or-yaml)
                      :app-name "dummy"
                      :type :k8s))
        tfeng (get-engine :k8scvt.k8s-to-flat)]
    (binding [*wmes-by-id* (atom {})] (into (sorted-map) (tfeng :run [data])))))

(defn convert-compose-to-flat [file-or-yaml]
  (let [data (if (string? file-or-yaml)
               (get-data file-or-yaml fi/get-compose-from-raw-yaml)
               file-or-yaml)
        eng (get-engine :composecvt.compose-to-flat)]
    (binding [*wmes-by-id* (atom {})] (into (sorted-map) (eng :run [data])))))

(defn convert-flat-to-compose [file-or-yaml]
  (let [data (if (string? file-or-yaml)
               (get-data file-or-yaml fi/get-flat-from-json)
               file-or-yaml)
        eng (get-engine :composecvt.flat-to-compose)]
    (binding [*wmes-by-id* (atom {})]
      (into (sorted-map) (eng :run-map (apply concat (vals data)))))))

(defn convert-to-k8s [file-or-json]
  (let [data (get-data file-or-json fi/get-flat-from-json)
        tkeng (get-engine :k8scvt.flat-to-k8s)]
    (binding [*wmes-by-id* (atom {})]
      (map #(dissoc % :type :id)
           (apply concat
                  (vals (k8skeys
                         (tkeng :run-map (apply concat (vals data))))))))))

(defn convert-to-helm [file-or-json wtp]
  (let [data (get-data file-or-json fi/get-flat-from-json)
        tkeng (get-engine :k8scvt.flat-to-k8s)]
    (binding [*wmes-by-id* (atom {})]
      (apply
       helm/to-nerd-helm
       (assoc
        (remove-types (k8skeys (tkeng :run-map (apply concat (vals data)))))
        :app-name "dummy")
       wtp))))

(defn shuffle-wmes [file-or-json]
  (let [data (get-data file-or-json fi/get-flat-from-json)
        wmes (apply concat (vals data))
        shuffled (shuffle wmes)]
    (group-by :type shuffled)))

(defn new-namespace [namespace data]
  (assoc data :model-namespace [{:type :model-namespace
                                 :name namespace}]))

(defn gen-string [e]
  (yaml/generate-string e :dumper-options {:flow-style :block}))

(defn convert-formats [conversion-type-arg file-or-json & outfile]
  (try
    (let [conversion-types
          (if (= conversion-type-arg :roundtrip)
            [:k8s-to-flat :flat-to-k8s]
            conversion-type-arg)]
      (binding [*conversion-index* (atom 0)
                *engine-conf* {:record (str "./tmp/"
                                            (.getName (File. file-or-json))
                                            "-")}]
        (let [get-base-name #(let [name-tail
                                   (.getName (io/file (first outfile)))]
                               (second (re-matches #"([^.]+)[.][^.]+"
                                                   name-tail)))
              make-header #(str "# Generated by Yipee.io\n"
                                "# Application: " (get-base-name) "\n\n")
              printer (let [lastconv (last conversion-types)]
                        (if (and (vector? lastconv)
                                 (= (first lastconv) :flat-to-helm))
                          println
                          (case lastconv
                            :flat-to-k8s #(println
                                           (str (when outfile (make-header))
                                                (str/join
                                                 "\n---\n"
                                                 (map gen-string %))))
                            json/pprint)))
              converted (reduce (fn [data ct]
                                   ((if (vector? ct)
                                      (if (= (first ct) :new-namespace)
                                        (partial new-namespace (second ct))
                                        #(convert-to-helm % (second ct)))
                                      (case ct
                                        :compose-to-flat convert-compose-to-flat
                                        :flat-to-compose convert-flat-to-compose
                                        :k8s-to-flat convert-k8s-to-flat
                                        :flat-to-k8s convert-to-k8s
                                        :scramble shuffle-wmes))
                                    data))
                                 file-or-json
                                conversion-types)
              display #(printer converted)]
          (cond (string? (first outfile)) (with-open [w (io/writer
                                                         (first outfile))]
                                            (binding [*out* w] (display)))
                (first outfile) converted
                :else (display)))))
    (catch Exception e
      (.printStackTrace e))))

(defn run-until-condition [file-or-json conversion-types testfun]
  (loop []
    (let [data (convert-formats conversion-types file-or-json true)]
      (if (testfun data)
        (clojure.pprint/pprint data)
        (recur)))))

(defn -main [file-or-json & conversion-types]
  (convert-formats (map read-string conversion-types) file-or-json))
