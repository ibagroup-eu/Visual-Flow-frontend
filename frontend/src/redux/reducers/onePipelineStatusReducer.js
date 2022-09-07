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
    FETCH_PIPELINE_STATUS_START,
    FETCH_PIPELINE_STATUS_SUCCESS,
    FETCH_PIPELINE_STATUS_FAIL,
    UPDATE_PIPELINE_STATUS_START,
    UPDATE_PIPELINE_STATUS_SUCCESS,
    UPDATE_PIPELINE_STATUS_FAIL
} from '../actions/types';

const initialState = {
    status: '',
    progress: 0,
    loading: false
};

const onePipelineStatusReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case FETCH_PIPELINE_STATUS_START:
        case UPDATE_PIPELINE_STATUS_START:
            return {
                ...state,
                loading: true
            };
        case FETCH_PIPELINE_STATUS_SUCCESS:
        case UPDATE_PIPELINE_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                status: action.payload.status,
                progress: action.payload.progress,
                id: action.payload.id
            };
        case FETCH_PIPELINE_STATUS_FAIL:
        case UPDATE_PIPELINE_STATUS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        default:
            return state;
    }
};

export default onePipelineStatusReducer;
