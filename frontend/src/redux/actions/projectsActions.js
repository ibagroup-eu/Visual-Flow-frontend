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
    FETCH_PROJECTS_START,
    FETCH_PROJECTS_SUCCESS,
    FETCH_PROJECTS_FAIL,
    CREATE_PROJECT,
    CREATE_PROJECT_FAIL,
    CREATE_PROJECT_SUCCESS,
    SET_CURRENT_PROJECT,
    DELETE_PROJECT,
    DELETE_PROJECT_FAIL,
    DELETE_PROJECT_SUCCESS
} from './types';
import api from '../../api/projects';
import history from '../../utils/history';

export const setCurrentProject = projectId => ({
    type: SET_CURRENT_PROJECT,
    payload: projectId
});

export const fetchProjects = () => dispatch => {
    dispatch({
        type: FETCH_PROJECTS_START
    });

    const sortByLocked = (arr = []) => [
        ...arr.filter(e => !e.locked),
        ...arr.filter(e => e.locked)
    ];

    return api.getProjects().then(
        response =>
            dispatch({
                type: FETCH_PROJECTS_SUCCESS,
                payload: {
                    ...response.data,
                    projects: sortByLocked(response.data?.projects)
                }
            }),
        error =>
            dispatch({
                type: FETCH_PROJECTS_FAIL,
                payload: { error }
            })
    );
};

export const createProject = project => dispatch => {
    dispatch({
        type: CREATE_PROJECT,
        payload: { project }
    });

    return api.createProject(project).then(
        response => {
            dispatch({
                type: CREATE_PROJECT_SUCCESS,
                payload: response.data
            });
            history.push('/');
        },
        error =>
            dispatch({
                type: CREATE_PROJECT_FAIL,
                payload: { error }
            })
    );
};

export const deleteProject = projectId => dispatch => {
    dispatch({
        type: DELETE_PROJECT,
        payload: projectId
    });
    return api.deleteProject(projectId).then(
        response => {
            dispatch({
                type: DELETE_PROJECT_SUCCESS,
                payload: { success: response.data, id: projectId }
            });
            dispatch(fetchProjects());
        },
        error =>
            dispatch({
                type: DELETE_PROJECT_FAIL,
                payload: { error }
            })
    );
};
