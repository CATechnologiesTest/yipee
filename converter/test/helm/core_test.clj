(ns helm.core-test
  (:require [clojure.test :refer :all]
            [helm.core :refer :all]
            [clojure.java.io :refer [output-stream]]
            [clojure.string :as str]
            [clj-yaml.core :as yaml])
  (:import [java.nio.charset
            StandardCharsets]
           [java.io
            ByteArrayInputStream]
           [org.apache.commons.compress.compressors.gzip
            GzipCompressorInputStream]
           [org.apache.commons.compress.archivers.tar
            TarArchiveEntry TarArchiveInputStream]))

(def test-chart-name (apply str "chart1_" (repeat 111 "1")))

(deftest template-test
  (testing "Generate template from map"
    (let [[[template1 template2] values]
          (templatize
           [{:name "foo"
             :contents {:foo.d.y
                        {:bar [{:baz 5} {:quux true}]
                         :wanda "xyz"
                         :framkowitz 1.23}}}
            {:name "goo"
             :contents {:goo.d.y
                        {:metadata {:annotations {"yowza" "urp"}}
                         :gar [{:gaz 5} {:guux true}]
                         :ganda "xyz"
                         :gramkowitz 1.23}}}]
           :all)]
      (is (= (:contents template1) (slurp "test/helm/testdata/foo.yaml")))
      (is (= (:contents template2) (slurp "test/helm/testdata/goo.yaml")))
      (is (= values (slurp "test/helm/testdata/foogoovalues.yaml")))))
  (testing "Generate template only ports"
    (let [[[template1 template2] values]
          (templatize
           [{:name "foo"
             :contents {:foo.d.y
                        {:ports [{:baz 5} {:quux true}]
                         :wanda "xyz"
                         :framkowitz 1.23}}}
            {:name "goo"
             :contents {:goo.d.y
                        {:metadata {:annotations {"yowza" "urp"}}
                         :gar [{:gaz 5} {:guux true}]
                         :ganda "xyz"
                         :gramkowitz 1.23}}}]
           :ports)]
      (is (= (:contents template1) (slurp "test/helm/testdata/fooports.yaml")))
      (is (= (:contents template2) (slurp "test/helm/testdata/gooports.yaml")))
      (is (= values (slurp "test/helm/testdata/foogooportvalues.yaml")))))
  (testing "Generate template only env"
    (let [[[template1 template2] values]
          (templatize
           [{:name "foo"
             :contents {:foo.d.y
                        {:bar [{:baz 5} {:quux true}]
                         :ports "xyz"
                         :env [{:name "anumber" :value "1.23"}]}}}
            {:name "goo"
             :contents {:goo.d.y
                        {:metadata {:annotations {"yowza" "urp"}}
                         :gar [{:gaz 5} {:guux true}]
                         :ganda "xyz"
                         :gramkowitz 1.23}}}]
           :env)]
      (is (= (:contents template1) (slurp "test/helm/testdata/fooenv.yaml")))
      (is (= (:contents template2) (slurp "test/helm/testdata/gooenv.yaml")))
      (is (= values (slurp "test/helm/testdata/foogooenvvalues.yaml")))))
  (testing "Generate template only labels"
    (let [[[template1 template2] values]
          (templatize
           [{:name "foo"
             :contents {:foo.d.y
                        {:bar [{:baz 5} {:quux true}]
                         :ports "xyz"
                         :env [{:name "anumber" :value "1.23"}]
                         :labels {:x "6" :y "28"}}}}
            {:name "goo"
             :contents {:goo.d.y
                        {:metadata {:annotations {"yowza" "urp"}}
                         :gar [{:gaz 5} {:guux true}]
                         :ganda "xyz"
                         :gramkowitz 1.23}}}]
           :labels)]
      (is (= (:contents template1) (slurp "test/helm/testdata/foolabels.yaml")))
      (is (= (:contents template2) (slurp "test/helm/testdata/goolabels.yaml")))
      (is (= values (slurp "test/helm/testdata/foogoolabelvalues.yaml")))))
  (testing "Generate template port / label mix"
    (let [[[template1 template2] values]
          (templatize
           [{:name "foo"
             :contents {:foo.d.y
                        {:bar [{:baz 5} {:quux true}]
                         :ports "xyz"
                         :env [{:name "anumber" :value "1.23"}]
                         :labels {:x "6" :y "28"}}}}
            {:name "goo"
             :contents {:goo.d.y
                        {:metadata {:annotations {"yowza" "urp"}}
                         :gar [{:gaz 5} {:guux true}]
                         :ganda "xyz"
                         :gramkowitz 1.23}}}]
           [:ports :labels])]
      (is (= (:contents template1) (slurp "test/helm/testdata/foopl.yaml")))
      (is (= (:contents template2) (slurp "test/helm/testdata/goopl.yaml")))
      (is (= values (slurp "test/helm/testdata/foogooplvalues.yaml")))))
  (testing "Generate template with conflicting paths"
    (let [[[template1 template2] values]
          (templatize
           [{:name "foo"
             :contents {:foo
                        {:bar [{:baz 5} {:quux true}]
                         :gOoWanda "xyz"
                         :framkowitz 1.23}
                        :gOoWanda "zyx"}}
            {:name "fooG"
             :contents {:oo
                        {:gar [{:gaz 5} {:guux true}]
                         :ganda "xyz"
                         :gramkowitz 1.23}
                        :ooWanda "wicked"}}]
           :all)]
      (is (= (:contents template1)
             (slurp "test/helm/testdata/fooconflict.yaml")))
      (is (= (:contents template2)
             (slurp "test/helm/testdata/gooconflict.yaml")))
      (is (= values (slurp "test/helm/testdata/foogooconflictvalues.yaml"))))))

(defn check-entry [tais check-name check-val]
  (let [chart-entry (.getNextTarEntry tais)
        buf (byte-array (.getSize chart-entry))
        _ (.read tais buf 0 (alength buf))
        str (String. buf StandardCharsets/UTF_8)]
    (is (= (.getName chart-entry) check-name))
    (is (= str check-val))))

(defn test-chart-file-name [name] (str test-chart-name "/" name))

(deftest chart-test
  (testing "generate a chart tgz"
    (let [chart (make-chart
                 test-chart-name
                 "0.0.1"
                 [{:name "foo"
                   :contents {:foo
                              {:bar [{:baz 5} {:quux true}]
                               :gOoWanda "xyz"
                               :framkowitz 1.23}
                              :gOoWanda "zyx"}}
                  {:name "fooG"
                   :contents {:oo
                              {:gar [{:gaz 5} {:guux true}]
                               :ganda "xyz"
                               :gramkowitz 1.23}
                              :ooWanda "wicked"}}]
                 :all)
          bais (ByteArrayInputStream. chart)
          gzis (GzipCompressorInputStream. bais)
          tais (TarArchiveInputStream. gzis)]
      (check-entry tais
                   (test-chart-file-name "Chart.yaml")
                   (str "name: " test-chart-name "\nversion: 0.0.1\n"))
      (check-entry tais
                   (test-chart-file-name "values.yaml")
                   (slurp "test/helm/testdata/foogooconflictvalues.yaml"))
      (check-entry tais
                   (test-chart-file-name "templates/foo.yaml")
                   (slurp "test/helm/testdata/fooconflict.yaml"))
      (check-entry tais
                   (test-chart-file-name "templates/fooG.yaml")
                   (slurp "test/helm/testdata/gooconflict.yaml"))
      (is (= (nerdify chart) (slurp "test/helm/testdata/nerdout.yaml"))))))
