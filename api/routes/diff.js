const Express = require('express');
const Router = Express.Router();
const baselogger = require('../helpers/logger');
const Logger = baselogger.createLogger('diff');
const errorObject = baselogger.errorObject;
const Util = require('./routeUtils');
const cvtHelpers = require('../helpers/cvthelpers');

Router.post('/', function(req, resp) {
    cvtHelpers.prepareDiffInput(req.body)
        .then(payload => {
            if (payload.err) {
                resp.status(400).json(
                    Util.generateErrorResponse(payload.err));
                return;
            }
            cvtHelpers.diff(payload.diffobj)
                .then(diffs => {
                    resp.json(Util.generateSuccessResponse(diffs));
                })
                .catch(err => {
                    Logger.error({error: errorObject(err),
                                  payload: payload}, "diff");
                    resp.status(500).json(Util.generateErrorResponse(err));
                });
        })
        .catch(err => {
            Logger.error({error: errorObject(err),
                          payload: req.body}, "diff");
            resp.status(500).json(Util.generateErrorResponse(err));
        });
});

module.exports = Router;
