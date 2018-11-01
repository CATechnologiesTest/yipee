const YAML = require('yamljs');
const fs = require('fs');
const Primus = require('primus')
const LineStream = require('byline').LineStream;
const request = require('request');
const cvtHelpers = require('./cvthelpers');
const Http = require('./http');
const baselogger = require('./logger');
const errorObject = baselogger.errorObject;
const logger = baselogger.getOrCreateLogger('k8sapi');
const util = require('util');
const env = require('../environment');

// All connected clients for namespace updates
const allConnections = new Map();

// Keep track of clients subscribed to one or more namespaces
const connectionsByNS = new Map();

// Track objects to yipee ids for matching up with status
const objectNamesToIDs = new Map();

// Track all objects in pod ownership chain
const objects = new Map();

function ppwrap(key, item) {
    console.log(key + ':', item);
    return item;
}

function ppwrapj(key, item) {
    console.log(key + ':', JSON.stringify(item, undefined, 4));
    return item;
}

function nsQualifiedName(ns, name) {
    return ns + ';' + name;
}

function getId(obj) {
    return objectNamesToIDs.get(
        nsQualifiedName(obj.metadata.namespace, obj.metadata.name));
}

// Gather ids for objects from namespace
function populateNamesAndIds(ns) {
    return new Promise((resolve, reject) => {
        namespaceNameToFlatFormat(ns)
            .then(flat => {
                for (let key in flat) {
                    flat[key].forEach(obj => {
                        if (obj['type'] == 'container-group') {
                            objectNamesToIDs.set(nsQualifiedName(ns, obj.name),
                                                 obj.id);
                        }
                    });
                }
                resolve('ok');
            })
            .catch(err => { reject(err); });
    });
}

// Just controllers and pods for now
function getNamespaceObjects(ns) {
    let controllers = [];
    let pods = [];
    objects.forEach((o, id) => {
        let meta = o.metadata;
        if (meta.namespace == ns) {
            if (isControllerKind(o.kind)) {
                controllers.push(o);
            } else if (o.kind == 'Pod') {
                pods.push(o);
            }
        }
    });

    return {controllers: controllers, pods: pods};
}

function getAllSubscribers() {
    return allConnections;
    // let results = [];

    // connectionsByNS.forEach((subs, ns) => {
    //     subs.forEach((sub, id) => {
    //         if (id != 'watchers') {
    //             results.push(sub);
    //         }
    //     });
    // });

    // return results;
}

function getNamespace(nsname) {
    return doGet(`/api/v1/namespaces/${nsname}`);
}

// Update namespace status when something inside it changes
function namespaceUpdate(ns) {
    let csAndPs = getNamespaceObjects(ns);
    let subs = getAllSubscribers();
    getNamespace(ns)
        .then(nspace => {
            subs.forEach(spark => {
                spark.write(
                    {namespaceUpdate:
                     {namespace: ns,
                      status: rollUpData(nspace,
                                         csAndPs.controllers, csAndPs.pods)}});
            });
        });
}

// Track all the pods (and their ancestors) in the system so we can
// use them in status and restart counts.

function trackObject(update) {
    let updateType = update['type'];
    let updateObj = update['object'];

    if (updateType == 'ADDED' || updateType == 'MODIFIED') {
        objects.set(updateObj.metadata.uid, updateObj);
    } else if (updateType == 'DELETED') {
        objects.delete(updateObj.metadata.uid);
    }

    if (isControllerKind(updateObj.kind)) {
        namespaceUpdate(updateObj.metadata.namespace);
    }
}

const controllerWatchUrls = [
    'https://kubernetes.default.svc/apis/apps/v1/watch/deployments',
    'https://kubernetes.default.svc/apis/apps/v1/watch/statefulsets',
    'https://kubernetes.default.svc/apis/apps/v1/watch/daemonsets'
];

function setUpPodTracking() {
    return new Promise(resolve => {
        setUpWatch(
            ['https://kubernetes.default.svc/api/v1/watch/pods',
             'https://kubernetes.default.svc/apis/apps/v1/watch/replicasets',
             ...controllerWatchUrls],
            updateBuffer => {
                trackObject(JSON.parse(updateBuffer.toString('utf8')));
            });
        Promise.all([getAllPods(), getAllReplicaSets(), getAllControllers()])
            .then(results => {
                for (let i = 0; i < results.length; i++) {
                    let list = results[i];
                    for (let j = 0; j < list.length; j++) {
                        let obj = list[j];
                        trackObject({'type': 'ADDED', 'object': obj});
                    }
                }
                resolve('ok');
            });
    });
}

function sendExistingStateToNewSubscriber(spark) {
    getAllControllers()
        .then(results => {
            for (let i = 0; i < results.length; i++) {
                let obj = results[i];
                spark.write({update: extractStatus(obj)});
            }
        });
}

// Create a primus server that uses websockets for transport
function initPrimus(server) {
    if (!env.liveCluster) {
        return null;
    }

    let primus = new Primus(server, {transformer: 'websockets'});

    setUpPodTracking()
        .then(_ => {
            primus.on('connection', function connection(spark) {
                allConnections.set(spark.id, spark);
                spark.on('data', function received(data) {
                    let msg = data.msg;

                    if (msg == 'subscribe') {
                        let ns = data.namespace;
                        console.log(spark.id, 'received subscription to:', ns);
                        // We store the spark associated with the namespace so
                        // that when namespace changes occur, we can update the
                        // subscribers through their sparks. We save the original
                        // requests so they can be aborted later.
                        if (connectionsByNS.has(ns)) {
                            connectionsByNS.get(ns).set(spark.id, spark);
                            sendExistingStateToNewSubscriber(spark);
                        } else {
                            doWatch(ns)
                                .then(watchers => {
                                    connectionsByNS.set(
                                        ns, new Map([['watchers', watchers],
                                                     [spark.id, spark]]));
                                });
                        }
                    } else if (msg == 'unsubscribe') {
                        let ns = data.namespace;
                        console.log(spark.id, 'received unsubscription to:', ns);
                        if (connectionsByNS.has(ns)) {
                            connectionsByNS.get(ns).delete(spark.id);
                        }

                        if (connectionsByNS.has(ns) &&
                            connectionsByNS.get(ns).size == 1) {
                            connectionsByNS.get(ns).get(
                                'watchers').forEach((w) => {
                                w.abort();
                            });
                            connectionsByNS.delete(ns);
                        }
                    }
                });
            });

            console.log('FINISHED PRIMUS INIT...');
        });
    return primus;
}

const secretDir = '/var/run/secrets/kubernetes.io/serviceaccount';

function readSecret(name) {
    var filedata = "";
    if (env.liveCluster) {
        filedata = fs.readFileSync(`${secretDir}/${name}`);
    }
    return filedata;
}

const token = readSecret('token');
const baseOptions = {
    host: 'kubernetes.default.svc',
    ca: [ readSecret('ca.crt') ],
    headers: {
        'Authorization': 'Bearer ' + token
    }
};

function doHttpOp(inoptions, payload) {
    var options = Object.assign({}, baseOptions, inoptions);
    return new Promise((resolve, reject) => {
        Http.tlsRequest(options, payload)
            .then(res => {
                if (res.rc < 400) {
                    var body = res.body;
                    if (typeof body === 'string') {
                        body = JSON.parse(body);
                    }
                    resolve(body);
                } else {
                    console.log("bad HTTP return:", res);
                    reject({
                        msg: "HTTP error",
                        status: res.rc
                    });
                }
            })
    });
}

function isDaemonSet(obj) {
    return obj.kind === 'DaemonSet';
}

function isControllerKind(kind) {
    switch (kind) {
    case 'Deployment':
    case 'StatefulSet':
    case 'DaemonSet':
        return true;
    default:
        return false;
    }
}

function statusName(obj) {
    // XXX: Fix this.
    // Current UI only pays attention to deployment-status
    if (isControllerKind(obj.kind)) {
        return 'deployment-status';
    } else {
        return obj.kind.toLowerCase() + '-status';
    }
}

// Any controller with replica count in the open interval (0..<desired
// replicas>) is yellow. Replica count of 0 is red; otherwise green
function calculateStatusValue(obj) {
    if (!isControllerKind(obj.kind)) {
        return 'green';
    } else {
        let replicas = getRequestedReplicas(obj);
        let active = getActiveReplicas(obj);

        if (active == 0) {
            return 'red';
        }

        if (active < replicas) {
            return 'yellow';
        }

        return 'green';
    }
}

// Search through objects recursively through ownerReferences by uid to find
// top-level controller
function findProgenitor(uid) {
    let obj = objects.get(uid);
    if (obj == undefined || obj.metadata.ownerReferences == undefined) {
        return uid;
    }

    let ownerRefs = obj.metadata.ownerReferences;

    for (let i = 0; i < ownerRefs.length; i++) {
        let ref = ownerRefs[i];
        if (ref.controller == true) {
            return findProgenitor(ref.uid);
        }
    }

    return uid;
}

// Find pods under a given controller using findProgenitor
function getPodsForController(obj) {
    let results = new Set();

    objects.forEach((p, id) => {
        if (p.kind == 'Pod' && findProgenitor(id) == obj.metadata.uid) {
            results.add(p);
        }
    });

    return results;
}

// Roll up restart count by gathering all underlying pods, and extracting
// their containerStatuses
function getRestarts(obj) {
    let pods = getPodsForController(obj);
    let restarts = 0;

    pods.forEach(pod => {
        if (pod.status) {
            let contStats = pod.status.containerStatuses;
            if (contStats != undefined) {
                for (let i = 0; i < contStats.length; i++) {
                    restarts = restarts + contStats[i].restartCount;
                }
            }
        }
    });

    return restarts;
}

function getRequestedReplicas(obj) {
    return isDaemonSet(obj) ? 1 : obj.spec.replicas;
}

function getReadyCount(cntlr) {
    let readyReplicas;
    if (isDaemonSet(cntlr) && cntlr.status && cntlr.status.numberReady) {
        readyReplicas = cntlr.status.numberReady;
    } else if (cntlr.status && cntlr.status.readyReplicas) {
        readyReplicas = cntlr.status.readyReplicas;
    } else {
        readyReplicas = 0;
    }
    return readyReplicas;
}

function getActiveReplicas(obj) {
    return getReadyCount(obj);
}

function extractStatus(obj) {
    if (isControllerKind(obj.kind)) {
        return {'type': statusName(obj),
                'status': calculateStatusValue(obj),
                'requested-replicas': getRequestedReplicas(obj),
                'active-replicas': getActiveReplicas(obj),
                'restart-count': getRestarts(obj),
                'cgroup': getId(obj)};
    } else {
        // TBD
        return {'type': statusName(obj),
                'status': 'green',
                'cgroup': getId(obj)};
    }
}

function primusUpdate(ns, data) {
    let subscribers = connectionsByNS.get(ns) || [];
    subscribers.forEach((spark, id) => {
        if (id != 'watchers') {
            let obj = JSON.parse(data.toString('utf8'));
            spark.write({update: extractStatus(obj['object'])});
        }
    });
}

function setUpWatch(uris, func) {
    let requestOptions = {
        method: 'GET',
        qs: {'watch': true},
        headers: { 'Authorization': 'Bearer ' + readSecret('token') },
        ca: [ readSecret('ca.crt') ],
        json: true
    };
    let stream = new LineStream();
    stream.on('data', func);

    let requests = [];
    for (let i = 0; i < uris.length; i++) {
        requestOptions.uri = uris[i];
        let req = request(requestOptions, (error, response, body) => {
            if (error) {
                console.log('Watch error:', error);
            }
        });
        req.pipe(stream);
        requests.concat(req);
    }

    return requests;
}

function makeNsWatchUrls(namespace) {
    let nswatchbase = `https://kubernetes.default.svc/apis/apps/v1/watch/namespaces/${namespace}`;

    return [`${nswatchbase}/deployments`,
            `${nswatchbase}/statefulsets`,
            `${nswatchbase}/daemonsets`];
}

function doWatch(namespace) {
    return new Promise((resolve, reject) => {
        populateNamesAndIds(namespace)
            .then(_ => {
                let requests = setUpWatch(
                    makeNsWatchUrls(namespace),
                    (data) => { primusUpdate(namespace, data); });
                resolve(requests);
            })
            .catch(err => { reject(err); });
    });
}

function doGet(path) {
    return doHttpOp({method: 'GET', path: path});
}

function getItemList(url) {
    return new Promise((resolve, reject) => {
        doGet(url)
            .then(res => {
                res.items.forEach(i => {
                    i.apiVersion = res.apiVersion;
                    i.kind = res.kind.substring(
                        0, res.kind.lastIndexOf("List"));
                });
                resolve(res.items);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function rollUpStatus(controllers) {
    let status = 'green';

    for (let c = 0; c < controllers.length; c++) {
        let cntlr = controllers[c];
        let specReplicas = isDaemonSet(cntlr) ? 1 : cntlr.spec.replicas;
        let readyReplicas = getReadyCount(cntlr);

        if (readyReplicas > 0 && readyReplicas < specReplicas &&
            status != 'red') {
            status = 'yellow';
        } else if (readyReplicas == 0) {
            status = 'red';
        }
    }
    return status;
}

function rollUpData(ns, controllers, pods) {
    let status = rollUpStatus(controllers);

    return {name: ns.metadata.name,
            dateCreated: ns.metadata.creationTimestamp,
            phase: ns.status.phase,
            podCount: pods.length,
            status: status,
            containerCount: pods.reduce((acc, p) => {
                return acc + p.spec.containers.length;
            }, 0)};
}

function processNamespace(ns) {
    return new Promise((resolve, reject) => {
        Promise.all(
            [getControllersForNs(ns.metadata.name),
             doGet(`/api/v1/namespaces/${ns.metadata.name}/pods`)])
            .then(promises => {
                resolve(rollUpData(ns, promises[0], promises[1].items));
            })
            .catch(err => { reject(err); });
    });
}

// Our app wants the "catalog object" to have dateCreated, containerCount, etc.
// Get pod info for namespace to count containers, and then build up
// the namespace object that we'll return to the UI.
function getAppNamespaceObjects(nslist) {
    return new Promise((resolve, reject) => {
        // Get podlist for each of the namespaces so we can count the
        // number of pods/containers in the namespace
        Promise.all(nslist.map(ns => { return processNamespace(ns); }))
            .then(res => { resolve(res); })
            .catch(err => { reject(err); });
    });
}

function getNamespaces() {
    return new Promise((resolve, reject) => {
        doGet('/api/v1/namespaces')
            .then(res => {
                return getAppNamespaceObjects(res.items);
            })
            .then(objlist => {
                resolve(objlist);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getAllPods() {
    return getItemList('/api/v1/pods');
}

function getAllDeployments() {
    return getItemList('/apis/apps/v1/deployments');
}

function getAllReplicaSets() {
    return getItemList('/apis/apps/v1/replicasets');
}

function getAllStatefulSets() {
    return getItemList('/apis/apps/v1/statefulsets');
}

function getAllDaemonSets() {
    return getItemList('/apis/apps/v1/daemonsets');
}

function getAllControllers() {
    return new Promise((resolve, reject) => {
        Promise.all([getAllDeployments(), getAllStatefulSets(),
                     getAllDaemonSets()])
            .then(results => {
                var rollup = [].concat(...results);
                resolve(rollup);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getControllersForNs(namespace) {
    return new Promise((resolve, reject) => {
        Promise.all([getDeployments(namespace, true),
                     getStatefulSets(namespace, true),
                     getDaemonSets(namespace, true)])
            .then(results => {
                var rollup = [].concat(...results);
                resolve(rollup);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getDeployments(namespace) {
    return getItemList(
        `/apis/apps/v1/namespaces/${namespace}/deployments`);
}

function getStatefulSets(namespace) {
    return getItemList(
        `/apis/apps/v1/namespaces/${namespace}/statefulsets`);
}

function getDaemonSets(namespace) {
    return getItemList(`/apis/apps/v1/namespaces/${namespace}/daemonsets`);
}

function getServices(namespace) {
    return getItemList(`/api/v1/namespaces/${namespace}/services`);
}

function getPvcs(namespace) {
    return getItemList(
        `/api/v1/namespaces/${namespace}/persistentvolumeclaims`);
}

function getSecrets(namespace) {
    return getItemList(`/api/v1/namespaces/${namespace}/secrets`);
}

function getConfigMaps(namespace) {
    return getItemList(`/api/v1/namespaces/${namespace}/configmaps`);
}

function getIngresses(namespace) {
    return getItemList(
        `/apis/extensions/v1beta1/namespaces/${namespace}/ingresses`);
}

function makeImport(namespace) {
    // get objects from namespace,
    // turn each one to yaml, and output them all as string data
    // with elements separated by "---"
    return new Promise((resolve, reject) => {
        Promise.all([getServices(namespace),
                     getDeployments(namespace),
                     getStatefulSets(namespace),
                     getDaemonSets(namespace),
                     getPvcs(namespace),
                     getIngresses(namespace)])
            .then(vals => {
                var strdata = "";
                vals.forEach(itemarr => {
                    itemarr.forEach(i => {
                        // strdata += YAML.stringify(i);
                        strdata += JSON.stringify(i);
                        strdata += "\n---\n";
                    });
                });
                resolve(strdata);
            })
            .catch(err => {
                console.log("helper error:", err);
                logger.error({error: errorObject(err)}, "makeImport error");
                reject(err);
            });
    });
}

function namespaceNameToFlatFormat(nsname) {
    return new Promise((resolve, reject) => {
        makeImport(nsname)
            .then(impstring => {
                // do a k8s-to-flat and create something like a
                // "yipee object" with flatFile set accordingly
                return cvtHelpers.k8sToFlat(impstring);
            })
            .then(flatFile => {
                if (typeof flatFile === 'string') {
                    flatFile = JSON.parse(flatFile);
                }
                flatFile['app-info'][0].name = nsname;
                if (!("model-namespace" in flatFile)) {
                    flatFile['model-namespace'] = [{type: "model-namespace",
                                                    name: nsname}];
                }
                resolve(flatFile);
            }).catch(err => { reject(err); });
    });
}

module.exports.namespaceNameToFlatFormat = namespaceNameToFlatFormat;
module.exports.getNamespaces = getNamespaces;
module.exports.makeImport = makeImport;
module.exports.initPrimus = initPrimus;
module.exports.doHttpOp = doHttpOp;
module.exports.token = token;
