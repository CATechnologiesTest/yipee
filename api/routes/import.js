const Express = require('express');
const Router = Express.Router();
const Util = require('./routeUtils');
const baselogger = require('../helpers/logger');
const errorObject = baselogger.errorObject;
const Logger = baselogger.createLogger("import");
const cvtHelpers = require('../helpers/cvthelpers');
const Env = require('../environment.js');
const Cache = require('../helpers/importCache');

function doImport(yipeeobj) {
    return new Promise((resolve, reject) => {
        cvtHelpers.tryAllImports(yipeeobj.importFile)
            .then(flatfile => {
                resolve(flatfile);
            })
            .catch(err => {
                reject(err);
            });
    });
};

Router.post('/', function(req, resp) {
    let yipeeobj = req.body;
    let retobj = {
        name: yipeeobj.name
    };
    doImport(yipeeobj)
        .then(flatfile => {
            if (Util.hasQueryParam(req, 'store', 'true')) {
                let yipeeguid = Cache.stashFlatFile(flatfile);
                if (yipeeguid) {
                    retobj.guid = yipeeguid;
                    resp.json(Util.generateSuccessResponse(retobj));
                } else {
                    let err = new Error("pending imports exceeds maximum");
                    resp.status(409).json(Util.generateErrorResponse(err));
                }
            } else {
                retobj.flatFile = JSON.parse(flatfile);
                resp.json(Util.generateSuccessResponse(retobj));
            }
        })
        .catch(err => {
            Logger.error({error: errorObject(err),
                          yipeeobj: yipeeobj}, "import");
            resp.status(400).json(Util.generateErrorResponse(err));
        });
});

Router.get('/:_id', function(req, resp) {
    let id = req.params._id;
    let flatfile = Cache.retrieveFlatFile(id);
    if (flatfile) {
        let retobj = {
            flatFile: JSON.parse(flatfile)
        };
        resp.json(Util.generateSuccessResponse(retobj));
    } else {
        let err = new Error("No model for uuid: " + id);
        resp.status(404).json(Util.generateErrorResponse(err));
    }
});

module.exports = Router;
