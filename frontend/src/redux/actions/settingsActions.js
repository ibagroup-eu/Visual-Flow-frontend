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
    GET_PROJECT_START,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_FAIL,
    UPDATE_PROJECT_START,
    UPDATE_PROJECT_FAIL,
    UPDATE_PROJECT_SUCCESS
} from './types';
import api from '../../api/projects';

export const getProject = projectId => dispatch => {
    dispatch({
        type: GET_PROJECT_START,
        payload: projectId
    });

    return api.getProjectById(projectId).then(
        response =>
            dispatch({
                type: GET_PROJECT_SUCCESS,
                payload: response.data
            }),
        error =>
            dispatch({
                type: GET_PROJECT_FAIL,
                payload: { error }
            })
    );
};

export const updateProject = project => dispatch => {
    dispatch({
        type: UPDATE_PROJECT_START,
        payload: project
    });

    return api.updateProject(project).then(
        () =>
            dispatch({
                type: UPDATE_PROJECT_SUCCESS,
                payload: project
            }),
        error =>
            dispatch({
                type: UPDATE_PROJECT_FAIL,
                payload: { error }
            })
    );
};
