(ns k8scvt.file-import
  (:require [clojure.string :as str]
            [clojure.pprint :as pprint]
            [clojure.walk :as walk]
            [clojure.data.json :as json]
            [clj-yaml.core :as yaml]
            [k8scvt.validators :as v]
            [inflections.core :as inf])
  (:import [java.io File]))

(def output-only-toplevel #{:status})
(def output-only-metadata #{:creationTimestamp :deletionTimestamp
                            :generation :resourceVersion :selfLink})

(defn ppwrap [tag val]
  (pprint/pprint (list tag val))
  val)

(defn remove-output-only-metadata [item]
  (walk/postwalk #(if (:metadata %)
                    (apply update % :metadata dissoc output-only-metadata)
                    %)
                 item))

(defn remove-output-only-fields [item]
  (apply dissoc (remove-output-only-metadata item) output-only-toplevel))

(defn protect-qualified-keywords [exp]
  (walk/postwalk #(if (and (keyword? %)
                           (not= (inc (count (name %)))
                                 (count (str %))))
                    (subs (str %) 1)
                    %)
                 exp))

(def parse
  (comp remove-output-only-fields protect-qualified-keywords
        yaml/parse-string))

(defn process-elements [k8s-string]
  (let [items (str/split k8s-string #"\n---\n")
        parsed (vec (map parse items))
        errors (vec (v/validate
                     parsed
                     (map-indexed (fn [idx _] (str "element" idx))
                                  parsed)))]
    (if (empty? errors)
      parsed
      (throw (RuntimeException. (str "ERRORS: " (str/join "\n" errors)))))))

(defn import-combined
  ([combined-string]
   (let [[ignore name-comment body] (str/split combined-string #"\n" 3)
         name (nth (str/split name-comment #" ") 2)]
     {:name name :elements (process-elements body)}))
  ([k8s-string name]
   {:name name :elements (process-elements k8s-string)}))

(defn prepare-yipee [k8s-data]
  (assoc (group-by #(keyword (inf/plural (str/lower-case (or (:kind %)
                                                             (name (:type %))))))
                   (:elements k8s-data))
         :app-name (:name k8s-data)
         :type :k8s))

(defn get-k8s-from-raw-yaml [k8s-file]
  (prepare-yipee
   {:name (second (re-matches #"^(.*)[.][^.]*$" (.getName (File. k8s-file))))
    :elements (process-elements (slurp k8s-file))}))

(defn get-compose-from-raw-yaml [k8s-file]
  (assoc (yaml/parse-string (slurp k8s-file)) :type :compose))

(defn get-k8s-from-yaml [k8s-file]
  (try
    (let [raw (import-combined (slurp k8s-file))]
      (prepare-yipee raw))
    (catch Exception _ (get-k8s-from-raw-yaml k8s-file))))

(defn get-k8s-from-yaml-testdata [k8s-file]
  (protect-qualified-keywords
   (get-k8s-from-yaml (str "test/k8scvt/testdata/" k8s-file))))

(defn get-flat-from-json [file]
  (protect-qualified-keywords
   (json/read-str (slurp file)
                  :key-fn keyword
                  :value-fn (fn [k v]
                              ;; all our actual types start with a lower
                              ;; case letter. Some k8s constructs include
                              ;; "type" fields and we don't want their
                              ;; values keywordized
                              (if (and (= k :type) (re-matches #"^[a-z].*$" v))
                                (keyword v)
                                v)))))

