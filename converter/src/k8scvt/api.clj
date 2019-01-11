(ns k8scvt.api
  (:gen-class)
  (:require [liberator.core :refer [resource defresource]]
            [liberator.representation :refer [ring-response]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.adapter.jetty :as jetty]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [clojure.data.json :as json]
            [clojure.tools.logging :as log]
            [clj-yaml.core :as yaml]
            [clojure.java.io :as io]
            [clojure.string :as str]
            [clojure.walk :as walk]
            [compojure.core :refer [routes ANY]]
            [engine.core :refer :all]
            [k8scvt.flat-to-k8s]
            [k8scvt.k8s-to-flat]
            [k8scvt.file-import :as fi]
            [k8scvt.validators :as v]
            [k8scvt.flat-validator :as fv]
            [k8scvt.util :as u]
            [k8scvt.diff :as diff]
            [helm.core :as helm]
            [helm.tar-util :as tar]
            [inflections.core :as inf])
  (:import [java.util Base64]
           [java.nio.charset StandardCharsets]))

;; Module providing all apis dealing with Kubernetes, Helm, and Model Diffing.
;; Support is provided for translating back and forth between flat format and
;; Kubernetes, generating helm charts (either from a single Kubernetes
;; manifest or the "diff" of multiple), and diffing manifests.

;; Extract request data from HTTP request
(defn body-as-string
  [ctx]
  (if-let [body (get-in ctx [:request :body])]
    (condp instance? body
      java.lang.String body
      (slurp (io/reader body)))))

(defn body-as-data [ctx]
  (fi/protect-qualified-keywords
   (json/read-str (body-as-string ctx) :key-fn keyword)))

;; Format and return any errors generated during processing
(defn return-formatted-errors [results tag formatter]
  (let [errmsgs (str/join "\n" (map formatter results))]
    {tag errmsgs}))

(defn return-errors [results]
  (return-formatted-errors results ::reterr u/format-validation-error))

(defn return-fv-errors [results]
  (return-formatted-errors results ::reterr fv/format-flat-validation-error))

(defn wmes-of-type [srclist typ]
  (filter #(= (:type %) typ) srclist))

(defn results-and-errors [wmes]
  (let [results wmes
        errors (wmes-of-type results :validation-error)]
    (if (empty? errors)
      [results true]
      [errors false])))

;; Generic convert call that can be passed different converters and will
;; run them and prepare the results by removing unused working memory elements
;; and type tags
(defn do-convert [validator converter valid-results]
  (let [[vresults ok] (results-and-errors (validator :run-list valid-results))]
    (if ok
      (let [retmap (converter :run-map valid-results)
            allowed (u/k8skeys retmap)]
        {::retval (u/remove-types allowed)})
      (return-fv-errors vresults))))

;; Perform an import given the translation to be performed
(defn do-import [errs k8s-elements translator]
  (if (seq errs)
      {::reterr (str/join "\n" errs)}
      (translator
       (fi/prepare-yipee
        {:name "unknown"
         :elements k8s-elements}))))

(def ^:dynamic *import-errs* nil)

(defn add-import-error [error]
  (swap! *import-errs* #(conj % error)))

(defn unroll-tar [inputstring]
  (try
    (tar/read-all-files inputstring)
    (catch Exception e
      (log/error (str "tar read exception: " (.getMessage e)))
      (add-import-error (str "invalid tar input -- "
                             "a base64-encoded, gzipped, tar file is required"))
      [nil nil])))

;; Gotta parse one k8s manifest object at a time, so
;; look for composite files from tarball and break them apart.
;;
;; In order to match up error messages when necessary,
;; we create an indexed "filename" for each
;; part of a composite file.
(defn prepare-tar-input [elements fnames]
  (when (and elements fnames)
    (loop [acc {} elems elements fns fnames]
      (if (empty? fns)
        [(:elements acc) (:fnames acc)]
        (let [element (first elems)
              sub-elements (str/split element #"\n---\n")
              accelems (:elements acc [])
              newelems (concat accelems sub-elements)
              fname (first fns)
              sub-fnames (if (> (count sub-elements) 1)
                          (map-indexed
                           (fn [idx _] (format "%s[%d]" fname idx))
                           sub-elements)
                          [fname])
              accfnames (:fnames acc [])
              newfnames (concat accfnames sub-fnames)
              newacc {:elements newelems :fnames newfnames}]
          (recur newacc (rest elems) (rest fns)))))))

(defn process-tar [inputstring]
  (let [[elements fnames] (unroll-tar inputstring)]
    (prepare-tar-input elements fnames)))

(defn process-yamls [yamlstrings fnames]
  (loop [acc [] fns fnames yamls yamlstrings]
    (if (empty? yamls)
      acc
      (let [fname (first fns)
            nextfns (rest fns)
            yaml (first yamls)
            nextyamls (rest yamls)]
        (let [pyaml (try
                      (fi/remove-output-only-fields (yaml/parse-string yaml))
                      (catch Exception e
                        (log/error
                         (str "tar content file: " fname
                              " yaml parse exception: " (.getMessage e)))
                        (add-import-error (str fname ": invalid yaml file"))
                        nil))
              newacc (if pyaml
                       (conj acc (fi/protect-qualified-keywords pyaml))
                       acc)]
          (recur newacc nextfns nextyamls))))))

(defn get-import-errors [k8s-elements fnames]
  (if (empty? @*import-errs*)
    (v/validate k8s-elements fnames)
    @*import-errs*))

(defn translate-to-flat [k8sobj]
  (binding [u/*wmes-by-id* (atom {})]
    (let [to-flat (engine :k8scvt.k8s-to-flat)
          input (list k8sobj)
          [results ok] (results-and-errors (to-flat :run-list input))]
      (if ok
        (let [fvalidate (engine :k8scvt.flat-validator)
              [fv-results fv-ok] (results-and-errors
                                  (fvalidate :run-list results))]
             (if fv-ok
               {::retval (group-by :type results)}
               (return-fv-errors fv-results)))
        (return-errors results)))))

(defn b64decode-if-possible [instr]
  (try
    (apply str (map char
                    (.decode (Base64/getDecoder)
                             (.getBytes instr StandardCharsets/UTF_8))))
    (catch Exception e
      instr)))

(defn k8s-import [ctx translator]
  (binding [*import-errs* (atom [])]
    (let [body-string (b64decode-if-possible (body-as-string ctx))
          str-elements (str/split body-string #"\n---\n")
          fnames (map-indexed (fn [idx val] (str "element" idx)) str-elements)
          k8s-elements (process-yamls str-elements fnames)
          errs (get-import-errors k8s-elements fnames)]
      (do-import errs k8s-elements translator))))

(defn k8s-bundle-import [ctx translator]
  (binding [*import-errs* (atom [])]
    (let [bodystr (body-as-string ctx)
          [raw-elements fnames] (process-tar bodystr)
          k8s-elements (when (and raw-elements fnames)
                         (process-yamls raw-elements fnames))
          errs (get-import-errors k8s-elements fnames)]
      (do-import errs k8s-elements translator))))

(defn cvt-flat-to-k8s [data]
  (binding [u/*wmes-by-id* (atom {})]
    (let [flatlist (map #(assoc % :type (keyword (:type %)))
                        (mapcat second data))
          fvalidate (engine :k8scvt.flat-validator)
          to-k8s (engine :k8scvt.flat-to-k8s)]
      (do-convert fvalidate to-k8s flatlist))))

(defn flat-to-k8s [ctx]
  (let [input (fi/protect-qualified-keywords
               (json/read-str (body-as-string ctx) :key-fn keyword))]
    (cvt-flat-to-k8s input)))

;; Perform a diff across a set of Kubernetes models.
(defn diff-models [ctx]
  (let [input (fi/protect-qualified-keywords
               (json/read-str (body-as-string ctx) :key-fn keyword))]
    {::retval (diff/formatted-diff (:parent input) (:children input))}))

(defn format-results [results]
  (reduce-kv (fn [m k v] (assoc m k (map u/gen-string v))) {} results))

(defn join-results [results]
  (loop [keys (keys results) joined ""]
    (if (empty? keys)
      joined
      (let [k (first keys)
            vals (str/join "\n---\n" (k results))]
        (recur (rest keys)
               (if (empty? joined)
                 vals
                 (str/join "\n---\n" [joined vals])))))))

(defn bundle-results [results]
  (let [entries (mapcat
                 (fn [[k entries]]
                   (map (fn [entry]
                          [(str (inf/plural (name k))
                                "/"
                                (:name (:metadata entry))
                                ".yaml")
                           (u/gen-string entry)])
                        entries))
                 results)]
    (helm/encode-bytes
     (tar/tarify entries))))

(defn conversion-base [ctx fun]
  (if (contains? ctx ::retval)
    (fun (::retval ctx))
    (ring-response {:body (::reterr ctx) :status 422})))

(defn conversion-return [ctx]
  (conversion-base ctx (comp join-results format-results)))

(defn conversion-bundle-return [ctx]
  ;; TODO: create archive from results
  (conversion-base ctx bundle-results))

(defn unpack-options [option-str]
  (mapv keyword (str/split option-str #"[+]")))

(defn conversion-helm-return [helm-fun wtp]
  (fn [ctx] (conversion-base ctx #(apply helm-fun % @wtp))))

(defn conversion-helm-bundle-return [wtp]
  (conversion-helm-return helm/to-helm wtp))

(defn conversion-helm-nerd-return [wtp]
  (conversion-helm-return helm/to-nerd-helm wtp))

(defn get-app-name [data] (:name (first (:app-info data))))

(defn get-app-helm-settings [data]
  (if-let [settings (:helm-settings (first (:app-info data)))]
    (mapcat (fn [[k v]] (if v [(keyword k)] [])) settings)
    [:all]))

(defn helm-post [ctx parameterization xlate]
  (let [data (body-as-data ctx)]
    (when (or (empty? @parameterization) (= @parameterization [:default]))
      (reset! parameterization (get-app-helm-settings data)))
    (assoc-in (xlate data) [::retval :app-name]
              (get-app-name data))))

;; Liberator resources implementing routes

(defn f2hnerd [what-to-parameterize]
  (let [wtp (atom (unpack-options what-to-parameterize))]
    (resource
     :allowed-methods [:post]
     :available-media-types ["application/json"]
     :post! #(helm-post % wtp cvt-flat-to-k8s)
     :handle-created (conversion-helm-nerd-return wtp))))

(defresource k2f
  :allowed-methods [:post]
  :available-media-types ["application/json"]
  :post! #(k8s-import % translate-to-flat)
  :handle-created #(conversion-base % identity))

(defresource kbundle2f
  :allowed-methods [:post]
  :available-media-types ["application/json"]
  :post! #(k8s-bundle-import % translate-to-flat)
  :handle-created #(conversion-base % identity))

(defresource f2k
  :allowed-methods [:post]
  :available-media-types ["application/json"]
  :post! flat-to-k8s
  :handle-created conversion-return)

(defresource f2kbundle
  :allowed-methods [:post]
  :available-media-types ["application/json"]
  :post! flat-to-k8s
  :handle-created conversion-bundle-return)

(defn f2hbundle [what-to-parameterize]
  (let [wtp (atom (unpack-options what-to-parameterize))]
    (resource
     :allowed-methods [:post]
     :available-media-types ["application/json"]
     :post! #(helm-post % wtp cvt-flat-to-k8s)
     :handle-created (conversion-helm-bundle-return wtp))))

(defresource m2d
  :allowed-methods [:post]
  :available-media-types ["application/json"]
  :post! diff-models
  :handle-created #(conversion-base % identity))

;; Routes handled by the Kubernetes subsystem. Only used in testing. In
;; mainline operation, the converter api bypasses this.
(def api-routes
  (routes
   (ANY "/f2hnerd" [] (f2hnerd "default"))
   (ANY "/f2hnerd/:wtp" [wtp] (f2hnerd wtp))
   (ANY "/k2f" [] k2f)
   (ANY "/kbundle2f" [] kbundle2f)
   (ANY "/f2k" [] f2k)
   (ANY "/f2kbundle" [] f2kbundle)
   (ANY "/f2hbundle" [] (f2hbundle "default"))
   (ANY "/f2hbundle/:wtp" [wtp] (f2hbundle wtp))
   (ANY "/m2d" [] m2d)
   (route/not-found (format (json/write-str {:message "Page not found"})))))

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
  (jetty/run-jetty #'handler {:port 3000 :join? false}))
