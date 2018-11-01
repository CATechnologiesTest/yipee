(ns k8scvt.core
  (:gen-class)
  (:require [k8scvt.api :as api]))

(defn -main
  "Run API web server"
  [& args]
  (let [p (promise)]
    (api/start)
    ;; wait forever
    (@p)))
