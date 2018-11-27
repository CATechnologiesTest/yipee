const Express = require('express');
const fs = require('fs');
const Router = Express.Router();
const baselogger = require('../helpers/logger');
const Logger = baselogger.createLogger("namespaces");
const errorObject = baselogger.errorObject;
const k8s = require('../helpers/k8sapi');
const Util = require('./routeUtils');
const cvtHelpers = require('../helpers/cvthelpers');
const Env = require('../environment');
const Store = require('../helpers/storage').getStorageHelper();
const Kubectl = require('../helpers/kubectl');

Router.get('/', function(req, resp) {
    k8s.getNamespaces()
        .then(nslist => {
            var response = nslist; // XXX
            resp.json(Util.generateSuccessResponse(response));
        })
        .catch(err => {
            Logger.error({error: errorObject(err)}, "getNamespaces");
            resp.status(500).json(Util.generateErrorResponse(err, req));
        });
});

Router.get('/:nsname', function(req, resp) {
    var nsname = req.params.nsname;
    Promise.all([k8s.namespaceNameToFlatFormat(nsname),
                 Store.fetch(nsname)])
        .then(parts => {
            let flatFile = parts[0];
            let stored = parts[1];
            if (stored) {
                flatFile.annotation = stored.annos;
                delete stored.annos;
            }
            let nsobj = {
                name: nsname,
                isPrivate: true,
                author: 'unknown',
                storeInfo: stored,
                flatFile: flatFile
            };
            resp.json(Util.generateSuccessResponse(nsobj));
        })
        .catch(err => {
            console.log("route error:", err);
            Logger.error({error: errorObject(err),
                          nsname: req.params.nsname}, "getNamespace");
            resp.status(500).json(Util.generateErrorResponse(err, req));
        });
});

// Not ReST (tm)  since the stored entity may or may not exist.  Whatever.
// We should change the endpoint to /:nsname/savelayout or something
// but that will need a corresponding UI change...
Router.put('/:nsname', function (req, resp) {
    let nsname = req.params.nsname;
    Store.save(nsname, req.body)
        .then(storeInfo => {
            resp.json(Util.generateSuccessResponse(
                {name: nsname, storeInfo: storeInfo}));
        })
        .catch(err => {
            Logger.error({error: errorObject(err),
                          nsname: req.params.nsname}, "saveNamespace");
            resp.status(500).json(Util.generateErrorResponse(err, req));
        });
});

function shouldCreateNamespace(req) {
    return req.query && req.query.createNamespace &&
        req.query.createNamespace.toLowerCase() === 'true';
}

// apply
Router.post('/apply/:nsname', function (req, resp) {
    let nsname = req.params.nsname;
    let flatFile = req.body.flatFile;
    let createNamespace = shouldCreateNamespace(req);
    let deployYaml;
    cvtHelpers.flatToK8s(flatFile)
        .then(kyaml => {
            deployYaml = kyaml;
            if (createNamespace) {
                return Kubectl.createNamespace(nsname);
            } else {
                return true;
            }
        })
        .then(() => {
            return Kubectl.doApply(nsname, deployYaml);
        })
        .then(() => {
            resp.json(Util.generateSuccessResponse("applied successfully"));
        })
        .catch(err => {
            Logger.error({error: errorObject(err),
                          nsname: nsname}, "apply");
            resp.status(500).json(Util.generateErrorResponse(err, req));
        });
});

// LEAVING THIS IN FOR NOW... Allows experimenting with status via a simple page
Router.get('/:nsname/client', function(req, resp) {
    resp.setHeader('Content-Type', 'text/html');
    fs.createReadStream(__dirname + '/../index.html').pipe(resp);
});

function doDownload(req, resp, cvtfun, respkey, withComment) {
    let nsname = req.params.nsname;
    let genTime = cvtHelpers.getGenerationDate();

    k8s.makeImport(nsname)
        .then(impstring => {
            return cvtHelpers.k8sToFlat(impstring);
        })
        .then(flatfile => {
            let flatObj = JSON.parse(flatfile);
            cvtHelpers.addAnnotationInfo(flatObj, genTime);
            return cvtfun(flatObj);
        })
        .then(k8sFile => {
            let respobj = {name: nsname, version: 0};
            respobj[respkey] = k8sFile;
            if (withComment) {
                respobj[respkey] = cvtHelpers.makeCommentedDownload(
                    {name: nsname}, k8sFile, genTime);
            }
            resp.json(Util.generateSuccessResponse(respobj));
        })
        .catch(err => {
            console.log("download error:", err);
            Logger.error({error: errorObject(err),
                          nsname: nsname,
                          type: req.params.dltype}, "download");
            resp.status(500).json(Util.generateErrorResponse(err, req));
        });
}

Router.get('/:nsname/kubernetes', function(req, resp) {
    doDownload(req, resp, cvtHelpers.flatToK8s, 'kubernetesFile', true);
});

Router.get('/:nsname/k8sbundle', function(req, resp) {
    doDownload(req, resp, cvtHelpers.flatToK8sBundle, 'kubernetesFile');
});

Router.get('/:nsname/helm', function(req, resp) {
    doDownload(req, resp, cvtHelpers.flatToHelmBundle, 'helmFile');
});

// XXX: we'll want to remove this and teach the app to use /import
// instead of /namespaces/import.  For now leave it in so we can work
// with the "old" korn-dashboard app...
// Import
Router.post('/import', function(req, resp) {
    let yipeeobj = req.body;
    cvtHelpers.tryAllImports(yipeeobj.importFile)
        .then(flatfile => {
            delete yipeeobj.importFile;
            yipeeobj.flatFile = JSON.parse(flatfile);
            resp.json(Util.generateSuccessResponse(yipeeobj));
        })
        .catch(err => {
            Logger.error({error: errorObject(err),
                          yipeeobj: yipeeobj}, "import");
            resp.status(400).json(Util.generateErrorResponse(err, req));
        });
});
// End XXX

Router.post('/diff', function(req, resp) {
    let nsSpec = req.body;
    let cvtObj = {
        parent: {
            name: nsSpec.parent
        },
        children: []
    };
    let models = [k8s.makeImport(nsSpec.parent)];
    nsSpec.children.forEach((child, idx) => {
        cvtObj.children.push({name: child});
        models.push(k8s.makeImport(child));
    });
    Promise.all(models)
        .then(yamls => {
            cvtObj.parent.yaml = yamls.shift();
            yamls.forEach((yaml, idx) => {
                cvtObj.children[idx].yaml = yaml;
            });
            return cvtHelpers.diff(cvtObj);
        })
        .then(diffs => {
            // diffs are a single newline-separated string -- just return it
            resp.json(Util.generateSuccessResponse(diffs));
        })
        .catch(err => {
            Logger.error({error: errorObject(err),
                          nsSpec: nsSpec}, "diff");
            resp.status(500).json(Util.generateErrorResponse(err, req));
        });

});

module.exports = Router;
