
function init() {
    // XXX: interrogate config and decide what we're using for storage
    // For now, it's all CRD, but you might imagine a configuration that
    // gives access to github, a hosted DB, ...
    let crd = require('./crdstore');
    return crd;
}

var store = init();

function getStorageHelper() {
    return store;
}

module.exports.getStorageHelper = getStorageHelper;
