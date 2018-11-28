const Env = require('../environment');
const baselogger = require('./logger');
const errorObject = baselogger.errorObject;
const logger = baselogger.getOrCreateLogger('cvthelper');
const Http = require('./http');
const k8s = require('./k8sapi');

function getAppName(yipee) {
    if (yipee.yipeeFile &&
        yipee.yipeeFile['app-info'] &&
        yipee.yipeeFile['app-info'].name &&
        // the compose converter (old or new) gives this for imports
        yipee.yipeeFile['app-info'].name != "[insert app name here]" &&
        // the k8s converter gives this for imports
        yipee.yipeeFile['app-info'].name != "unknown") {
        return yipee.yipeeFile['app-info'].name;
    } else if (yipee.name) {
        return yipee.name;
    } else {
        return "ENOTFOUND";
    }
}
module.exports.getAppName = getAppName;

function getGenerationDate() {
    return new Date().toISOString();
}
module.exports.getGenerationDate = getGenerationDate;

function addAnnotationInfo(flatFile, genTime) {
    flatFile['model-annotations'] = [{'type': 'model-annotations'}];
    flatFile['model-annotations'][0]['yipee.generatedAt'] = genTime;
}

function makeCommentedDownload(yipee, payload, genTime) {
    return "# Generated " + genTime + " by Yipee editor\n" +
        "# Application: " + getAppName(yipee) + "\n\n" +
        payload;
}

module.exports.addAnnotationInfo = addAnnotationInfo;
module.exports.makeCommentedDownload = makeCommentedDownload;

function doConversion(inputdata, url, path) {
    let headers = {'Content-Type': 'text/plain'};
    let options = Object.assign({}, {method: 'POST',
                                     path: path,
                                     headers: headers},
                                Http.hostPortFromUrl(url));
    options.headers['Content-Length'] = Buffer.byteLength(inputdata);
    return new Promise((resolve, reject) => {
        Http.request(options, inputdata)
            .then(res => {
                if (res.rc < 300) {
                    resolve({converted: res.body});
                } else {
                    resolve({error: res.body});
                }
            })
            .catch(err => {
                resolve({error: err});
            });
    });
}

function chooseImportError(composeErrs, k8sErrs, k8sbundleErrs) {
    let retval = "Input can't be processed.  " +
        "It must be a parseable YAML file or a " +
        "compressed tar (.tgz, .tar.gz) of parseable YAML files";
    if (!composeErrs.includes("Invalid compose file:")) {
        retval = composeErrs;
    } else if (!k8sErrs.includes("missing kind -- can't validate") &&
               !k8sErrs.includes("invalid yaml")) {
        retval = k8sErrs;
    } else if (!k8sbundleErrs.includes("invalid tar input")) {
        retval = k8sbundleErrs;
    }
    return retval;
}

function tryAllImports(inputdata) {
    return new Promise((resolve, reject) => {
        let cvtsrc = typeof inputdata === 'string' ? inputdata:
            JSON.stringify(inputdata);
        let k8s = doConversion(cvtsrc, Env.cvtEndpointURL, '/k2f');
        let k8sbundle = doConversion(cvtsrc, Env.cvtEndpointURL, '/kbundle2f');
        let compose = doConversion(cvtsrc, Env.cvtEndpointURL, '/c2f');
        Promise.all([compose, k8s, k8sbundle])
            .then(results => {
                let idx = results.findIndex(e => e.hasOwnProperty('converted'));
                if (idx !== -1) {
                    resolve(results[idx].converted);
                } else {
                    let [c,k,kb] = results.map(e => e.error);
                    logger.warn({compose: c, k8s: k, bundle: kb},
                                "Rejected import");
                    reject(new Error(chooseImportError(c,k,kb)));
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}
module.exports.tryAllImports = tryAllImports;

function promiseConvert(data, endpoint) {
    let cvtsrc = typeof data === 'string' ? data : JSON.stringify(data);
    return new Promise((resolve, reject) => {
        doConversion(cvtsrc, Env.cvtEndpointURL, endpoint)
            .then(result => {
                if (result.hasOwnProperty('converted')) {
                    resolve(result.converted);
                } else if (result.hasOwnProperty('error')) {
                    reject(new Error(result.error));
                } else {
                    logger.warn({result: result}, "convert botch");
                    reject(new Error("convert botch"));
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

function makeDiffObject(inobj) {
    if (!(typeof inobj === 'object') || !(inobj.hasOwnProperty('name'))) {
        return Promise.reject(new Error("each diff object must have a " +
                                        "'name' property"));
    }
    let inputType = typeof inobj.data;
    return new Promise((resolve, reject) => {
        if (inputType === 'object') {
            // assume this is flat-format and turn it to yaml
            flatToK8s(inobj.data)
                .then(yaml => {
                    resolve({name: inobj.name,
                             yaml: yaml});
                })
                .catch(err => {
                    reject(err);
                });
        } else if (inputType === 'string') {
            // assume it's already yaml and we're good to go
            resolve({name: inobj.name,
                     yaml: inobj.data});
        } else if (inputType === 'undefined') {
            // assume that 'name' denotes a k8s namespace
            k8s.makeImport(inobj.name)
                .then(yaml => {
                    resolve({name: inobj.name,
                             yaml: yaml});
                })
                .catch(err => {
                    reject(err);
                });
        } else {
            // neither flat nor yaml -- input error
            reject(new Error(`${inobj.name} is ${inputType}.` +
                             "Must be either object (flat-format) or " +
                             "string (yaml)"));
        }
    });
}

function prepareDiffInput(body) {
    return new Promise((resolve, reject) => {
        let retval = {};
        if (!(typeof body) === 'object') {
            retval.err = new Error("invalid diff input -- not an object");
            resolve(retval);
        } else if (!(body.hasOwnProperty("parent") &&
                     body.hasOwnProperty("children") &&
                     Array.isArray(body.children))) {
            retval.err = new Error("invalid diff input -- " +
                                   "must have 'parent' and " +
                                   "'children' properties");
            resolve(retval);
        } else {
            let childPromises = body.children.map(c => makeDiffObject(c));
            Promise.all([makeDiffObject(body.parent), ...childPromises])
                .then(inputs => {
                    retval.diffobj = {
                        parent: inputs.shift(),
                        children: inputs
                    };
                    resolve(retval);
                })
                .catch(err => {
                    retval.err = err;
                    resolve(retval);
                });
        }
    });
}
module.exports.prepareDiffInput = prepareDiffInput;

function k8sToFlat(k8sdata) {
    return promiseConvert(k8sdata, '/k2f');
}
module.exports.k8sToFlat = k8sToFlat;

function flatToK8s(flatdata) {
    return promiseConvert(flatdata, '/f2k');
}
module.exports.flatToK8s = flatToK8s;

function flatToK8sBundle(flatdata) {
    return promiseConvert(flatdata, '/f2kbundle');
}
module.exports.flatToK8sBundle = flatToK8sBundle;

function flatToHelmBundle(flatdata) {
    return promiseConvert(flatdata, '/f2hbundle');
}
module.exports.flatToHelmBundle = flatToHelmBundle;

function diff(diffobj) {
    return promiseConvert(diffobj, '/m2d');
}
module.exports.diff = diff;
