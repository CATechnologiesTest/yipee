/*
 * Middleware for request tracing.
 *
 * Would be nice to use 'bunyan-middleware'
 * but it doesn't seem to respond to dynamic level change the way we would
 * like.  (Probably because it's using a per-request child logger and our
 * level change doesn't get to the child...?).
 *
 * Future consideration: add a header that keeps the reqid so that it can
 * be shared/correlated across micro-services?
 */
const uuid = require('uuid');
var baselog = require('./logger');
var log = baselog.createLogger("requestTrace");

var serverId = uuid.v4();
var nextTraceId = 0;
module.exports = function(req, res, next) {
    if (log.trace()) {
        var reqid = {serverId: serverId,
                     reqid: ++nextTraceId};
        log.trace({trace_reqid: reqid, req: req}, "TRACE API request");
        res.on('finish', function() {
            log.trace({trace_reqid: reqid,
                       req_method: req.method,
                       req_url: req.url,
                       res: res}, "TRACE API response");
        });
        res.on('close', function() {
            log.warn({req: req, res: res}, "request socket closed");
        });
    }
    next();
}
