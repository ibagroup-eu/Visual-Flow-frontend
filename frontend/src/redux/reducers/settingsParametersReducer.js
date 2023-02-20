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
    CREATE_PARAMETER_FAIL,
    CREATE_PARAMETER_START,
    CREATE_PARAMETER_SUCCESS,
    DELETE_PARAMETER_FAIL,
    DELETE_PARAMETER_START,
    DELETE_PARAMETER_SUCCESS,
    FETCH_PARAMETERS_FAIL,
    FETCH_PARAMETERS_START,
    FETCH_PARAMETERS_SUCCESS,
    UPDATE_PARAMETER_FAIL,
    UPDATE_PARAMETER_START,
    UPDATE_PARAMETER_SUCCESS
} from '../actions/types';

export const initialState = {
    loading: false,
    editable: false,
    params: [],
    saving: false,
    editStatus: {},
    deleteStatus: {}
};

const settingsParametersReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case FETCH_PARAMETERS_START:
            return {
                ...state,
                loading: true
            };
        case FETCH_PARAMETERS_SUCCESS:
            return {
                ...state,
                ...action.payload,
                loading: false
            };
        case FETCH_PARAMETERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };

        case DELETE_PARAMETER_START:
            return {
                ...state,
                saving: true,
                deleteStatus: {
                    ...state.deleteStatus,
                    [action.payload.id]: true
                }
            };
        case DELETE_PARAMETER_SUCCESS:
            return {
                ...state,
                params: action.payload.params,
                saving: false,
                deleteStatus: {
                    ...state.deleteStatus,
                    [action.payload.id]: false
                }
            };
        case DELETE_PARAMETER_FAIL:
            return {
                ...state,
                error: action.payload.error,
                saving: false,
                deleteStatus: {
                    ...state.deleteStatus,
                    [action.payload.id]: false
                }
            };

        case CREATE_PARAMETER_START:
            return {
                ...state,
                saving: true
            };
        case CREATE_PARAMETER_SUCCESS:
            return {
                ...state,
                params: action.payload.params,
                saving: false
            };
        case CREATE_PARAMETER_FAIL:
            return {
                ...state,
                error: action.payload.error,
                saving: false
            };

        case UPDATE_PARAMETER_START:
            return {
                ...state,
                saving: true,
                editStatus: {
                    ...state.editStatus,
                    [action.payload.id]: true
                }
            };
        case UPDATE_PARAMETER_SUCCESS:
            return {
                ...state,
                params: action.payload.params,
                saving: false,
                editStatus: {
                    ...state.editStatus,
                    [action.payload.id]: false
                }
            };
        case UPDATE_PARAMETER_FAIL:
            return {
                ...state,
                error: action.payload.error,
                saving: false,
                editStatus: {
                    ...state.editStatus,
                    [action.payload.id]: false
                }
            };

        default:
            return state;
    }
};

export default settingsParametersReducer;
