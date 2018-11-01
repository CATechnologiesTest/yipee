(ns composecvt.validators
  (:require [clojure.string :as str]
            [clojure.java.io :as io]
            [clojure.data.json :as json]
            [clj-yaml.core :as yaml])
  (:import [com.networknt.schema JsonSchema JsonSchemaFactory]
           [com.fasterxml.jackson.databind JsonNode ObjectMapper]))

(def schemaurl "schemata/config_schema_v")

(defn get-schema-filename [vsn]
  (let [fname (if (and (string? vsn) (str/starts-with? vsn "2"))
                (str schemaurl "2.yipee.json")
                (if (= vsn "3")
                  (str schemaurl "3.0.json")
                  (str schemaurl vsn ".json")))]
    (if (.exists (io/file fname))
      fname)))

(defn get-schema-string [vsn]
  (if-let [fname (get-schema-filename vsn)]
    (slurp fname)
    (throw (Exception. (format "Can't validate compose version: '%s'" vsn)))))

(defn get-schema [vsn]
  (let [schemastr (get-schema-string vsn)
        schema (.getSchema (new JsonSchemaFactory) schemastr)]
    schema))

(defn validate-app [app]
  (let [schema (get-schema (:version app))
        datajson (json/write-str app)
        data (.readTree (new ObjectMapper) datajson)]
    (.validate schema data)))

(defn normalize-results [errrpt]
  ;; collect error messages.  Note that they start with "$." so we strip that
  (map #(subs (.getMessage %) 2) errrpt))

(defn validate [app]
  (let [rpt (validate-app app)]
    (normalize-results rpt)))
