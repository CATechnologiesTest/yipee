(ns k8scvt.diff
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [clojure.pprint :as pprint]
            [clojure.edn :as edn]
            [clojure.data.json :as json]
            [clj-yaml.core :as yaml]
            [engine.core :refer :all]
            [k8scvt.file-import :as fi]
            [k8scvt.diff-rules]))

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

;; Generate a path entry for an object in an array based on its contents and type
(defn ident [x]
  (cond (:kind x) (str "(metadata/name:" (:name (:metadata x)) ")")
        (:name x) (str "(name:" (:name x) ")")
        (:containerPort x) (str "(containerPort:" (:containerPort x) ")")
        (:port x) (str "(port:" (:port x) ")")
        :else x))

;; Determine if a value is at the end of a path
(defn leaf? [x] (not (or (map? x) (vector? x) (seq? x))))

;; Turn a structure into a set of fields containing paths and values.
(defn extract-fields [obj role]
  (let [results (atom [])
        ext (fn ext-aux [obj stem cont]
              (cond (map? obj) (let [sorted (sort-by str obj)]
                                 (doseq [[k v] sorted]
                                   (if (leaf? v)
                                     (cont [:leaf (conj stem k) v])
                                     (do (cont [:node (conj stem k) v])
                                         (ext-aux v (conj stem k) cont)))))
                    ;; sort here since there is no requirement that the
                    ;; arrays are in the same order
                    (or (vector? obj)
                        (seq? obj)) (let [sorted (sort-by str obj)]
                                      (loop [items sorted]
                                        (when (seq items)
                                          (let [v (first items)
                                                path (conj stem (ident v))]
                                            (if (leaf? v)
                                              (cont [:leaf path v])
                                              (do (cont [:node path v])
                                                  (ext-aux v path cont))))
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

