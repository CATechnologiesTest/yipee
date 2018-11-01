var logLevel = process.env.LOG_LEVEL || 'info';
var bunyan = require('bunyan');

var logMap = {};

function errorObject(err) {
    var errObject = {};
    if (err) {
        var theError = err;
        if (err.error) {
            // wrapped by status code helper...
            theError = err.error;
        }
        Object.getOwnPropertyNames(theError).forEach((key) => {
            errObject[key] = theError[key];
        });
    }
    return errObject;
}

function createLogger(name, level) {
    createLevel = logLevel;
    if (level) {
        createLevel = level;
    }
    newLogger = bunyan.createLogger({
        name: name,
        serializers: bunyan.stdSerializers,
        streams: [
            {
                level: createLevel,
                stream: process.stdout
            },
        ]
    });
    logMap[name] = newLogger;

    return newLogger;
}

function getLogger(name) {
    return logMap[name];
}

function getOrCreateLogger(name) {
    var theLogger = getLogger(name);
    if (!theLogger) {
        theLogger = createLogger(name);
    }
    return theLogger;
}

function getLoggerNames() {
    return Object.keys(logMap);
}

var defaultLogger = createLogger('baseLogger');

module.exports = {
    logger: defaultLogger,
    errorObject: errorObject,
    createLogger: createLogger,
    getLogger: getLogger,
    getOrCreateLogger: getOrCreateLogger,
    getLoggerNames: getLoggerNames
};
