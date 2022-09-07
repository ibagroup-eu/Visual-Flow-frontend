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

import importExportReducer from './importExportReducer';
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

describe('importExportReducer', () => {
    const payload = {
        data: {}
    };

    const initialState = {
        accessToImport: false,
        loading: false,
        data: {},
        fileName: '',
        isFetching: false
    };

    it('should return the initial state', () => {
        expect(importExportReducer(undefined)).toEqual({
            ...initialState
        });
    });

    it('should handle SET_EXPORT_FILENAME', () => {
        const action = {
            type: SET_EXPORT_FILENAME,
            payload: 'name'
        };
        expect(importExportReducer(undefined, action)).toEqual({
            ...initialState,
            fileName: 'name'
        });
    });

    it('should handle SET_DEFAULT', () => {
        const action = {
            type: SET_DEFAULT
        };
        expect(importExportReducer(undefined, action)).toEqual({
            ...initialState
        });
    });

    describe('check access', () => {
        it('should handle CHECK_START', () => {
            const action = {
                type: CHECK_START
            };
            expect(importExportReducer(undefined, action)).toEqual({
                ...initialState,
                loading: true
            });
        });

        it('should handle CHECK_SUCCESS', () => {
            const action = {
                type: CHECK_SUCCESS,
                payload: { access: true }
            };
            expect(importExportReducer(undefined, action)).toEqual({
                ...initialState,
                accessToImport: true
            });
        });

        it('should handle CHECK_FAIL', () => {
            const action = {
                type: CHECK_FAIL,
                payload: { error: '' }
            };
            expect(importExportReducer(undefined, action)).toEqual({
                ...initialState,
                error: ''
            });
        });
    });

    describe('import', () => {
        it('should handle IMPORT_START', () => {
            const action = {
                type: IMPORT_START
            };
            expect(importExportReducer(undefined, action)).toEqual({
                ...initialState,
                loading: true
            });
        });

        it('should handle IMPORT_SUCCESS', () => {
            const action = {
                type: IMPORT_SUCCESS,
                payload
            };
            expect(importExportReducer(undefined, action)).toEqual({
                ...initialState
            });
        });

        it('should handle IMPORT_FAIL', () => {
            const action = {
                type: IMPORT_FAIL,
                payload: { error: '' }
            };
            expect(importExportReducer(undefined, action)).toEqual({
                ...initialState,
                error: ''
            });
        });
    });

    describe('export', () => {
        it('should handle EXPORT_START', () => {
            const action = {
                type: EXPORT_START
            };
            expect(importExportReducer(undefined, action)).toEqual({
                ...initialState,
                loading: true
            });
        });

        it('should handle EXPORT_SUCCESS', () => {
            const action = {
                type: EXPORT_SUCCESS,
                payload
            };
            expect(importExportReducer(undefined, action)).toEqual({
                ...initialState,
                data: payload,
                isFetching: true
            });
        });

        it('should handle EXPORT_FAIL', () => {
            const action = {
                type: EXPORT_FAIL,
                payload: { error: '' }
            };
            expect(importExportReducer(undefined, action)).toEqual({
                ...initialState,
                error: ''
            });
        });
    });
});
