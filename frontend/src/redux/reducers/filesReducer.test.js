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
    CLEAR_FILES_STATE,
    DOWNLOAD_FILES_FAIL,
    DOWNLOAD_FILES_START,
    DOWNLOAD_FILES_SUCCESS,
    UPLOAD_FILES_FAIL,
    UPLOAD_FILES_START,
    UPLOAD_FILES_SUCCESS
} from '../actions/types';
import filesReducer from './filesReducer';

describe('Files Reducer', () => {
    const payload = {
        data: {}
    };

    it('should return the initial state', () => {
        expect(filesReducer(undefined)).toEqual({
            loading: false,
            uploaded: false,
            data: null
        });
    });

    it('should handle UPLOAD_FILES_START', () => {
        const action = {
            type: UPLOAD_FILES_START
        };
        expect(filesReducer(undefined, action)).toEqual({
            loading: true,
            uploaded: false,
            data: null
        });
    });

    it('should handle UPLOAD_FILES_SUCCESS', () => {
        const action = {
            type: UPLOAD_FILES_SUCCESS,
            payload
        };
        expect(filesReducer(undefined, action)).toEqual({
            loading: false,
            uploaded: true,
            data: null
        });
    });

    it('should handle UPLOAD_FILES_FAIL', () => {
        const action = {
            type: UPLOAD_FILES_FAIL,
            payload: { error: {} }
        };
        expect(filesReducer(undefined, action)).toEqual({
            loading: false,
            uploaded: false,
            data: null,
            error: {}
        });
    });

    it('should handle DOWNLOAD_FILES_START', () => {
        const action = {
            type: DOWNLOAD_FILES_START
        };
        expect(filesReducer(undefined, action)).toEqual({
            loading: true,
            uploaded: false,
            data: null
        });
    });

    it('should handle DOWNLOAD_FILES_SUCCESS', () => {
        const action = {
            type: DOWNLOAD_FILES_SUCCESS,
            payload
        };
        expect(filesReducer(undefined, action)).toEqual({
            loading: false,
            uploaded: false,
            data: payload
        });
    });

    it('should handle DOWNLOAD_FILES_FAIL', () => {
        const action = {
            type: DOWNLOAD_FILES_FAIL,
            payload: { error: {} }
        };
        expect(filesReducer(undefined, action)).toEqual({
            loading: false,
            uploaded: false,
            data: null,
            error: {}
        });
    });

    it('should handle DOWNLOAD_FILES_DELETE_FILE', () => {
        const action = {
            type: CLEAR_FILES_STATE
        };
        expect(filesReducer(undefined, action)).toEqual({
            loading: false,
            uploaded: false,
            data: null
        });
    });
});
