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

import api from '../../api/appSettings';
import { fetchVersion } from './appSettingsActions';
import {
    FETCH_SETTINGS_VERSION_FAIL,
    FETCH_SETTINGS_VERSION_START,
    FETCH_SETTINGS_VERSION_SUCCESS
} from './types';

describe('appSettings', () => {
    describe('fetchVersion', () => {
        beforeEach(() => {
            jest.spyOn(api, 'getVersion').mockResolvedValue({
                data: { version: '1.0.0' }
            });
        });

        it('should dispatch FETCH_SETTINGS_VERSION_START', async () => {
            const dispatch = jest.fn();

            await fetchVersion()(dispatch);

            expect(dispatch).toHaveBeenCalledWith({
                type: FETCH_SETTINGS_VERSION_START
            });
        });

        it('should dispatch FETCH_SETTINGS_VERSION_START', async () => {
            const dispatch = jest.fn();

            await fetchVersion()(dispatch);

            expect(dispatch.mock.calls).toEqual([
                [
                    {
                        type: FETCH_SETTINGS_VERSION_START
                    }
                ],
                [
                    {
                        type: FETCH_SETTINGS_VERSION_SUCCESS,
                        payload: { version: '1.0.0' }
                    }
                ]
            ]);
        });

        it('should dispatch FETCH_SETTINGS_VERSION_FAIL', async () => {
            jest.spyOn(api, 'getVersion').mockRejectedValue({
                message: 'Ops!'
            });

            const dispatch = jest.fn();

            await fetchVersion()(dispatch);

            expect(dispatch.mock.calls).toEqual([
                [
                    {
                        type: FETCH_SETTINGS_VERSION_START
                    }
                ],
                [
                    {
                        type: FETCH_SETTINGS_VERSION_FAIL,
                        payload: { error: { message: 'Ops!' } }
                    }
                ]
            ]);
        });
    });
});
