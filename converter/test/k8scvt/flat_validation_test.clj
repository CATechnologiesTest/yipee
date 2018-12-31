(ns k8scvt.flat-validation-test
  (:require [clojure.test :refer :all]
            [engine.core :refer :all]
            [k8scvt.flat-validator :refer :all]))

(def a-uuid "62849681-2862-8496-8128-628496812862")

(def case-expected-type
  [:case
   :controller-type
   ["StatefulSet"
    [:fixed-map
     [:type #{"RollingUpdate"}]
     [:?
      [:rollingUpdate
       [:fixed-map [:? [:partition :non-negative-integer]]]]]]]
   ["Deployment"
    [:or
     [:fixed-map [:type #{"Recreate"}]]
     [:fixed-map
      [:type #{"RollingUpdate"}]
      [:?
       [:rollingUpdate
        [:fixed-map
         [:?
          [:maxSurge
           [:or
            :non-negative-integer
            :non-negative-integer-string
            #"[1-9][0-9]?[%]"]]]
         [:?
          [:maxUnavailable
           [:or
            :non-negative-integer
            :non-negative-integer-string
            #"[1-9][0-9]?[%]"]]]]]]]]]
   ["DaemonSet"
    [:or
     [:fixed-map [:type #{"OnDelete"}]]
     [:fixed-map
      [:type #{"RollingUpdate"}]
      [:?
       [:rollingUpdate
        [:fixed-map
         [:? [:maxUnavailable
              [:or
               :positive-integer
               :positive-integer-string
               #"[1-9][0-9]?[%]"]]]]]]]]]])

(defn contains-errors [data errors]
  ;; translate to strings because regex patterns don't compare with '='
  (= (str (set (:validation-error data))) (str (set errors))))

(deftest test-checks
  (testing "field primitive type checks work"
    (is (type-check :string "x"))
    (is (not (type-check :string :x)))
    (is (type-check :string-array ["x"]))
    (is (type-check :string-array []))
    (is (not (type-check :string-array [3])))
    (is (type-check :empty-string-array []))
    (is (not (type-check :empty-string-array ["x"])))
    (is (type-check :keyword-or-str "x"))
    (is (type-check :keyword-or-str :x))
    (is (not (type-check :keyword-or-str [10])))
    (is (type-check :integer 4))
    (is (not (type-check :integer 10.2)))
    (is (not (type-check :integer "x")))
    (is (type-check :non-negative-integer 0))
    (is (type-check :non-negative-integer 4))
    (is (not (type-check :non-negative-integer -1)))
    (is (not (type-check :non-negative-integer :x)))
    (is (type-check :positive-integer 4))
    (is (not (type-check :positive-integer -1)))
    (is (not (type-check :positive-integer 0)))
    (is (not (type-check :positive-integer :x)))
    (is (type-check :non-negative-integer-string "0"))
    (is (type-check :non-negative-integer-string "4"))
    (is (not (type-check :non-negative-integer-string "-1")))
    (is (not (type-check :non-negative-integer-string ":x")))
    (is (type-check :positive-integer-string "4"))
    (is (not (type-check :positive-integer-string "-1")))
    (is (not (type-check :positive-integer-string "0")))
    (is (not (type-check :positive-integer-string ":x")))
    (is (type-check :compose-duration "3h4m"))
    (is (type-check :compose-duration "3m4ms"))
    (is (type-check :compose-duration "20h10m12s4ms100us"))
    (is (not (type-check :compose-duration "20h10m12s4ms100e")))
    (is (not (type-check :compose-duration 10)))
    (is (type-check :memory-value 20))
    (is (type-check :memory-value "20e10"))
    (is (type-check :memory-value "20P"))
    (is (type-check :memory-value "20Ki"))
    (is (not (type-check :memory-value "20Kill")))
    (is (not (type-check :memory-value "-20Ki")))
    (is (not (type-check :memory-value -28)))
    (is (not (type-check :memory-value :a)))
    (is (type-check :storage-value 20))
    (is (type-check :storage-value "20e10"))
    (is (type-check :storage-value "20P"))
    (is (type-check :storage-value "20Ki"))
    (is (not (type-check :storage-value "20Kill")))
    (is (not (type-check :storage-value "-20Ki")))
    (is (not (type-check :storage-value -28)))
    (is (not (type-check :storage-value :a)))
    (is (type-check :cpu-value 5))
    (is (type-check :cpu-value 0.5))
    (is (type-check :cpu-value "5"))
    (is (type-check :cpu-value "5m"))
    (is (not (type-check :cpu-value "0.5m")))
    (is (not (type-check :cpu-value "-5m")))
    (is (type-check :boolean true))
    (is (type-check :boolean false))
    (is (not (type-check :boolean 3)))
    (is (type-check :json {:x 4 :y [10]}))
    (is (not (type-check :json +)))
    (is (type-check :uuid a-uuid))
    (is (not (type-check :uuid "111111-1111")))
    (is (not (type-check :uuid 17)))
    (is (type-check :uuid-ref a-uuid))
    (is (not (type-check :uuid-ref "111111-1111")))
    (is (not (type-check :uuid-ref 17)))
    (is (type-check :uuid-ref-array [a-uuid]))
    (is (not (type-check :uuid-ref-array ["111111-1111"])))
    (is (not (type-check :uuid-ref-array [17])))
    (is (not (type-check :uuid-ref-array a-uuid)))))

(deftest test-validation-errors
  (testing "generate all error variations"
    (let [flat-validator (engine :k8scvt.flat-validator)]
      ;; annotation with bad string and json types and an invalid reference
      (is (contains-errors
           (flat-validator :run [{:type :annotation
                                  :key 4
                                  :value +
                                  :annotated a-uuid}])
           [{:type :validation-error,
             :validation-type :invalid-reference,
             :field :annotated,
             :reference-type :wme,
             :wme
             {:type :annotation,
              :key 4,
              :value +,
              :annotated a-uuid},
             :value a-uuid}
            {:type :validation-error,
             :validation-type :invalid-type,
             :field :value,
             :expected :json,
             :wme
             {:type :annotation,
              :key 4,
              :value +,
              :annotated a-uuid},
             :value +},
            {:type :validation-error,
             :validation-type :invalid-type,
             :field :key,
             :expected :string,
             :wme
             {:type :annotation,
              :key 4,
              :value +,
              :annotated a-uuid},
             :value 4}]))

      ;; no errors if all valid, including reference
      (is (contains-errors
           (flat-validator :run [{:type :annotation
                                  :key "foo"
                                  :value ["yes"]
                                  :annotated a-uuid}
                                 {:type :foo :id a-uuid}])
           []))

      ;; optional value is ignored
      (is (contains-errors
           (flat-validator :run [{:type :annotation
                                  :key 4
                                  :annotated a-uuid}])
           [{:type :validation-error,
             :validation-type :invalid-reference,
             :field :annotated,
             :reference-type :wme,
             :wme
             {:type :annotation,
              :key 4,
              :annotated a-uuid},
             :value a-uuid},
            {:type :validation-error,
             :validation-type :invalid-type,
             :field :key,
             :expected :string,
             :wme
             {:type :annotation,
              :key 4,
              :annotated a-uuid},
             :value 4}]))

      ;; dead reference with allow-missing-target is okay
      (is (contains-errors
           (flat-validator :run [{:type :command
                                  :value ["foo" "bar"]
                                  :container a-uuid}])
           []))

      ;; bad string array
      (is (contains-errors
           (flat-validator :run [{:type :command
                                  :value 7
                                  :container a-uuid}])
           [{:type :validation-error,
             :validation-type :invalid-type,
             :field :value,
             :expected :string-array,
             :wme
             {:type :command,
              :value 7,
              :container a-uuid},
             :value 7}]))

      ;; bad non-negative-integer-string
      (is (contains-errors
           (flat-validator :run [{:type :config
                                  :default-mode "-1"
                                  :name "name"
                                  :map-name "map-name"}])
           [{:type :validation-error,
             :validation-type :invalid-type,
             :field :default-mode,
             :expected :non-negative-integer-string,
             :wme
             {:type :config,
              :default-mode "-1",
              :name "name",
              :map-name "map-name"},
             :value "-1"}]))

      ;; good uuid-ref-array, string-array and string options
      ;; the way we use uuid-ref-arrays does not require that they have
      ;; existing targets
      (is (contains-errors
           (flat-validator :run [{:type :container-group
                                  :name "xxx"
                                  :pod a-uuid ;; allows missing target
                                  :source "auto"
                                  :controller-type "Deployment"
                                  :containers [a-uuid]
                                  :container-names ["yep"]}])
           []))

      ;; bad uuid-ref-array, string options
      (is (contains-errors
           (flat-validator :run [{:type :container-group
                                  :name "xxx"
                                  :pod a-uuid ;; allows missing target
                                  :source "slauto"
                                  :controller-type "Degloyment"
                                  :containers 5
                                  :container-names ["yep"]}])
           [{:type :validation-error,
             :validation-type :invalid-type,
             :field :containers,
             :expected :uuid-ref-array,
             :wme
             {:type :container-group,
              :name "xxx",
              :pod "62849681-2862-8496-8128-628496812862",
              :source "slauto",
              :controller-type "Degloyment",
              :containers 5,
              :container-names ["yep"]},
             :value 5}
            {:type :validation-error,
             :validation-type :invalid-type,
             :field :controller-type,
             :expected #{"Deployment" "StatefulSet" "Job" "DaemonSet" "CronJob"},
             :wme
             {:type :container-group,
              :name "xxx",
              :pod "62849681-2862-8496-8128-628496812862",
              :source "slauto",
              :controller-type "Degloyment",
              :containers 5,
              :container-names ["yep"]},
             :value "Degloyment"}
            {:type :validation-error,
             :validation-type :invalid-type,
             :field :source,
             :expected #{"k8s" "auto"},
             :wme
             {:type :container-group,
              :name "xxx",
              :pod "62849681-2862-8496-8128-628496812862",
              :source "slauto",
              :controller-type "Degloyment",
              :containers 5,
              :container-names ["yep"]},
             :value "slauto"}]))

      ;; matching case type with fixed-maps and 'or's
      (is (contains-errors
           (flat-validator :run [{:type :deployment-spec
                                  :count 3
                                  :mode "replicated"
                                  :cgroup a-uuid
                                  :service-name "service"
                                  :controller-type "StatefulSet"
                                  :termination-grace-period 10
                                  :update-strategy {:type "RollingUpdate"
                                                    :rollingUpdate {:partition 5}}
                                  :pod-management-policy "Parallel"}
                                 {:type :container-group
                                  :name "xxx"
                                  :id a-uuid
                                  :pod a-uuid ;; allows missing target
                                  :source "auto"
                                  :controller-type "Deployment"
                                  :containers [a-uuid]
                                  :container-names ["yep"]}])
           []))

      ;; matching case type skipping optional map entry
      (is (contains-errors
           (flat-validator :run [{:type :deployment-spec
                                  :count 3
                                  :mode "replicated"
                                  :cgroup a-uuid
                                  :service-name "service"
                                  :controller-type "StatefulSet"
                                  :termination-grace-period 10
                                  :update-strategy {:type "RollingUpdate"}
                                  :pod-management-policy "Parallel"}
                                 {:type :container-group
                                  :name "xxx"
                                  :id a-uuid
                                  :pod a-uuid ;; allows missing target
                                  :source "auto"
                                  :controller-type "Deployment"
                                  :containers [a-uuid]
                                  :container-names ["yep"]}])
           []))

      ;; matching case type with non-negative-integer and regex match
      (is (contains-errors
           (flat-validator :run [{:type :deployment-spec
                                  :count 3
                                  :mode "replicated"
                                  :cgroup a-uuid
                                  :service-name "service"
                                  :controller-type "Deployment"
                                  :termination-grace-period 10
                                  :update-strategy {:type "RollingUpdate"
                                                    :rollingUpdate
                                                    {:maxSurge 0
                                                     :maxUnavailable "10%"}}
                                  :pod-management-policy "Parallel"}
                                 {:type :container-group
                                  :name "xxx"
                                  :id a-uuid
                                  :pod a-uuid ;; allows missing target
                                  :source "auto"
                                  :controller-type "Deployment"
                                  :containers [a-uuid]
                                  :container-names ["yep"]}])
           []))

      ;; matching case type with positive-integer
      (is (contains-errors
           (flat-validator :run [{:type :deployment-spec
                                  :count 3
                                  :mode "replicated"
                                  :cgroup a-uuid
                                  :service-name "service"
                                  :controller-type "DaemonSet"
                                  :termination-grace-period 10
                                  :update-strategy {:type "RollingUpdate"
                                                    :rollingUpdate
                                                    {:maxUnavailable 1}}
                                  :pod-management-policy "Parallel"}
                                 {:type :container-group
                                  :name "xxx"
                                  :id a-uuid
                                  :pod a-uuid ;; allows missing target
                                  :source "auto"
                                  :controller-type "Deployment"
                                  :containers [a-uuid]
                                  :container-names ["yep"]}])
           []))

      ;; matching case type with positive-integer-string
      (is (contains-errors
           (flat-validator :run [{:type :deployment-spec
                                  :count 3
                                  :mode "replicated"
                                  :cgroup a-uuid
                                  :service-name "service"
                                  :controller-type "DaemonSet"
                                  :termination-grace-period 10
                                  :update-strategy {:type "RollingUpdate"
                                                    :rollingUpdate
                                                    {:maxUnavailable "1"}}
                                  :pod-management-policy "Parallel"}
                                 {:type :container-group
                                  :name "xxx"
                                  :id a-uuid
                                  :pod a-uuid ;; allows missing target
                                  :source "auto"
                                  :controller-type "Deployment"
                                  :containers [a-uuid]
                                  :container-names ["yep"]}])
           []))

      ;; matching case type with bad positive-integer-string
      (is (contains-errors
           (flat-validator :run [{:type :deployment-spec
                                  :count 3
                                  :mode "replicated"
                                  :cgroup a-uuid
                                  :service-name "service"
                                  :controller-type "DaemonSet"
                                  :termination-grace-period 10
                                  :update-strategy {:type "RollingUpdate"
                                                    :rollingUpdate
                                                    {:maxUnavailable "0"}}
                                  :pod-management-policy "Parallel"}
                                 {:type :container-group
                                  :name "xxx"
                                  :id a-uuid
                                  :pod a-uuid ;; allows missing target
                                  :source "auto"
                                  :controller-type "Deployment"
                                  :containers [a-uuid]
                                  :container-names ["yep"]}])
           [{:type :validation-error,
             :validation-type :invalid-type,
             :field :update-strategy,
             :expected case-expected-type,
             :wme
             {:termination-grace-period 10,
              :service-name "service",
              :mode "replicated",
              :type :deployment-spec,
              :cgroup "62849681-2862-8496-8128-628496812862",
              :controller-type "DaemonSet",
              :count 3,
              :pod-management-policy "Parallel",
              :update-strategy
              {:type "RollingUpdate", :rollingUpdate {:maxUnavailable "0"}}},
             :value
             {:type "RollingUpdate", :rollingUpdate {:maxUnavailable "0"}}}]))

            ;; matching case type with bad positive-integer-string
      (is (contains-errors
           (flat-validator :run [{:type :deployment-spec
                                  :count 3
                                  :mode "replicated"
                                  :cgroup a-uuid
                                  :service-name "service"
                                  :controller-type "DaemonSet"
                                  :termination-grace-period 10
                                  :update-strategy {:type "RollingUpdate"
                                                    :rollingUpdate
                                                    {:maxUnavailable 0}}
                                  :pod-management-policy "Parallel"}
                                 {:type :container-group
                                  :name "xxx"
                                  :id a-uuid
                                  :pod a-uuid ;; allows missing target
                                  :source "auto"
                                  :controller-type "Deployment"
                                  :containers [a-uuid]
                                  :container-names ["yep"]}])
           [{:type :validation-error,
             :validation-type :invalid-type,
             :field :update-strategy,
             :expected case-expected-type,
             :wme
             {:termination-grace-period 10,
              :service-name "service",
              :mode "replicated",
              :type :deployment-spec,
              :cgroup "62849681-2862-8496-8128-628496812862",
              :controller-type "DaemonSet",
              :count 3,
              :pod-management-policy "Parallel",
              :update-strategy
              {:type "RollingUpdate", :rollingUpdate {:maxUnavailable 0}}},
             :value
             {:type "RollingUpdate", :rollingUpdate {:maxUnavailable 0}}}]))

      ;; non-matching case type
      (is (contains-errors
           (flat-validator :run [{:type :deployment-spec
                                  :count 3
                                  :mode "replicated"
                                  :cgroup a-uuid
                                  :service-name "service"
                                  :controller-type "CronJob"
                                  :termination-grace-period 10
                                  :update-strategy {:type "RollingUpdate"}
                                  :pod-management-policy "Parallel"}
                                 {:type :container-group
                                  :name "xxx"
                                  :id a-uuid
                                  :pod a-uuid ;; allows missing target
                                  :source "auto"
                                  :controller-type "DaemonSet"
                                  :containers [a-uuid]
                                  :container-names ["yep"]}])
           [{:type :validation-error,
             :validation-type :invalid-type,
             :field :update-strategy,
             :expected case-expected-type,
             :wme
             {:termination-grace-period 10,
              :service-name "service",
              :mode "replicated",
              :type :deployment-spec,
              :cgroup "62849681-2862-8496-8128-628496812862",
              :controller-type "CronJob",
              :count 3,
              :pod-management-policy "Parallel",
              :update-strategy {:type "RollingUpdate"}},
             :value {:type "RollingUpdate"}}]))

      ;; empty-string-array, boolean
      (is (contains-errors
           (flat-validator :run [{:type :volume
                                  :name "v"
                                  :annotations {}
                                  :is-template false
                                  :selector {:matchExpressions {:key "foo"
                                                                :operator "Exists"
                                                                :values []}}}])
           []))

      ;; bad array, boolean
      (is (contains-errors
           (flat-validator :run [{:type :volume
                                  :name "v"
                                  :annotations {}
                                  :access-modes ["ReadOnlyFew"]
                                  :is-template false
                                  :selector {:matchExpressions {:key "foo"
                                                                :operator "Exists"
                                                                :values []}}}])
           [{:type :validation-error,
             :validation-type :invalid-type,
             :field :access-modes,
             :expected
             [:array #{"ReadWriteMany" "ReadWriteOnce" "ReadOnlyMany"}],
             :wme
             {:type :volume,
              :name "v",
              :annotations {},
              :access-modes ["ReadOnlyFew"],
              :is-template false,
              :selector
              {:matchExpressions {:key "foo", :operator "Exists", :values []}}},
             :value ["ReadOnlyFew"]}]))

      ;; bad empty-string-array, array, boolean
      (is (contains-errors
           (flat-validator :run [{:type :volume
                                  :name "v"
                                  :annotations {}
                                  :access-modes ["ReadOnlyMany"]
                                  :is-template false
                                  :selector {:matchExpressions {:key "foo"
                                                                :operator "Exists"
                                                                :values ["x"]}}}])
           [{:type :validation-error,
             :validation-type :invalid-type,
             :field :selector,
             :expected
             [:fixed-map
              [:?
               [:matchExpressions
                [:or
                 [:fixed-map
                  [:key :string]
                  [:operator #{"In" "NotIn"}]
                  [:values :string-array]]
                 [:fixed-map
                  [:key :string]
                  [:operator #{"Exists" "DoesNotExist"}]
                  [:values :empty-string-array]]]]]
              [:? [:matchLabels [:key-value :keyword-or-str :string]]]],
             :wme
             {:type :volume,
              :name "v",
              :annotations {},
              :access-modes ["ReadOnlyMany"]
              :is-template false,
              :selector
              {:matchExpressions
               {:key "foo", :operator "Exists", :values ["x"]}}},
             :value
             {:matchExpressions
              {:key "foo", :operator "Exists", :values ["x"]}}}]))

      ;; open-map, key-value
      (is (contains-errors
           (flat-validator :run [{:type :k8s-service
                                  :name "service"
                                  :metadata {:annotations {:foo "bar"
                                                           :baz "quux"}
                                             :name "yowza"
                                             :abcde "yes"}
                                 :service-type "NodePort"}])
           []))
      ;; missing discriminator field
      (is (contains-errors
           (flat-validator :run [{:type :deployment-spec
                                  :name "service"
                                  :update-strategy {:type "RollingUpdate"}
                                  :count 1
                                  :mode "replicated"
                                  :cgroup a-uuid
                                  :service-name ""}
                                 {:type :container-group
                                  :name "xxx"
                                  :id a-uuid
                                  :pod a-uuid ;; allows missing target
                                  :source "auto"
                                  :controller-type "Deployment"
                                  :containers [a-uuid]
                                  :container-names ["yep"]}])
           [{:type :validation-error,
             :validation-type :invalid-type,
             :field :update-strategy,
             :expected case-expected-type,
             :wme
             {:type :deployment-spec,
              :name "service",
              :update-strategy {:type "RollingUpdate"},
              :count 1,
              :mode "replicated",
              :cgroup "62849681-2862-8496-8128-628496812862",
              :service-name ""},
             :value {:type "RollingUpdate"}}
            {:type :validation-error,
             :validation-type :missing-required-field,
             :missing-field :controller-type,
             :wme
             {:type :deployment-spec,
              :name "service",
              :update-strategy {:type "RollingUpdate"},
              :count 1,
              :mode "replicated",
              :cgroup "62849681-2862-8496-8128-628496812862",
              :service-name ""}}])))))
