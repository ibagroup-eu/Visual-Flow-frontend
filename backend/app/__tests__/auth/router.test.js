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
const request = require('supertest');
const { router, handleLogin, callback } = require('../../auth/router');

describe('Router', () => {
    let app;
    const user = { id: 1 };
    const mock = jest.fn();

    beforeEach(() => {
        app = express();
        app.use((req, res, next) => {
            mock(req, res, next);
            next();
        });
        app.use(router);
    });

    it('/login should redirect to auth provider url', done => {
        request(app)
            .get('/login')
            .expect(302)
            .expect(
                'Location',
                `https://strategy_base_url/oauth/authorize?response_type=code&redirect_uri=${encodeURIComponent(
                    'https://strategy_callback_url'
                )}&scope=read_user&client_id=GITLAB_APP_ID`
            )
            .end(done);
    });

    it('/profile should return 401 to login when not authenticated', done => {
        request(app)
            .get('/profile')
            .expect(401)
            .end(done);
    });

    it('/profile should return the user when authenticated', done => {
        mock.mockImplementation(req => {
            req.user = user;
        });
        request(app)
            .get('/profile')
            .expect(200)
            .end(done);
    });

    it('test callback function', () => {
        const req = {
            session: {
                redirectUrl: 'profile'
            }
        };
        const redirect = jest.fn();
        const res = {
            redirect
        };
        callback(req, res);
        expect(redirect).toHaveBeenCalledWith('/profile');

        req.session.redirectUrl = '';
        callback(req, res);
        expect(redirect).toHaveBeenCalledWith('/');
    });

    it('should call handleLogin function', () => {
        const req = {
            query: {
                redirect: 'url'
            },
            session: {
                redirectUrl: ''
            }
        };
        handleLogin(req, {}, jest.fn());
        expect(req.session.redirectUrl).toBe('url');
    });
});
