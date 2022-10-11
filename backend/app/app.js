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
const session = require('express-session');

const prepareIndex = require('./utils/prepareIndex');
const logger = require('./logger')('server');
const { httpLogger, errorHandler } = require('./midleware');
const routers = require('./routes');
const CONFIG = require('./config');

const store = require('./store');

const app = express();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: CONFIG.APP.COOKIE_MAX_AGE
        },
        store
    })
);

app.use(httpLogger);
app.use(CONFIG.APP.BASE_URL, routers);
app.use(errorHandler);

const listener = error => {
    logger.info(
        `Starting the server for "${CONFIG.EXPRESS.ENV}" environment ...`
    );

    if (error) {
        logger.error('Unable start the server: ', error);
        process.exit(10);
    }

    prepareIndex(CONFIG);

    logger.info(
        `Express is listening on: ${CONFIG.EXPRESS.HOST}:${CONFIG.EXPRESS.PORT}`
    );
};

module.exports = {
    app,
    listener
};
