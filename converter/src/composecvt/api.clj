(ns composecvt.api
  (:gen-class)
  (:require [liberator.core :refer [resource defresource]]
            [liberator.representation :refer [ring-response]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.adapter.jetty :as jetty]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [clojure.data.json :as json]
            [clojure.java.io :as io]
            [clojure.string :as str]
            [compojure.core :refer [routes ANY]]
            [clj-yaml.core :as yaml]
            [engine.core :refer :all]
            [clojure.pprint :as pprint]
            [k8scvt.api :as k8s]
            [k8scvt.util :as util]
            [k8scvt.file-import :as fi]
            [k8scvt.flat-validator :as fv]
            [composecvt.compose-to-flat]
            [composecvt.flat-to-compose]
            [composecvt.validators :as v]))

(defn body-as-string
  [ctx]
  (if-let [body (get-in ctx [:request :body])]
    (condp instance? body
      java.lang.String body
      (slurp (io/reader body)))))

(defn wmes-of-type [srclist typ]
  (filter #(= (:type %) typ) srclist))

(defn return-fv-errors [results]
  (k8s/return-formatted-errors results ::reterr fv/format-flat-validation-error))

(defn cvtc2f [composeobj]
  (binding [util/*wmes-by-id* (atom {})]
    (let [to-flat (engine :composecvt.compose-to-flat)
          inputobj (list (assoc composeobj :type :compose))
          results (to-flat :run-list inputobj)
          fvalidate (engine :k8scvt.flat-validator)
          [fv-results fv-ok] (k8s/results-and-errors
                              (fvalidate :run-list results))]
      (if fv-ok
        {::retval (group-by :type results)}
        (return-fv-errors fv-results)))))

(defn load-and-validate-import [ctx]
  (let [body (k8s/b64decode-if-possible (body-as-string ctx))
        [pobj perr] (try
                      [(yaml/parse-string body) nil]
                      (catch Exception e
                        [nil "Invalid compose file: can't parse"]))
        verrs (when pobj
                (try
                  (v/validate pobj)
                  (catch Exception e
                    "Invalid compose file: can't validate")))]
    [pobj (remove nil? (flatten [perr verrs]))]))

(defn compose-to-flat [ctx]
  (let [[composeobj errors] (load-and-validate-import ctx)]
    (if (> (count errors) 0)
      {::reterr (str/join "\n" errors)}
      (cvtc2f composeobj))))

(defn flat-test [ctx]
  (binding [util/*wmes-by-id* (atom {})]
    (let [results (map #(assoc % :type (keyword (:type %)))
                       (mapcat second
                               (fi/protect-qualified-keywords
                                (json/read-str
                                 (body-as-string ctx)
                                 :key-fn keyword))))
          fvalidate (engine :k8scvt.flat-validator)
          [fv-results fv-ok] (k8s/results-and-errors
                              (fvalidate :run-list results))]
      (if fv-ok
        {::retval (group-by :type results)}
        (return-fv-errors fv-results)))))

(defresource c2f
  :allowed-methods [:post]
  :available-media-types ["application/json"]
  :post! compose-to-flat
  :handle-created (fn [ctx]
                    (if (contains? ctx ::retval)
                      (json/write-str (::retval ctx))
                      (ring-response {:body (::reterr ctx) :status 422}))))

(defresource badf
  :allowed-methods [:post]
  :available-media-types ["application/json"]
  :post! flat-test
  :handle-created (fn [ctx]
                    (if (contains? ctx ::retval)
                      (json/write-str (::retval ctx))
                      (ring-response {:body (::reterr ctx) :status 422}))))

(def api-routes
  (routes
   (ANY "/c2f" [] c2f)
   (ANY "/badf" [] badf)
   (route/not-found (format (json/write-str {:message "Page not found"})))))

(def handler
  (-> api-routes
      handler/api
      wrap-params))

(defn start []
  (jetty/run-jetty #'handler {:port 3000 :join? false}))
