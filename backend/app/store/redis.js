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

const redis = require('ioredis');
const connectRedis = require('connect-redis');
const session = require('express-session');

const CONFIG = require('../config');
const logger = require('../logger')('redis');

const createStore = () => {
    const Redis = connectRedis(session);

    const redisClient = redis.createClient({
        host: CONFIG.REDIS.HOST,
        port: CONFIG.REDIS.PORT,
        password: CONFIG.REDIS.PASSWORD,
        db: CONFIG.REDIS.DB
    });

    redisClient.on('error', err =>
        logger.info(`Could not establish a connection with redis: ${err}`)
    );
    redisClient.on('connect', () =>
        logger.info('Connected to redis successfully')
    );

    return new Redis({
        client: redisClient
    });
};

module.exports = {
    createStore
};
