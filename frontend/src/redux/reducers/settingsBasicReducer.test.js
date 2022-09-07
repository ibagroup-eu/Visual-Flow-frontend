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

import settingsBasicReducer from './settingsBasicReducer';
import {
    GET_PROJECT_START,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_FAIL,
    UPDATE_PROJECT_FAIL,
    UPDATE_PROJECT_SUCCESS
} from '../actions/types';

describe('settings Basic Reducer', () => {
    const payload = { name: 'project', id: 'project-id' };

    it('should return the initial state', () => {
        expect(settingsBasicReducer(undefined, {})).toEqual({});
    });

    it('should handle GET_PROJECT_SUCCESS', () => {
        const action = {
            type: GET_PROJECT_SUCCESS,
            payload
        };
        expect(settingsBasicReducer(undefined, action)).toEqual({
            loading: false,
            error: false,
            project: payload
        });
    });

    it('should handle GET_PROJECT_FAIL', () => {
        const action = {
            type: GET_PROJECT_FAIL,
            payload: { error: {} }
        };
        expect(settingsBasicReducer(undefined, action)).toEqual({
            loading: false,
            error: {}
        });
    });

    it('should handle GET_PROJECT_START', () => {
        const action = {
            type: GET_PROJECT_START
        };
        expect(settingsBasicReducer(undefined, action)).toEqual({
            loading: true
        });
    });

    it('should handle UPDATE_PROJECT_FAIL', () => {
        const action = {
            type: UPDATE_PROJECT_FAIL,
            payload: { error: {} }
        };
        expect(settingsBasicReducer(undefined, action)).toEqual({
            error: {}
        });
    });

    it('should handle UPDATE_PROJECT_SUCCESS', () => {
        const action = {
            type: UPDATE_PROJECT_SUCCESS,
            payload
        };
        expect(settingsBasicReducer(undefined, action)).toEqual({
            error: false,
            project: payload
        });
    });
});
