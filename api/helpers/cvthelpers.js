var Env = require('../environment');
var baselogger = require('./logger');
var errorObject = baselogger.errorObject;
var logger = baselogger.getOrCreateLogger('cvthelper');
const Http = require('./http');

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

function addAnnotationInfo(flatFile) {
    let nowstr = getGenerationDate();
    flatFile['model-annotations'] = [{'type': 'model-annotations'}];
    flatFile['model-annotations'][0]['yipee.io.generatedAt'] = nowstr;
}

function makeCommentedDownload(yipee, payload) {
    let nowstr = getGenerationDate();
    return "# Generated " + nowstr + " by Yipee editor\n" +
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
