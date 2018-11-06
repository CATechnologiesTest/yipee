# k10eh - Graphical Kubernetes Editing
Working with Kubernetes doesn't _necessarily_ imply spending quality
time with YAML. For the last couple of years, Yipee.io has provided
SaaS-based graphical Kubernetes modeling at `https://app.yipee.io` and
many people have taken advantage of this to avoid "YAML Hell".
Throughout the development of the SaaS application, however, we heard
from a sizeable segment of our users that they would like to have an
on-premise, preferably open source, version of our tool. Well, here it
is...

## What does it do?
This repository contains the pure Kubernetes editing functionality
from the original Yipee.io application but drops the SaaS-related
parts. So, there are no teams, no model storage, and no authentication
or authorization. Instead, you can simply point the application at a
YAML file and edit your model graphically before saving it back out.

## What does a model look like?
Here is a simple Joomla model:

![](sample-joomla-model.png)

It should be easy to understand the big picture.

The YAML for this model is:

``` yaml
apiVersion: v1
kind: Service
metadata:
  name: joomla
spec:
  selector:
    name: joomla-kubernetes
    component: joomla
  ports:
  - port: 80
    targetPort: 80
    name: joomla-80
    protocol: TCP
  - port: 443
    targetPort: 443
    name: joomla-443
    protocol: TCP
  type: ClusterIP

---
apiVersion: v1
kind: Service
metadata:
  name: mariadb
  selector:
    name: joomla-kubernetes
    component: mariadb
  ports:
  - port: 3306
    targetPort: 3306
    name: mariadb-3306
    protocol: TCP
  type: ClusterIP

---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: joomla
spec:
  selector:
    matchLabels:
      name: joomla-kubernetes
      component: joomla
  template:
    spec:
      imagePullSecrets: []
      containers:
      - volumeMounts:
        - mountPath: /bitnami/joomla
          name: joomla-data
        - mountPath: /bitnami/php
          name: php-data
        - mountPath: /bitnami/apache
          name: apache-data
        name: joomla
        env:
        - name: JOOMLA_EMAIL
          value: user@example.com
        - name: JOOMLA_PASSWORD
          valueFrom:
            configMapKeyRef:
              key: JOOM_PASSWORD
              name: joomlaconfig
        - name: JOOMLA_USERNAME
          value: root
        - name: MARIADB_HOST
          value: mariadb2
        - name: MARIADB_PASSWORD
          valueFrom:
            configMapKeyRef:
              key: MARIA_PASSWORD
              name: joomlaconfig
        - name: MARIADB_PORT
          value: '4306'
        ports:
        - containerPort: 80
          protocol: TCP
        - containerPort: 1776
          protocol: TCP
        - containerPort: 443
          protocol: TCP
        image: bitnami/joomla:latest
      volumes:
      - name: php-data
        persistentVolumeClaim:
          claimName: php-data-claim
      - name: apache-data
        persistentVolumeClaim:
          claimName: apache-data-claim
      - name: joomla-data
        persistentVolumeClaim:
          claimName: joomla-data-claim
      restartPolicy: Always
    metadata:
      labels:
        name: joomla-kubernetes
        component: joomla
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  replicas: 1
  revisionHistoryLimit: 2

---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: mariadb
spec:
  selector:
    matchLabels:
      name: joomla-kubernetes
      component: mariadb
  template:
    spec:
      imagePullSecrets: []
      containers:
      - volumeMounts:
        - mountPath: /bitnami/mariadb
          name: mariadb-data
        name: mariadb
        env:
        - name: ALLOW_EMPTY_PASSWORD
          value: 'yes'
        - name: MARIADB_PORT
          value: '3306'
        - name: MARIADB_ROOT_PASSWORD
          valueFrom:
            configMapKeyRef:
              key: MARIA_PASS
              name: joomlaconfig
        ports:
        - containerPort: 3306
          protocol: TCP
        image: bitnami/mariadb:10.1.26-r2
      volumes:
      - name: mariadb-data
        persistentVolumeClaim:
          claimName: mariadb-data-claim
      restartPolicy: Always
    metadata:
      labels:
        name: joomla-kubernetes
        component: mariadb
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  replicas: 1
  revisionHistoryLimit: 2

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: apache-data-claim
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 2G
  volumeMode: Filesystem

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: php-data-claim
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 2G
  volumeMode: Filesystem

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: joomla-data-claim
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 2G
  volumeMode: Filesystem

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mariadb-data-claim
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 2G
  volumeMode: Filesystem
```

## What about Docker Compose?
The editor can import Docker Compose files. They will be turned into
Kubernetes models on import. There is no support for going in the
other direction. The Compose support is provided to help in migrating
to Kubernetes.

## Where do we go from here?
That's partly up to you! Yipee is open source now and we welcome
collaborators and contributors. If you have an idea or opinion as to
future directions, we're listening.

# Installation
The yipee editor is ready to run as a kubernetes application.  Public
images built from the master branch of this repo are available in
dockerhub.  The _yipee.yaml_ file in this repo defines the kubernetes
objects needed to deploy the app.

Running in a local minikube should be as simple as:

```
kubectl apply -f yipee.yaml
minikube service yipee-ui
```

To deploy in a cloud-based cluster, you will want to change the type of
the _yipee-ui_ service definition from _NodePort_ to _LoadBalancer_
(or create an ingress).

# Build from Source
## Prerequisites
- docker
- bash
## Building Images
You can build images from source by running _build.sh_ at the top of
the repo.  By default this will produce three images:
- yipee-converter
- yipee-api
- yipee-ui

## Run with Locally Built Images
- push the images to your kubernetes cluster
- modify _yipee.yaml_ to reference those images
- apply the modified yipee.yaml
