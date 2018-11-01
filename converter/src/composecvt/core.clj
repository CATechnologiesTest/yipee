(ns composecvt.core
  (:gen-class)
  (:require [composecvt.api :as api]))

(defn -main
  "Run API web server"
  [& args]
  (let [p (promise)]
    (api/start)
    ;; wait forever
    (@p)))
