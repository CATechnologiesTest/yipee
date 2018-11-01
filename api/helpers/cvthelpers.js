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

function generateDateStrings(yipee) {
    var nowstr = new Date().toISOString();
    var modstr;
    if (typeof yipee.dateModified === 'string') {
        // DB timestamps come out as strings, but they're not formatted
        // the same as the nodejs toISOString that we're using
        // for "generated time".   So we do this for consistency...
        try {
            modstr = new Date(yipee.dateModified).toISOString();
        } catch (ignore) {
            modstr = 'N/A';
        }
    } else if (yipee.fromNerdCvt) {
        modstr = nowstr;
    } else {
        modstr = 'N/A';
    }

    return [nowstr, modstr];
}

function splitURL(url) {
    if (url == null || url == undefined || url == '') {
        return ['app.yipee.io', '00000000-0000-0000-0000-000000000000',
                '00000000-0000-0000-0000-000000000000'];
    }

    var host, id, org;
    [_, _, host, _, _, _, id, _, org] = url.split(/([:][/][/])|[/]/);
    return [host, id, org];
}

function addAnnotationInfo(yipee, url, isFlat) {
    yipeeFile = yipee.yipeeFile;
    // Add k8s annotations
    var modstr;
    [_, modstr] = generateDateStrings(yipee);

    [host, id, org] = splitURL(url);
    if (isFlat) {
        yipeeFile['model-annotations'] = [{'type': 'model-annotations'}];
        yipeeFile['model-annotations'][0]['yipee.io.lastModelUpdate'] = modstr;
        yipeeFile['model-annotations'][0]['yipee.io.modelId'] = id;
        yipeeFile['model-annotations'][0]['yipee.io.contextId'] = org;
        yipeeFile['model-annotations'][0]['yipee.io.modelURL'] = url;
    } else {
        yipeeFile['model-annotations'] = {};
        yipeeFile['model-annotations']['yipee.io.lastModelUpdate'] = modstr;
        yipeeFile['model-annotations']['yipee.io.modelId'] = id;
        yipeeFile['model-annotations']['yipee.io.contextId'] = org;
        yipeeFile['model-annotations']['yipee.io.modelURL'] = url;
    }
}

function makeCommentedDownload(yipee, payload) {
    var nowstr, modstr;
    [nowstr, modstr] = generateDateStrings(yipee);
    return "# Generated " + nowstr + " by Yipee.io\n" +
        "# Application: " + getAppName(yipee) + "\n" +
        "# Last Modified: " + modstr + "\n" +
        // XXX: don't include URL until the app supports it...
        // "# URL: https://app.yipee.io/main/editor/" + yipee._id + "\n" +
        "\n" +
        payload;
}

module.exports.addAnnotationInfo = addAnnotationInfo;
module.exports.generateDateStrings = generateDateStrings;
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
