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
    UPLOAD_FILES_START,
    UPLOAD_FILES_SUCCESS,
    UPLOAD_FILES_FAIL,
    DOWNLOAD_FILES_START,
    DOWNLOAD_FILES_FAIL,
    DOWNLOAD_FILES_SUCCESS,
    CLEAR_FILES_STATE
} from '../actions/types';

const initialState = {
    loading: false,
    uploaded: false,
    data: null
};

// eslint-disable-next-line complexity
const filesReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case UPLOAD_FILES_START:
            return {
                ...state,
                loading: true,
                uploaded: false
            };
        case DOWNLOAD_FILES_START:
            return {
                ...state,
                loading: true
            };
        case UPLOAD_FILES_SUCCESS:
            return {
                ...state,
                loading: false,
                uploaded: true
            };
        case DOWNLOAD_FILES_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            };
        case UPLOAD_FILES_FAIL:
        case DOWNLOAD_FILES_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        case CLEAR_FILES_STATE:
            return {
                ...state,
                data: null,
                uploaded: false
            };
        default:
            return state;
    }
};

export default filesReducer;
