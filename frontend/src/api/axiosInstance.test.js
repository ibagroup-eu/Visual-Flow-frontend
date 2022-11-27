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

import { axiosSimpleInstance, axiosInstance, getLocation } from './axiosInstance';
import { set } from 'lodash';

describe('axiosInstance', () => {
    require('./axiosInstance');
    const homePath = '/home/pathname';

    describe('Response interceptor', () => {
        it('should return response', () => {
            [axiosInstance].forEach(value => {
                const response = { config: { method: 'get' } };
                const actual = value.interceptors.response.handlers[0].fulfilled(
                    response
                );
                expect(actual).toBe(response);
            });
        });

        it('should return response without get and statusText "No Content"', () => {
            [axiosInstance].forEach(value => {
                const response = {
                    config: { method: 'post' },
                    statusText: 'No Content'
                };
                const actual = value.interceptors.response.handlers[0].fulfilled(
                    response
                );
                expect(actual).toBe(response);
            });
        });

        it('should return response without get and statusText "content"', () => {
            [axiosInstance].forEach(value => {
                const response = {
                    config: { method: 'post' },
                    statusText: 'content'
                };
                const actual = value.interceptors.response.handlers[0].fulfilled(
                    response
                );
                expect(actual).toBe(response);
            });
        });

        it.each([{ instance: axiosSimpleInstance }, { instance: axiosInstance }])(
            'should reject error with data.message',
            ({ instance }) => {
                const error = {
                    response: { status: 400, data: { message: 'errorMessage' } }
                };
                const actual = instance.interceptors.response.handlers[0].rejected(
                    error
                );
                expect(actual).rejects.toEqual(error);
            }
        );

        it.each([{ instance: axiosSimpleInstance }, { instance: axiosInstance }])(
            'should reject error with login',
            ({ instance }) => {
                window.BASE_URL = 'baseUrl/';
                set(window, 'location', {
                    ...window.location,
                    pathname: '/pathname',
                    search: ''
                });

                const error = {
                    response: { status: 401 }
                };
                const actual = instance.interceptors.response.handlers[0].rejected(
                    error
                );

                expect(actual).rejects.toEqual(error);
            }
        );

        it.each([{ instance: axiosSimpleInstance }, { instance: axiosInstance }])(
            'should reject error with data.error',
            ({ instance }) => {
                const error = {
                    response: { status: 400, data: { error: 'errorMessage' } }
                };
                const actual = instance.interceptors.response.handlers[0].rejected(
                    error
                );
                expect(actual).rejects.toEqual(error);
            }
        );

        it.each([{ instance: axiosSimpleInstance }, { instance: axiosInstance }])(
            'should reject error with data = "errorMessage"',
            ({ instance }) => {
                const error = {
                    response: { status: 400, data: 'errorMessage' }
                };
                const actual = instance.interceptors.response.handlers[0].rejected(
                    error
                );
                expect(actual).rejects.toEqual(error);
            }
        );

        it.each([{ instance: axiosSimpleInstance }, { instance: axiosInstance }])(
            'should reject error with responseType: "blob"',
            ({ instance }) => {
                const error = {
                    response: {
                        status: 400,
                        config: { responseType: 'blob' },
                        data: {
                            text: jest
                                .fn()
                                .mockImplementationOnce(() =>
                                    Promise.resolve('test')
                                )
                        }
                    }
                };
                const actual = instance.interceptors.response.handlers[0].rejected(
                    error
                );
                expect(actual).rejects.toEqual(error);
            }
        );

        it.each([{ instance: axiosSimpleInstance }, { instance: axiosInstance }])(
            'should reject error',
            ({ instance }) => {
                const error = {
                    response: {
                        status: 400,
                        data: { errors: [{ defaultMessage: 'errorMessage' }] }
                    }
                };
                const actual = instance.interceptors.response.handlers[0].rejected(
                    error
                );
                expect(actual).rejects.toEqual(error);
            }
        );
    });

    it('getLocation should return a correct url', () => {
        expect(getLocation(homePath, '/homePage/')).toBe(
            `/homePage/login?redirect=${encodeURIComponent('/home/pathname')}`
        );

        expect(getLocation(`baseUrl${homePath}`, 'baseUrl/')).toBe(
            `baseUrl/login?redirect=${encodeURIComponent('home/pathname')}`
        );

        expect(getLocation(homePath, '/')).toBe(
            `/login?redirect=${encodeURIComponent('home/pathname')}`
        );
    });

    it('login should set window.location', () => {
        expect(window.location).toBe('baseUrl/login?redirect=%2Fpathname');
    });
});
