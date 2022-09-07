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

import {
    axiosMockInstance,
    axiosInstance,
    getLocation,
    login
} from './axiosInstance';

describe('axiosInstance', () => {
    require('./axiosInstance');

    describe('Response interceptor', () => {
        it('should return response', () => {
            [axiosMockInstance, axiosInstance].forEach(value => {
                const response = { config: { method: 'get' } };
                const actual = value.interceptors.response.handlers[0].fulfilled(
                    response
                );
                expect(actual).toBe(response);
            });
        });

        it('should reject error', () => {
            [axiosMockInstance, axiosInstance].forEach(value => {
                const error = {
                    response: { status: 400, data: { message: 'errorMessage' } }
                };
                const actual = value.interceptors.response.handlers[0].rejected(
                    error
                );
                expect(actual).rejects.toEqual(error);
            });
        });

        it('should reject error', () => {
            [axiosMockInstance, axiosInstance].forEach(value => {
                const error = {
                    response: { status: 400, data: { error: 'errorMessage' } }
                };
                const actual = value.interceptors.response.handlers[0].rejected(
                    error
                );
                expect(actual).rejects.toEqual(error);
            });
        });

        it('should reject error', () => {
            [axiosMockInstance, axiosInstance].forEach(value => {
                const error = {
                    response: { status: 400, data: 'errorMessage' }
                };
                const actual = value.interceptors.response.handlers[0].rejected(
                    error
                );
                expect(actual).rejects.toEqual(error);
            });
        });
    });

    it('getLocation should return a correct url', () => {
        expect(getLocation('/home/pathname', '/homePage/')).toBe(
            `/homePage/login?redirect=${encodeURIComponent('/home/pathname')}`
        );

        expect(getLocation('baseUrl/home/pathname', 'baseUrl/')).toBe(
            `baseUrl/login?redirect=${encodeURIComponent('home/pathname')}`
        );

        expect(getLocation('/home/pathname', '/')).toBe(
            `/login?redirect=${encodeURIComponent('home/pathname')}`
        );
    });

    it('login should set window.location', () => {
        window.BASE_URL = 'baseUrl/';
        window.location.pathname = '/pathname';
        window.location.search = '';
        login();
        expect(window.location).toBe('baseUrl/login?redirect=%2Fpathname');
    });
});
