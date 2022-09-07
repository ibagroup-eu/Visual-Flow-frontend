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
    FETCH_USERS_AND_ROLES_START,
    FETCH_USERS_AND_ROLES_SUCCESS,
    FETCH_USERS_AND_ROLES_FAIL,
    UPDATE_USERS_AND_ROLES_START,
    UPDATE_USERS_AND_ROLES_SUCCESS,
    UPDATE_USERS_AND_ROLES_FAIL
} from './types';
import projectsApi from '../../api/projects';

export const fetchProjectUsers = id => dispatch => {
    dispatch({
        type: FETCH_USERS_AND_ROLES_START
    });

    return projectsApi.getProjectUsers(id).then(
        response =>
            dispatch({
                type: FETCH_USERS_AND_ROLES_SUCCESS,
                payload: response.data
            }),
        error =>
            dispatch({
                type: FETCH_USERS_AND_ROLES_FAIL,
                payload: { error }
            })
    );
};

export const updateProjectUsers = (id, updatedUsers) => dispatch => {
    const tmp = {};
    updatedUsers.forEach(user => {
        tmp[user.username] = user.role;
    });

    dispatch({
        type: UPDATE_USERS_AND_ROLES_START
    });

    return projectsApi.updateProjectUsers(id, tmp).then(
        () =>
            dispatch({
                type: UPDATE_USERS_AND_ROLES_SUCCESS,
                payload: tmp
            }),
        error =>
            dispatch({
                type: UPDATE_USERS_AND_ROLES_FAIL,
                payload: { error }
            })
    );
};
