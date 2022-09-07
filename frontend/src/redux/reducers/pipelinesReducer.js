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
    FETCH_PIPELINES_START,
    FETCH_PIPELINES_FAIL,
    FETCH_PIPELINES_SUCCESS,
    DELETE_PIPELINES_FAIL,
    DELETE_PIPELINES_SUCCESS,
    RUN_PIPELINE_START,
    RUN_PIPELINE_SUCCESS,
    STOP_PIPELINE_SUCCESS,
    STOP_PIPELINE_START,
    RUN_PIPELINE_FAIL,
    STOP_PIPELINE_FAIL,
    RESUME_PIPELINE_START,
    RESUME_PIPELINE_SUCCESS,
    RESUME_PIPELINE_FAIL,
    CREATE_PIPELINE_START,
    CREATE_PIPELINE_SUCCESS,
    CREATE_PIPELINE_FAIL,
    UPDATE_PIPELINE_START,
    UPDATE_PIPELINE_SUCCESS,
    UPDATE_PIPELINE_FAIL,
    COPY_PIPELINE_START,
    COPY_PIPELINE_SUCCESS,
    COPY_PIPELINE_FAIL,
    SET_PIPELINES_LAST_RUN,
    SET_PIPELINES_STATUS
} from '../actions/types';

const initialState = {
    loading: true,
    data: [],
    pipelineRun: false,
    lastRun: '',
    status: ''
};

// eslint-disable-next-line complexity
const pipelinesReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case FETCH_PIPELINES_START:
        case CREATE_PIPELINE_START:
        case UPDATE_PIPELINE_START:
        case COPY_PIPELINE_START:
            return {
                ...state,
                loading: true
            };
        case FETCH_PIPELINES_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            };
        case FETCH_PIPELINES_FAIL:
        case CREATE_PIPELINE_FAIL:
        case UPDATE_PIPELINE_FAIL:
        case COPY_PIPELINE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        case CREATE_PIPELINE_SUCCESS:
        case UPDATE_PIPELINE_SUCCESS:
        case COPY_PIPELINE_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case DELETE_PIPELINES_FAIL:
            return {
                ...state,
                error: action.payload.error
            };
        case DELETE_PIPELINES_SUCCESS:
            return {
                ...state,
                data: state.data.pipelines.filter(
                    job => action.payload.id?.indexOf(job.id) === -1
                ),
                success: action.payload.success
            };
        case RUN_PIPELINE_START:
        case RESUME_PIPELINE_START:
            return {
                ...state,
                pipelineRun: true
            };
        case RUN_PIPELINE_SUCCESS:
        case STOP_PIPELINE_SUCCESS:
        case RESUME_PIPELINE_SUCCESS:
        case STOP_PIPELINE_START:
            return {
                ...state,
                pipelineRun: false
            };
        case RUN_PIPELINE_FAIL:
        case STOP_PIPELINE_FAIL:
        case RESUME_PIPELINE_FAIL:
            return {
                ...state,
                pipelineRun: false,
                error: action.payload.error
            };
        case SET_PIPELINES_LAST_RUN:
            return {
                ...state,
                lastRun: action.payload
            };
        case SET_PIPELINES_STATUS:
            return {
                ...state,
                status: action.payload
            };
        default:
            return state;
    }
};

export default pipelinesReducer;
