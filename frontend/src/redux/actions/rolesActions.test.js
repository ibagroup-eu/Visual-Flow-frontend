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

import fetchRoles from './rolesActions';
import api from '../../api/users';
import { FETCH_ROLES_START, FETCH_ROLES_FAIL, FETCH_ROLES_SUCCESS } from './types';

describe('roles actions', () => {
    let data;
    let dispatch;

    describe('fetchRoles', () => {
        beforeEach(() => {
            data = [];
            dispatch = jest.fn();
            jest.spyOn(api, 'getRoles').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_ROLES_START', () => {
            fetchRoles()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_ROLES_START });
        });

        it('should dispatch FETCH_ROLES_SUCCESS on success', () => {
            return fetchRoles()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_ROLES_START }],
                    [{ type: FETCH_ROLES_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch FETCH_ROLES_FAIL on failure', () => {
            jest.spyOn(api, 'getRoles').mockRejectedValue({});
            return fetchRoles()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_ROLES_START }],
                    [{ type: FETCH_ROLES_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });
});
