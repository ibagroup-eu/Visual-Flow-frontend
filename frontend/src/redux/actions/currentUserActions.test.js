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

import { fetchCurrentUser } from './currentUserActions';
import userApi from '../../api/users';
import {
    FETCH_CURRENT_USER_START,
    FETCH_CURRENT_USER_SUCCESS,
    FETCH_CURRENT_USER_FAIL
} from './types';

describe('currentUser actions', () => {
    let dispatch;

    beforeEach(() => {
        dispatch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should dispatch FETCH_CURRENT_USER_START', () => {
        jest.spyOn(userApi, 'getCurrentUser').mockResolvedValue({ data: {} });
        fetchCurrentUser()(dispatch);
        expect(dispatch).toHaveBeenCalledWith({ type: FETCH_CURRENT_USER_START });
    });

    it('should dispatch FETCH_CURRENT_USER_SUCCESS on success', async () => {
        const data = { isSuperUser: true };
        jest.spyOn(userApi, 'getCurrentUser').mockResolvedValue({ data });

        await fetchCurrentUser()(dispatch);

        expect(dispatch.mock.calls).toEqual([
            [{ type: FETCH_CURRENT_USER_START }],
            [{ type: FETCH_CURRENT_USER_SUCCESS, payload: data }]
        ]);
    });

    it('should dispatch FETCH_CURRENT_USER_FAIL on failure', async () => {
        const error = new Error('Network Error');
        jest.spyOn(userApi, 'getCurrentUser').mockRejectedValue(error);

        await fetchCurrentUser()(dispatch);

        expect(dispatch.mock.calls).toEqual([
            [{ type: FETCH_CURRENT_USER_START }],
            [{ type: FETCH_CURRENT_USER_FAIL, payload: { error } }]
        ]);
    });
});
