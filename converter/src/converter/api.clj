(ns converter.api
  (:gen-class)
  (:require [liberator.core :refer [resource defresource]]
            [liberator.representation :refer [ring-response]]
            [liberator.dev :refer [wrap-trace]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.adapter.jetty :as jetty]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [compojure.core :refer [routes ANY]]
            [clojure.data.json :as json]
            [clojure.tools.logging :as log]
            [composecvt.api :as capi]
            [k8scvt.api :as kapi]))

;; Front end converter api that forwards to other modules containing
;; specific code for different conversions.

(def api-routes
  (routes
   (ANY "/k2f" [] kapi/k2f)
   (ANY "/f2k" [] kapi/f2k)
   (ANY "/kbundle2f" [] kapi/kbundle2f)
   (ANY "/f2hnerd" [] (kapi/f2hnerd "default"))
   (ANY "/f2hnerd/:wtp" [wtp] (kapi/f2hnerd wtp))
   (ANY "/m2d" [] kapi/m2d)
   (ANY "/m2hbundle" [] kapi/m2hbundle)
   (ANY "/c2f" [] capi/c2f)
   (ANY "/f2kbundle" [] kapi/f2kbundle)
   (ANY "/f2hbundle" [] (kapi/f2hbundle "default"))
   (ANY "f2hbundle/:wtp" [wtp] (kapi/f2hbundle wtp))
   (route/not-found (format (json/write-str
                             {:message "Page not found - crap!"})))))

(defn wrap-fallback-exception [handler]
  (fn [request]
    (try
      (handler request)
      (catch Exception e
        (log/error e "unhandled exception")
        ;; since I don't like to ever return 500 ;^)
        {:status 418 :body (.getMessage e)}))))

(def handler
  (-> api-routes
      handler/api
      wrap-params
      wrap-fallback-exception))

(defn start []
  (println "Running jetty...")
  (jetty/run-jetty #'handler {:port 3000 :join? false}))


