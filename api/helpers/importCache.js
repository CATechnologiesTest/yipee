const Env = require('../environment');
const Guid = require('./guid');
const baselogger = require('./logger');
const errorObject = baselogger.errorObject;
const Logger = baselogger.createLogger("import");


const ffMap = new Map([]);

function stashModel(flatfile) {
    if (ffMap.size >= Env.getMaxFlatFiles()) {
        return null;
    };
    let uuid = Guid.generate();
    let timer = setTimeout(() => {
        if (ffMap.delete(uuid)) {
            Logger.info({guid: uuid}, "deleted stashed import after timeout");
        }
    }, Env.getFlatFileTimeout());
    ffMap.set(uuid, {flatFile: flatfile, timer: timer});
    return uuid;
};
module.exports.stashModel = stashModel;

function retrieveModel(uuid) {
    let mapEntry = ffMap.get(uuid);
    let flatFile = undefined;
    if (mapEntry) {
        clearTimeout(mapEntry.timer);
        ffMap.delete(uuid);
        flatFile = mapEntry.flatFile;
    }
    return flatFile;
}
module.exports.retrieveModel = retrieveModel;

function getFlatFile(uuid) {
    let mapEntry = ffMap.get(uuid);
    let flatFile = undefined;
    if (mapEntry) {
        flatFile = mapEntry.flatFile;
    }
    return flatFile;
}
module.exports.getFlatFile = getFlatFile;

