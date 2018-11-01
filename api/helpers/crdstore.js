

const k8s = require('./k8sapi');

function doInit() {
    // XXX: make sure our CRD is defined.
    // do a "list" query or something...
    //
    // For now, we're gonna just assume that CRD, serviceaccount and
    // perms are already set up.
}

function makeUrl(nsname) {
    return `/apis/yipee.io/v1/namespaces/default/models/${nsname}`;
}

function makeCustomResource(nsname, flatobj) {
    let crObj = {
        apiVersion: "yipee.io/v1",
        kind: "YipeeModel",
        metadata: {
            name: nsname
            // namespace: nsname
        },
        spec: {
            annotation: flatobj.annotation
        }
    };
    return crObj;
}

function doSave(nsname, yipeeobj) {
    let flatFile = yipeeobj.flatFile;
    let storeobj = makeCustomResource(nsname, flatFile);
    let verb = 'POST';
    let storeInfo = yipeeobj.storeInfo;
    if (yipeeobj.storeInfo) {
        storeobj = yipeeobj.storeInfo.crd;
        storeobj.spec = {
            annotation: flatFile.annotation
        }
        // Note that PUT can yield 409 optimistic lock.  PATCH
        // is also an option (last writer wins)
        verb = 'PUT';
    }
    let payload = JSON.stringify(storeobj);
    let url = makeUrl(nsname);
    let headers = {
        'Authorization': 'Bearer ' + k8s.token,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
    };
    return new Promise((resolve, reject) => {

        k8s.doHttpOp({method: verb, path: url, headers: headers}, payload)
            .then(crdobj => {
                delete crdobj.spec;
                resolve({crd: crdobj});
            })
            .catch(err => {
                reject(err);
            });
    });
}

function doFetch(nsname) {
    let url = makeUrl(nsname);
    return new Promise((resolve, reject) => {
        k8s.doHttpOp({method: 'GET', path: url})
            .then(res => {
                let crdobj = res;
                let annos = res.spec.annotation;
                delete crdobj.spec;
                resolve({crd: crdobj, annos: annos});
            })
            .catch(err => {
                if (err.status === 404) {
                    resolve(null);
                } else {
                    reject(err);
                }
            });
    });
}

module.exports = {
    save: doSave,
    fetch: doFetch
};
