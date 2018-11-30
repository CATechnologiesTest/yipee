
// Generic converter service -- assume that api and converter run in
// the same pod so we can access on localhost by default...
module.exports.cvtEndpointURL = process.env.CVT_URL || 'http://localhost:3000';

// Set this to true to enable interaction with live cluster.
// If set, the implication is that the serviceAccount associated with
// the backend pod(s) has access to the live cluster (via role definition
// and binding).  See the deployment yaml file for details...
module.exports.liveCluster = process.env.LIVE_CLUSTER;

// This controls how many stored flatfiles to use for imports where query
// parameter 'store' is set to true.
function getMaxFlatFiles() {
    let intmax = 64;
    if (process.env.MAX_FLAT_FILES) {
        let intenv = parseInt(process.env.MAX_FLAT_FILES, 10);
        if (intenv) {
            intmax = intenv;
        }
    }
    return intmax;
}
module.exports.getMaxFlatFiles = getMaxFlatFiles;

function getFlatFileTimeout() {
    let timeoutsecs = 30;
    if (process.env.FLAT_FILE_TIMEOUT_SECS) {
        let intsecs = parseInt(process.env.FLAT_FILE_TIMEOUT_SECS, 10);
        if (intsecs) {
            timeoutsecs = intsecs;
        }
    }
    return timeoutsecs * 1000;
}
module.exports.getFlatFileTimeout = getFlatFileTimeout;
