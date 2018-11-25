const uuidv4 = require('uuid/v4')
const Env = require('../environment.js')

const ffMap = new Map([]);

function stashModel(flatfile) {
    var uuid = uuidv4();
    if (ffMap.size >= Env.maxFlatFiles) {
        deleteFirstFlatFileEntry();
    };
    ffMap.set(uuid, flatfile);
    return uuid;
};

function deleteFirstFlatFileEntry() {
    var firstKey = ffMap.keys().next().value;
    ffMap.delete(firstKey);
};

function retrieveModel(uuid) {
    var flatfile = ffMap.get(uuid);
    ffMap.delete(uuid);
    return flatfile;
}

module.exports.stashModel = stashModel;
module.exports.retrieveModel = retrieveModel;
