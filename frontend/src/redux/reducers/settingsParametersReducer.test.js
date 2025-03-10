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

import settingsParametersReducer, {
    initialState
} from './settingsParametersReducer';
import {
    FETCH_PARAMETERS_START,
    FETCH_PARAMETERS_FAIL,
    FETCH_PARAMETERS_SUCCESS,
    UPDATE_PARAMETERS_FAIL,
    UPDATE_PARAMETERS_SUCCESS,
    UPDATE_PARAMETERS_START,
    DELETE_PARAMETER_START,
    DELETE_PARAMETER_SUCCESS,
    DELETE_PARAMETER_FAIL,
    CREATE_PARAMETER_START,
    CREATE_PARAMETER_SUCCESS,
    CREATE_PARAMETER_FAIL,
    UPDATE_PARAMETER_START,
    UPDATE_PARAMETER_SUCCESS,
    UPDATE_PARAMETER_FAIL
} from '../actions/types';

describe('settings parameters reducer', () => {
    describe('FETCH_PARAMETERS', () => {
        const tests = [
            { state: {}, action: {}, exp: {} },
            {
                state: undefined,
                action: { type: FETCH_PARAMETERS_START },
                exp: { ...initialState, loading: true }
            },
            {
                state: undefined,
                action: {
                    type: FETCH_PARAMETERS_SUCCESS,
                    payload: { editable: true, params: [{}] }
                },
                exp: {
                    ...initialState,
                    editable: true,
                    params: [{}],
                    loading: false
                }
            },
            {
                state: undefined,
                action: {
                    type: FETCH_PARAMETERS_FAIL,
                    payload: { error: 'Ops!' }
                },
                exp: {
                    ...initialState,
                    loading: false,
                    error: 'Ops!'
                }
            }
        ];

        it.each(tests)(
            'should return handle $action.type',
            ({ state, action, exp }) => {
                expect(settingsParametersReducer(state, action)).toEqual(exp);
            }
        );
    });

    describe('DELETE_PARAMETER', () => {
        const tests = [
            { state: {}, action: {}, exp: {} },
            {
                state: undefined,
                action: { type: DELETE_PARAMETER_START, payload: { id: 0 } },
                exp: { ...initialState, saving: true, deleteStatus: { 0: true } }
            },
            {
                state: undefined,
                action: {
                    type: DELETE_PARAMETER_SUCCESS,
                    payload: { params: [{}], id: 0 }
                },
                exp: {
                    ...initialState,
                    saving: false,
                    params: [{}],
                    deleteStatus: { 0: false }
                }
            },
            {
                state: undefined,
                action: {
                    type: DELETE_PARAMETER_FAIL,
                    payload: { error: 'Ops!', id: 0 }
                },
                exp: {
                    ...initialState,
                    saving: false,
                    error: 'Ops!',
                    deleteStatus: { 0: false }
                }
            }
        ];

        it.each(tests)(
            'should return handle $action.type',
            ({ state, action, exp }) => {
                expect(settingsParametersReducer(state, action)).toEqual(exp);
            }
        );
    });

    describe('CREATE_PARAMETER', () => {
        const tests = [
            { state: {}, action: {}, exp: {} },
            {
                state: undefined,
                action: { type: CREATE_PARAMETER_START },
                exp: { ...initialState, saving: true }
            },
            {
                state: undefined,
                action: {
                    type: CREATE_PARAMETER_SUCCESS,
                    payload: { params: [{}] }
                },
                exp: {
                    ...initialState,
                    saving: false,
                    params: [{}]
                }
            },
            {
                state: undefined,
                action: {
                    type: CREATE_PARAMETER_FAIL,
                    payload: { error: 'Ops!' }
                },
                exp: {
                    ...initialState,
                    saving: false,
                    error: 'Ops!'
                }
            }
        ];

        it.each(tests)(
            'should return handle $action.type',
            ({ state, action, exp }) => {
                expect(settingsParametersReducer(state, action)).toEqual(exp);
            }
        );
    });

    describe('UPDATE_PARAMETER', () => {
        const tests = [
            { state: {}, action: {}, exp: {} },
            {
                state: undefined,
                action: { type: UPDATE_PARAMETER_START, payload: { id: 0 } },
                exp: { ...initialState, saving: true, editStatus: { 0: true } }
            },
            {
                state: undefined,
                action: {
                    type: UPDATE_PARAMETER_SUCCESS,
                    payload: { params: [{}], id: 0 }
                },
                exp: {
                    ...initialState,
                    saving: false,
                    params: [{}],
                    editStatus: { 0: false }
                }
            },
            {
                state: undefined,
                action: {
                    type: UPDATE_PARAMETER_FAIL,
                    payload: { error: 'Ops!', id: 0 }
                },
                exp: {
                    ...initialState,
                    saving: false,
                    error: 'Ops!',
                    editStatus: { 0: false }
                }
            }
        ];

        it.each(tests)(
            'should return handle $action.type',
            ({ state, action, exp }) => {
                expect(settingsParametersReducer(state, action)).toEqual(exp);
            }
        );
    });
});
