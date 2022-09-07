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

import oneJobStatusReducer from './oneJobStatusReducer';
import {
    FETCH_JOB_STATUS_START,
    FETCH_JOB_STATUS_SUCCESS,
    FETCH_JOB_STATUS_FAIL
} from '../actions/types';

describe('Jobs Reducer', () => {
    const payload = {
        data: []
    };

    it('should return the initial state', () => {
        expect(oneJobStatusReducer(undefined)).toEqual({
            loading: false,
            status: ''
        });
    });

    it('should handle FETCH_JOB_STATUS_SUCCESS', () => {
        const action = {
            type: FETCH_JOB_STATUS_SUCCESS,
            payload
        };
        expect(oneJobStatusReducer(undefined, action)).toEqual({
            loading: false,
            status: payload.data.status
        });
    });

    it('should handle FETCH_JOB_STATUS_FAIL', () => {
        const action = {
            type: FETCH_JOB_STATUS_FAIL,
            payload: { error: '' }
        };
        expect(oneJobStatusReducer(undefined, action)).toEqual({
            loading: false,
            status: '',
            error: ''
        });
    });

    it('should handle FETCH_JOB_STATUS_START', () => {
        const action = {
            type: FETCH_JOB_STATUS_START
        };
        expect(oneJobStatusReducer(undefined, action)).toEqual({
            loading: true,
            status: ''
        });
    });
});
