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
    FETCH_JOBS_START,
    FETCH_JOBS_SUCCESS,
    FETCH_JOBS_FAIL,
    DELETE_JOBS_FAIL,
    DELETE_JOBS_SUCCESS,
    CREATE_JOB_START,
    CREATE_JOB_FAIL,
    CREATE_JOB_SUCCESS,
    UPDATE_JOB_FAIL,
    UPDATE_JOB_SUCCESS,
    UPDATE_JOB_START,
    RUN_JOB_START,
    RUN_JOB_FAIL,
    RUN_JOB_SUCCESS,
    STOP_JOB_START,
    STOP_JOB_FAIL,
    STOP_JOB_SUCCESS,
    SET_JOB_SEARCH_FIELD,
    COPY_JOB_START,
    COPY_JOB_SUCCESS,
    COPY_JOB_FAIL,
    SET_JOBS_LAST_RUN,
    SET_JOBS_STATUS
} from '../actions/types';

const initialState = {
    loading: true,
    data: [],
    searchField: '',
    jobRun: false,
    lastRun: '',
    status: ''
};

// eslint-disable-next-line complexity
const jobsReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case FETCH_JOBS_START:
        case CREATE_JOB_START:
        case UPDATE_JOB_START:
        case COPY_JOB_START:
            return {
                ...state,
                loading: true
            };
        case FETCH_JOBS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            };
        case FETCH_JOBS_FAIL:
        case CREATE_JOB_FAIL:
        case UPDATE_JOB_FAIL:
        case COPY_JOB_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        case CREATE_JOB_SUCCESS:
        case UPDATE_JOB_SUCCESS:
        case COPY_JOB_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case DELETE_JOBS_FAIL:
            return {
                ...state,
                error: action.payload.error
            };
        case DELETE_JOBS_SUCCESS:
            return {
                ...state,
                success: action.payload.success
            };
        case RUN_JOB_START:
            return {
                ...state,
                jobRun: true
            };
        case RUN_JOB_SUCCESS:
        case STOP_JOB_SUCCESS:
        case STOP_JOB_START:
            return {
                ...state,
                jobRun: false
            };
        case RUN_JOB_FAIL:
        case STOP_JOB_FAIL:
            return {
                ...state,
                jobRun: false,
                error: action.payload.error
            };
        case SET_JOB_SEARCH_FIELD:
            return { ...state, searchField: action.payload };
        case SET_JOBS_LAST_RUN:
            return {
                ...state,
                lastRun: action.payload
            };
        case SET_JOBS_STATUS:
            return {
                ...state,
                status: action.payload
            };
        default:
            return state;
    }
};

export default jobsReducer;
