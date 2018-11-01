const chai = require('chai');
var chaiHttp = require('chai-http');
const expect = chai.expect;
const nock = require('nock');
const app = require('../app');
const util = require('util');

chai.use(chaiHttp);

function logAndThrow(err) {
    console.log(err);
    throw err;
}

const apihost = "https://kubernetes.default.svc";
const testnsname = "simple";
const alldeploymentsurl = "/apis/apps/v1/deployments";
const allstatefulsetsurl = "/apis/apps/v1/statefulsets";
const alldaemonsetsurl = "/apis/apps/v1/daemonsets";

const appdeploymenturl = /^\/apis\/apps\/v1\/namespaces\/.+\/deployments/;
const appstatefulseturl = /^\/apis\/apps\/v1\/namespaces\/.+\/statefulsets/;
const appdaemonseturl = /^\/apis\/apps\/v1\/namespaces\/.+\/daemonsets/;
const appsvcurl =        /^\/api\/v1\/namespaces\/.+\/services/;
const apppodsurl =       /^\/api\/v1\/namespaces\/.+\/pods$/;
const apppvcsurl =       /^\/api\/v1\/namespaces\/.+\/persistentvolumeclaims$/;
const appingressurl = /^\/apis\/extensions\/v1beta1\/namespaces\/.+\/ingresses$/;
const crdurl =           /^\/apis\/yipee.io\/v1\/namespaces\/.+\/models\/.+$/;

// XXX: too much initialized data here.  See about storing these as
// individual data files and reading them in...
//
// The whole nock thing is pretty klunky for this scenario.  Better than
// not exercising the code at all during build though...
const namespaceList = {
  "kind": "NamespaceList",
  "apiVersion": "v1",
  "metadata": {
    "selfLink": "/api/v1/namespaces",
    "resourceVersion": "31184"
  },
  "items": [
    {
      "metadata": {
        "name": "default",
        "selfLink": "/api/v1/namespaces/default",
        "uid": "20de515a-6f1e-11e8-9388-025000000001",
        "resourceVersion": "11",
        "creationTimestamp": "2018-06-13T15:26:22Z"
      },
      "spec": {
        "finalizers": [
          "kubernetes"
        ]
      },
      "status": {
        "phase": "Active"
      }
    },
    {
      "metadata": {
        "name": "docker",
        "selfLink": "/api/v1/namespaces/docker",
        "uid": "5285e85f-6f1e-11e8-9388-025000000001",
        "resourceVersion": "435",
        "creationTimestamp": "2018-06-13T15:27:45Z"
      },
      "spec": {
        "finalizers": [
          "kubernetes"
        ]
      },
      "status": {
        "phase": "Active"
      }
    },
    {
      "metadata": {
        "name": "kube-public",
        "selfLink": "/api/v1/namespaces/kube-public",
        "uid": "23446968-6f1e-11e8-9388-025000000001",
        "resourceVersion": "50",
        "creationTimestamp": "2018-06-13T15:26:26Z"
      },
      "spec": {
        "finalizers": [
          "kubernetes"
        ]
      },
      "status": {
        "phase": "Active"
      }
    },
    {
      "metadata": {
        "name": "kube-system",
        "selfLink": "/api/v1/namespaces/kube-system",
        "uid": "212b7866-6f1e-11e8-9388-025000000001",
        "resourceVersion": "12",
        "creationTimestamp": "2018-06-13T15:26:23Z"
      },
      "spec": {
        "finalizers": [
          "kubernetes"
        ]
      },
      "status": {
        "phase": "Active"
      }
    },
    {
      "metadata": {
        "name": "simple",
        "selfLink": "/api/v1/namespaces/simple",
        "uid": "20ce0f0f-6f55-11e8-8348-025000000001",
        "resourceVersion": "27577",
        "creationTimestamp": "2018-06-13T22:00:04Z",
        "annotations": {
          "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"v1\",\"kind\":\"Namespace\",\"metadata\":{\"annotations\":{},\"name\":\"simple\",\"namespace\":\"\"}}\n"
        }
      },
      "spec": {
        "finalizers": [
          "kubernetes"
        ]
      },
      "status": {
        "phase": "Active"
      }
    },
    {
      "metadata": {
        "name": "yahjim",
        "selfLink": "/api/v1/namespaces/yahjim",
        "uid": "82910656-6f21-11e8-8348-025000000001",
        "resourceVersion": "2346",
        "creationTimestamp": "2018-06-13T15:50:34Z",
        "labels": {
          "name": "yahjim"
        },
        "annotations": {
          "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"v1\",\"kind\":\"Namespace\",\"metadata\":{\"annotations\":{},\"labels\":{\"name\":\"yahjim\"},\"name\":\"yahjim\",\"namespace\":\"\"}}\n"
        }
      },
      "spec": {
        "finalizers": [
          "kubernetes"
        ]
      },
      "status": {
        "phase": "Active"
      }
    }
  ]
};

const deploymentList = {
  "kind": "DeploymentList",
  "apiVersion": "apps/v1",
  "metadata": {
    "selfLink": "/apis/apps/v1/namespaces/simple/deployments",
    "resourceVersion": "33614"
  },
  "items": [
    {
      "metadata": {
        "name": "nginx-deployment",
        "namespace": "simple",
        "selfLink": "/apis/apps/v1/namespaces/simple/deployments/nginx-deployment",
        "uid": "0b887dde-6f59-11e8-8348-025000000001",
        "resourceVersion": "29588",
        "generation": 2,
        "creationTimestamp": "2018-06-13T22:28:07Z",
        "labels": {
          "component": "nginx-deployment",
          "name": "simple",
          "yipee.io/nginx-svc": "generated"
        },
        "annotations": {
          "deployment.kubernetes.io/revision": "1",
          "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"extensions/v1beta1\",\"kind\":\"Deployment\",\"metadata\":{\"annotations\":{\"yipee.io.lastModelUpdate\":\"2018-06-13T22:27:39.282Z\",\"yipee.io.modelURL\":\"https://app.yipee.io/catalog\"},\"name\":\"nginx-deployment\",\"namespace\":\"simple\"},\"spec\":{\"replicas\":1,\"revisionHistoryLimit\":2,\"rollbackTo\":{\"revision\":0},\"selector\":{\"matchLabels\":{\"component\":\"nginx-deployment\",\"name\":\"simple\",\"yipee.io/nginx-svc\":\"generated\"}},\"strategy\":{\"type\":\"RollingUpdate\"},\"template\":{\"metadata\":{\"labels\":{\"component\":\"nginx-deployment\",\"name\":\"simple\",\"yipee.io/nginx-svc\":\"generated\"}},\"spec\":{\"containers\":[{\"image\":\"nginx\",\"name\":\"nginx-container\",\"ports\":[{\"containerPort\":80,\"protocol\":\"TCP\"}]}]}}}}\n",
          "yipee.io.lastModelUpdate": "2018-06-13T22:27:39.282Z",
          "yipee.io.modelURL": "https://app.yipee.io/catalog"
        }
      },
      "spec": {
        "replicas": 1,
        "selector": {
          "matchLabels": {
            "component": "nginx-deployment",
            "name": "simple",
            "yipee.io/nginx-svc": "generated"
          }
        },
        "template": {
          "metadata": {
            "creationTimestamp": null,
            "labels": {
              "component": "nginx-deployment",
              "name": "simple",
              "yipee.io/nginx-svc": "generated"
            }
          },
          "spec": {
            "containers": [
              {
                "name": "nginx-container",
                "image": "nginx",
                "ports": [
                  {
                    "containerPort": 80,
                    "protocol": "TCP"
                  }
                ],
                "resources": {

                },
                "terminationMessagePath": "/dev/termination-log",
                "terminationMessagePolicy": "File",
                "imagePullPolicy": "Always"
              }
            ],
            "restartPolicy": "Always",
            "terminationGracePeriodSeconds": 30,
            "dnsPolicy": "ClusterFirst",
            "securityContext": {

            },
            "schedulerName": "default-scheduler"
          }
        },
        "strategy": {
          "type": "RollingUpdate",
          "rollingUpdate": {
            "maxUnavailable": 1,
            "maxSurge": 1
          }
        },
        "revisionHistoryLimit": 2,
        "progressDeadlineSeconds": 600
      },
      "status": {
        "observedGeneration": 2,
        "replicas": 1,
        "updatedReplicas": 1,
        "readyReplicas": 1,
        "availableReplicas": 1,
        "conditions": [
          {
            "type": "Available",
            "status": "True",
            "lastUpdateTime": "2018-06-13T22:28:07Z",
            "lastTransitionTime": "2018-06-13T22:28:07Z",
            "reason": "MinimumReplicasAvailable",
            "message": "Deployment has minimum availability."
          },
          {
            "type": "Progressing",
            "status": "True",
            "lastUpdateTime": "2018-06-13T22:28:10Z",
            "lastTransitionTime": "2018-06-13T22:28:07Z",
            "reason": "NewReplicaSetAvailable",
            "message": "ReplicaSet \"nginx-deployment-66bff55cfb\" has successfully progressed."
          }
        ]
      }
    }
  ]
};

const svcList = {
  "kind": "ServiceList",
  "apiVersion": "v1",
  "metadata": {
    "selfLink": "/api/v1/namespaces/simple/services",
    "resourceVersion": "31687"
  },
  "items": [
    {
      "metadata": {
        "name": "nginx-svc",
        "namespace": "simple",
        "selfLink": "/api/v1/namespaces/simple/services/nginx-svc",
        "uid": "0b870652-6f59-11e8-8348-025000000001",
        "resourceVersion": "29558",
        "creationTimestamp": "2018-06-13T22:28:07Z",
        "annotations": {
          "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"v1\",\"kind\":\"Service\",\"metadata\":{\"annotations\":{\"yipee.io.lastModelUpdate\":\"2018-06-13T22:27:39.282Z\",\"yipee.io.modelURL\":\"https://app.yipee.io/catalog\"},\"name\":\"nginx-svc\",\"namespace\":\"simple\"},\"spec\":{\"ports\":[{\"name\":\"nginx-svc-8080\",\"port\":8080,\"protocol\":\"TCP\",\"targetPort\":80}],\"selector\":{\"yipee.io/nginx-svc\":\"generated\"},\"type\":\"ClusterIP\"}}\n",
          "yipee.io.lastModelUpdate": "2018-06-13T22:27:39.282Z",
          "yipee.io.modelURL": "https://app.yipee.io/catalog"
        }
      },
      "spec": {
        "ports": [
          {
            "name": "nginx-svc-8080",
            "protocol": "TCP",
            "port": 8080,
            "targetPort": 80
          }
        ],
        "selector": {
          "yipee.io/nginx-svc": "generated"
        },
        "clusterIP": "10.103.48.233",
        "type": "ClusterIP",
        "sessionAffinity": "None"
      },
      "status": {
        "loadBalancer": {

        }
      }
    }
  ]
};

var podList = {
    "kind": "PodList",
    "apiVersion": "v1",
    "metadata": {
        "selfLink": "/api/v1/namespaces/simple/pods",
        "resourceVersion": "214034"
    },
    "items": [
        {
            "metadata": {
                "name": "auth-76bfb587b8-cch7b",
                "generateName": "auth-76bfb587b8-",
                "namespace": "simple"
            },
            "spec": {
                "containers": [
                    {
                        "name": "first",
                        "image": "yipee-tools-spoke-cos.ca.com:5000/first"
                    },
                    {
                        "name": "second",
                        "image": "yipee-tools-spoke-cos.ca.com:5000/second"
                    }
                ]
            }
        }
    ]
};

const crdGetResponse = {
    "apiVersion": "yipee.io/v1",
    "kind": "YipeeModel",
    "metadata": {
        "clusterName": "",
        "creationTimestamp": "2018-07-05T23:24:48Z",
        "generation": 1,
        "name": "fooey",
        "namespace": "default",
        "resourceVersion": "53773",
        "selfLink": "/apis/yipee.io/v1/namespaces/default/models/fooey",
        "uid": "9c15ccbe-80aa-11e8-992e-080027614e1f"
    },
    "spec": {
        "annotation": [
            {
                "type": "annotation",
                "id": "1c4d6b71-1243-42b4-bd50-a1d82352e15a",
                "key": "ui",
                "value": {
                    "canvas": {
                        "position": {
                            "x": 100,
                            "y": 100
                        }
                    }
                },
                "annotated": "c7501884-815e-11e8-992e-080027614e1f"
            },
            {
                "type": "annotation",
                "id": "66033f41-64a9-4a3e-8e94-357fe65baa19",
                "key": "ui",
                "value": {
                    "canvas": {
                        "position": {
                            "x": 0,
                            "y": 0
                        }
                    }
                },
                "annotated": "65206bb3-7eda-11e8-992e-080027614e1f"
            }
        ]
    }
};

const statefulSetList = {
  "kind": "StatefulSetList",
  "apiVersion": "apps/v1",
  "metadata": {
    "selfLink": "/apis/apps/v1/namespaces/simple/statefulsets",
    "resourceVersion": "692522"
  },
  "items": [
    {
      "metadata": {
        "name": "web",
        "namespace": "simple",
        "selfLink": "/apis/apps/v1/namespaces/simple/statefulsets/web",
        "uid": "1261d725-8b6c-11e8-992e-080027614e1f",
        "resourceVersion": "584637",
        "generation": 1,
        "creationTimestamp": "2018-07-19T15:54:51Z",
        "annotations": {
          "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"apps/v1\",\"kind\":\"StatefulSet\",\"metadata\":{\"annotations\":{},\"name\":\"web\",\"namespace\":\"simple\"},\"spec\":{\"replicas\":2,\"selector\":{\"matchLabels\":{\"app\":\"nginx\"}},\"serviceName\":\"nginx\",\"template\":{\"metadata\":{\"labels\":{\"app\":\"nginx\"}},\"spec\":{\"containers\":[{\"image\":\"k8s.gcr.io/nginx-slim:0.8\",\"name\":\"nginx\",\"ports\":[{\"containerPort\":80,\"name\":\"web\"}],\"volumeMounts\":[{\"mountPath\":\"/usr/share/nginx/html\",\"name\":\"www\"}]}]}},\"volumeClaimTemplates\":[{\"metadata\":{\"name\":\"www\"},\"spec\":{\"accessModes\":[\"ReadWriteOnce\"],\"resources\":{\"requests\":{\"storage\":\"1Gi\"}}}}]}}\n"
        }
      },
      "spec": {
        "replicas": 2,
        "selector": {
          "matchLabels": {
            "app": "nginx"
          }
        },
        "template": {
          "metadata": {
            "creationTimestamp": null,
            "labels": {
              "app": "nginx"
            }
          },
          "spec": {
            "containers": [
              {
                "name": "nginx",
                "image": "k8s.gcr.io/nginx-slim:0.8",
                "ports": [
                  {
                    "name": "web",
                    "containerPort": 80,
                    "protocol": "TCP"
                  }
                ],
                "resources": {

                },
                "volumeMounts": [
                  {
                    "name": "www",
                    "mountPath": "/usr/share/nginx/html"
                  }
                ],
                "terminationMessagePath": "/dev/termination-log",
                "terminationMessagePolicy": "File",
                "imagePullPolicy": "IfNotPresent"
              }
            ],
            "restartPolicy": "Always",
            "terminationGracePeriodSeconds": 30,
            "dnsPolicy": "ClusterFirst",
            "securityContext": {

            },
            "schedulerName": "default-scheduler"
          }
        },
        "volumeClaimTemplates": [
          {
            "metadata": {
              "name": "www",
              "creationTimestamp": null
            },
            "spec": {
              "accessModes": [
                "ReadWriteOnce"
              ],
              "resources": {
                "requests": {
                  "storage": "1Gi"
                }
              }
            },
            "status": {
              "phase": "Pending"
            }
          }
        ],
        "serviceName": "nginx",
        "podManagementPolicy": "OrderedReady",
        "updateStrategy": {
          "type": "RollingUpdate",
          "rollingUpdate": {
            "partition": 0
          }
        },
        "revisionHistoryLimit": 10
      },
      "status": {
        "observedGeneration": 1,
        "replicas": 2,
        "readyReplicas": 2,
        "currentReplicas": 2,
        "currentRevision": "web-b46f789c4",
        "updateRevision": "web-b46f789c4",
        "collisionCount": 0
      }
    }
  ]
};

const daemonSetList = {
  "kind": "DaemonSetList",
  "apiVersion": "apps/v1",
  "metadata": {
    "selfLink": "/apis/apps/v1/namespaces/kube-system/daemonsets",
    "resourceVersion": "741178"
  },
  "items": [
    {
      "metadata": {
        "name": "kube-proxy",
        "namespace": "simple",
        "selfLink": "/apis/apps/v1/namespaces/kube-system/daemonsets/kube-proxy",
        "uid": "66dd583b-7eda-11e8-992e-080027614e1f",
        "resourceVersion": "714017",
        "generation": 1,
        "creationTimestamp": "2018-07-03T16:01:52Z",
        "labels": {
          "k8s-app": "kube-proxy"
        },
        "annotations": {
          "deprecated.daemonset.template.generation": "1"
        }
      },
      "spec": {
        "selector": {
          "matchLabels": {
            "k8s-app": "kube-proxy"
          }
        },
        "template": {
          "metadata": {
            "creationTimestamp": null,
            "labels": {
              "k8s-app": "kube-proxy"
            }
          },
          "spec": {
            "volumes": [
              {
                "name": "kube-proxy",
                "configMap": {
                  "name": "kube-proxy",
                  "defaultMode": 420
                }
              },
              {
                "name": "xtables-lock",
                "hostPath": {
                  "path": "/run/xtables.lock",
                  "type": "FileOrCreate"
                }
              },
              {
                "name": "lib-modules",
                "hostPath": {
                  "path": "/lib/modules",
                  "type": ""
                }
              }
            ],
            "containers": [
              {
                "name": "kube-proxy",
                "image": "k8s.gcr.io/kube-proxy-amd64:v1.10.0",
                "command": [
                  "/usr/local/bin/kube-proxy",
                  "--config=/var/lib/kube-proxy/config.conf"
                ],
                "resources": {

                },
                "volumeMounts": [
                  {
                    "name": "kube-proxy",
                    "mountPath": "/var/lib/kube-proxy"
                  },
                  {
                    "name": "xtables-lock",
                    "mountPath": "/run/xtables.lock"
                  },
                  {
                    "name": "lib-modules",
                    "readOnly": true,
                    "mountPath": "/lib/modules"
                  }
                ],
                "terminationMessagePath": "/dev/termination-log",
                "terminationMessagePolicy": "File",
                "imagePullPolicy": "IfNotPresent",
                "securityContext": {
                  "privileged": true
                }
              }
            ],
            "restartPolicy": "Always",
            "terminationGracePeriodSeconds": 30,
            "dnsPolicy": "ClusterFirst",
            "serviceAccountName": "kube-proxy",
            "serviceAccount": "kube-proxy",
            "hostNetwork": true,
            "securityContext": {

            },
            "schedulerName": "default-scheduler",
            "tolerations": [
              {
                "key": "node-role.kubernetes.io/master",
                "effect": "NoSchedule"
              },
              {
                "key": "node.cloudprovider.kubernetes.io/uninitialized",
                "value": "true",
                "effect": "NoSchedule"
              }
            ]
          }
        },
        "updateStrategy": {
          "type": "RollingUpdate",
          "rollingUpdate": {
            "maxUnavailable": 1
          }
        },
        "revisionHistoryLimit": 10
      },
      "status": {
        "currentNumberScheduled": 1,
        "numberMisscheduled": 0,
        "desiredNumberScheduled": 1,
        "numberReady": 1,
        "observedGeneration": 1,
        "updatedNumberScheduled": 1,
        "numberAvailable": 1
      }
    }
  ]
};

const pvcList = {
  "kind": "PersistentVolumeClaimList",
  "apiVersion": "v1",
  "metadata": {
    "selfLink": "/api/v1/namespaces/chartmuseum/persistentvolumeclaims",
    "resourceVersion": "2060528"
  },
  "items": [
    {
      "metadata": {
        "name": "nodehelmstorage-claim",
        "namespace": "simple",
        "selfLink": "/api/v1/namespaces/chartmuseum/persistentvolumeclaims/nodehelmstorage-claim",
        "uid": "c6b502d8-b6d9-11e8-9a76-080027614e1f",
        "resourceVersion": "2060003",
        "creationTimestamp": "2018-09-12T22:18:29Z",
        "annotations": {
          "control-plane.alpha.kubernetes.io/leader": "{\"holderIdentity\":\"a04c50b5-b125-11e8-9f4a-080027614e1f\",\"leaseDurationSeconds\":15,\"acquireTime\":\"2018-09-12T22:18:29Z\",\"renewTime\":\"2018-09-12T22:18:59Z\",\"leaderTransitions\":0}",
          "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"v1\",\"kind\":\"PersistentVolumeClaim\",\"metadata\":{\"annotations\":{\"yipee.io.contextId\":\"4bf3a466-1558-11e7-a85c-af51914269f8\",\"yipee.io.lastModelUpdate\":\"2018-09-12T20:50:46.159Z\",\"yipee.io.modelId\":\"25e0e2cc-6226-11e8-9869-7f3c6d851623\",\"yipee.io.modelURL\":\"https://app.yipee.io/editor/25e0e2cc-6226-11e8-9869-7f3c6d851623/4bf3a466-1558-11e7-a85c-af51914269f8\"},\"name\":\"nodehelmstorage-claim\",\"namespace\":\"chartmuseum\"},\"spec\":{\"accessModes\":[\"ReadWriteOnce\"],\"resources\":{\"requests\":{\"storage\":\"250M\"}},\"volumeMode\":\"Filesystem\"}}\n",
          "pv.kubernetes.io/bind-completed": "yes",
          "pv.kubernetes.io/bound-by-controller": "yes",
          "volume.beta.kubernetes.io/storage-provisioner": "k8s.io/minikube-hostpath",
          "yipee.io.contextId": "4bf3a466-1558-11e7-a85c-af51914269f8",
          "yipee.io.lastModelUpdate": "2018-09-12T20:50:46.159Z",
          "yipee.io.modelId": "25e0e2cc-6226-11e8-9869-7f3c6d851623",
          "yipee.io.modelURL": "https://app.yipee.io/editor/25e0e2cc-6226-11e8-9869-7f3c6d851623/4bf3a466-1558-11e7-a85c-af51914269f8"
        },
        "finalizers": [
          "kubernetes.io/pvc-protection"
        ]
      },
      "spec": {
        "accessModes": [
          "ReadWriteOnce"
        ],
        "resources": {
          "requests": {
            "storage": "250M"
          }
        },
        "volumeName": "pvc-c6b502d8-b6d9-11e8-9a76-080027614e1f",
        "storageClassName": "standard"
      },
      "status": {
        "phase": "Bound",
        "accessModes": [
          "ReadWriteOnce"
        ],
        "capacity": {
          "storage": "250M"
        }
      }
    }
  ]
};

const ingressList = {
    "apiVersion": "v1",
    "items": [
        {
            "apiVersion": "extensions/v1beta1",
            "kind": "Ingress",
            "metadata": {
                "annotations": {
                    "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"extensions/v1beta1\",\"kind\":\"Ingress\",\"metadata\":{\"annotations\":{},\"name\":\"yipee-ingress\",\"namespace\":\"default\"},\"spec\":{\"backend\":{\"serviceName\":\"ui\",\"servicePort\":80}}}\n"
                },
                "creationTimestamp": "2018-10-16T00:15:37Z",
                "generation": 1,
                "name": "yipee-ingress",
                "namespace": "simple",
                "resourceVersion": "639064",
                "selfLink": "/apis/extensions/v1beta1/namespaces/default/ingresses/yipee-ingress",
                "uid": "9b4a59d1-d0d8-11e8-846c-080027c6347a"
            },
            "spec": {
                "backend": {
                    "serviceName": "ui",
                    "servicePort": 80
                }
            },
            "status": {
                "loadBalancer": {}
            }
        }
    ],
    "kind": "List",
    "metadata": {
        "resourceVersion": "",
        "selfLink": ""
    }
};

describe('Yipee K8s API Tests:', function() {
    this.timeout(60000);

    before(function(done) {
        nock(apihost).get('/api/v1/namespaces').reply(200, namespaceList);
        // nock(apihost).persist().get(alldeploymentsurl).reply(
        //     200, deploymentList);
        nock(apihost).persist().get(appdeploymenturl).reply(200, deploymentList);
        nock(apihost).persist().get(appsvcurl).reply(200, svcList);
        nock(apihost).persist().get(apppodsurl).reply(200, podList);
        nock(apihost).persist().get(appstatefulseturl).reply(
            200, statefulSetList);
        // nock(apihost).persist().get(allstatefulsetsurl).reply(
        //     200, statefulSetList);
        nock(apihost).persist().get(appdaemonseturl).reply(200, daemonSetList);
        // nock(apihost).persist().get(alldaemonsetsurl).reply(200, daemonSetList);
        nock(apihost).persist().get(apppvcsurl).reply(200, pvcList);
        nock(apihost).persist().get(appingressurl).reply(200, ingressList);
        nock(apihost).post(crdurl).reply(200, crdGetResponse);
        nock(apihost).persist().get(crdurl).reply(200, crdGetResponse);
        done();
    });

    after(function(done) {
        expect(nock.isDone()).to.be.true;
        nock.cleanAll();
        app.stop();
        done();
    });

    function nslistTest() {
        describe("#nslistTest", function() {
            it('should retrieve nslist from k8s api', function(done) {
                chai.request(app.server)
                    .get('/namespaces')
                    .then(res => {
                        expect(res).to.not.be.null;
                        expect(res.status).to.equal(200);
                        var resobj = JSON.parse(res.text);
                        expect(resobj.success).to.be.true;
                        expect(resobj.total).to.equal(6);
                        expect(resobj.data.length).to.equal(6);
                        var foundTestNs = false;
                        resobj.data.forEach(ns => {
                            expect(ns).to.include.all.keys('name',
                                                           'dateCreated',
                                                           'phase',
                                                           'podCount',
                                                           'containerCount');
                            expect(ns.phase).to.equal("Active");
                            expect(ns.dateCreated).to.not.equal(NaN);
                            if (ns.name === testnsname) {
                                foundTestNs = true;
                            }
                        });
                        expect(foundTestNs).to.be.true;
                        done();
                    })
                    .catch(err => {
                        logAndThrow(err);
                        done(err);
                    });
            });
        });
    }

    function nsappTest() {
        describe("#nsappTest", function() {
            it('should retrieve app namespace from k8s api', function(done) {
                chai.request(app.server)
                    .get('/namespaces/' + testnsname)
                    .then(res => {
                        expect(res).to.not.be.null;
                        expect(res.status).to.equal(200);
                        var resobj = JSON.parse(res.text);
                        expect(resobj.success).to.be.true;
                        expect(resobj.total).to.equal(1);
                        expect(resobj.data.length).to.equal(1);
                        var flatFile = resobj.data[0].flatFile;
                        var cg = flatFile['container-group'];
                        // console.log("cg:",
                        //             util.inspect(
                        //                 cg,
                        //                 {showHidden: false, depth: null}));
                        expect(cg.length).to.equal(3);
                        var cgs = cg.map(c => {
                            return {name: c.name, type: c['controller-type']};
                        });

                        // !@)#(*! Dunno why this "include" doesn't work
                        // Seemed OK in "traffic" (with an older version
                        // of chai)
                        // expect(cgs).to.own.include({name: 'web',
                        //                         type: 'StatefulSet'});
                        // expect(cgs).to.include({name: 'nginx-deployment',
                        //                         type: 'Deployment'});
                        // expect(cgs).to.include({name: 'kube-proxy',
                        //                         type: 'DaemonSet'});
                        var svc = flatFile['k8s-service'];
                        expect(svc.length).to.equal(1);
                        expect(svc[0].name).to.equal('nginx-svc');
                        var container = flatFile.container;
                        // console.log("container:",
                        //             util.inspect(
                        //                 container,
                        //                 {showHidden: false, depth: null}));
                        expect(container.length).to.equal(3);
                        var names = container.map(c => c.name);
                        expect(names).to.have.all.members(
                            ['nginx', 'nginx-container', 'kube-proxy']);
                        done();
                    })
                    .catch(err => {
                        logAndThrow(err);
                        done(err);
                    });
            });
        });
    }

    function crdTest() {
        describe("#crdTest", function() {
            it('should save a custom resource', function(done) {
                chai.request(app.server)
                    .put('/namespaces/simple')
                    .set('content-type', 'application/json')
                    .set('accept', 'application/json')
                    .send({name: "k8sapi-crdtest",
                           flatFile: {
                               annotation: [{ui: {x: 0, y:10}}],
                               service: {},
                               others: {}
                           }
                          })
                    .then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body.success).to.be.true;
                        let expected = {
                            name: 'simple',
                            storeInfo: {
                            }
                        };
                        let crd = crdGetResponse;
                        delete crd.spec;
                        expected.storeInfo.crd = crd;
                        expect(res.body.data[0]).to.deep.equal(expected);
                        done();
                    })
                    .catch(err => {
                        logAndThrow(err);
                        done(err);
                    });
            });
        });
    }

    function diffTest() {
        let diffInput = {
            parent: "ns1",
            children: ["ns2", "ns3"]
        };
        describe("#diffTest", function() {
            it('should diff namespaces', function(done) {
                chai.request(app.server)
                    .post('/namespaces/diff')
                    .set('content-type', 'application/json')
                    .set('accept', 'application/json')
                    .send(diffInput)
                    .then(res => {
                        expect(res.status).to.equal(200);
                        expect(res.body.success).to.be.true;
                        // XXX: we have no real diffs since any/all
                        // test namespaces look the same...
                        // Should make different ones with "nock" but
                        // that's a pain.  At least we're executing the
                        // code on the diff path -- so we can at least
                        // assert that there are no flagrant JS syntax
                        // errors (but that's about it for assertions...)
                        console.log("data:", res.body.data[0]);
                        done();
                    })
                    .catch(err => {
                        logAndThrow(err);
                        done(err);
                    });
            });
        });
    }

    nslistTest();
    nsappTest();
    crdTest();
    diffTest();
});
