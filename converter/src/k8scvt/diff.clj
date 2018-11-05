(ns k8scvt.diff
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [clojure.pprint :as pprint]
            [clojure.edn :as edn]
            [clojure.data.json :as json]
            [clj-yaml.core :as yaml]
            [engine.core :refer :all]
            [k8scvt.file-import :as fi]
            [k8scvt.diff-rules]
            [helm.core :as helm]
            [helm.tar-util :as tar]))

;; This file provides support for "diffing" kubernetes models and
;; generating shared helm charts that can be instantiated into
;; descriptions of the models via separate values files. The diffing
;; proceeds in two phases:
;;
;; Phase 1 - extract each field in a model as a path and a value. This
;; phase considers each stopping point on a path into a nested
;; structure as a field. So, in the structure:
;; {:foo {:bar {:baz 4 :quux 5}}}, ignoring "roles" (ancestor, etc.)
;; the fields are:
;;
;; {:type :field
;;  :is-leaf false
;;  :path [:foo]
;;  :value {:bar {:baz 4 :quux 5}}}
;; {:type :field
;;  :is-leaf false
;;  :path [:foo :bar]
;;  :value {:baz 4 :quux 5}}
;; {:type :field
;;  :is-leaf true
;;  :path [:foo :bar :baz]
;;  :value 4}
;; {:type :field
;;  :is-leaf true
;;  :path [:foo :bar :quux]
;;  :value 5}
;;
;; This is severely complicated by arrays. Since the positions of
;; items within the arrays are generally irrelevant in this context,
;; they can vary across related models (particularly when one or more
;; of the entries is missing). It becomes extremely difficult to match
;; up arrays from different models. So, what we do is take advantage
;; of the fact that the entries in these arrays have identifying
;; fields. We use these fields and their values to insert identifiable
;; path entries. If our original struct was:
;; {:foo {:containers [{:name "me"} {:name "you"}] :bar {:baz 4 :quux 5}}}
;; the fields would be:
;;
;; {:type :field
;;  :is-leaf false
;;  :path [:foo]
;;  :value {:containers [{:name "me"} {:name "you"}] :bar {:baz 4 :quux 5}}
;; {:type :field
;;  :is-leaf false
;;  :path [:foo :containers]
;;  :value [{:name "me"} {:name "you"}]}
;; {:type :field
;;  :is-leaf false
;;  :path [:foo :containers "(name:me)"]
;;  :value {:name "me"}}
;; {:type :field
;;  :is-leaf false
;;  :path [:foo :containers "(name:you)"]
;;  :value {:name "you"}}
;; {:type :field
;;  :is-leaf true
;;  :path [:foo :containers "(name:me)" :name]
;;  :value "me"}
;; {:type :field
;;  :is-leaf true
;;  :path [:foo :containers "(name:you)" :name]
;;  :value "you"}
;; {:type :field
;;  :is-leaf false
;;  :path [:foo :bar]
;;  :value {:baz 4 :quux 5}}
;; {:type :field
;;  :is-leaf true
;;  :path [:foo :bar :baz]
;;  :value 4}
;; {:type :field
;;  :is-leaf true
;;  :path [:foo :bar :quux]
;;  :value 5}
;;
;; Once all the fields have been extracted, we prune them in the following way:
;; Any field with N copies (where N is the number of models being
;; diffed) doesn't participate in a difference. So, we can discard all
;; such fields.
;;
;; The remaining fields which have all been modified in at least one
;; descendant are passed to a simple set of four rules (in diff_rules.clj) that:
;;
;; 1) Creates diff objects for any diffs not within annotations.
;; 2) Removes any diffs that show up leafward from other diffs. We
;;    always want to work with the first diff we encounter on a path.
;;
;; Once the diffs have been identified, they can be used for various purposes.
;; The first one is to generate helm charts. To do so, we first follow
;; the paths in our diffs to the differences and replace the values
;; with special maps containing identifiable keys so that the helm
;; chart generator can recognize them, replace them with template
;; variables, and put the correct values in the respective model
;; values files. The helm chart generator is used on each model as if it was
;; being turned into a chart by itself and the results are picked through to
;; produce the single overall helm chart.

(defn num-from-string [str]
  (try (let [num (edn/read-string str)]
         (when (number? num) num))
       (catch Exception _ nil)))

;; Used to produce a text version of a diff path for text output
(defn simple-path [path]
  (str/join "." (map #((if (keyword %) name str) %) path)))

;; Find a named object within an array
(defn find-named [v namestr]
  (let [name (subs namestr 1 (dec (count namestr)))
        [field value] (str/split name #":")
        keys (map keyword (str/split field #"/"))]
    (first (filter #(= (get-in % keys) value) v))))

;; Find the index of a named field in an array
(defn find-named-index [v namestr]
  (let [name (subs namestr 1 (dec (count namestr)))
        [field valuestr] (str/split name #":")
        value (or (num-from-string valuestr) valuestr)
        keys (map keyword (str/split field #"/"))
        num-items (count v)]
    (loop [subs v idx 0]
      (cond (>= idx num-items) nil
            (= (get-in (first subs) keys) value) idx
            :else (recur (rest subs) (inc idx))))))

;; Generate a path entry for an object in an array based on its contents and type
(defn ident [x]
  (cond (:kind x) (str "(metadata/name:" (:name (:metadata x)) ")")
        (:name x) (str "(name:" (:name x) ")")
        (:containerPort x) (str "(containerPort:" (:containerPort x) ")")
        (:port x) (str "(port:" (:port x) ")")
        :else x))

;; Turn a structure into a set of fields containing paths and values.
(defn extract-fields [obj role]
  (let [results (atom [])
        ext (fn ext-aux [obj stem cont]
              (cond (map? obj) (let [sorted (sort-by str obj)]
                                 (doseq [[k v] sorted]
                                   (cont [:node (conj stem k) v])
                                   (ext-aux v (conj stem k) cont)))
                    ;; sort here since there is no requirement that the
                    ;; arrays are in the same order
                    (or (vector? obj)
                        (seq? obj)) (let [sorted (sort-by str obj)]
                                      (loop [items sorted]
                                        (when (seq items)
                                          (let [v (first items)
                                                path (conj stem (ident v))]
                                            (cont [:node path v])
                                            (ext-aux v path cont))
                                          (recur (rest items)))))
                    :else (cont [:leaf stem obj])))
        cont #(swap! results conj %)]
    (ext obj [] cont)
    @results))

;; Translate each k8s object into a set of fields and a role (either
;; :ancestor or the index number of the child).
(defn translate-k8s-obj [obj role]
  (let [fields (vec (mapcat
                     (fn [[node-type path value]]
                       (if (= (last path) :app-name)
                         []
                         [{:type :field
                           :is-leaf (= node-type :leaf)
                           :path path
                           :value value
                           :role role}]))
                     (extract-fields obj role)))]
    (if (number? role) ; a child
      (cons {:type :role :value role} fields)
      fields)))

;; Remove all fields that have a copy for each role (they can't be part of
;; any diffs).
(defn prune-common-wmes [wmes role-count]
  (let [wset (into #{} wmes)
        wmap (reduce (fn [m v] (let [key (dissoc v :role)
                                     val (or (get m key) [])]
                                 (assoc m key (conj val v))))
                     {}
                     wmes)]
    (reduce (fn [s [k v]]
              (if (= (count v) role-count)
                (apply disj s v)
                s))
            wset
            wmap)))

;; Create a set of diff objects for a model and any number of child models
(defn diff
  ([ancestor children]
   (let [eng (engine :k8scvt.diff-rules)
         raw-wmes (concat
                   (apply concat
                          (map-indexed (fn [i child] (translate-k8s-obj child i))
                                       children))
                   (translate-k8s-obj ancestor :ancestor))
         wmes (prune-common-wmes raw-wmes (inc (count children)))]
     (:diff (eng :run wmes))))
  ([children]
   (diff (first children) (rest children))))

;; Run "diff" reading from named files
(defn diff-files [files & {:keys [ancestor] :or {ancestor (first files)}}]
  (diff (fi/get-k8s-from-yaml ancestor)
          (mapv fi/get-k8s-from-yaml
                (if (= ancestor (first files)) (rest files) files))))

;; pprint complex object values within a text diff
(defn- decorate [val]
  (let [val (with-out-str (pprint/pprint val))]
    (if (= (.charAt val (dec (count val))) \newline)
      (subs val 0 (dec (count val)))
      val)))

;; Format diffs for a simple CLI
(defn- simple-output [rec is-multi]
  (let [role (:role rec)
        translated (simple-path (:path rec))
        user (if is-multi (str "Child " role) "Child")]
    (case (:action rec)
      (:remove) (printf "%s removed field: '%s'\n" user translated)
      (:add) (printf "%s added field: '%s'\n" user translated)
      (:modify) (let [tail [translated
                            (decorate (:from rec)) (decorate (:to rec))]]
                  (apply printf
                         "%s modified field: '%s', from value: %s to: value: %s\n"
                         user
                         tail))
      (pprint/pprint rec))))

(defn format-path [path]
  (with-out-str
    (loop [items (map #((if (keyword %) name str) %) path)
           indent " "]
      (when (seq items)
        (println (first items))
        (when (seq (rest items))
          (print indent)
          (recur (rest items) (str indent " ")))))))

(defn- format-diff-output [name rec]
  (let [translated (format-path (:path rec))]
    (case (:action rec)
      (:remove) (printf "'%s' removed:\n\n%s\n" name translated)
      (:add) (printf "'%s' added:\n\n%s\n" name translated)
      (:modify) (let [tail [translated
                            (decorate (:from rec)) (decorate (:to rec))]]
                  (apply printf
                         "'%s' modified field:\n\n%s\nfrom %s to: %s\n\n"
                         name
                         tail))
      (pprint/pprint rec))))

;; Perform a diff for the API and format the output as simple text
(defn formatted-diff [ancestor children]
  (let [{ancestor-name :name ancestor-yaml-str :yaml} ancestor
        [child-names child-yamls] (loop [c children names [] yamls []]
                                    (if (seq c)
                                      (let [[child & others] c]
                                        (recur others
                                               (conj names (:name child))
                                               (conj yamls
                                                     (fi/import-combined
                                                      (:yaml child)
                                                      (:name child)))))
                                      [names yamls]))
        diffs (diff (fi/import-combined ancestor-yaml-str ancestor-name)
                    child-yamls)]
    (with-out-str
      (loop [d diffs]
        (when (seq d)
          (let [[diff & others] d
                should-strip (= (take-last 2 (:path diff)) [:metadata :uid])]
            (when-not should-strip
              (format-diff-output (child-names (:role diff)) diff))
            (when (and others (not should-strip))
              (println "---\n"))
            (recur others)))))))

(defn- translate-input [model]
  {:name (:app-name model) :yaml (yaml/generate-string
                                  (dissoc model :app-name :type))})

;; Run a diff against a set of files and generate humand-readable output
(defn text-diff [ancestor children]
  (let [ancestor-model (fi/get-k8s-from-yaml ancestor)
        child-models (mapv fi/get-k8s-from-yaml children)]
    (formatted-diff (translate-input ancestor-model)
                    (mapv translate-input child-models))))

(defn old-text-diff [files & {:keys [ancestor output-file]
                          :or {ancestor (first files) output-file nil}}]
  (let [doit (fn []
                 (doseq [diff-rec (diff (fi/get-k8s-from-yaml ancestor)
                                        (mapv fi/get-k8s-from-yaml files))]
                   (simple-output diff-rec (not= ancestor (first files)))))]
      (if output-file
        (with-open [w (io/writer output-file)]
          (binding [*out* w]
            (doit)))
        (doit))))

;; Get models from files passed in
(defn get-models [files]
  (mapv fi/get-k8s-from-yaml files))

;; Traverse an object given a path and return the value.
(defn navigate [obj path]
  (if (empty? path)
    obj
    (let [[head & tail] path]
      (cond (keyword? head) (navigate (head obj) tail)
            (string? head) (navigate (find-named obj head) tail)
            :else (throw (RuntimeException.
                          (str "Path: '"
                               path
                               "' does not match object: '"
                               obj
                               "'\n")))))))

;; Using a special map key, create a recognizable value for the helm generator.
(defn generate-value-string [value]
  {helm/chunk-tag (json/write-str value)})

;; Base 64 encode
(defn diff-encode [value]
  (if (try (number? (edn/read-string value)) (catch Exception _ false))
    (helm/encode-bytes (.getBytes value))
    (helm/encode value)))

;; Create an encoded value for a diff that the helm generator will decode
;; to create the actual result value.
(defn create-helm-variable [identifier value]
  (let [encoded (diff-encode (generate-value-string value))]
    {helm/diff-tag encoded :identifier identifier}))

;; A special tag for a map that is a path-ending value. Since any of the models
;; that is missing the value is also missing the "key", we store the key in
;; the magic structure so we can use it to create the field for the models
;; with corresponding values.
(defn make-editable-map [field val]
  {helm/editable-map-tag (create-helm-variable field val)})

(defn apply-key [key obj]
  (cond (keyword? key) (key obj)
        (string? key) (find-named obj key)
        :else (throw (RuntimeException.
                          (str "Key: '"
                               key
                               "' does not match object: '"
                               obj
                               "'\n")))))

;; Navigate an object via a diff path and replace the endpoint value with
;; 1) a helm variable for a path ending in a scalar
;; 2) an "editable map" for a path ending in a map
;; 3) a special helm variable for a path ending in an array
(defn fill-in-helm-vars [obj [action path]]
  (if (empty? (rest path))
    ;; case 1
    (if (= action :modify)
      (let [key (first path)
            rest-obj (apply-key key obj)]
        (assoc obj key
               (create-helm-variable key (if (seq? rest-obj)
                                           (vec rest-obj)
                                           rest-obj))))
      (create-helm-variable (first path) (if (seq? obj) (vec obj) obj)))
    (let [[head & tail] path]
      ;; case 2
      (cond (keyword? head) (if (head obj)
                              (assoc obj head
                                     (fill-in-helm-vars (head obj) [action tail]))
                              (make-editable-map head ""))
            ;; case 3
            (string? head) (let [idx (find-named-index obj head)]
                             (if idx
                               (vec
                                (concat
                                 (take idx obj)
                                 [(fill-in-helm-vars (nth obj idx) [action tail])]
                                 (drop (inc idx) obj)))
                               (conj obj (create-helm-variable head ""))))
            :else (throw (RuntimeException.
                          (str "Path: '"
                               path
                               "' does not match object: '"
                               obj
                               "'\n")))))))

;; Replace all diff values with magic helm variables
(defn apply-diffs-for-helm [model diffs]
  (dissoc (reduce fill-in-helm-vars model (map (juxt :action :path) diffs))
          :type))

;; Make sure a set of names is unique. Start adding an index if the bare
;; value has been seen and increment as necessary.
(defn uniqify [names]
  (first
   ((fn u [names]
      (if (empty? (rest names))
        [names #{(first names)}]
        (let [[nametail seen-set] (u (rest names))]
          (loop [curname (first names) idx 2]
            (if (not (seen-set curname))
              [(cons curname nametail) (conj seen-set curname)]
              (recur (str curname idx) (inc idx)))))))
    names)))

;; Replace a multi-entry yaml file with a vector of parsed entries.
(defn combined-yaml-to-vec [combined-string]
  (vec (map yaml/parse-string (str/split combined-string #"\n---\n"))))

;; Translate a chart name and a set of models in yaml files into a helm chart
;; with a distinct values file for each model.
(defn models-to-helm [chart-name files]
  (try
    (let [models (get-models files)
          app-names (uniqify (mapv :app-name models))
          diffs (diff models)
          results (mapv #(apply-diffs-for-helm % diffs) models)
          ;; actually build a chart for each model
          charts (vec (map-indexed
                       (fn [idx val]
                         (helm/build-chart (nth app-names idx)
                                           "0.0.1"
                                           (helm/build-chart-input val)
                                           [:none]))
                       results))
          ;; merge the output from multiple charts
          entries (vec
                   (concat
                    [[(helm/chart-file-path chart-name "Chart")
                      (get-in charts [0 0 1])]]
                    (map (fn [name chart]
                           [(str chart-name "/" name "_values.yaml")
                            (get-in chart [1 1])])
                         app-names
                         charts)
                    (map (fn [[name chart]]
                           [(helm/template-file-path
                             chart-name
                             (subs name
                                   (inc (str/last-index-of name \/))
                                   (str/last-index-of name ".")))
                            chart])
                         (nthnext (first charts) 2))))]
      (helm/encode-bytes (tar/tarify entries)))
    (catch Exception e (.printStackTrace e))))
