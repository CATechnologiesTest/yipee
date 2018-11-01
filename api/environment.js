
// Generic converter service -- assume that api and converter run in
// the same pod so we can access on localhost by default...
module.exports.cvtEndpointURL = process.env.CVT_URL || 'http://localhost:3000';

// Set this to true to enable interaction with live cluster.
// If set, the implication is that the serviceAccount associated with
// the backend pod(s) has access to the live cluster (via role definition
// and binding).  See the deployment yaml file for details...
module.exports.liveCluster = process.env.LIVE_CLUSTER;
