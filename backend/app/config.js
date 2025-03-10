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

const path = require('path');
const { version } = require('../../package.json');

const IS_LOCAL_ENV = !['production', 'development'].includes(
    process.env.NODE_ENV
);

const CONFIG = {
    EXPRESS: {
        PORT: process.env.EXPRESS_PORT || 8888,
        HOST: IS_LOCAL_ENV ? '127.0.0.1' : '0.0.0.0',
        SESSION_STORE: process.env.SESSION_STORE || 'dynamic',
        ENV: process.env.NODE_ENV,
        IS_LOCAL_ENV
    },
    APP: {
        VERSION: version,
        BASE_URL: process.env.BASE_URL || '/',
        PLATFORM: process.env.PLATFORM,
        LOGOUT_URL: process.env.LOGOUT_URL,
        COOKIE_MAX_AGE: process.env.COOKIE_MAX_AGE || 3600 * 1000 * 8,
        BUILD_PATH:
            process.env.BUILD_PATH ||
            path.join(__dirname, '../../frontend/public'),
        PROXY: {
            API_SERVER: {
                HOST: process.env.API_SERVER
            },
            MOCK_SERVER: {
                HOST: process.env.MOCK_SERVER
            }
        }
    },
    REDIS: {
        PORT: process.env.REDIS_PORT || 6379,
        HOST: process.env.REDIS_HOST,
        PASSWORD: process.env.REDIS_PASSWORD,
        DB: process.env.REDIS_DB || 0
    },
    AUTH: {
        STRATEGY: process.env.STRATEGY,
        PROVIDER: {
            GITLAB: {
                APP_ID: process.env.GITLAB_APP_ID,
                APP_SECRET: process.env.GITLAB_APP_SECRET,
                CALLBACK_URL: process.env.STRATEGY_CALLBACK_URL,
                BASE_URL: process.env.STRATEGY_BASE_URL
            },
            GITHUB: {
                APP_ID: process.env.GITHUB_APP_ID,
                APP_SECRET: process.env.GITHUB_APP_SECRET,
                CALLBACK_URL: process.env.STRATEGY_CALLBACK_URL,
                BASE_URL: process.env.STRATEGY_BASE_URL
            },
            OIDC: {
                ISSUER_URL: process.env.ISSUER_URL,
                AUTHORIZATION_URL: process.env.AUTHORIZATION_URL,
                TOKEN_URL: process.env.TOKEN_URL,
                USERINFO_URL: process.env.USERINFO_URL,
                CLIENT_ID: process.env.CLIENT_ID,
                CLIENT_SECRET: process.env.CLIENT_SECRET,
                CALLBACK_URL: process.env.CALLBACK_URL,
                AVATAR: {
                    URL: process.env.OIDC_AVATAR_URL || '',
                    KEY: process.env.OIDC_AVATAR_KEY || ''
                }
            }
        }
    }
};

module.exports = CONFIG;
