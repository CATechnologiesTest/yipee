const Express = require('express');
const Router = Express.Router();
const baselogger = require('../helpers/logger');
const Logger = baselogger.createLogger('diff');
const errorObject = baselogger.errorObject;
const Util = require('./routeUtils');
const cvtHelpers = require('../helpers/cvthelpers');

function makeDiffInput(inobj) {
    if (!typeof inobj === 'object' || !(inobj.hasOwnProperty('name') &&
                                        inobj.hasOwnProperty('data'))) {
        return Promise.reject(new Error("each diff object must have 'name' " +
                                        "and 'data' properties"));
    }
    let inputType = typeof inobj.data;
    return new Promise((resolve, reject) => {
        if (inputType === 'object') {
            // assume this is flat-format and turn it to yaml
            cvtHelpers.flatToK8s(inobj.data)
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
        } else {
            // neither flat nor yaml -- input error
            reject(new Error(`${inobj.name} is ${inputType}.` +
                             "Must be either object (flat-format) or " +
                             "string (yaml)"));
        }
    });
}

function prepareInput(body) {
    return new Promise((resolve, reject) => {
        let retval = {};
        if (!typeof body === 'object') {
            retval.err = new Error("invalid diff input -- not an object");
            resolve(retval);
        } else if (!(body.hasOwnProperty("parent") &&
                     body.hasOwnProperty("child"))) {
            retval.err = new Error("invalid diff input -- " +
                                   "must have 'parent' and 'child' properties");
            resolve(retval);
        } else {
            Promise.all([makeDiffInput(body.parent), makeDiffInput(body.child)])
                .then(inputs => {
                    retval.diffobj = {
                        parent: inputs[0],
                        children: [inputs[1]]
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

Router.post('/', function(req, resp) {
    prepareInput(req.body)
        .then(payload => {
            if (payload.err) {
                resp.status(400).json(
                    Util.generateErrorResponse(payload.err, req));
                return;
            }
            cvtHelpers.diff(payload.diffobj)
                .then(diffs => {
                    resp.json(Util.generateSuccessResponse(diffs));
                })
                .catch(err => {
                    Logger.error({error: errorObject(err),
                                  payload: payload}, "diff");
                    resp.status(500).json(Util.generateErrorResponse(err, req));
                });
        })
        .catch(err => {
            Logger.error({error: errorObject(err),
                          payload: payload}, "diff");
            resp.status(500).json(Util.generateErrorResponse(err, req));
        });
});

module.exports = Router;
