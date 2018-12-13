(ns composecvt.flat-to-compose
  (:require [clojure.string :as str]
            [engine.core :refer :all]
            [k8scvt.util :refer [get-wme-by-id]]
            [composecvt.compose-to-flat :refer [k8s-sanitize]]))

;; overrides run after "normal" service assembly
(def override-priority -1)
(def adjustment-priority 1000)
(def cleanup-priority -1000)

(defancestor [:container :service] :cgroup-member)

(defancestor [:volume :volume-ref] :named)

(defancestor [:service :container :network :volume :secret :container-group
              :k8s-service :empty-dir-volume :host-path-volume :app-info
              :ingress]
  :annotatable)

(defrule create-compose
  "Create an initial compose"
  =>
  (insert! {:type :compose}))

(defrule remove-app-infos
  "Remove all app-info elements since compose doesn't use them"
  [?wme :wme (= (:type ?wme) :app-info)]
  =>
  (remove! ?wme))

(defrule insert-default-version
  {:priority override-priority}
  "Add a default version keyword to a compose"
  [?compose :compose (not (:version ?compose))]
  =>
  (remove! ?compose)
  (insert! (assoc ?compose :version "3")))

(defrule insert-version
  "Add a version element to a compose being constructed"
  [?compose-version :compose-version]
  [?compose :compose]
  =>
  (remove! ?compose-version)
  (remove! ?compose)
  (insert! (assoc ?compose :version (:version ?compose-version))))

(defrule insert-empty-networks
  {:priority -100}
  "Add an empty networks section into a compose being constructed if necessary"
  [?compose :compose (not (:networks ?compose))]
  =>
  (remove! ?compose)
  (insert! (assoc ?compose :networks {})))

(defrule insert-empty-volumes
  {:priority -100}
  "Add an empty volumes section into a compose being constructed if necessary"
  [?compose :compose (not (:volumes ?compose))]
  =>
  (remove! ?compose)
  (insert! (assoc ?compose :volumes {})))

(defrule insert-service
  {:priority -100}
  "Add a service into a compose being constructed"
  [?compose :compose]
  [?svc :service]
  =>
  (remove! ?compose)
  (remove! ?svc)
  (insert! (assoc-in ?compose [:services (keyword (:name ?svc))]
                     (dissoc ?svc :name :type :cgroup :position :id :__id))))

(defrule replace-container-with-service
  "Create a service from a container"
  [?container :container]
  =>
  (remove! ?container)
  (insert! (assoc ?container :type :service)))

(defrule remove-dead-container-group
  "Delete a container group when its related containers/services are gone"
  [?cgroup :container-group]
  [:not [?cmem :cgroup-member (= (:cgroup ?cmem) (:id ?cgroup))]]
  =>
  (remove! ?cgroup))

(defrule insert-empty-service-volumes
  "Add an empty volumes section into a service being constructed if necessary"
  [?svc :service (not (:volumes ?svc))]
  =>
  (remove! ?svc)
  (insert! (assoc ?svc :volumes '())))

(defrule insert-network-holds
  "Add hold_for_compose values to a network"
  {:priority 1} ;; XXX: higher than insert-networks
  [?net :network]
  [?hfc :hold-for-compose (= (:container ?hfc) (:id ?net))]
  =>
  (remove! ?hfc)
  (remove! ?net)
  (let [newhfc (:value ?hfc)
        newnet (merge ?net newhfc)]
    (insert! newnet)))

(defrule insert-networks
  "Add networks to a compose"
  [?compose :compose]
  [?network :network]
  =>
  (remove! ?network)
  (remove! ?compose)
  (let [nmap (dissoc ?network :name :type :id :__id)]
    (insert!
     (update ?compose :networks
             #(assoc % (keyword (:name ?network))
                     (if (empty? nmap) nil nmap))))))

(defrule insert-volume-holds
  "Add hold_for_compose values to a volume"
  {:priority 1} ;; XXX: higher than insert-volumes
  [?vol :volume]
  [?hfc :hold-for-compose (= (:container ?hfc) (:id ?vol))]
  =>
  (remove! ?hfc)
  (remove! ?vol)
  (let [newhfc (:value ?hfc)
        newvol (merge ?vol newhfc)]
    (insert! newvol)))

(defrule insert-volumes
  "Add volumes to a compose"
  [?compose :compose]
  [?volume :volume]
  =>
  (remove! ?volume)
  (remove! ?compose)
  (let [vmap (dissoc ?volume :name :volume-mode :access-modes :storage-class
                     :physical-volume-name :is-template :storage :selector
                     :claim-name :type :id :__id)]
    (insert!
     (update ?compose :volumes
             #(assoc % (keyword (:name ?volume))
                     (if (empty? vmap) nil vmap))))))

(defrule insert-secret
  {:priority -100} ; so that annotations get added in before this
  "Add a secret into a compose being constructed"
  [?compose :compose]
  [?secret :secret]
  =>
  (remove! ?compose)
  (remove! ?secret)
  (insert! (assoc-in ?compose [:secrets (keyword (:name ?secret))]
                     (as-> ?secret s
                       (cond (not= (:alternate-name s) "")
                             (assoc s :external {:name (:alternate-name s)})

                             (= (:source s) "")
                             (assoc s :external true)

                             :else
                             (assoc s :file (:source s)))
                       (dissoc s :type :__id :id :name :alternate-name
                               :secret-volume :source :default-mode)))))

(defrule add-env-var-to-service
  "Add an environment variable to a service"
  [?svc :service]
  [?evar :environment-var (= (:container ?evar) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?evar)
  (let [ek (:key ?evar)
        ev (:value ?evar)]
    (insert!
     (update ?svc :environment
           #(sort (cons (str ek (when ev (str "=" ev))) %))))))

(defrule insert-holds
  "Add hold_for_compose values to a service"
  {:priority -1}
  [?svc :service]
  [?hfc :hold-for-compose (= (:container ?hfc) (:id ?svc))]
  =>
  (remove! ?hfc)
  (remove! ?svc)
  (let [newhfc (:value ?hfc)
        newsvc (merge ?svc newhfc)]
    (insert! newsvc)))

(defrule remove-unused-annotations
  {:priority -100}
  "Get rid of any stray annotations"
  [?anno :annotation]
  =>
  (remove! ?anno))

(defrule insert-image-into-service
  "Add an image into a service being constructed"
  [?svc :service]
  [?image :image (= (:container ?image) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?image)
  (insert! (assoc ?svc :image (:value ?image))))

(defrule insert-build-into-service
  "Add a build into a service being constructed"
  [?svc :service]
  [?build :build (= (:container ?build) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?build)
  (let [newsvc (assoc ?svc :build (:value ?build))]
    (insert! newsvc)))

(defrule insert-held-build-into-service
  "Add build holds into a service being constructed"
  {:priority -1} ;; XXX: after insert-build
  [?svc :service]
  [?hfc :hold-for-compose
   (:build (:value ?hfc))
   (= (:container ?hfc) (:id ?svc))]
  =>
  (let [build (:build ?svc)
        hfcval (:value ?hfc)
        newhfcval (dissoc hfcval :build)
        build-hold (:build hfcval)
        newbuild (if build-hold
                   (if build
                     (assoc build-hold :context build)
                     build-hold)
                   build)]
    (remove! ?svc)
    (remove! ?hfc)
    (insert! (assoc ?hfc :value newhfcval))
    (insert! (assoc ?svc :build newbuild))))

(defrule insert-port-mapping
  "Add a port mapping into a service being constructed"
  [?svc :service]
  [?pmap :port-mapping (= (:container ?pmap) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?pmap)
    (insert! (update
               ?svc :ports
                #(cons (str (and (:host ?pmap) (str (:host ?pmap) ":"))
                            (when (and (not= (:external ?pmap) "")
                                       (not= (:external ?pmap) "*"))
                              (str (:external ?pmap) ":"))
                            (:internal ?pmap)
                            (and (:protocol ?pmap)
                                 (str "/" (:protocol ?pmap)))) %))))

(defrule insert-exposed-port
  "Add an exposed port into a service being constructed"
  [?svc :service]
  [?eport :exposed-port (= (:container ?eport) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?eport)
  (insert! (update ?svc :expose #(cons (:internal ?eport) %))))

(defrule insert-labels
  "Add a label into a service being constructed"
  [?svc :service]
  [?label :label (= (:cgroup ?label) (:cgroup ?svc))]
  =>
  (remove! ?svc)
  (remove! ?label)
  (insert! (update ?svc :labels
                   (fn [labels]
                     (if (:ismap ?label)
                       (assoc labels (:key ?label) (:value ?label))
                       (let [k (:key ?label)
                             v (:value ?label)]
                         (conj labels
                               (str k (when v (str "=" v))))))))))

(defrule insert-entrypoint
  "Add an entrypoint into a service being constructed"
  [?svc :service]
  [?ep :entrypoint (= (:container ?ep) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?ep)
  (insert! (assoc ?svc :entrypoint (:value ?ep))))

(defrule insert-command
  "Add a command into a service being constructed"
  [?svc :service]
  [?command :command (= (:container ?command) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?command)
  (insert! (assoc ?svc :command (:value ?command))))

(defrule insert-logging
  "Add logging config into a service being constructed"
  [?svc :service]
  [?logging :logging (= (:container ?logging) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?logging)
  (insert! (assoc ?svc :logging (dissoc ?logging :type :id :container :__id))))

(defrule insert-dependency
  "Add a dependency into a service being constructed"
  [?svc :service]
  [?dep :dependency (= (:depender ?dep) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?dep)
  (insert! (update ?svc
                   :depends_on
                   #(cons (:name (get-wme-by-id (:dependee ?dep))) %))))

(defrule insert-replica-count
  "Add a replication factor into a service being constructed"
  [?svc :service]
  [?repl :replication
   (= (:container ?repl) (:id ?svc))
   (> (:count ?repl) 1)]
  =>
  (remove! ?svc)
  (remove! ?repl)
  (insert!
   (assoc-in ?svc [:deploy :replicas] (:count ?repl))))

(defrule remove-replication-count-of-one
  "Remove a replication with a count of 1"
  [?repl :replication (= (:count ?repl) 1)]
  =>
  (remove! ?repl))

(defrule insert-grace-period
  "Add a grace period into a service being constructed"
  [?svc :service]
  [?grace :stop-grace-period (= (:container ?grace) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?grace)
  (insert!
   (assoc-in ?svc [:stop_grace_period] (:value ?grace))))

(defrule insert-update-config
  "Add an update configuration into a service being constructed"
  [?svc :service]
  [?uconf :update-config (= (:cgroup ?uconf) (:cgroup ?svc))]
  =>
  (remove! ?svc)
  (remove! ?uconf)
  (insert!
   (assoc-in ?svc [:deploy :update_config] (:value ?uconf))))

(defrule insert-restart-policy
  "Add a restart policy into a service being constructed"
  [?svc :service]
  [?rpolicy :restart-policy (= (:cgroup ?rpolicy) (:cgroup ?svc))]
  =>
  (remove! ?svc)
  (remove! ?rpolicy)
  (insert!
   (assoc-in ?svc [:deploy :restart_policy] (:value ?rpolicy))))

(defrule insert-deployment-mode-from-hold
  "Add a deployment mode into a service being constructed"
  [?svc :service]
  [?dmode :deployment-mode
   (= (:container ?dmode) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?dmode)
  (let [mode (case (:value ?dmode)
               "allnodes" "global"
               "replicated")]
    (insert!
     (assoc-in ?svc [:deploy :mode] mode))))

(defrule insert-deployment-spec-into-service
  "Add a deployment spec into a service being constructed"
  [?svc :service]
  [?dspec :deployment-spec (= (:cgroup ?dspec) (:cgroup ?svc))]
  =>
  (remove! ?svc)
  (remove! ?dspec)
  (let [[mode count] (case (:mode ?dspec)
                       "allnodes" ["global" nil]
                       ["replicated" (:count ?dspec 1)])
        modespec (assoc-in ?svc [:deploy :mode] mode)
        newsvc (if count
                 (assoc-in modespec [:deploy :replicas] count)
                 modespec)]
    (insert! newsvc)))

(defrule insert-placement
  "Add a placement into a service being constructed"
  [?svc :service]
  [?place :placement (= (:cgroup ?place) (:cgroup ?svc))]
  =>
  (remove! ?svc)
  (remove! ?place)
  (insert!
   (assoc-in ?svc [:deploy :placement] (:value ?place))))

(defrule insert-extra-host
  "Add an extra host into a service being constructed"
  [?svc :service]
  [?ehosts :extra-hosts (= (:cgroup ?ehosts) (:cgroup ?svc))]
  =>
  (remove! ?svc)
  (remove! ?ehosts)
  (insert!
   (assoc-in ?svc [:extra_hosts] (:value ?ehosts))))

(defn make-health-test [healthcmd]
  (flatten (list "CMD" healthcmd)))

(defn seconds-to-duration [seconds]
  (str seconds "s"))

(defrule insert-health-check
  "Add a health check into a service being constructed"
  [?svc :service]
  [?hcheck :healthcheck
   (= (:container ?hcheck) (:id ?svc))
   (or (= (:check-type ?hcheck) "both")
       (= (:check-type ?hcheck) "liveness"))
   (or (= (:protocol ?hcheck) "exec")
       (:healthcmd ?hcheck))]
  =>
  (remove! ?svc)
  (remove! ?hcheck)
  (let [test (make-health-test (:healthcmd ?hcheck))
        interval (seconds-to-duration (:interval ?hcheck))
        timeout (seconds-to-duration(:timeout ?hcheck))
        retries (:retries ?hcheck)]
    (insert! (assoc ?svc :healthcheck {:test test :interval interval
                    :timeout timeout :retries retries}))))

(defrule rename-item
  {:priority adjustment-priority}
  "Rename any k8s-flavored names back to compose-flavored"
  [?named :named]
  [?nmap :name-mapping
   (= (:item-id ?nmap) (:id ?named))
   (let [field (keyword (:field ?nmap))]
     (= (:k8s ?nmap) (field ?named)))]
  =>
  (remove! ?nmap)
  (remove! ?named)
  (insert! (assoc ?named (keyword (:field ?nmap)) (:compose ?nmap))))

(defrule remove-scale
  "Remove scale entries -- vestigial from old yipee format"
  [?svc :service]
  [?scale :scale (= (:container ?scale) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?scale)
  (insert! (dissoc ?svc :scale)))

(defrule insert-network-ref
  "Add a network reference into a service being constructed"
  [?svc :service]
  [?net :network-ref (= (:container ?net) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?net)
  (insert! (assoc-in ?svc [:networks (keyword (:name ?net))]
                     (dissoc ?net :type :name :id :__id :container))))

(defrule insert-volume-ref
  "Add a volume reference into a service being constructed"
  [?svc :service]
  [?vol :volume-ref (= (:container ?vol) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?vol)
  (insert!
   (update ?svc
           :volumes
           #(sort (cons (str (:volume-name ?vol) ":" (:path ?vol)
                             (when (= (name (:access-mode ?vol)) "ReadOnlyMany")
                               ":ro"))
                        %)))))

(defrule insert-secret-ref
  "Add a secret reference into a service being constructed"
  [?svc :service]
  [?secret :secret-ref (= (:container ?secret) (:id ?svc))]
  =>
  (remove! ?svc)
  (remove! ?secret)
  (let [smode (:mode ?secret)
        secret (assoc ?secret :mode (Integer/parseInt smode 8))]
    (insert!
     (update ?svc :secrets
             #(cons (dissoc secret :type :container :secret :index :id
                            :mount-path :secret-volume :readonly :__id)
                    %)))))

(defrule insert-restart
  "Add a restart into a service being constructed"
  [?svc :service]
  [?restart :restart (= (:cgroup ?restart) (:cgroup ?svc))]
  =>
  (remove! ?svc)
  (remove! ?restart)
  (insert! (assoc ?svc :restart (:value ?restart))))

