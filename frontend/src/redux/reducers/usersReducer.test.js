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

import usersReducer from './usersReducer';
import {
    FETCH_USERS_START,
    FETCH_USERS_FAIL,
    FETCH_USERS_SUCCESS
} from '../actions/types';

describe('users Reducer', () => {
    const payload = [];

    it('should return the initial state', () => {
        expect(usersReducer(undefined, {})).toEqual({
            loading: true,
            data: []
        });
    });

    it('should handle FETCH_USERS_SUCCESS', () => {
        const action = {
            type: FETCH_USERS_SUCCESS,
            payload
        };
        expect(usersReducer(undefined, action)).toEqual({
            loading: false,
            data: payload
        });
    });

    it('should handle FETCH_USERS_FAIL', () => {
        const action = {
            type: FETCH_USERS_FAIL,
            payload: { error: {} }
        };
        expect(usersReducer(undefined, action)).toEqual({
            loading: false,
            error: {},
            data: []
        });
    });

    it('should handle FETCH_USERS_START', () => {
        const action = {
            type: FETCH_USERS_START
        };
        expect(usersReducer(undefined, action)).toEqual({
            loading: true,
            data: []
        });
    });
});
