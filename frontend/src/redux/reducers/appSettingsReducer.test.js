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

import appSettingsReducer, { initialState } from './appSettingsReducer';
import {
    FETCH_SETTINGS_VERSION_FAIL,
    FETCH_SETTINGS_VERSION_START,
    FETCH_SETTINGS_VERSION_SUCCESS
} from '../actions/types';

describe('appSettingsReducer', () => {
    describe('version', () => {
        it('should handle FETCH_SETTINGS_VERSION_START', () => {
            expect(
                appSettingsReducer(undefined, { type: FETCH_SETTINGS_VERSION_START })
            ).toEqual({
                ...initialState,
                loading: true
            });

            expect(
                appSettingsReducer(
                    { version: '1.0.0' },
                    { type: FETCH_SETTINGS_VERSION_START }
                )
            ).toEqual({
                ...initialState,
                version: '1.0.0',
                loading: true
            });
        });

        it('should handle FETCH_SETTINGS_VERSION_SUCCESS', () => {
            expect(
                appSettingsReducer(undefined, {
                    type: FETCH_SETTINGS_VERSION_SUCCESS,
                    payload: { version: '1.0.0' }
                })
            ).toEqual({
                ...initialState,
                version: '1.0.0',
                loading: false
            });

            expect(
                appSettingsReducer(
                    { version: '1.0.0', loading: true },
                    {
                        type: FETCH_SETTINGS_VERSION_SUCCESS,
                        payload: { version: '1.1.0' }
                    }
                )
            ).toEqual({
                ...initialState,
                version: '1.1.0',
                loading: false
            });
        });

        it('should handle FETCH_SETTINGS_VERSION_FAIL', () => {
            expect(
                appSettingsReducer(
                    { version: '1.0.0', loading: true },
                    {
                        type: FETCH_SETTINGS_VERSION_FAIL,
                        payload: { error: 'Ops!' }
                    }
                )
            ).toEqual({
                ...initialState,
                error: 'Ops!',
                version: '1.0.0',
                loading: false
            });
        });
    });
});
