(ns k8scvt.validators
  (:require [clojure.string :as str]
            [clojure.data.json :as json]
            [clj-yaml.core :as yaml])
  (:import [com.networknt.schema JsonSchema JsonSchemaFactory]
           [com.fasterxml.jackson.databind JsonNode ObjectMapper]))

;; (def schemaurl (str
;;                "https://raw.githubusercontent.com/"
;;                "garethr/kubernetes-json-schema/master/v.11.1-standalone-strict/"))
(def schemaurl "schemata/master-standalone-strict/")

(defn get-schema [kind]
  (try
    (let [fname (str schemaurl (str/lower-case kind) ".json")
          schemastr (slurp fname)
          schema (.getSchema (new JsonSchemaFactory) schemastr)]
      schema)
    (catch Exception e
      (when-not (instance? java.io.FileNotFoundException e)
        (println "get-schema exception:" (.getMessage e)))
      nil)))

(defn validate-item [schema obj]
  (let [datajson (json/write-str obj)
        data (.readTree (new ObjectMapper) datajson)]
    (.validate schema data)))

(defn validate-app [k8sobjs]
  ;; find appropriate schema based on "kind" and validate each
  ;; entry
  (map-indexed
   (fn [idx item]
     (let [kind (:kind item)
           schema (when kind (get-schema kind))]
       [idx (cond schema (map #(.getMessage %) (validate-item schema item))
                  kind []
                  :else [(format "$.missing kind -- can't validate" kind)])]))
   k8sobjs))

(defn normalize-results [errrpt filenames]
  ;; remove empty error maps, and prepend some yaml document identifier
  ;; to error messages
  ;; return a single array of error messages
  (flatten
   (map (fn [[idx errset]]
          (let [basemsg (nth filenames idx (str "element" idx))]
            ;; Error messages from the schema validator start with "$".
            ;; We're replacing that with a filename (when we have one)
            ;; or with "element#" in the case of a single combined file
            ;; (in which elements are separated by "---")
            (map #(str basemsg ": " (subs % 2)) errset)))
        errrpt)))

(defn validate [app-elements fnames]
  (normalize-results (validate-app app-elements) fnames))
