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
    CREATE_PROJECT_SUCCESS,
    CREATE_PROJECT_FAIL,
    SET_CURRENT_PROJECT,
    DELETE_PROJECT_FAIL,
    DELETE_PROJECT_SUCCESS
} from '../actions/types';

const initialState = {
    loading: true,
    data: {},
    currentProject: null
};

const projectsReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case FETCH_PROJECTS_START:
            return {
                ...state,
                loading: true
            };
        case FETCH_PROJECTS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            };
        case FETCH_PROJECTS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        case CREATE_PROJECT_SUCCESS:
            return {
                ...state,
                success: action.payload
            };
        case CREATE_PROJECT_FAIL:
        case DELETE_PROJECT_FAIL:
            return {
                ...state,
                error: action.payload.error
            };
        case DELETE_PROJECT_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    projects: state.data?.projects.filter(
                        project => project.id !== action.payload.id
                    )
                },
                success: action.payload.success
            };
        case SET_CURRENT_PROJECT:
            return {
                ...state,
                currentProject: action.payload
            };
        default:
            return state;
    }
};

export default projectsReducer;
