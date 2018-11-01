(ns composecvt.compare-test
  (:use clojure.test)
  (:require [composecvt.compare :as cmp]))

(def simple {:services {:one {:image "one"}}})

(def matches {:bothnil [nil nil]
              :nilempty [nil {}]
              :bothempty [{} {}]
              :identical [simple simple]
              :nilemptyvolnet [simple
                               (assoc simple :networks {} :volumes {})]
              :envlistmap [(assoc-in simple [:services :one :environment]
                                     ["var1=val1" "var2=99" "var3"])
                           (assoc-in simple [:services :one :environment]
                                     {:var1 "val1" :var2 99 :var3 nil})]
              :envlistorder [(assoc-in simple [:services :one :environment]
                                      ["a=1" "b=2" "c"])
                             (assoc-in simple [:services :one :environment]
                                       ["c" "b=2" "a=1"] )]
              :labelslistmap [(assoc-in simple [:services :one :labels]
                                        ["l1=val1" "l2=99" "l3"])
                              (assoc-in simple [:services :one :labels]
                                        {:l1 "val1" :l2 99 :l3 nil})]
              :labellistorder [(assoc-in simple [:services :one :labels]
                                         ["a=1" "b=2" "c"])
                               (assoc-in simple [:services :one :labels]
                                         ["c" "b=2" "a=1"] )]
              })

(def failures {:badimage [simple
                          (assoc-in simple [:services :one :image] "notone")]
               :extranet [simple (assoc simple :networks {:one {}})]
               :netnames [(assoc simple :networks {:one {}})
                          (assoc simple :networks {:two {}})]
               :volnames [(assoc simple :volumes {:one {}})
                          (assoc simple :volumes {:two {}})]
               :envdiff [(assoc-in simple [:services :one :environment]
                                   ["var1=val1" "var2=99"])
                         (assoc-in simple [:services :one :environment]
                                   {:var1 "val1bad" :var3 87})]
               :labeldiff1 [(assoc-in simple [:services :one :labels]
                                      ["var1=val1" "var2=99"])
                            (assoc-in simple [:services :one :labels]
                                      {:var1 "val1bad" :var3 87})]
               :labeldiff2 [(assoc-in simple [:services :one :labels]
                                      ["a=1" "b=2" "c"])
                            (assoc-in simple [:services :one :labels]
                                      ["c" "b=3" "a=2"] )]})


(deftest shouldmatch
  (doseq [[testcase [c1 c2]] matches]
    (let [result (cmp/compose-match? c1 c2)]
      (is (true? result)))))

(deftest shouldfail
  (println "---EXPECTING FAILURES---")
  (doseq [[testcase [c1 c2]] failures]
    (let [result (cmp/compose-match? c1 c2)]
      (is (not (true? result)))))
  (println "---END EXPECTED FAILURES---"))


