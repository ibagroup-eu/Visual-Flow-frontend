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

import logsReducer from './logsReducer';
import {
    FETCH_LOGS_FAIL,
    FETCH_LOGS_START,
    FETCH_LOGS_SUCCESS
} from '../actions/types';

describe('Logs Reducer', () => {
    const payload = {
        data: []
    };

    it('should return the initial state', () => {
        expect(logsReducer(undefined)).toEqual({
            loading: true,
            data: []
        });
    });

    it('should handle FETCH_LOGS_START', () => {
        const action = {
            type: FETCH_LOGS_START
        };
        expect(logsReducer(undefined, action)).toEqual({
            loading: true,
            data: [],
            error: null
        });
    });

    it('should handle FETCH_JOBS_SUCCESS', () => {
        const action = {
            type: FETCH_LOGS_SUCCESS,
            payload
        };
        expect(logsReducer(undefined, action)).toEqual({
            loading: false,
            data: payload,
            error: null
        });
    });

    it('should handle FETCH_LOGS_FAIL', () => {
        const action = {
            type: FETCH_LOGS_FAIL,
            payload: { error: {} }
        };
        expect(logsReducer(undefined, action)).toEqual({
            loading: false,
            data: [],
            error: {}
        });
    });
});
