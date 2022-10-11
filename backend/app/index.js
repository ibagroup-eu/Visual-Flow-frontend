const https = require('https');

const CONFIG = require('./config');

const credentials = require('./certs');
const { app, listener } = require('./app');

const httpsServer = https.createServer(credentials, app);

const server = httpsServer.listen(
    CONFIG.EXPRESS.PORT,
    CONFIG.EXPRESS.HOST,
    listener
);

module.exports = server;
