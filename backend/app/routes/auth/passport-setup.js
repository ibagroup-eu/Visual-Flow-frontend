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
const axios = require('axios');
const _ = require('lodash');

const CONFIG = require('../../config');

const passThrough = (userData, cb) => cb(null, userData);

passport.serializeUser(passThrough);
passport.deserializeUser(passThrough);

const verify = (accessToken, refreshToken, profile, cb) => {
    cb(null, {
        accessToken,
        refreshToken,
        profile: {
            ...profile,
            avatar:
                CONFIG.AUTH.STRATEGY === 'GITHUB'
                    ? _.get(profile, 'photos[0].value')
                    : _.get(profile, 'avatarUrl')
        }
    });
};

const verifyOIDC = (template, key) => (
    issuer,
    profile,
    context,
    idToken,
    accessToken,
    refreshToken,
    cb
) => {
    const getData = avatar => ({
        accessToken,
        refreshToken,
        profile: {
            ...profile,
            avatar
        }
    });

    return axios
        .get(
            template({
                USERNAME: _.get(profile, 'username'),
                EMAIL: _.get(profile, 'emails[0].value'),
                ID: _.get(profile, 'id')
            })
        )
        .then(response => cb(null, getData(_.get(response?.data, key))))
        .catch(() => cb(null, getData()));
};

const getStrategyConfig = () => {
    if (CONFIG.AUTH.STRATEGY === 'GITLAB') {
        return new GitLabStrategy(
            {
                clientID: CONFIG.AUTH.PROVIDER.GITLAB.APP_ID,
                clientSecret: CONFIG.AUTH.PROVIDER.GITLAB.APP_SECRET,
                callbackURL: CONFIG.AUTH.PROVIDER.GITLAB.CALLBACK_URL,
                baseURL: CONFIG.AUTH.PROVIDER.GITLAB.BASE_URL
            },
            verify
        );
    }
    if (CONFIG.AUTH.STRATEGY === 'OIDC') {
        return new OpenIDConnectStrategy(
            {
                issuer: CONFIG.AUTH.PROVIDER.OIDC.ISSUER_URL,
                authorizationURL: CONFIG.AUTH.PROVIDER.OIDC.AUTHORIZATION_URL,
                tokenURL: CONFIG.AUTH.PROVIDER.OIDC.TOKEN_URL,
                userInfoURL: CONFIG.AUTH.PROVIDER.OIDC.USERINFO_URL,
                clientID: CONFIG.AUTH.PROVIDER.OIDC.CLIENT_ID,
                clientSecret: CONFIG.AUTH.PROVIDER.OIDC.CLIENT_SECRET,
                callbackURL: CONFIG.AUTH.PROVIDER.OIDC.CALLBACK_URL
            },
            verifyOIDC(
                _.template(CONFIG.AUTH.PROVIDER.OIDC.AVATAR.URL),
                CONFIG.AUTH.PROVIDER.OIDC.AVATAR.KEY
            )
        );
    }
    return new GitHubStrategy(
        {
            clientID: CONFIG.AUTH.PROVIDER.GITHUB.APP_ID,
            clientSecret: CONFIG.AUTH.PROVIDER.GITHUB.APP_SECRET,
            callbackURL: CONFIG.AUTH.PROVIDER.GITHUB.CALLBACK_URL,
            authorizationURL: CONFIG.AUTH.PROVIDER.GITHUB.BASE_URL
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
