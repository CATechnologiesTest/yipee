const Express = require('express');
const Router = Express.Router();
const Util = require('./routeUtils');
const baselogger = require('../helpers/logger');
const errorObject = baselogger.errorObject;
const Logger = baselogger.createLogger("convertAPI");
const cvtHelpers = require('../helpers/cvthelpers');
const modelStore = require('../helpers/modelstore');

Router.post('/', function(req, resp) {
    let yipeeobj = req.body;
    let retobj = {
        name: yipeeobj.name
    };
    doImport(yipeeobj)
        .then(flatfile => {
            if (req.param('store') == 'true') {
                let yipeeguid = modelStore.stashModel(flatfile);
                retobj.guid = yipeeguid;
                resp.json(Util.generateSuccessResponse(retobj));
            } else {
                retobj.flatFile = JSON.parse(flatfile);
                resp.json(Util.generateSuccessResponse(retobj));
            }
        })
        .catch(err => {
            Logger.error({error: errorObject(err),
                          yipeeobj: yipeeobj}, "import");
            resp.status(400).json(Util.generateErrorResponse(err, req));
        });
});

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

Router.get('/:_id', function(req, resp) {
    let id = req.params._id;
    let flatfile = modelStore.retrieveModel(id);
    if ( flatfile ) {
        let retobj = {
            flatFile: JSON.parse(flatfile)
        };
        resp.json(Util.generateSuccessResponse(retobj));
    } else {
        let err = {
            message: "No model for uuid: " + id
        };
        resp.status(404).json(Util.generateErrorResponse(err, req));
    }
});

module.exports = Router;
