const Env = require('../environment');
const Guid = require('./guid');
const baselogger = require('./logger');
const errorObject = baselogger.errorObject;
const Logger = baselogger.createLogger("import");


const ffMap = new Map([]);

// Store a flat-file keyed by a new GUID.
// Manage cache size by arranging
// to remove the entry after an interval if no one has come
// to claim it.  Also, enforce a maximum cache size as a guard against
// the unlikely event of a flood of stash requests.
function stashFlatFile(flatfile) {
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
module.exports.stashFlatFile = stashFlatFile;

// Retrieve (and remove) a stored flat-file
function retrieveFlatFile(uuid) {
    let mapEntry = ffMap.get(uuid);
    let flatFile = undefined;
    if (mapEntry) {
        clearTimeout(mapEntry.timer);
        ffMap.delete(uuid);
        flatFile = mapEntry.flatFile;
    }
    return flatFile;
}
module.exports.retrieveFlatFile = retrieveFlatFile;

// retrieve flat file but don't remove/expire the cache entry.
function getFlatFile(uuid) {
    let mapEntry = ffMap.get(uuid);
    let flatFile = undefined;
    if (mapEntry) {
        flatFile = mapEntry.flatFile;
    }
    return flatFile;
}
module.exports.getFlatFile = getFlatFile;

