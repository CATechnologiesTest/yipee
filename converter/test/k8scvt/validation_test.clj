(ns k8scvt.validation-test
  (:require [clojure.test :refer :all]
            [clojure.string :as str]
            [clj-yaml.core :as yaml]
            [k8scvt.validators :as v]))

(defn errs-for-element [rpt element]
  (reduce (fn [cnt msg] (if (str/includes? msg element) (+ cnt 1) cnt)) 0 rpt))

(defn import-combined [combined-string]
  (vec (map yaml/parse-string (str/split combined-string #"\n---\n"))))

(defn validate-flatfile [fname]
  (let [elements (import-combined (slurp fname))
        fnames (map-indexed (fn [idx val] (str "element" idx)) elements)]
    (v/validate elements fnames)))

(deftest simple-validation
  (testing "simple success"
    (let [errrpt (validate-flatfile "test/k8scvt/testdata/bday4.yml")]
      (is (= 0 (count errrpt)))))
  (testing "simple failures"
    (let [errrpt (validate-flatfile "test/k8scvt/testdata/badbday.yml")]
      ;; (println errrpt)
      (is (= 9 (count errrpt)))
      (is (= 4 (errs-for-element errrpt "element6")))
      (is (= 3 (errs-for-element errrpt "element8")))
      (is (= 0 (errs-for-element errrpt "element9"))))))

(deftest validate-es-prod
  (testing "elasticsearch/production_cluster from examples"
    (let [errrpt (validate-flatfile "test/k8scvt/testdata/es-prod.yml")]
      ;; (println errrpt)
      (is (= 0 (count errrpt))))))

(deftest validate-not-k8s
  (testing "importing compose file as k8s"
    (let [errrpt (validate-flatfile "test/k8scvt/testdata/compose.yml")]
      (is (= 1 (count errrpt)))
      (is (str/includes? (first errrpt) "missing kind -- can't validate")))))
