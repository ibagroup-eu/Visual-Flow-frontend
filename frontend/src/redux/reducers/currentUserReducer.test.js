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

import currentUserReducer from './currentUserReducer';
import {
    FETCH_CURRENT_USER_START,
    FETCH_CURRENT_USER_SUCCESS,
    FETCH_CURRENT_USER_FAIL
} from '../actions/types';

describe('currentUser Reducer', () => {
    const initialState = {
        loading: false,
        data: {},
        error: null
    };

    it('should return the initial state', () => {
        expect(currentUserReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle FETCH_CURRENT_USER_START', () => {
        const action = { type: FETCH_CURRENT_USER_START };
        expect(currentUserReducer(undefined, action)).toEqual({
            ...initialState,
            loading: true,
            error: null
        });
    });

    it('should handle FETCH_CURRENT_USER_SUCCESS', () => {
        const payload = { isSuperUser: true };
        const action = { type: FETCH_CURRENT_USER_SUCCESS, payload };
        expect(currentUserReducer(undefined, action)).toEqual({
            ...initialState,
            loading: false,
            data: payload,
            error: null
        });
    });

    it('should handle FETCH_CURRENT_USER_FAIL', () => {
        const error = new Error('Network Error');
        const action = { type: FETCH_CURRENT_USER_FAIL, payload: { error } };
        expect(currentUserReducer(undefined, action)).toEqual({
            ...initialState,
            loading: false,
            error: error,
            data: {}
        });
    });
});
