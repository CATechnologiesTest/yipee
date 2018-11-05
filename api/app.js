// process.env.NODE_ENV = "development"
// process.env.DEBUG="*"
/**
 * Module Dependencies
 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const loggingRoutes = require('./routes/logging');

const log = require('./helpers/logger');
const requestTrace = require('./helpers/requestTrace');
const env = require('./environment');

const convertRoutes = require('./routes/convert');
const importRoutes = require('./routes/import');
const downloadRoutes = require('./routes/download');

const namespaceRoutes = require('./routes/namespaces');

const initPrimus = require('./helpers/k8sapi').initPrimus;
const app = express();

process.on('unhandledRejection', function(e) {
    console.log(e.message, e.stack);
});

app.use(bodyParser.json({limit:"100mb"}));
app.use(cors());

// Enable trace logging to see all requests/responses
app.use(requestTrace);

app.use('/setLog', loggingRoutes);
app.use('/convert', convertRoutes);
app.use('/import', importRoutes);
app.use('/download', downloadRoutes);

app.use('/namespaces', namespaceRoutes);

// Listen on port 5000
const server = app.listen(5000);
const primus = initPrimus(server);
module.exports.server = server;

// for tests
function stop() {
    server.close();
    if (primus) {
        primus.end();
    }
}
module.exports.stop = stop;
