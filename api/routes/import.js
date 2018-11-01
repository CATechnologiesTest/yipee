const Express = require('express');
const Router = Express.Router();
const Util = require('./routeUtils');
const baselogger = require('../helpers/logger');
const errorObject = baselogger.errorObject;
const Logger = baselogger.createLogger("convertAPI");
const cvtHelpers = require('../helpers/cvthelpers');

Router.post('/', function(req, resp) {
    let yipeeobj = req.body;
    cvtHelpers.tryAllImports(yipeeobj.importFile)
        .then(flatfile => {
            retobj = {
                name: yipeeobj.name
            };
            retobj.flatFile = JSON.parse(flatfile);
            resp.json(Util.generateSuccessResponse(retobj));
        })
        .catch(err => {
            Logger.error({error: errorObject(err),
                          yipeeobj: yipeeobj}, "import");
            resp.status(400).json(Util.generateErrorResponse(err, req));
        });
});

module.exports = Router;
