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
    CHECK_START,
    CHECK_SUCCESS,
    CHECK_FAIL,
    IMPORT_START,
    IMPORT_SUCCESS,
    IMPORT_FAIL,
    EXPORT_START,
    EXPORT_SUCCESS,
    EXPORT_FAIL,
    SET_EXPORT_FILENAME,
    SET_DEFAULT
} from '../actions/types';

const initialState = {
    accessToImport: false,
    loading: false,
    data: {},
    fileName: '',
    isFetching: false
};

// eslint-disable-next-line complexity
const importExportReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case CHECK_START:
        case IMPORT_START:
        case EXPORT_START:
            return {
                ...state,
                loading: true
            };
        case CHECK_SUCCESS:
            return {
                ...state,
                loading: false,
                accessToImport: action.payload.access
            };
        case IMPORT_SUCCESS:
            return {
                ...state,
                loading: false
            };
        case CHECK_FAIL:
        case IMPORT_FAIL:
        case EXPORT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        case EXPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                isFetching: true,
                data: action.payload
            };
        case SET_EXPORT_FILENAME:
            return {
                ...state,
                fileName: action.payload
            };
        case SET_DEFAULT:
            return { ...initialState };
        default:
            return state;
    }
};

export default importExportReducer;
