var express = require('express');
var router = express.Router();
var bunyan = require('bunyan');
var baselog = require('../helpers/logger');

const validLevels = ["trace", "debug", "info", "warn", "error"];

function level2string(logger) {
    switch (logger.level()) {
    case bunyan.TRACE:
        return "TRACE";
    case bunyan.DEBUG:
        return "DEBUG";
    case bunyan.INFO:
        return "INFO";
    case bunyan.WARN:
        return "WARN";
    case bunyan.ERROR:
        return "ERROR";
    default:
        return "UNKNOWN";
    }
}

function validateLevel(level) {
    return validLevels.some(lvl => lvl === level);
}

function setLogLevel(logger, level) {
    switch (level.toLowerCase()) {
    case "trace":
        logger.level(bunyan.TRACE)
        break;
    case "debug":
        logger.level(bunyan.DEBUG)
        break;
    case "info":
        logger.level(bunyan.INFO)
        break;
    case "warn":
        logger.level(bunyan.WARN)
        break;
    case "error":
        logger.level(bunyan.ERROR)
        break;
    default:
        logger.warn({badlevel: level},
                    "ignoring request for invalid log level");
    }
}

router.put('/', function(req, res) {
    var level = req.body.level;
    if (validateLevel(level)) {
        var allLoggers = baselog.getLoggerNames();
        for (var i = 0; i < allLoggers.length; i++) {
            setLogLevel(baselog.getLogger(allLoggers[i]), level);
        }
        baselog.logger.warn({newlevel: level, loggerNames: allLoggers},
                            "all loggers (re)set");
        res.status(200).send("all loggers (re)set");
    } else {
        res.status(400).send("bad log level: " + level);
    }
});

router.put('/:_name', function(req, res) {
    var loggerName = req.params._name;
    var theLogger = baselog.getLogger(loggerName);
    var level = req.body.level;
    if (theLogger) {
        if (validateLevel(level)) {
            setLogLevel(theLogger, level);
            theLogger.warn({newlevel: level}, "log level reset");
            res.status(200).send(`reset ${loggerName} to ${level}`);
        } else {
            res.status(400).send("bad log level: " + level);
        }
    } else {
        var msg = `logger ${loggerName} not found`;
        baselog.logger.warn(msg);
        res.status(400).send(msg);
    }
});

module.exports = router;
