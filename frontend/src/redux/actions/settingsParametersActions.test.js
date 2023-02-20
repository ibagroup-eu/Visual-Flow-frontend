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
    updateParameters,
    fetchParameters,
    updateParameter,
    createParameter,
    deleteParameter
} from './settingsParametersActions';
import api from '../../api/projects';
import {
    FETCH_PARAMETERS_START,
    FETCH_PARAMETERS_SUCCESS,
    FETCH_PARAMETERS_FAIL,
    UPDATE_PARAMETERS_START,
    UPDATE_PARAMETERS_FAIL,
    UPDATE_PARAMETERS_SUCCESS,
    UPDATE_PARAMETER_START,
    UPDATE_PARAMETER_SUCCESS,
    UPDATE_PARAMETER_FAIL,
    CREATE_PARAMETER_START,
    CREATE_PARAMETER_SUCCESS,
    CREATE_PARAMETER_FAIL,
    DELETE_PARAMETER_SUCCESS,
    DELETE_PARAMETER_START,
    DELETE_PARAMETER_FAIL
} from './types';

describe('Parameters action', () => {
    let data;
    let dispatch;

    describe('getParameters', () => {
        beforeEach(() => {
            data = { params: [{ key: 'key', value: { text: 'value' } }] };
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
                    [
                        {
                            type: FETCH_PARAMETERS_SUCCESS,
                            payload: {
                                params: [{ key: 'key', value: 'value', id: 'key' }]
                            }
                        }
                    ]
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

    describe('updateParameter', () => {
        beforeEach(() => {
            data = {
                pages: {
                    settingsParameters: {
                        params: [{ id: 'key_1', key: 'key_1', value: 'value_1' }]
                    }
                }
            };
            dispatch = jest.fn();
        });

        it('should dispatch UPDATE_PARAMETER_SUCCESS', async () => {
            jest.spyOn(api, 'updateProjectParameter').mockResolvedValue({});

            const param = { id: 'key_1', key: 'key_11', value: 'value_11' };

            await updateParameter(0, param)(dispatch, () => data);

            expect(dispatch.mock.calls).toEqual([
                [{ type: UPDATE_PARAMETER_START, payload: { id: param.id } }],
                [
                    {
                        type: UPDATE_PARAMETER_SUCCESS,
                        payload: {
                            params: [
                                { id: 'key_11', key: 'key_11', value: 'value_11' }
                            ],
                            id: param.id
                        }
                    }
                ]
            ]);
        });

        it('should dispatch UPDATE_PARAMETER_FAIL', async () => {
            jest.spyOn(api, 'updateProjectParameter').mockRejectedValue('Ops!');

            const param = { id: 'key_1', key: 'key_11', value: 'value_11' };

            await updateParameter(0, param)(dispatch, () => data);

            expect(dispatch.mock.calls).toEqual([
                [{ type: UPDATE_PARAMETER_START, payload: { id: param.id } }],
                [
                    {
                        type: UPDATE_PARAMETER_FAIL,
                        payload: {
                            error: 'Ops!',
                            id: param.id
                        }
                    }
                ]
            ]);
        });
    });

    describe('createParameter', () => {
        beforeEach(() => {
            data = {
                pages: {
                    settingsParameters: {
                        params: []
                    }
                }
            };
            dispatch = jest.fn();
        });

        it('should dispatch CREATE_PARAMETER_SUCCESS', async () => {
            jest.spyOn(api, 'createProjectParameter').mockResolvedValue({});

            const param = { id: 'key_1', key: 'key_1', value: 'value_1' };

            await createParameter(0, param)(dispatch, () => data);

            expect(dispatch.mock.calls).toEqual([
                [{ type: CREATE_PARAMETER_START }],
                [
                    {
                        type: CREATE_PARAMETER_SUCCESS,
                        payload: {
                            params: [{ id: 'key_1', key: 'key_1', value: 'value_1' }]
                        }
                    }
                ]
            ]);
        });

        it('should dispatch CREATE_PARAMETER_FAIL', async () => {
            jest.spyOn(api, 'createProjectParameter').mockRejectedValue('Ops!');

            const param = { id: 'key_1', key: 'key_1', value: 'value_1' };

            await createParameter(0, param)(dispatch, () => data);

            expect(dispatch.mock.calls).toEqual([
                [{ type: CREATE_PARAMETER_START }],
                [
                    {
                        type: CREATE_PARAMETER_FAIL,
                        payload: {
                            error: 'Ops!'
                        }
                    }
                ]
            ]);
        });
    });

    describe('deleteParameter', () => {
        beforeEach(() => {
            data = {
                pages: {
                    settingsParameters: {
                        params: [{ id: 'key_1', key: 'key_1', value: 'value_1' }]
                    }
                }
            };
            dispatch = jest.fn();
        });

        it('should dispatch DELETE_PARAMETER_SUCCESS', async () => {
            jest.spyOn(api, 'deleteProjectParameter').mockResolvedValue({});

            const param = { id: 'key_1', key: 'key_11', value: 'value_11' };

            await deleteParameter(0, param)(dispatch, () => data);

            expect(dispatch.mock.calls).toEqual([
                [{ type: DELETE_PARAMETER_START, payload: { id: param.id } }],
                [
                    {
                        type: DELETE_PARAMETER_SUCCESS,
                        payload: {
                            params: [],
                            id: param.id
                        }
                    }
                ]
            ]);
        });

        it('should dispatch DELETE_PARAMETER_FAIL', async () => {
            jest.spyOn(api, 'deleteProjectParameter').mockRejectedValue('Ops!');

            const param = { id: 'key_1', key: 'key_11', value: 'value_11' };

            await deleteParameter(0, param)(dispatch, () => data);

            expect(dispatch.mock.calls).toEqual([
                [{ type: DELETE_PARAMETER_START, payload: { id: param.id } }],
                [
                    {
                        type: DELETE_PARAMETER_FAIL,
                        payload: {
                            error: 'Ops!',
                            id: param.id
                        }
                    }
                ]
            ]);
        });
    });
});
