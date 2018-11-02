const Express = require('express');
const Router = Express.Router();
const Env = require('../environment');
const baselogger = require('../helpers/logger');
const Logger = baselogger.createLogger("convertAPI");
const errorObject = baselogger.errorObject;
const Http = require('../helpers/http');
const Util = require('./routeUtils');
const Helpers = require('../helpers/cvthelpers');

const baseOptions = {method: 'POST',
                     headers: {'Content-Type': 'application/json'}};

const optionsByType = {
    kubernetes: Object.assign({}, baseOptions,
                              Http.hostPortFromUrl(Env.cvtEndpointURL),
                              {path: '/f2k'}),
    helm: Object.assign({}, baseOptions,
                        Http.hostPortFromUrl(Env.cvtEndpointURL),
                        {path: '/f2hnerd'})
};

const types = new Set(Object.getOwnPropertyNames(optionsByType));

function doPost(options, srcdata) {
    const postData = typeof srcdata === 'string' ? srcdata :
        JSON.stringify(srcdata);
    options.headers['Content-Length'] = Buffer.byteLength(postData);
    return new Promise((resolve, reject) => {
        Http.request(options, postData)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function makeReturnErrors(payload) {
    return payload.split('\n').filter(line => line.trim().length > 0);
}

function getAppAttribute(req, field, defaultValue) {
    let attr;
    // Flat format should have a single app-info object which
    // contains the field
    if (req.body['app-info'] &&
        req.body['app-info'].length == 1 &&
        req.body['app-info'][0][field]) {
        attr = req.body['app-info'][0][field];
    } else {
        attr = defaultValue;
    }
    return attr;
}

function getAppName(req) {
    return getAppAttribute(req, 'name', 'NoFlatFileName');
}

Router.post('/:_type', function(req, resp) {
    if (types.has(req.params._type)) {
        let flatFile = Object.assign({}, req.body);
        Helpers.addAnnotationInfo(flatFile);
        doPost(optionsByType[req.params._type], flatFile)
            .then(res => {
                if (res.rc < 300) {
                    // minimal yipeeobject for "makeCommentedDownload"
                    var yipeeObj = {name: getAppName(req)};
                    var typeKey = req.params._type + "File";
                    var converted = Helpers.makeCommentedDownload(
                        yipeeObj, res.body);
                    var response = {name: Helpers.getAppName(yipeeObj),
                                    version: 0};
                    response[typeKey] = converted;
                    resp.json(Util.generateSuccessResponse(response));
                } else if (res.rc >= 400 && res.rc < 500) {
                    Logger.warn({errors: res}, "convert/validate errors");
                    resp.status(res.rc).json(
                        {status: res.rc,
                         errors: makeReturnErrors(res.body)});
                } else {
                    Logger.warn({doConvert: res}, "Unexpected doConvert return");
                    resp.status(res.rc).send(res.body);
                }
            })
            .catch(err => {
                Logger.error({err: errorObject(err)}, "doConvert error");
                resp.status(500).send(err);
            });
    } else {
        resp.sendStatus(404);
    }
});

module.exports = Router;
