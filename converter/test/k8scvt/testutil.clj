(ns k8scvt.testutil
  (:use clojure.test)
  (:require [ring.adapter.jetty :as jetty]
            [clojure.java.io :as io]
            [clojure.string :as str]
            [k8scvt.api :as api]
            [helm.core :as helm]
            [helm.tar-util :as tar]
            [k8scvt.file-import :as fi]
            [k8scvt.k8s-to-flat]
            [clj-yaml.core :as yaml]
            [clojure.data.json :as json]
            [engine.core :refer :all]))

(def test-port 8890)
(def base-url (format "http://localhost:%d" test-port))

(defmacro with-server [& body]
  `(do
     (let [server# (jetty/run-jetty api/handler {:join? false :port test-port})]
       (try
         ~@body
         (finally
           (do
             (.stop server#)))))))

(defn test-file-name [base]
  (str "test/k8scvt/testdata/" base))

(defn test-slurp [file]
  (slurp (test-file-name file)))

(defn get-flat-from-json-testdata [file]
  (fi/get-flat-from-json (str "test/k8scvt/testdata/" file)))
