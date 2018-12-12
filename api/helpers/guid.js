const uuidv4 = require('uuid/v4')

function generate() {
    return uuidv4();
}
module.exports.generate = generate;

const guidRE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isGuid(value) {
    let retval = false;
    let match = value.match(guidRE);
    if (match) {
        retval = true;
    }
    return retval;
}
module.exports.isGuid = isGuid;
