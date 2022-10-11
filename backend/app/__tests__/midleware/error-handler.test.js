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
const request = require('supertest');

const { errorHandler } = require('../../midleware');

describe('error-handler', () => {
    let app;
    let mock;

    beforeEach(() => {
        mock = jest.fn();
        app = express();

        app.use((req, res, next) => {
            mock(req, res, next);
            next();
        });

        app.use(
            session({
                secret: 'secret',
                resave: false,
                saveUninitialized: false,
                cookie: {
                    maxAge: 3600 * 1000 * 8
                }
            })
        );

        app.use(errorHandler);
    });

    it('should handle errors', async () => {
        mock.mockImplementation(() => {
            throw Error('Something went wrong!');
        });

        const response = await request(app).get('/profile');

        expect(response.status).toBe(500);
        expect(JSON.parse(response.text)).toEqual({
            error: 'Something went wrong!'
        });
    });
});
