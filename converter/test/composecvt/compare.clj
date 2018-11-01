(ns composecvt.compare
  (:require [clojure.string :as str]))

(defn compare-names
  ;; check that all names in the list have corresponding keys in the map
  [thelist themap]
  (if (= (count thelist) (count themap))
    (let [matches (map #(contains? themap (keyword %)) thelist)]
      (every? true? matches))))

(defn compare-key-value
  ;; check that every "key=value" list entry has a corresponding
  ;; {key val} in the map
  [thelist themap]
  (if (= (count thelist) (count themap))
    (let [matches (map #(let [parts (str/split % #"=")
                              key (first parts)
                              val (last parts)]
                          (and (contains? themap (keyword key))
                               (= (get themap (keyword key) val))))
                       thelist)]
      (every? true? matches))))

(defn compare-map-and-list
  ;; compare when one arg could be a map and the other a list
  ;; "fun" can be used for different treatments
  ;;   of values ("names" or "key-value")
  [v1 v2 fun]
  (if (and (map? v1) (map? v2))
    (= v1 v2)
    (if (and (sequential? v1) (sequential? v2))
      (= v1 v2)
      (if (map? v1)
        (fun v2 v1)
        (fun v1 v2)))))

(defn ensure-strings
  [strlist]
  (map #(str %) strlist))

(defn ordered-lists
  [v1 v2]
  (if (and (sequential? v1) (sequential? v2))
    [(sort v1) (sort v2)]))

(defn svc-deploy-match?
  ;; check functional equivalence of deploy spec
  ;; we treat absence of mode as equal to "replicated"
  ;; we treat absence of replicas as equal to 1 iff mode is "replicated"
  ;; If other elements are present they should match with equals
  [d1 d2]
  (let [mode1 (:mode d1 "replicated")
        mode2 (:mode d2 "replicated")
        repl1 (if (= mode1 "replicated") (:replicas d1 1) (:replicas d1))
        repl2 (if (= mode2 "replicated") (:replicas d2 1) (:replicas d2))]
    (and
     (= mode1 mode2)
     (= repl1 repl2)
     (= (dissoc d1 :mode :replicas) (dissoc d2 :mode :replicas)))))

(defn duration-match?
  ;; check functional equivalence of duration specs.  They're equal if
  ;; they yield the same number of seconds
  [d1 d2]
  (let [s1 (.getSeconds (java.time.Duration/parse (str "PT" d1)))
        s2 (.getSeconds (java.time.Duration/parse (str "PT" d2)))]
    (= s1 s2)))

(def SHCMD ["CMD" "/bin/sh" "-c"])
(defn normalize-health-test
  ;; our converter turns all "CMD-SHELL" specs to "CMD"
  ;; any string (as opposed to array) spec also gets turned to "CMD" array
  [t]
  (if (and (sequential? t) (= "CMD-SHELL" (first t)))
             (vec (flatten [SHCMD (rest t)]))
             (if (string? t)
               (conj SHCMD t)
               (vec t))))

(defn health-test-match?
  [t1 t2]
  (= (normalize-health-test t1) (normalize-health-test t2)))

(defn svc-healthcheck-match?
  [h1 h2]
  (and (health-test-match? (:test h1) (:test h2))
       (duration-match? (:timeout h1 "1s") (:timeout h2 "1s"))
       (duration-match? (:interval h1 "1s") (:interval h2 "1s"))
       (= (:retries h1 1) (:retries h2 1))))

(def secret-defaults {:uid "0" :gid "0" :mode 292})
(defn secrets-match?
  [secret1 secret2]
  (let [s1map (if (string? secret1) {:source secret1} secret1)
        s1 (merge secret-defaults {:target (:source s1map)} s1map)
        s2map (if (string? secret2) {:source secret2} secret2)
        s2 (merge secret-defaults {:target (:source s2map)} s2map)]
    (= s1 s2)))

(defn get-secret-name [item]
  (or (:source item) item))

(defn svc-secrets-match?
  [in-slist1 in-slist2]
  (if (= (count in-slist1) (count in-slist2))
    (let [slist1 (sort-by get-secret-name in-slist1)
          slist2 (sort-by get-secret-name in-slist2)
          matches (map #(secrets-match? %1 %2) slist1 slist2)]
      (every? true? matches))))

(defn handle-svc-result [sname key result val1 val2]
  (if (not (true? result))
    (do
      (printf "FAIL: services.%s.%s%n" (name sname) (name key))
      (println "  val1:" val1)
      (println "  val2:" val2)))
  result)

(defn nil-empty-equal? [v1 v2]
  (if (every? empty? [v1 v2])
    true
    (= v1 v2)))

(defn filter-generated-labels [labels]
  (if (map? labels)
    (into {} (filter (fn [[k v]] (not (= "generated" v))) labels))
    (filter #(not (= "generated" (first (rest (str/split % #"=" 2))))) labels)))

(def svc-matchers {:networks (fn [v1 v2]
                               (compare-map-and-list v1 v2 compare-names))
                   :environment (fn [v1 v2]
                                  (compare-map-and-list v1 v2 compare-key-value))
                   :labels (fn [rv1 rv2]
                             (let [v1 (filter-generated-labels rv1)
                                   v2 (filter-generated-labels rv2)]
                               (compare-map-and-list v1 v2 compare-key-value)))
                   :deploy svc-deploy-match?
                   :healthcheck svc-healthcheck-match?
                   :secrets svc-secrets-match?
                   :volumes nil-empty-equal?})

(defn svc-element-match?
  ;; compare the respective elements of two services
  ;; we use special comparison functions for some of the elements
  ;; that are "normalized" in yipee
  [sname key val1 val2]
  (let [matchfun (get svc-matchers key (fn [v1 v2] (= v1 v2)))]
    (let [result (matchfun val1 val2)]
      (handle-svc-result sname key result val1 val2))))

(defn prep-svcmatch-args
  ;; for the given svc key, prepare two values for comparison
  [key val1 val2]
  (case key
    ;; we don't sort these -- compare using original order
    (:command :entrypoint :secrets) [val1 val2]
    ;; ports are a list, whose values may be string or int
    :ports (ordered-lists (ensure-strings val1) (ensure-strings val2))
    ;; default -- sort if possible
    (if-let [ol (ordered-lists val1 val2)]
      ol
      [val1 val2])))

(defn svc-match?
  ;; compare two services for functional equality
  [sname s1 s2]
  (let [matches (map (fn [[key val1]]
                       (let [val2 (get s2 key)
                             [v1 v2] (prep-svcmatch-args key val1 val2)]
                         (svc-element-match? sname key v1 v2)))
                     s1)]
      (every? true? matches)))

(def matchers {:services svc-match?})

(defn compare-top-level-element [type c1 c2]
  (let [m1 (get c1 type)
        m2 (get c2 type)
        cmpfun (get matchers type #(= %2 %3))]
    (if (= (count m1) (count m2))
      (map (fn [[ename eval]] (cmpfun ename eval (get m2 ename))) m1)
      (do
        (printf "FAIL: %s: count mismatch%n", (name type))
        [false]))))

(defn compose-match?
  ;; compare two compose definitions for functional equality
  [c1 c2]
  (let [svcresults (compare-top-level-element :services c1 c2)
        volresults (compare-top-level-element :volumes c1 c2)
        netresults (compare-top-level-element :networks c1 c2)
        secretresults (compare-top-level-element :secrets c1 c2)
        results (flatten [svcresults volresults netresults secretresults])]
    (or (every? true? results)
        (do (printf "ERRORS: %s" (vec results))
            false))))
