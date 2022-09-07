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

import { fetchProjectUsers, updateProjectUsers } from './settingsUsersRolesActions';
import api from '../../api/projects';
import {
    FETCH_USERS_AND_ROLES_START,
    FETCH_USERS_AND_ROLES_FAIL,
    FETCH_USERS_AND_ROLES_SUCCESS,
    UPDATE_USERS_AND_ROLES_FAIL,
    UPDATE_USERS_AND_ROLES_START,
    UPDATE_USERS_AND_ROLES_SUCCESS
} from './types';

describe('users and roles action', () => {
    let data;
    let dispatch;

    describe('fetchProjectUsers', () => {
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'getProjectUsers').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_USERS_AND_ROLES_START', () => {
            fetchProjectUsers()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({
                type: FETCH_USERS_AND_ROLES_START
            });
        });

        it('should dispatch FETCH_USERS_AND_ROLES_SUCCESS on success', () => {
            return fetchProjectUsers()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_USERS_AND_ROLES_START }],
                    [{ type: FETCH_USERS_AND_ROLES_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch FETCH_USERS_AND_ROLES_FAIL on failure', () => {
            jest.spyOn(api, 'getProjectUsers').mockRejectedValue({});
            return fetchProjectUsers()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_USERS_AND_ROLES_START }],
                    [{ type: FETCH_USERS_AND_ROLES_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('updateProjectUsers', () => {
        const projectId = 'projectId';
        const users = [
            { username: 'TTest', name: 'Tested Testing', role: 'Administrator' }
        ];
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'updateProjectUsers').mockResolvedValue(users);
        });

        const expected_UPDATE_USERS_AND_ROLES_START = {
            type: UPDATE_USERS_AND_ROLES_START
        };

        it('should dispatch UPDATE_PARAMETERS_START', () => {
            updateProjectUsers(projectId, users)(dispatch);
            expect(dispatch).toHaveBeenCalledWith(
                expected_UPDATE_USERS_AND_ROLES_START
            );
        });

        it('should dispatch UPDATE_USERS_AND_ROLES_SUCCESS on success', () => {
            return updateProjectUsers(
                projectId,
                users
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [expected_UPDATE_USERS_AND_ROLES_START],
                    [
                        {
                            type: UPDATE_USERS_AND_ROLES_SUCCESS,
                            payload: { [users[0].username]: users[0].role }
                        }
                    ]
                ]);
            });
        });

        it('should dispatch UPDATE_USERS_AND_ROLES_FAIL on failure', () => {
            jest.spyOn(api, 'updateProjectUsers').mockRejectedValue({});
            return updateProjectUsers(
                projectId,
                users
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [expected_UPDATE_USERS_AND_ROLES_START],
                    [{ type: UPDATE_USERS_AND_ROLES_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });
});
