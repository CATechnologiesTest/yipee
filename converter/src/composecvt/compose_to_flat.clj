(ns composecvt.compose-to-flat
  (:require [clojure.string :as str]
            [engine.core :refer :all]
            [k8scvt.util :refer [id-insert! id-remove!]])
  (:import [java.util UUID]))

;; TODO: work out to-yipee transformations done by go converter.
;;
;; - svc.build: yipee is a string, compose may be a map.
;;   if map, yipee.svc.build gets svc.build.context and
;;   yipee.svc.hold_for_compose.build gets the full map
;;   DONE?  See extract-builds
;;
;; - svc.nets: compose is string-array or map-of-maps.  yipee is map-of-maps
;;   DONE?  See extract-network-refs
;;
;; - svc.healthcheck: yipee requires all of interval, timeout and retries
;;   so default them if not present.  Yipee represents interval and timeout
;;   in seconds rather than "durations".
;    DONE?  See extract-health-checks
;;
;; - svc.deploy: yipee only stores "mode" and "count".  Yipee mode values
;;   are: "allnodes" and "replicated", so "allnodes" needs to translate
;;   to "global" (and vice versa).  Other compose deploy keys are currently
;;   just "held".
;;   DONE?  See extract-deployment
;;
;; - golang cvtcore.GenerateYipee does "addYipeeItems" and
;;   "transformComposeFields".  Gotta make sure we've accounted for all that.
;;    Also "transformComposeNets" -- yipee stores "public".  Looks like
;;     compose has both "external" and "internal".  "external" can be
;;     boolean or map.  "internal" is boolean. The yipee "public" value
;;     is the negation of compose "internal".  Looks like "networks.external"
;;     is a hold_for_compose on the network...
;;
;; - a compose volumes.external should get a "volumes.hold_for_compose".
;;   Also, note that compose doesn't allow "external" to co-exist with any
;;   other volume configuration
;;
;; - (to-compose): RemoveEmptyLists from composeV3.go?
;; - (to-compose): fromYipeeAdjustments from compose.go?
;;
;; Misc:
;; - svcMapsToLists: svc "environment" and "labels" are always lists
;;   of "key=value" strings in yipee.  Compose allows either lists or maps
;;   for both.
;;   DONE?  extract-environments and extract-labels allow for either
;;          map or list, and turn either one to flat format.
;;
;; - orderedEnv: env vars sorted by key...
;;   DONE in flat_to_compose
;; - ordered keys in output yaml maps (got this for free from golang yaml)
;;   this doesn't impact functionality/correctness but may be nice to have?
;;
;; XXX: compose claims to support duration specified in us and ms
;; ISO 8601 and java.time.Duration traffics in seconds and nanos and
;; the Duration parser will handle fractional seconds "n.n"...
(defn duration-to-seconds [duration]
  (.getSeconds (java.time.Duration/parse (str "PT" duration))))

(defn empty-wme? [wme]
  (= (count wme) 2)) ; :type + :id

(defn get-id! [] (str (UUID/randomUUID)))

(defn k8s-sanitize [name]
  (str/replace (str/lower-case name) #"[^a-z0-9\-]" "-"))

(defn init-volume [vol name]
  (assoc vol
         :type :volume
         :is-template false
         :name name
         :volume-mode :Filesystem
         :access-modes [:ReadWriteOnce]
         :physical-volume-name ""
         :claim-name (str name "-claim")
         :storage-class ""
         :storage ""
         :selector {:matchLabels {}}))

(defrule add-app-info
  "Add a 'app-info' element"
 =>
 ;; XXX: same values as existing golang converter
 (id-insert! {:name "[insert app name here]"
           :description "[insert app description here]"
           :logo "[insert name of app logo image here]"
           :type :app-info}))

(defrule extract-version
  "Load version from a compose file into working memory"
  {:priority 100}
  [?compose :compose (:version ?compose)]
  =>
  (id-remove! ?compose)
  (id-insert! (dissoc ?compose :version))
  (id-insert! {:type :compose-version :version (:version ?compose)}))

(defrule extract-services
  "Load services from a compose into working memory"
  {:priority 100}
  [?compose :compose (:services ?compose)]
  =>
  (doseq [[key val] (vec (:services ?compose))]
    (let [svc-id
          (id-insert! (assoc val
                             :type :service
                             :name (name key)
                             :cgroup (get-id!)))]
      ;; every service gets an empty hold_for_compose wme
      (id-insert! {:type :hold-for-compose :container svc-id :value {}})))
  (id-remove! ?compose)
  (id-insert! (dissoc ?compose :services)))

(defrule extract-networks
  "Pull networks out of a compose"
  {:priority 100}
  [?compose :compose (:networks ?compose)]
  =>
  (doseq [[key val] (vec (:networks ?compose))]
    (let [net-id (id-insert! (assoc val :type :network :name (name key)))
          net-hfc {:type :hold-for-compose :container net-id :value{}}]
      ;; every network gets an empty hold_for_compose wme
      (id-insert! net-hfc)))
  (id-remove! ?compose)
  (id-insert! (dissoc ?compose :networks)))

(defrule extract-volumes
  "Pull volumes out of a compose"
  {:priority 100}
  [?compose :compose (:volumes ?compose)]
  =>
  (doseq [[key val] (vec (:volumes ?compose))]
    (let [cname (name key)
          volname (k8s-sanitize cname)
          vol-id (id-insert! (init-volume val volname))
          vol-hfc {:type :hold-for-compose :container vol-id :value {}}]
      ;; every volume gets an empty hold_for_compose wme
      (id-insert! vol-hfc)
      (when-not (= volname cname)
        (id-insert! {:type :name-mapping :compose cname :k8s volname
                     :item-id vol-id :field :name}))))
  (id-remove! ?compose)
  (id-insert! (dissoc ?compose :volumes)))

(defrule extract-secrets
  "Pull secrets out of a compose"
  {:priority 100}
  [?compose :compose (:secrets ?compose)]
  =>
  (doseq [[key val] (vec (:secrets ?compose))]
    (let [base-secret {:type :secret :name (name key)}
          annotated (if (:annotations val)
                      (assoc base-secret :annotations (:annotations val))
                      base-secret)
          ext (:external val)
          file (:file val)]
      (id-insert!
       (cond (and ext file)
             {:type :validation-error
              :value :inconsistent-fields
              :fields [:file :external]
              :path [{:secret (name key)}]}

             (and (map? ext)
                  (= (count ext) 1)
                  (= (first (keys ext)) :name))
             (assoc annotated
                    :source ""
                    :alternate-name (first (vals ext)))

             (nil? ext)
             (if (nil? file)
               {:type :validation-error
                :value :missing-required-field
                :path [{:secret (name key)} :file-or-external]}
               (assoc annotated :source file :alternate-name ""))

             true
             (assoc annotated :source "" :alternate-name ""
                    :default-mode 420)))))
  (id-remove! ?compose)
  (id-insert! (dissoc ?compose :secrets)))

(defrule extract-environments
  "Pull environments out separately from services"
  {:priority 50}
  [?svc :service (:environment ?svc)]
  =>
  (let [id (:id ?svc)
        env (:environment ?svc)
        ismap (map? env)
        epairs (if (map? env)
                 (vec env)
                 (vec (map #(str/split % #"[=]" 2) env)))]
    (doseq [[k v] epairs]
      (id-insert! {:type :environment-var :container id
                :key (name k) :value (if v (str v))})))
    (id-remove! ?svc)
    (id-insert! (dissoc ?svc :environment)))

(defrule extract-images
  "Pull images out separately from services"
  {:priority 50}
  [?svc :service (:image ?svc)]
  =>
  (id-insert! {:type :image :container (:id ?svc) :value (:image ?svc)})
  (id-remove! ?svc)
  (id-insert! (dissoc ?svc :image)))

(defrule extract-builds
  "Pull builds out separately from services"
  {:priority 50}
  [?svc :service (:build ?svc)]
  [?hfc :hold-for-compose (= (:id ?svc) (:container ?hfc))]
  =>
  (let [build (:build ?svc)
        [buildstr holds] (if (string? build)
                           [build nil]
                           [(:context build) (dissoc build :context)])]
    (id-insert! {:type :build :container (:id ?svc) :value buildstr})
    (id-remove! ?svc)
    (id-insert! (dissoc ?svc :build))
    (when holds
      (id-remove! ?hfc)
      (id-insert! (assoc-in ?hfc [:value :build] holds)))))

(defrule extract-port-mappings
  "Pull port mappings out separately from services"
  {:priority 50}
  [?svc :service (:ports ?svc)]
  =>
  (doseq [p (:ports ?svc)]
    ;; XXX: long-form port-spec
    (let [pstr (if (integer? p) (str p) p)
          colons (str/split pstr #":")
          ccnt (count colons)
          slashes (str/split (last colons) #"/")
          pr (if (> (count slashes) 1) (last slashes))
          i (first slashes)
          h (if (> ccnt 2) (first colons))
          e (cond
              (> ccnt 2) (get colons 1)
              (> ccnt 1) (get colons 0)
              :else nil)
          pmap {:type :port-mapping :container (:id ?svc) :internal i
                :external "" :node-port "" :container-references true}
          hpmap (if h (assoc pmap :host h) pmap)
          epmap (if e (assoc hpmap :external e) hpmap)
          portmap (if pr (assoc epmap :protocol pr) epmap)]
      (id-insert! portmap)))
  (let [labelkey (str "yipee.io/" (:name ?svc))
        labelval "generated"]
    (id-insert! {:type :k8s-service
                 :name (:name ?svc)
                 :selector {labelkey labelval}
                 :service-type "NodePort"})
    (id-remove! ?svc)
    (id-insert! (assoc (dissoc ?svc :ports)
                       :add-service-label {:key labelkey :value labelval}))))

(defrule extract-exposed-ports
  "Pull 'expose'd ports out of a service"
  {:priority 50}
  [?svc :service (:expose ?svc)]
  =>
  (id-remove! ?svc)
  (doseq [p (:expose ?svc)]
    (id-insert! {:type :exposed-port :container (:id ?svc) :internal p}))
  (id-insert! (dissoc ?svc :expose)))

(defrule extract-labels
  "Pull labels out of a service"
  {:priority 50}
  [?svc :service (:labels ?svc)]
  =>
  (id-remove! ?svc)
  (let [labels (:labels ?svc)
        ismap (map? labels)
        lpairs (if ismap
                 (vec labels)
                 (vec (map #(str/split % #"[=]" 2) labels)))]
    (doseq [[k v] lpairs]
      (id-insert!
       {:type :label :cgroup (:cgroup ?svc)
        :key (name k) :value v}))  ;; :ismap ismap}))
    (id-insert! (dissoc ?svc :labels))))

(defrule extract-entrypoint
  "Pull any entrypoint from services"
  {:priority 50}
  [?svc :service (:entrypoint ?svc)]
  =>
  (id-insert! {:type :entrypoint :container (:id ?svc) :value (:entrypoint ?svc)})
  (id-remove! ?svc)
  (id-insert! (dissoc ?svc :entrypoint)))

(defrule extract-command
  "Pull any command from services"
  {:priority 50}
  [?svc :service (:command ?svc)]
  =>
  (id-insert! {:type :command :container (:id ?svc) :value (:command ?svc)})
  (id-remove! ?svc)
  (id-insert! (dissoc ?svc :command)))

(defrule extract-logging
  "Pull logging config from services"
  {:priority 50}
  [?svc :service (:logging ?svc)]
  =>
  (id-insert! (assoc (:logging ?svc) :type :logging :container (:id ?svc)))
  (id-remove! ?svc)
  (id-insert! (dissoc ?svc :logging)))

(defrule extract-dependencies
  "Pull dependencies out separately from services"
  {:priority 50}
  [?svc :service (:depends_on ?svc)]
  =>
  (doseq [d (:depends_on ?svc)]
    (let [dependee (first (collect! #(= (:name %) d)))]
      (id-insert! {:type :dependency
                   :depender (:id ?svc)
                   :dependee (:id dependee)})))
  (id-remove! ?svc)
  (id-insert! (dissoc ?svc :depends_on)))

;; XXX: add a validator for the compose svc.deploy

;; XXX: latest compose deploy also supports:
;; - endpoint_mode
;; - labels
;; - resources
;; - a whole slew of things are supported for "compose up"
;;   but not for "stack deploy":
;;     build, cgroup_parent, container_name, ...
(defrule extract-deployment
  "Pull deployment spec out of a service"
  {:priority 50}
  [?svc :service (:deploy ?svc)]
  =>
  (let [composedeploy (:deploy ?svc)
        [mode count] (case (:mode composedeploy)
                       "global" ["allnodes" nil]
                       ["replicated" (:replicas composedeploy 1)])
        placement (:placement composedeploy)
        update-config (:update_config composedeploy)
        restart (:restart_policy composedeploy)]
    (id-insert! (merge {:mode mode :type :deployment-spec
                        :cgroup (:cgroup ?svc)
                        :service-name ""
                        :controller-type "Deployment"}
                       (if count {:count count})))
    (when placement
      (id-insert! {:type :placement :cgroup (:cgroup ?svc) :value placement}))
    (when update-config
      (id-insert! {:type :update-config :cgroup (:cgroup ?svc)
                   :value update-config}))
    (when restart
      (id-insert! {:type :restart-policy :cgroup (:cgroup ?svc) :value restart})))
  (id-remove! ?svc)
  (id-insert! (dissoc ?svc :deploy)))

(defn make-health-cmd [composecmd]
  "Convert a compose healthcheck.test to yipee format"
  (if (string? composecmd)
    (list "/bin/sh" "-c" composecmd)
    (if (sequential? composecmd) ;; XXX: validator to insure a sequential...
      (case (first composecmd)
        "CMD-SHELL" (flatten (merge ["/bin/sh" "-c"] (rest composecmd)))
        "CMD" (rest composecmd))
      (println "unknown composecmd:" composecmd (type composecmd)))))

(defrule extract-health-checks
  "Pull health checks out of a service"
  {:priority 50}
  [?svc :service (:healthcheck ?svc)]
  =>
  (id-remove! ?svc)
  (let [composehc (:healthcheck ?svc)
        retries (:retries composehc 1)
        interval (duration-to-seconds (:interval composehc "1s"))
        timeout (duration-to-seconds (:timeout composehc "1s"))
        healthcmd (make-health-cmd (:test composehc))]
  (id-insert! {:type :healthcheck :container (:id ?svc)
            :healthcmd healthcmd :retries retries :check-type "both"
            :interval interval :timeout timeout})
  (id-insert! (dissoc ?svc :healthcheck))))

(defrule remove-empty-compose
  "Remove compose when empty"
  {:priority 100}
  [?compose :compose (empty? (dissoc ?compose :type :id :__id))]
  =>
   (id-remove! ?compose))

(defrule remove-empty-networks
  "Remove networks when empty"
  {:priority 50}
  [?compose :compose (and (:networks ?compose) (empty? (:networks ?compose)))]
  =>
   (id-remove! ?compose)
   (id-insert! (dissoc ?compose :networks)))

(defrule remove-empty-volumes
  "Remove volumes when empty"
  {:priority 50}
  [?compose :compose (and (:volumes ?compose) (empty? (:volumes ?compose)))]
  =>
   (id-remove! ?compose)
   (id-insert! (dissoc ?compose :volumes)))

(defrule replace-empty-service-with-container-and-group
  "Remove service when empty"
  {:priority 50}
  [?svc :service (empty-wme? (dissoc ?svc :name :id :cgroup :add-service-label))]
  [:not [?cgroup :container-group (= (:id ?cgroup) (:cgroup ?svc))]]
  =>
  (let [cgroup-id (:cgroup ?svc)]
    (id-remove! ?svc)
    (id-insert! {:type :container :name (:name ?svc) :id (:id ?svc)
                 :cgroup cgroup-id})
    (if-let [label (:add-service-label ?svc)]
      (id-insert! (merge {:type :label :cgroup cgroup-id} label)))
    (id-insert! {:type :container-group
                 :id cgroup-id
                 :source "auto"
                 :controller-type :Deployment
                 :containers [(:id ?svc)]
                 :name (:name ?svc)
                 :container-names [(:name ?svc)]})))

(defrule add-default-deployment-spec
  [?cg :container-group (= :Deployment (:controller-type ?cg))]
  [:not [?dspec :deployment-spec (= (:id ?cg) (:cgroup ?dspec))]]
  =>
  (id-insert! {:type :deployment-spec
               :controller-type "Deployment"
               :mode "replicated"
               :count 1
               :cgroup (:id ?cg)}))

(defmulti extract-svc-net class)
(defmethod extract-svc-net java.lang.String [n] [n nil])
(defmethod extract-svc-net clojure.lang.MapEntry [n] [(key n) (val n)])

(defrule extract-network-refs
  "Pull networks out of a service"
  {:priority 50}
  [?svc :service (:networks ?svc)]
  =>
  (doseq [netval (:networks ?svc)]
    (let [[key val] (extract-svc-net netval)]
      (id-insert! (assoc val :type :network-ref :container (:id ?svc)
                      :name (name key)))))
  (id-remove! ?svc)
  (id-insert! (dissoc ?svc :networks)))

(defrule extract-volume-refs
  "Pull volumes out of a service"
  {:priority 50}
  [?svc :service (:volumes ?svc)]
  =>
  (doseq [ref (:volumes ?svc)]
    (let [[v p ro] (str/split ref #"[:]")
          k8s-vname (k8s-sanitize v)
          base {:type :volume-ref :container (:id ?svc)
                :container-name (:name ?svc)
                :volume-name k8s-vname
                :path p
                :sub-path ""
                :volume (:id (first (collect! :volume #(= (:name %) k8s-vname))))
                :access-mode (if (some? ro) :ReadOnlyMany :ReadWriteOnce)}
          ref-id (id-insert! base)]
      (when-not (= v k8s-vname)
        (id-insert! {:type :name-mapping :compose v :k8s k8s-vname
                     :item-id ref-id :field :volume-name}))))
  (id-remove! ?svc)
  (id-insert! (dissoc ?svc :volumes)))

;; always a list
;; short-form is just a list of names
;;   (we supply defaults: source and target are both the name,
;;                        uid and gid are both "0" (string)
;;                        mode is "444" (string)
;; long-form is a map with (optional) source, target, uid, gid, mode keys
;;  Defaults for unspecified keys are as above
(defrule extract-secret-refs
  "Pull secrets out of a service"
  {:priority 50}
  [?svc :service (:secrets ?svc)]
  =>
  (loop [index 0 slist (:secrets ?svc)]
    (when-not (empty? slist)
      (let [s (first slist)
            smap (if (string? s) {:source s} s)
            target (:target smap (:source smap))
            uid (str (:uid smap 0))
            gid (str (:gid smap 0))
            ;; XXX: more/better octal translation?
            mode (let [m (:mode smap 292)] (format "%o" m))
            sref (assoc smap :target target :uid uid :gid gid :mode mode)
            secret (first (collect! :secret #(= (:name %) (:source smap))))]
        (id-insert! (assoc sref :type :secret-ref :container (:id ?svc)
                           :secret (:id secret) :index index
                           :readonly false)))
      (recur (inc index) (rest slist))))
  (id-remove! ?svc)
  (id-insert! (dissoc ?svc :secrets)))

(defrule extract-restarts
  "Pull restarts out of a service"
  {:priority 50}
  [?svc :service (contains? ?svc :restart)]
  =>
  (let [rs (:restart ?svc)
        restart (if (string? rs) rs "no")]
    (id-insert! {:type :restart :cgroup (:cgroup ?svc) :value restart}))
  (id-remove! ?svc)
  (id-insert! (dissoc ?svc :restart)))

(defrule extract-extra-hosts
  "Pull extra hosts out of a service"
  {:priority 50}
  [?svc :service (:extra_hosts (:hold_for_compose ?svc))]
  =>
  (id-insert!
   {:type :extra-hosts :cgroup (:cgroup ?svc)
    :value (:extra_hosts (:hold_for_compose ?svc))})
  (id-remove! ?svc)
  (let [hfc (:hold_for_compose ?svc)
        new-hfc (dissoc hfc :extra_hosts)]
    (id-insert! (assoc ?svc :hold_for_compose new-hfc))))

(def v2-svc-extras #{:extends
                     :volume_driver
                     :volumes_from
                     :cpu_shares
                     :cpu_quota
                     :cpuset
                     :mem_limit
                     :memswap_limit})

(def svc-extras #{:cap_add
                  :cap_drop
                  :configs
                  :cgroup_parent
                  :container_name
                  :credential_spec
                  :devices
                  :dns
                  :dns_search
                  :tmpfs
                  :env_file
                  :external_links
                  :extra_hosts
                  :links
                  :network_mode
                  :pid
                  :security_opt
                  :stop_signal
                  :stop_grace_period
                  :sysctls
                  :ulimits
                  :userns_mode
                  :domainname
                  :hostname
                  :ipc
                  :mac_address
                  :privileged
                  :read_only
                  :shm_size
                  :stdin_open
                  :tty
                  :user
                  :working_dir})

(defrule extract-svc-extras
  "Pull extra 'hold-for-compose' stuff out of a service"
  {:priority 50}
  [?svc :service (some svc-extras (keys ?svc))]
  [?hfc :hold-for-compose (= (:container ?hfc) (:id ?svc))]
  =>
  (let [key (some svc-extras (keys ?svc))
        newholds (assoc-in ?hfc [:value key] (key ?svc))]
    (id-remove! ?svc)
    (id-remove! ?hfc)
    (id-insert! (dissoc ?svc key))
    (id-insert! newholds)))

(defrule extract-v2-svc-extras
  "Pull extra 'hold-for-compose' stuff out of a service"
  {:priority 50}
  [?svc :service (some v2-svc-extras (keys ?svc))]
  [?vsn :compose-version (str/starts-with? (:version ?vsn) "2")]
  [?hfc :hold-for-compose (= (:container ?hfc) (:id ?svc))]
  =>
  (let [key (some v2-svc-extras (keys ?svc))
        newholds (assoc-in ?hfc [:value key] (key ?svc))]
    (id-remove! ?svc)
    (id-remove! ?hfc)
    (id-insert! (dissoc ?svc key))
    (id-insert! newholds)))

(def volume-extras #{:external})

(defrule extract-volume-extras
  "Pull 'hold-for-compose' stuff out of a volume"
  {:priority 50}
  [?vol :volume (some volume-extras (keys ?vol))]
  [?hfc :hold-for-compose (= (:container ?hfc) (:id ?vol))]
  =>
  (let  [key (some volume-extras (keys ?vol))
         newholds (assoc-in ?hfc [:value key] (key ?vol))]
    (id-remove! ?vol)
    (id-remove! ?hfc)
    (id-insert! (dissoc ?vol key))
    (id-insert! newholds)))

(def network-extras #{:external :internal :ipam})
(defrule extract-network-extras
  "Pull 'hold-for-compose' stuff out of a network"
  {:priority 50}
  [?net :network (some network-extras (keys ?net))]
  [?hfc :hold-for-compose (= (:container ?hfc) (:id ?net))]
  =>
  (let  [key (some network-extras (keys ?net))
         newholds (assoc-in ?hfc [:value key] (key ?net))]
    (id-remove! ?net)
    (id-remove! ?hfc)
    (id-insert! (dissoc ?net key))
    (id-insert! newholds)))
