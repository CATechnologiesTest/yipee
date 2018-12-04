
function getAppURL(req) {
    return req.headers.referer
}
module.exports.getAppURL = getAppURL;

function hasQueryParam(req, param, value) {
    if (req.query && req.query[param]) {
        if (req.query[param].toLowerCase() === value.toLowerCase()) {
            return true;
        }
    }
    return false;
}
module.exports.hasQueryParam = hasQueryParam;

function generateResponse(success, contents, length) {
    var total = parseInt(length) || contents.length;
    var response = {
        success: success,
        total: total,
        data: contents
    }
    return response;
}

module.exports.generateErrorResponse = function(error) {
    return generateResponse(false, [error.message]);
}

module.exports.generateSuccessResponse = function(data, length) {
    var responseData;
    if(Object.prototype.toString.call(data) === "[object Array]") {
        responseData = data;
    } else {
        responseData = [data];
    }
    return generateResponse(true, responseData, length);
}
