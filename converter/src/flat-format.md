# Flat Format
## Flat Format "Objects"
The term "Flat Format" refers to the lack of (most) hierarchical
structure in the model below. Any relationships between objects are
managed via *id* references. A flat format document consists of a map
from object type names to arrays of corresponding objects. In addition
to the specific fields mentioned below, each object contains a *type*
field whose value is the string name of the object type and an *id*
field containing a uuid string uniquely representing the object. We
intend that some objects will contain attributes specific to
particular orchestrators. Because of this, it's critical that users
overwrite fields within an existing object rather than construct
instances from scratch so any "extra" information used internally is
not lost.


### Orchestrator Agnostic
#### annotation
Additional information about another object (including overrides)
- *key* **string** (name of annotation)
- *value* **json** (value of annotation)
- *annotated* **uuid-ref** (object being annotated)
#### app-info
High-level data about an entire model
- *description* **string** 
- *logo* **string** 
- *name* **string** 
- *readme* **string** 
#### command
Docker command for running a container
- *value* **string-array** 
- *container* **uuid-ref** (reference to container)
#### config
Config map (behaves mostly like an unencrypted secret)
- *default-mode* **non-negative-integer-string** (mode to apply to each config item if not specified)
- *name* **string** (name of config volume)
- *map-name* **string** (name of config map)
#### config-ref
Reference to a config map/volume
- *container* **uuid-ref** (reference to container)
- *container-name* **string** (needed for lookup after storage)
- *name* **string** (name of config volume)
- *path* **string** (mount path for volume in container)
- *config* **uuid-ref** (id of config volume)
#### container
Docker container being managed
- *name* **string** 
- *cgroup* **uuid-ref** (reference to container group)
#### container-group
Multi-container unit (support for Kubernetes pods)
- *name* **string** 
- *pod* **uuid-ref** (reference to pod structure representing group)
- *source* **string** (*auto*, *k8s*)
- *controller-type* **string** (*Deployment*, *DaemonSet*, *StatefulSet*, *Job*, *CronJob*)
- *containers* **uuid-ref-array** 
- *container-names* **string-array** (needed for storing in yipee)
#### dependency
Startup ordering relationship
- *depender* **uuid-ref** (reference to dependent container)
- *dependee* **uuid-ref** (reference to independent container)
#### deployment-spec
Defines how many instances of a container group should be deployed and in what "mode" (*replicated* or *allnodes*)
- *count* **case controller-type: when "CronJob"=>((non-negative-integer)?); when "DaemonSet"=>((non-negative-integer)?); otherwise=>(non-negative-integer)** (Ignored for DaemonSet)
- *mode* **string** (*replicated*, *allnodes*)
- *cgroup* **uuid-ref** (reference to container group)
- *service-name* **case controller-type: when "StatefulSet"=>(string); otherwise=>((string)?)** (name of associated headless service)
- *controller-type* **string** (*Deployment*, *DaemonSet*, *StatefulSet*, *CronJob*)
- *termination-grace-period* **non-negative-integer** (how long to wait before killing pods)
- *update-strategy* **case controller-type: when "StatefulSet"=>({"type"=>("RollingUpdate"), ("rollingUpdate"=>{("partition"=>non-negative-integer)?})?}); when "Deployment"=>(({"type"=>("Recreate")} | {"type"=>("RollingUpdate"), ("rollingUpdate"=>{("maxSurge"=>(non-negative-integer | non-negative-integer-string | #"[1-9][0-9]?[%]"))?, ("maxUnavailable"=>(non-negative-integer | non-negative-integer-string | #"[1-9][0-9]?[%]"))?})?})); when "DaemonSet"=>(({"type"=>("OnDelete")} | {"type"=>("RollingUpdate"), ("rollingUpdate"=>{("maxUnavailable"=>(positive-integer | positive-integer-string | #"[1-9][0-9]?[%]"))?})?}))** 
- *pod-management-policy* **string** (*OrderedReady*, *Parallel*)
#### empty-dir-volume
Empty directory on pod host for scratch use
- *name* **string** 
- *annotations* **json** (will go away - currently used to support ui format)
- *medium* **string** (*Memory*, *<empty string>* -- default: *<empty string>*. whether or not to mount the directory as tmpfs)
- *cgroup* **uuid-ref** (needed to disambiguate empty dir volumes -- they don't have unique instances like PV claims)
#### entrypoint
Docker entrypoint for running a container
- *value* **string-array** 
- *container* **uuid-ref** 
#### environment-var
Enviroment variable
- *key* **string** 
- *value* **string** 
- *valueFrom* **({"configMapKeyRef"=>{"key"=>string, "name"=>string, ("optional"=>boolean)?}} | {"fieldRef"=>{("apiVersion"=>string)?, "fieldPath"=>string}} | {"resourceFieldRef"=>{("containerName"=>string)?, ("divisor"=>string)?, "resource"=>string}} | {"secretKeyRef"=>{"key"=>string, "name"=>string, ("optional"=>boolean)?}})** 
- *container* **uuid-ref** (reference to container)
#### extra-hosts
Hostname/IP mappings for additional hosts
- *value* **string-array** 
- *cgroup* **uuid-ref** (reference to container group w/ mappings)
#### healthcheck
Specification for a check operation to perform on a container
- *healthcmd* **string-array** 
- *interval* **non-negative-integer** 
- *retries* **non-negative-integer** 
- *timeout* **non-negative-integer** 
- *check-type* **string** (*liveness*, *readiness*, *both*)
- *container* **uuid-ref** (reference to container)
#### host-path-volume
File or directory mounted from host node's filesystem
- *name* **string** 
- *cgroup* **uuid-ref** (reference to associated container group)
- *host-path* **string** (path on host node filesystem)
- *host-path-type* **string** (*DirectoryOrCreate*, *Directory*, *FileOrCreate*, *File*, *Socket*, *CharDevice*, *BlockDevice*)
#### image
Image run by a container
- *value* **string** 
- *container* **uuid-ref** (reference to container running image)
#### label
Tag placed on searchable unit
- *key* **string** 
- *value* **string** 
- *cgroup* **uuid-ref** (reference to labeled container group)
#### port-mapping
Mapping between container port and external port
- *name* **string** 
- *internal* **string** 
- *external* **non-negative-integer-string** 
- *protocol* **string** (*tcp*, *udp*)
- *container* **uuid-ref** (reference to container)
- *defining-service* **uuid-ref** (explicit service that called out port; empty string if generated from compatibility mode)
#### replication
Number of instances of a container group to run
- *count* **non-negative-integer** 
- *cgroup* **uuid-ref** (reference to replicated container group)
#### restart
Conditions under which a container group should be restarted
- *value* **string** (*always*, *none*, *unless-stopped*, *on-failure*)
- *cgroup* **uuid-ref** (reference to restarting container group)
#### restart-policy
How containers should be restarted
- *value* **string** (*always*, *none*, *unless-stopped*, *on-failure*)
- *cgroup* **uuid-ref** (reference to associated container group)
#### secret
Definition of secret value (needs work as the set of fields is not currently fixed - *external*, *file*, *alternate-name* vary depending on the secret
- *name* **string** 
- *source* **string** (empty string if "external", file name if "file")
- *alternate-name* **string** (empty string if "file" or "external" without name)
- *default-mode* **non-negative-integer-string** (mode to apply to each secret item if not specified)
#### secret-ref
Reference to existing secret from a container
- *uid* **non-negative-integer-string** 
- *gid* **non-negative-integer-string** 
- *mode* **non-negative-integer-string** 
- *secret-volume* **uuid-ref** (reference to secret volume)
- *secret* **uuid-ref** (reference to secret)
- *source* **string** 
- *target* **string** 
- *container* **uuid-ref** (reference to container using secret)
#### volume
Storage specification
- *name* **string** 
- *annotations* **json** (will go away - currently used to support ui format)
- *is-template* **boolean** (whether or not this volume object represents a StatefulSet VolumeClaimTemplate rather than a direct volume claim)
- *volume-mode* **string** (*Filesystem*, *Block* -- default: *Filesystem*)
- *access-modes* **[("ReadWriteMany" | "ReadWriteOnce" | "ReadOnlyMany")]** (one or more of: *ReadOnlyMany*, *ReadWriteOnce*, *ReadWriteMany*)
- *storage-class* **string** (name of predefined cluster storage class)
- *storage* **storage-value** (amount of storage for a PersistentVolumeClaim -- allows units: E, P, T, G, M, K - powers of 10: Exa, Peta, Tera, Giga, Mega, Kilo and Ei, Pi, Ti, Gi, Mi, Ki - powers of two (i.e. Gi is 1024\*1024\*1024 while G is 1000\*1000\*1000)
- *selector* **{("matchExpressions"=>({"key"=>string, "operator"=>("In" | "NotIn"), "values"=>string-array} | {"key"=>string, "operator"=>("Exists" | "DoesNotExist"), "values"=>empty-string-array}))?, ("matchLabels"=>{"keyword-or-str"=>string, ...})?}** (used for PersistentVolumeClaims -- staying compatible with k8s-service for now... both matchLabels and matchExpressions for attributes of persistent volumes (see: [persistent volume docs](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes)))
#### volume-ref
Reference from container to volume
- *path* **string** 
- *volume-name* **string** 
- *volume* **uuid-ref** (reference to volume)
- *access-mode* **string** (*ReadOnlyMany*, *ReadWriteOnce*, *ReadWriteMany*)
- *container-name* **string** (name of container using volume)
- *container* **uuid-ref** (reference to container using volume)

### Kubernetes Only
#### cronjob-data
All data for a CronJob controller
- *cgroup* **uuid-ref** (reference to associated container group)
- *cronjob-spec* **{("concurrencyPolicy"=>("Allow" | "Forbid" | "Replace"))?, ("failedJobsHistoryLimit"=>non-negative-integer)?, "schedule"=>string, ("startingDeadlineSeconds"=>non-negative-integer)?, ("successfulJobsHistoryLimit"=>non-negative-integer)?, ("suspend"=>boolean)?}** 
- *job-spec* **{"activeDeadlineSeconds"=>positive-integer, ("backoffLimit"=>non-negative-integer)?, ("completions"=>positive-integer)?, ("manualSelector"=>boolean)?, "parallelism"=>positive-integer, ("selector"=>{("matchExpressions"=>({"key"=>string, "operator"=>("In" | "NotIn"), "values"=>string-array} | {"key"=>string, "operator"=>("Exists" | "DoesNotExist"), "values"=>empty-string-array}))?, ("matchLabels"=>{"keyword-or-str"=>string, ...})?})?}** 
#### container-lifecycle
[:container :uuid-ref :container "reference to container with lifecycle"]
- *postStart* **({"exec"=>{"command"=>string-array}} | {"httpGet"=>{("host"=>string)?, ("httpHeaders"=>[string])?, "path"=>string, "port"=>(string | 1..65535), ("scheme"=>string)?}} | {"tcpSocket"=>{("host"=>string)?, "port"=>(string | 1..65535)}})** 
- *preStop* **({"exec"=>{"command"=>string-array}} | {"httpGet"=>{("host"=>string)?, ("httpHeaders"=>[string])?, "path"=>string, "port"=>(string | 1..65535), ("scheme"=>string)?}} | {"tcpSocket"=>{("host"=>string)?, "port"=>(string | 1..65535)}})** 
#### container-resources
[:container :uuid-ref :container "reference to container possessing resources"]
- *limits* **{("memory"=>memory-value)?, ("cpu"=>cpu-value)?}** 
- *requests* **{("memory"=>memory-value)?, ("cpu"=>cpu-value)?}** 
#### image-pull-policy
When to pull a new image
- *value* **string** (*Always*, *IfNotPresent*)
- *container* **uuid-ref** (reference to container using image)
#### ingress
Manages external access to services in a cluster
- *name* **string** 
- *metadata* **{("annotations"=>{"keyword-or-str"=>string, ...})?, ("labels"=>{"keyword-or-str"=>string, ...})?, ("selector"=>{"keyword-or-str"=>string, ...})?, "name"=>string, ("namespace"=>string)?...}** 
- *spec* **({"backend"=>{"service-id"=>string, "servicePort"=>(string | 1..65535)}, ("tls"=>[{("hosts"=>string-array)?, ("secretName"=>string)?}])?} | {"rules"=>[{("host"=>string)?, "http"=>{"paths"=>[{"backend"=>{"service-id"=>string, "servicePort"=>(string | 1..65535)}, "path"=>string}]}}], ("tls"=>[{("hosts"=>string-array)?, ("secretName"=>string)?}])?} | {"backend"=>{"service-id"=>string, "servicePort"=>(string | 1..65535)}, "rules"=>[{("host"=>string)?, "http"=>{"paths"=>[{"backend"=>{"service-id"=>string, "servicePort"=>(string | 1..65535)}, "path"=>string}]}}], ("tls"=>[{("hosts"=>string-array)?, ("secretName"=>string)?}])?})** 
#### k8s-namespace
Kubernetes supports explicit namespaces
- *name* **string** 
- *label-name* **string** 
#### k8s-service
Stores the selector and metadata derived from a top level Kubernetes service
- *name* **string** 
- *metadata* **{("annotations"=>{"keyword-or-str"=>string, ...})?, ("labels"=>{"keyword-or-str"=>string, ...})?, ("selector"=>{"keyword-or-str"=>string, ...})?, "name"=>string, ("namespace"=>string)?...}** 
- *selector* **{"keyword-or-str"=>string, ...}** 
- *service-type* **string** (*ClusterIP*, *NodePort*, *LoadBalancer*, *ExternalName*)
- *cluster-ip* **string** (if present, static IP for service or "None")
- *node-port* **string** (if present, staticly defined port for service)
#### model-namespace
Single namespace for a model. The reference namespace will be added to each construct on output.
- *name* **string** (name of the namespace)
#### node-selector
Defines the nodes on which a container can be deployed.
- *cgroup* **uuid-ref** (reference to labeled container group)
- *nodeSelectorTerms* **[{("matchExpressions"=>({"key"=>string, "operator"=>("In" | "NotIn"), "values"=>non-empty-string-array} | {"key"=>string, "operator"=>("Exists" | "DoesNotExist"), "values"=>empty-string-array} | {"key"=>string, "operator"=>("Lt" | "Gt"), "values"=>[(integer | integer-string)]}))?, ("matchFields"=>({"key"=>string, "operator"=>("In" | "NotIn"), "values"=>non-empty-string-array} | {"key"=>string, "operator"=>("Exists" | "DoesNotExist"), "values"=>empty-string-array} | {"key"=>string, "operator"=>("Lt" | "Gt"), "values"=>[(integer | integer-string)]}))?}]** 
#### security-context
Holds security configuration that will be applied to a container
- *container* **uuid-ref** (reference to associated container)
- *allowPrivilegeEscalation* **boolean** (whether a process can gain more privileges than its parent process)
- *capabilities* **{("add"=>string-array)?, ("drop"=>string-array)?}** (the capabilities to add/drop when running containers)
- *privileged* **boolean** (run container in privileged mode)
- *readOnlyRootFilesystem* **boolean** 
- *runAsGroup* **(non-negative-integer | non-negative-integer-string)** 
- *runAsNonRoot* **boolean** 
- *runAsUser* **(non-negative-integer | non-negative-integer-string)** 
- *seLinuxOptions* **{"level"=>string, "role"=>string, "type"=>string, "user"=>string}** 
#### secret-volume
Volume holding secret item values
- *source* **string** (*auto*, *k8s*)
- *default-mode* **non-negative-integer-string** (default mode for secret items in this volume)
- *secret-name* **string** (name of secret exposed by secret volume)
#### top-label
Kubernetes supports labels at many levels. We mostly care about labels in selectors but you can also place labels at the top levels of constructs like *Deployments*. These are those auxiliary labels.
- *key* **string** 
- *value* **string** 
- *cgroup* **uuid-ref** (reference to labeled container group)
#### unknown-k8s-kind
Any item with a "kind" we don't recognize should be wrapped in one of these.
- *body* **json** (entire definition of unknown object)

### Compose Only
#### build
How to build a container
- *value* **(string | {"context"=>string, ("dockerfile"=>string)?, ("args"=>({"keyword-or-str"=>(string | integer), ...} | [string]))?})** 
- *container* **uuid-ref** (reference to associated container)
#### network-ref
Reference from a container to a network
- *name* **string** 
- *aliases* **string-array** 
- *container* **uuid-ref** (reference to associated container)
#### logging
Description of logging configuration for container
- *driver* **string** 
- *options* **{"keyword-or-str"=>(string | integer), ...}** 
- *container* **uuid-ref** (reference to container using logging)
#### stop-grace-period
Length of time to wait for stop
- *value* **string** 
- *container* **uuid-ref** (reference to container being stopped)
#### deployment-mode
How a compose container should be deployed
- *value* **string** (*global*, *replicated*)
- *source* **string** 
- *container* **uuid-ref** (reference to container being deployed)
