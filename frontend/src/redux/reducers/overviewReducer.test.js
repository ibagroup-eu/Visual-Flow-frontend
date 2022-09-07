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

import overviewReducer from './overviewReducer';
import {
    FETCH_RESOURCE_UTILIZATION_FAIL,
    FETCH_RESOURCE_UTILIZATION_START,
    FETCH_RESOURCE_UTILIZATION_SUCCESS
} from '../actions/types';

describe('overview Reducer', () => {
    const payload = {
        data: {}
    };

    it('should return the initial state', () => {
        expect(overviewReducer(undefined)).toEqual({
            loading: true,
            data: {}
        });
    });

    it('should handle FETCH_RESOURCE_UTILIZATION_SUCCESS', () => {
        const action = {
            type: FETCH_RESOURCE_UTILIZATION_SUCCESS,
            payload
        };
        expect(overviewReducer(undefined, action)).toEqual({
            loading: false,
            data: payload
        });
    });

    it('should handle FETCH_RESOURCE_UTILIZATION_FAIL', () => {
        const action = {
            type: FETCH_RESOURCE_UTILIZATION_FAIL,
            payload: { error: {} }
        };
        expect(overviewReducer(undefined, action)).toEqual({
            loading: false,
            data: {},
            error: {}
        });
    });

    it('should handle FETCH_RESOURCE_UTILIZATION_START', () => {
        const action = {
            type: FETCH_RESOURCE_UTILIZATION_START
        };
        expect(overviewReducer(undefined, action)).toEqual({
            loading: true,
            data: {}
        });
    });
});
