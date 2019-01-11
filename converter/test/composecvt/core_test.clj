(ns composecvt.core-test
  (:require [clojure.test :refer :all]
            [clojure.data.json :as json]
            [clj-yaml.core :as yaml]
            [engine.core :refer :all]
            [k8scvt.util :as util]
            [k8scvt.flat-validator]
            [k8scvt.flat-to-k8s]
            [composecvt.compose-to-flat]
            [composecvt.flat-to-compose]))


(defn  get-compose-from-yaml [fname]
  (let [fdata (yaml/parse-string
               (slurp (str "test/composecvt/testdata/" fname)))]
    (list (assoc fdata :type :compose))))

(defn compose-to-flat [yaml-file]
  (println "--- compose-to-flat:" yaml-file "---")
  (binding [util/*wmes-by-id* (atom {})]
    (let [composelist (get-compose-from-yaml yaml-file)
          to-flat (engine :composecvt.compose-to-flat)
          _ (to-flat :configure {:record "/tmp/cttf"})
          flatwmes (to-flat :run-list composelist)
          flat-validator (engine :k8scvt.flat-validator)
          _ (flat-validator :configure {:record "/tmp/fv"})
          verrors (:validation-error (flat-validator :run flatwmes))
          to-compose (engine :composecvt.flat-to-compose)
          _ (to-compose :configure {:record "/tmp/cttc"})
          composewmes (to-compose :run-list flatwmes)]
      (is (empty? verrors))
      (is (not-any? #(= (:type %) :validation-error) composewmes))
      ;; (is (= 1 (count composewmes)))
      (println "--- compose-flat-compose:" yaml-file "---")
      (clojure.pprint/pprint composewmes)
      (println (yaml/generate-string (dissoc (first composewmes) :type))))))

(deftest compose-to-flat-test
  (testing "compose to flat"
    (doseq [compose ["simple.yml" "health.yml" "spokeFile.yml"
                     "bday4.yml" "secrets.yml"]]
      (compose-to-flat compose))))
