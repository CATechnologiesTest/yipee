const http = require('http');
const https = require('https');
const url = require('url');

function hostPortFromUrl(urlstr) {
    var purl = url.parse(urlstr);
    var intport = parseInt(purl.port, 10);
    if (intport) {
        return {host: purl.hostname, port: intport};
    } else {
        return {host: purl.hostname};
    }
}

function doRequest(transport, options, payload) {
    return new Promise((resolve, reject) => {
        const req = transport.request(options, (response) => {
            var resdata = [];
            response.setEncoding('utf8');
            response.on('data', (chunk) => resdata.push(chunk));
            response.on('end', () => resolve({rc: response.statusCode,
                                              body: resdata.join('')}));
        });
        req.on('error', (err) => reject(err));
        if (payload) {
            req.write(payload);
        }
        req.end();
    });
}

function request(options, payload) {
    return doRequest(http, options, payload);
}

function tlsRequest(options, payload) {
    return doRequest(https, options, payload);
}

module.exports.request = request;
module.exports.tlsRequest = tlsRequest;
module.exports.hostPortFromUrl = hostPortFromUrl;
