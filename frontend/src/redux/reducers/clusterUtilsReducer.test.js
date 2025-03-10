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
    FETCH_CLUSTER_UTILS_START,
    FETCH_CLUSTER_UTILS_SUCCESS,
    FETCH_CLUSTER_UTILS_FAIL
} from '../actions/types';
import clusterUtilsReducer from './clusterUtilsReducer';

describe('cluster utils Reducer', () => {
    const error = 'error';

    const initialState = {
        loading: false,
        data: {}
    };

    it('should return the initial state', () => {
        expect(clusterUtilsReducer(undefined)).toEqual(initialState);
    });

    it('should handle FETCH_CLUSTER_UTILS_START', () => {
        const action = {
            type: FETCH_CLUSTER_UTILS_START
        };
        expect(clusterUtilsReducer(undefined, action)).toEqual({
            ...initialState,
            loading: true
        });
    });

    it('should handle FETCH_CLUSTER_UTILS_SUCCESS', () => {
        const action = {
            type: FETCH_CLUSTER_UTILS_SUCCESS,
            payload: {}
        };
        expect(clusterUtilsReducer(undefined, action)).toEqual({
            ...initialState,
            data: {},
            loading: false
        });
    });

    it('should handle FETCH_CLUSTER_UTILS_FAIL', () => {
        const action = {
            type: FETCH_CLUSTER_UTILS_FAIL,
            payload: { error }
        };
        expect(clusterUtilsReducer(undefined, action)).toEqual({
            ...initialState,
            loading: false,
            error
        });
    });
});
