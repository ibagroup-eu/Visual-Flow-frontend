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

import { updateParameters, fetchParameters } from './settingsParametersActions';
import api from '../../api/projects';
import {
    FETCH_PARAMETERS_START,
    FETCH_PARAMETERS_SUCCESS,
    FETCH_PARAMETERS_FAIL,
    UPDATE_PARAMETERS_START,
    UPDATE_PARAMETERS_FAIL,
    UPDATE_PARAMETERS_SUCCESS
} from './types';

describe('Parameters action', () => {
    let data;
    let dispatch;

    describe('getParameters', () => {
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'getProjectParameters').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_PARAMETERS_START', () => {
            fetchParameters()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_PARAMETERS_START });
        });

        it('should dispatch FETCH_PARAMETERS_SUCCESS on success', () => {
            return fetchParameters()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_PARAMETERS_START }],
                    [{ type: FETCH_PARAMETERS_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch FETCH_PARAMETERS_FAIL on failure', () => {
            jest.spyOn(api, 'getProjectParameters').mockRejectedValue({});
            return fetchParameters()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_PARAMETERS_START }],
                    [{ type: FETCH_PARAMETERS_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('updateParameters', () => {
        const projectId = 'projectId';
        const parameters = { params: [{ key: 'project', value: 'project-id' }] };
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'updateProjectParameters').mockResolvedValue(parameters);
        });

        const expected_UPDATE_PARAMETERS_START = {
            type: UPDATE_PARAMETERS_START,
            payload: parameters
        };

        it('should dispatch UPDATE_PARAMETERS_START', () => {
            updateParameters(projectId, parameters)(dispatch);
            expect(dispatch).toHaveBeenCalledWith(expected_UPDATE_PARAMETERS_START);
        });

        it('should dispatch UPDATE_PARAMETERS_SUCCESS on success', () => {
            return updateParameters(
                projectId,
                parameters
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [expected_UPDATE_PARAMETERS_START],
                    [{ type: UPDATE_PARAMETERS_SUCCESS, payload: parameters }]
                ]);
            });
        });

        it('should dispatch UPDATE_PARAMETERS_FAIL on failure', () => {
            jest.spyOn(api, 'updateProjectParameters').mockRejectedValue({});
            return updateParameters(
                projectId,
                parameters
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [expected_UPDATE_PARAMETERS_START],
                    [{ type: UPDATE_PARAMETERS_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });
});
