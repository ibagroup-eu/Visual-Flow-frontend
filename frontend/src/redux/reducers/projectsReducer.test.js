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

import projectsReducer from './projectsReducer';
import {
    FETCH_PROJECTS_START,
    FETCH_PROJECTS_SUCCESS,
    FETCH_PROJECTS_FAIL,
    CREATE_PROJECT_SUCCESS,
    CREATE_PROJECT_FAIL,
    SET_CURRENT_PROJECT,
    DELETE_PROJECT_FAIL,
    DELETE_PROJECT_SUCCESS
} from '../actions/types';

describe('projects Reducer', () => {
    const payload = {
        data: {}
    };

    it('should return the initial state', () => {
        expect(projectsReducer(undefined, {})).toEqual({
            loading: true,
            data: {},
            currentProject: null
        });
    });

    it('should handle FETCH_PROJECTS_SUCCESS', () => {
        const action = {
            type: FETCH_PROJECTS_SUCCESS,
            payload
        };
        expect(projectsReducer(undefined, action)).toEqual({
            loading: false,
            data: payload,
            currentProject: null
        });
    });

    it('should handle FETCH_PROJECTS_FAIL', () => {
        const action = {
            type: FETCH_PROJECTS_FAIL,
            payload: { error: {} }
        };
        expect(projectsReducer(undefined, action)).toEqual({
            loading: false,
            data: {},
            currentProject: null,
            error: {}
        });
    });

    it('should handle FETCH_REQUEST_START', () => {
        const action = {
            type: FETCH_PROJECTS_START
        };
        expect(projectsReducer(undefined, action)).toEqual({
            loading: true,
            data: {},
            currentProject: null
        });
    });

    it('should handle CREATE_PROJECT', () => {
        const action = {
            type: CREATE_PROJECT_SUCCESS,
            payload: 'id'
        };
        expect(projectsReducer(undefined, action).success).toEqual('id');
    });

    it('should handle CREATE_PROJECT_FAIL', () => {
        const action = {
            type: CREATE_PROJECT_FAIL,
            payload: { error: 'text' }
        };
        expect(projectsReducer(undefined, action).error).toEqual('text');
    });

    it('should handle DELETE_PROJECT_SUCCESS', () => {
        const action = {
            type: DELETE_PROJECT_SUCCESS,
            payload: { id: 'project-id', success: 'success' }
        };
        const initialState = {
            data: {
                projects: [{ id: 'project-id' }, { id: 'proj' }],
                editable: true
            }
        };
        expect(projectsReducer(initialState, action)).toEqual({
            data: {
                projects: [{ id: 'proj' }],
                editable: true
            },
            success: 'success'
        });
    });

    it('should handle DELETE_PROJECT_FAIL', () => {
        const action = {
            type: DELETE_PROJECT_FAIL,
            payload: { error: 'error' }
        };
        expect(projectsReducer(undefined, action).error).toEqual('error');
    });

    it('should handle SET_CURRENT_PROJECT', () => {
        const project = '1';
        const action = {
            type: SET_CURRENT_PROJECT,
            payload: project
        };
        expect(projectsReducer(undefined, action).currentProject).toEqual(project);
    });
});
