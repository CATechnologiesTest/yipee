const Express = require('express');
const Router = Express.Router();
const Util = require('./routeUtils');
const baselogger = require('../helpers/logger');
const errorObject = baselogger.errorObject;
const Logger = baselogger.createLogger("convertAPI");
const cvtHelpers = require('../helpers/cvthelpers');
const uuidv4 = require('uuid/v4')
const Env = require('../environment.js')

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

const ffMap = new Map([]);

function stashModel(flatfile) {
    if (ffMap.size >= Env.getMaxFlatFiles()) {
        return null;
    };
    let uuid = uuidv4();
    let timer = setTimeout(() => {
        if (ffMap.delete(uuid)) {
            Logger.info({guid: uuid}, "delete stashed import after timeout");
        }
    }, Env.getFlatFileTimeout());
    ffMap.set(uuid, {flatFile: flatfile, timer: timer});
    return uuid;
};

function retrieveModel(uuid) {
    let mapEntry = ffMap.get(uuid);
    let flatFile = undefined;
    if (mapEntry) {
        clearTimeout(mapEntry.timer);
        ffMap.delete(uuid);
        flatFile = mapEntry.flatFile;
    }
    return flatFile;
}

Router.post('/', function(req, resp) {
    let yipeeobj = req.body;
    let retobj = {
        name: yipeeobj.name
    };
    doImport(yipeeobj)
        .then(flatfile => {
            if (Util.hasQueryParam(req, 'store', 'true')) {
                let yipeeguid = stashModel(flatfile);
                if (yipeeguid === null) {
                    let err = new Error("pending imports exceeds maximum");
                    resp.status(409).json(Util.generateErrorResponse(err));
                } else {
                    retobj.guid = yipeeguid;
                    resp.json(Util.generateSuccessResponse(retobj));
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
    let flatfile = retrieveModel(id);
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
