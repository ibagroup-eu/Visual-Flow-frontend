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
const {
    passThrough,
    verify,
    verifyOIDC,
    getStrategyConfig
} = require('../../auth/passport-setup');

describe('Passport-Setup', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should serialize', () => {
        const userData = 'userData';
        const cb = jest.fn();

        passThrough(userData, cb);
        expect(cb).toHaveBeenCalledWith(null, userData);
    });

    it('should verify', () => {
        const accessToken = 'accessToken';
        const refreshToken = 'refreshToken';
        const profile = 'profile';
        const cb = jest.fn();

        verify(accessToken, refreshToken, profile, cb);
        expect(cb).toHaveBeenCalledWith(null, {
            accessToken,
            refreshToken,
            profile
        });
    });

    it('should verifyOIDC', () => {
        const issuer = 'issuer';
        const profile = 'profile';
        const context = 'context';
        const idToken = 'idToken';
        const accessToken = 'accessToken';
        const refreshToken = 'refreshToken';
        const cb = jest.fn();

        verifyOIDC(
            issuer,
            profile,
            context,
            idToken,
            accessToken,
            refreshToken,
            cb
        );
        expect(cb).toHaveBeenCalledWith(null, {
            accessToken,
            refreshToken,
            profile
        });
    });

    it('should getStrategyConfig for OIDC', () => {
        process.env.STRATEGY = 'OIDC';
        process.env.CLIENT_ID = 'CLIENT_ID';
        process.env.CLIENT_SECRET = 'CLIENT_SECRET';
        process.env.CALLBACK_URL = 'https://strategy_callback_url';
        process.env.ISSUER_URL = 'https://strategy_issuer_url';
        process.env.AUTHORIZATION_URL = 'https://strategy_authorization_url';
        process.env.TOKEN_URL = 'https://strategy_token_url';
        process.env.USERINFO_URL = 'https://strategy_userinfo_url';

        expect(getStrategyConfig()).toBeDefined();
        expect(getStrategyConfig()).toEqual(expect.anything());
        expect(getStrategyConfig()).toMatchObject({
            name: 'openidconnect'
        });
    });

    it('should getStrategyConfig for GITHUB', () => {
        process.env.STRATEGY = 'GITHUB';
        process.env.GITHUB_APP_ID = 'CLIENT_ID';
        process.env.GITHUB_APP_SECRET = 'CLIENT_SECRET';
        process.env.STRATEGY_CALLBACK_URL = 'https://strategy_callback_url';
        process.env.GITHUB_STRATEGY_BASE_URL = 'https://strategy_issuer_url';

        expect(getStrategyConfig()).toBeDefined();
        expect(getStrategyConfig()).toEqual(expect.anything());
        expect(getStrategyConfig()).toMatchObject({
            name: 'github'
        });
    });
});
