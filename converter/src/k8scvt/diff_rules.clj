(ns k8scvt.diff-rules
  (:require [engine.core :refer :all]))

;; Simple rules to manage diffs between two Kubernetes models. Takes an input
;; set of fields and constructs diffs, pruning any diff subsumed by one higher
;; in the object hierarchy.

(def ^:dynamic *cleanup* -10000)
(def ^:dynamic *adjustment* 10000)

(defn add-or-remove [x]
  (#{:add :remove} (:action x)))

;; Is the path to a field an extension of another path?
(defn path-extends? [path sub-path]
  (loop [p path s sub-path]
    (cond (empty? p) false
          (empty? s) true
          (= (first p) (first s)) (recur (rest p) (rest s))
          :else false)))

;; Remove any diff whose path is an extension of another diff's path
(defrule purge-duplicates
  {:priority *adjustment*}
  "Remove sub-diffs when parent structures are added or removed"
  [?diff1 :diff (add-or-remove ?diff1)]
  [?diff2 :diff
   (= (:role ?diff1) (:role ?diff2))
   (path-extends? (:path ?diff2) (:path ?diff1))]
  =>
  (remove! ?diff2))

;; Generate diffs (removed, added, modified)
(defrule removed
  "Find diffs in which a field was removed"
  [?afield :field
   (= (:role ?afield) :ancestor)
   (not (some #{:annotations} (:path ?afield)))]
  [?role :role]
  [:not [?field :field
         (= (:path ?field) (:path ?afield))
         (= (:role ?field) (:value ?role))
         (= (:is-leaf ?field) (:is-leaf ?afield))]]
  [:not [?diff :diff
         (= (:action ?diff) :remove)
         (= (:role ?diff) (:value ?role))
         (= (:path ?diff) (:path ?afield))]]
  =>
  (insert! {:type :diff
            :action :remove
            :role (:value ?role)
            :removed (:value ?afield)
            :path (:path ?afield)}))

(defrule added
  "Find diffs in which a field was added"
  [?role :role]
  [?field :field
   (= (:role ?field) (:value ?role))
   (not (some #{:annotations} (:path ?field)))]
  [:not [?afield :field
         (= (:role ?afield) :ancestor)
         (= (:is-leaf ?afield) (:is-leaf ?field))
         (= (:path ?afield) (:path ?field))]]
  [:not [?diff :diff
         (= (:action ?diff) :add)
         (= (:role ?diff) (:value ?role))
         (= (:path ?diff) (:path ?field))]]
  =>
  (insert! {:type :diff
            :action :add
            :role (:value ?role)
            :added (:value ?field)
            :path (:path ?field)}))

(defrule modified
  {:priority -1}
  "Find diffs in which a field was modified"
  [?role :role]
  [?field :field
   (:is-leaf ?field)
   (= (:role ?field) (:value ?role))
   (not (some #{:annotations} (:path ?field)))]
  [?afield :field
   (= (:role ?afield) :ancestor)
   (:is-leaf ?afield)
   (= (:path ?afield) (:path ?field))
   (not= (:value ?afield) (:value ?field))]
  [:not [?diff :diff
         (add-or-remove (:action ?diff))
         (path-extends? (:path ?field) (:path ?diff))]]
  =>
  (insert! {:type :diff
            :action :modify
            :from (:value ?afield)
            :to (:value ?field)
            :role (:value ?role)
            :path (:path ?field)}))
