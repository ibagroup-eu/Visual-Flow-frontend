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

import fetchUsers from './usersActions';
import api from '../../api/users';
import { FETCH_USERS_START, FETCH_USERS_FAIL, FETCH_USERS_SUCCESS } from './types';

describe('users actions', () => {
    let data;
    let dispatch;

    describe('fetchUsers', () => {
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'getUsers').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_USERS_START', () => {
            fetchUsers()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_USERS_START });
        });

        it('should dispatch FETCH_USERS_SUCCESS on success', () => {
            return fetchUsers()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_USERS_START }],
                    [{ type: FETCH_USERS_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch FETCH_USERS_FAIL on failure', () => {
            jest.spyOn(api, 'getUsers').mockRejectedValue({});
            return fetchUsers()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_USERS_START }],
                    [{ type: FETCH_USERS_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });
});
