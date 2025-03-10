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
    CREATE_CRON_FAIL,
    CREATE_CRON_START,
    CREATE_CRON_SUCCESS,
    FETCH_CRON_FAIL,
    FETCH_CRON_START,
    FETCH_CRON_SUCCESS,
    UPDATE_CRON_FAIL,
    UPDATE_CRON_START,
    UPDATE_CRON_SUCCESS
} from '../actions/types';
import cronReducer from './cronReducer';

describe('cron Reducer', () => {
    const mockData = {
        schedule: '',
        suspend: true
    };
    const error = 'error';

    const initialState = {
        loading: false,
        data: mockData
    };

    it('should return the initial state', () => {
        expect(cronReducer(undefined)).toEqual(initialState);
    });

    it('should handle FETCH_CRON_START', () => {
        const action = {
            type: FETCH_CRON_START
        };
        expect(cronReducer(undefined, action)).toEqual({
            ...initialState,
            loading: true
        });
    });

    it('should handle FETCH_CRON_SUCCESS', () => {
        const action = {
            type: FETCH_CRON_SUCCESS,
            payload: { ...mockData }
        };
        expect(cronReducer(undefined, action)).toEqual({
            ...initialState,
            data: { ...mockData },
            loading: false
        });
    });

    it('should handle FETCH_CRON_FAIL', () => {
        const action = {
            type: FETCH_CRON_FAIL,
            payload: { error }
        };
        expect(cronReducer(undefined, action)).toEqual({
            ...initialState,
            loading: false,
            error
        });
    });

    it('should handle CREATE_CRON_START', () => {
        const action = {
            type: CREATE_CRON_START
        };
        expect(cronReducer(undefined, action)).toEqual({
            ...initialState,
            loading: true
        });
    });

    it('should handle CREATE_CRON_SUCCESS', () => {
        const action = {
            type: CREATE_CRON_SUCCESS,
            payload: { ...mockData }
        };
        expect(cronReducer(undefined, action)).toEqual({
            ...initialState,
            loading: false
        });
    });

    it('should handle CREATE_CRON_FAIL', () => {
        const action = {
            type: CREATE_CRON_FAIL,
            payload: { error }
        };
        expect(cronReducer(undefined, action)).toEqual({
            ...initialState,
            loading: false,
            error
        });
    });

    it('should handle UPDATE_CRON_START', () => {
        const action = {
            type: UPDATE_CRON_START
        };
        expect(cronReducer(undefined, action)).toEqual({
            ...initialState,
            loading: true
        });
    });

    it('should handle UPDATE_CRON_SUCCESS', () => {
        const action = {
            type: UPDATE_CRON_SUCCESS,
            payload: { ...mockData }
        };
        expect(cronReducer(undefined, action)).toEqual({
            ...initialState,
            loading: false
        });
    });

    it('should handle UPDATE_CRON_FAIL', () => {
        const action = {
            type: UPDATE_CRON_FAIL,
            payload: { error }
        };
        expect(cronReducer(undefined, action)).toEqual({
            ...initialState,
            loading: false,
            error
        });
    });
});
