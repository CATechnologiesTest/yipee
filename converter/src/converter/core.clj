(ns converter.core
  (:gen-class)
  (:require [converter.api :as api]))

;; Server main function for converter service.
(defn -main
  "Run API web server"
  [& args]
  (println "STARTING.........")
  (let [p (promise)]
    (api/start)
    ;; wait forever
    (@p)))
