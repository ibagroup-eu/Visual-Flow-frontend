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

const passport = require('passport');
const GitLabStrategy = require('passport-gitlab2').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const OpenIDConnectStrategy = require('passport-openidconnect').Strategy;

const passThrough = (userData, cb) => cb(null, userData);
passport.serializeUser(passThrough);
passport.deserializeUser(passThrough);

const verify = (accessToken, refreshToken, profile, cb) => {
    const userData = { accessToken, refreshToken, profile };
    cb(null, userData);
};

const verifyOIDC = (
    issuer,
    profile,
    context,
    idToken,
    accessToken,
    refreshToken,
    cb
) => {
    const userData = { accessToken, refreshToken, profile };
    return cb(null, userData);
};

const getStrategyConfig = () => {
    if (process.env.STRATEGY === 'GITLAB') {
        return new GitLabStrategy(
            {
                clientID: process.env.GITLAB_APP_ID,
                clientSecret: process.env.GITLAB_APP_SECRET,
                callbackURL: process.env.STRATEGY_CALLBACK_URL,
                baseURL: process.env.STRATEGY_BASE_URL
            },
            verify
        );
    }
    if (process.env.STRATEGY === 'OIDC') {
        return new OpenIDConnectStrategy(
            {
                issuer: process.env.ISSUER_URL,
                authorizationURL: process.env.AUTHORIZATION_URL,
                tokenURL: process.env.TOKEN_URL,
                userInfoURL: process.env.USERINFO_URL,
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                callbackURL: process.env.CALLBACK_URL
            },
            verifyOIDC
        );
    }
    return new GitHubStrategy(
        {
            clientID: process.env.GITHUB_APP_ID,
            clientSecret: process.env.GITHUB_APP_SECRET,
            callbackURL: process.env.STRATEGY_CALLBACK_URL,
            baseURL: process.env.GITHUB_STRATEGY_BASE_URL
        },
        verify
    );
};

const strategy = getStrategyConfig();
passport.use(strategy);

module.exports = {
    strategy,
    passThrough,
    verify,
    verifyOIDC,
    getStrategyConfig
};
