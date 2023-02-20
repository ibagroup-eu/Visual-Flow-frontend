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
jest.doMock('axios');

const _ = require('lodash');
const axios = require('axios');

const {
    passThrough,
    verify,
    verifyOIDC
} = require('../../../routes/auth/passport-setup');

describe('Passport-Setup', () => {
    beforeEach(() => {
        jest.resetModules();
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
        const profile = {};
        const cb = jest.fn();

        verify(accessToken, refreshToken, profile, cb);
        expect(cb).toHaveBeenCalledWith(null, {
            accessToken,
            refreshToken,
            profile
        });
    });

    it('should verifyOIDC', async () => {
        const issuer = 'issuer';
        const profile = {};
        const context = 'context';
        const idToken = 'idToken';
        const accessToken = 'accessToken';
        const refreshToken = 'refreshToken';
        const cb = jest.fn();

        axios.get.mockResolvedValueOnce({ data: {} });

        await verifyOIDC(jest.fn(), '')(
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
        jest.doMock('../../../config', () => ({
            AUTH: {
                STRATEGY: 'OIDC',
                PROVIDER: {
                    OIDC: {
                        ISSUER_URL: 'ISSUER_URL',
                        AUTHORIZATION_URL: 'AUTHORIZATION_URL',
                        TOKEN_URL: 'TOKEN_URL',
                        USERINFO_URL: 'USERINFO_URL',
                        CLIENT_ID: 'CLIENT_ID',
                        CLIENT_SECRET: 'CLIENT_SECRET',
                        CALLBACK_URL: 'CALLBACK_URL',
                        AVATAR: {
                            URL: 'URL',
                            KEY: 'KEY'
                        }
                    }
                }
            }
        }));

        const {
            getStrategyConfig
            // eslint-disable-next-line global-require
        } = require('../../../routes/auth/passport-setup');

        expect(getStrategyConfig()).toBeDefined();
        expect(getStrategyConfig()).toEqual(expect.anything());
        expect(getStrategyConfig()).toMatchObject({
            name: 'openidconnect'
        });
    });

    it('should getStrategyConfig for GITHUB', () => {
        jest.doMock('../../../config', () => ({
            AUTH: {
                STRATEGY: 'GITHUB',
                PROVIDER: {
                    GITHUB: {
                        APP_ID: 'APP_ID',
                        APP_SECRET: 'APP_SECRET',
                        CALLBACK_URL: 'CALLBACK_URL',
                        BASE_URL: 'BASE_URL'
                    }
                }
            }
        }));

        const {
            getStrategyConfig
            // eslint-disable-next-line global-require
        } = require('../../../routes/auth/passport-setup');

        expect(getStrategyConfig()).toBeDefined();
        expect(getStrategyConfig()).toEqual(expect.anything());
        expect(getStrategyConfig()).toMatchObject({
            name: 'github'
        });
    });

    it('should getStrategyConfig for GITLAB', () => {
        jest.doMock('../../../config', () => ({
            AUTH: {
                STRATEGY: 'GITLAB',
                PROVIDER: {
                    GITLAB: {
                        APP_ID: process.env.GITLAB_APP_ID,
                        APP_SECRET: process.env.GITLAB_APP_SECRET,
                        CALLBACK_URL: process.env.STRATEGY_CALLBACK_URL,
                        BASE_URL: process.env.STRATEGY_BASE_URL
                    }
                }
            }
        }));

        const {
            getStrategyConfig
            // eslint-disable-next-line global-require
        } = require('../../../routes/auth/passport-setup');

        expect(getStrategyConfig()).toBeDefined();
        expect(getStrategyConfig()).toEqual(expect.anything());
        expect(getStrategyConfig()).toMatchObject({
            name: 'gitlab'
        });
    });

    it('should add avatar', async () => {
        const profile = { username: 'joker' };
        const accessToken = 'accessToken';
        const refreshToken = 'refreshToken';

        const cb = jest.fn();

        axios.get.mockResolvedValueOnce({
            data: { user: { avatar: { url: 'avatar_url' } } }
        });

        await verifyOIDC(
            // eslint-disable-next-line no-template-curly-in-string
            _.template('/api/user/${USERNAME}'),
            'user.avatar.url'
        )('', profile, '', '', accessToken, refreshToken, cb);

        expect(cb).toHaveBeenCalledWith(null, {
            accessToken,
            refreshToken,
            profile: {
                ...profile,
                avatar: 'avatar_url'
            }
        });

        expect(axios.get).toHaveBeenCalledWith('/api/user/joker');
    });

    it('should not add avatar if avatar url is empty', async () => {
        const profile = { username: 'joker' };
        const accessToken = 'accessToken';
        const refreshToken = 'refreshToken';

        const cb = jest.fn();

        axios.get.mockResolvedValueOnce({
            data: {}
        });

        await verifyOIDC(
            // eslint-disable-next-line no-template-curly-in-string
            _.template(undefined),
            'user.avatar.url'
        )('', profile, '', '', accessToken, refreshToken, cb);

        expect(cb).toHaveBeenCalledWith(null, {
            accessToken,
            refreshToken,
            profile
        });

        expect(axios.get).toHaveBeenCalledWith('');
    });

    it('should not add avatar if avatar data is empty', async () => {
        const profile = { username: 'joker' };
        const accessToken = 'accessToken';
        const refreshToken = 'refreshToken';

        const cb = jest.fn();

        axios.get.mockResolvedValueOnce({
            data: {}
        });

        await verifyOIDC(
            // eslint-disable-next-line no-template-curly-in-string
            _.template('/api/user/${USERNAME}'),
            'user.avatar.url'
        )('', profile, '', '', accessToken, refreshToken, cb);

        expect(cb).toHaveBeenCalledWith(null, {
            accessToken,
            refreshToken,
            profile
        });

        expect(axios.get).toHaveBeenCalledWith('/api/user/joker');
    });

    it('should not add avatar when an error occurs', async () => {
        const profile = {
            id: 'f67bb6db-b082-4a52-931e-cee39130ba9a',
            username: 'joker',
            emails: [
                {
                    value: 'joker@gmail.com'
                }
            ]
        };

        const accessToken = 'accessToken';
        const refreshToken = 'refreshToken';

        const cb = jest.fn();

        axios.get.mockRejectedValueOnce(new Error('Ops!'));

        await verifyOIDC(
            // eslint-disable-next-line no-template-curly-in-string
            _.template('/api/user/${USERNAME}/${EMAIL}/${ID}'),
            'user.avatar.url'
        )('', profile, '', '', accessToken, refreshToken, cb);

        expect(cb).toHaveBeenCalledWith(null, {
            accessToken,
            refreshToken,
            profile: {
                ...profile,
                avatar: undefined
            }
        });

        expect(axios.get).toHaveBeenCalledWith(
            '/api/user/joker/joker@gmail.com/f67bb6db-b082-4a52-931e-cee39130ba9a'
        );
    });
});
