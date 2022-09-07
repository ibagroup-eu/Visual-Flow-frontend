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

import settingsParametersReducer from './settingsParametersReducer';
import {
    FETCH_PARAMETERS_START,
    FETCH_PARAMETERS_FAIL,
    FETCH_PARAMETERS_SUCCESS,
    UPDATE_PARAMETERS_FAIL,
    UPDATE_PARAMETERS_SUCCESS,
    UPDATE_PARAMETERS_START
} from '../actions/types';

describe('settings parameters Reducer', () => {
    const payload = { params: [{ key: 'project', value: 'project-id' }] };

    it('should return the initial state', () => {
        expect(settingsParametersReducer(undefined, {})).toEqual({
            loading: true,
            data: {}
        });
    });

    it('should handle FETCH_PARAMETERS_SUCCESS', () => {
        const action = {
            type: FETCH_PARAMETERS_SUCCESS,
            payload
        };
        expect(settingsParametersReducer(undefined, action)).toEqual({
            loading: false,
            data: payload
        });
    });

    it('should handle FETCH_PARAMETERS_FAIL', () => {
        const action = {
            type: FETCH_PARAMETERS_FAIL,
            payload: { error: {} }
        };
        expect(settingsParametersReducer(undefined, action)).toEqual({
            loading: false,
            error: {},
            data: {}
        });
    });

    it('should handle FETCH_PARAMETERS_START', () => {
        const action = {
            type: FETCH_PARAMETERS_START
        };
        expect(settingsParametersReducer(undefined, action)).toEqual({
            loading: true,
            data: {}
        });
    });

    it('should handle UPDATE_PARAMETERS_FAIL', () => {
        const action = {
            type: UPDATE_PARAMETERS_FAIL,
            payload: { error: {} }
        };
        expect(settingsParametersReducer(undefined, action)).toEqual({
            error: {},
            data: {},
            loading: false
        });
    });

    it('should handle UPDATE_PARAMETERS_SUCCESS', () => {
        const action = {
            type: UPDATE_PARAMETERS_SUCCESS,
            payload
        };
        expect(settingsParametersReducer(undefined, action)).toEqual({
            data: payload,
            loading: false
        });
    });

    it('should handle UPDATE_PARAMETERS_START', () => {
        const action = {
            type: UPDATE_PARAMETERS_START
        };
        expect(settingsParametersReducer(undefined, action)).toEqual({
            loading: true,
            data: {}
        });
    });
});
