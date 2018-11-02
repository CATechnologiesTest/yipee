const Express = require('express');
const Router = Express.Router();
const Env = require('../environment');
const baselogger = require('../helpers/logger');
const Logger = baselogger.createLogger("convertAPI");
const errorObject = baselogger.errorObject;
const Util = require('./routeUtils');
const Helpers = require('../helpers/cvthelpers');

const typeConverters = {
    kubernetes: {cvt: Helpers.flatToK8s, retkey: 'kubernetesFile'},
    k8sbundle: {cvt: Helpers.flatToK8sBundle, retkey: 'kubernetesFile'},
    helm: {cvt: Helpers.flatToHelmBundle, retkey: 'helmFile'}
};

const types = new Set(Object.getOwnPropertyNames(typeConverters));

function makeComment() {
    return "# Generated " + new Date().toISOString() + " by Yipee.io\n";
}

Router.post('/:_type', function(req, resp) {
    const dltype = req.params._type;
    if (types.has(dltype)) {
        const converter = typeConverters[dltype];
        let flatFile = req.body;
        Helpers.addAnnotationInfo(flatFile);
        converter.cvt(flatFile)
            .then(result => {
                var retval = {};
                var payload = result;
                if (dltype === 'kubernetes') {
                    payload = makeComment() + payload;
                }
                retval[converter.retkey] = payload;
                resp.json(Util.generateSuccessResponse(retval));
            })
            .catch(err => {
                Logger.error({err: errorObject(err),
                              type: req.params._type}, "download error");
            });
    } else {
        Logger.warn({type: dltype}, "invalid download type requested");
        resp.sendStatus(404);
    }
});

module.exports = Router;

