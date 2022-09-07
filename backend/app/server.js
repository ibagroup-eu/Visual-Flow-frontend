/*
 * Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const fs = require('fs');
const https = require('https');
const prepareIndex = require('./utils/prepareIndex');
const env = require('./env');

const privateKey = fs.readFileSync(env.keyPath, 'utf8');
const certificate = fs.readFileSync(env.crtPath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

const logger = require('./logger')('server');
const router = require('./router');
const config = require('./config');

app.use(config.app.baseUrl, router);

logger.info('Starting the server ...');

const httpsServer = https.createServer(credentials, app);

const listener = error => {
    if (error) {
        logger.error('Unable start the server: ', error);
        process.exit(10);
    }
    prepareIndex(config);
    logger.info(
        `Express is listening on: ${config.express.host}:${config.express.port}`
    );
};

const server = httpsServer.listen(
    config.express.port,
    config.express.host,
    listener
);

module.exports = {
    app,
    server,
    listener
};
