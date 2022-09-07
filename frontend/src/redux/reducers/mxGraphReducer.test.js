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
    SET_CURRENT_CELL,
    SET_GRAPH_PARAMS,
    SET_SIDE_PANEL,
    SET_GRAPH_FIELDS,
    FETCH_JOB_START,
    FETCH_JOB_FAIL,
    FETCH_JOB_SUCCESS,
    FETCH_PIPELINE_START,
    FETCH_PIPELINE_SUCCESS,
    FETCH_PIPELINE_FAIL,
    SET_ZOOM_VALUE
} from '../actions/types';
import mxGraphReducer from './mxGraphReducer';

describe('mxGraph Reducer', () => {
    const initialState = {
        currentCell: '',
        sidePanelIsOpen: false,
        data: {},
        dirty: false,
        paramsIsDirty: false,
        sidePanelIsDirty: false,
        loading: true,
        fields: null,
        zoomValue: 1,
        panning: false,
        showLogsModal: false
    };

    it('should return the initial state', () => {
        expect(mxGraphReducer(undefined)).toEqual(initialState);
    });

    it('should handle SET_SIDE_PANEL', () => {
        const action = {
            type: SET_SIDE_PANEL,
            payload: true
        };
        expect(mxGraphReducer(undefined, action)).toEqual({
            ...initialState,
            sidePanelIsOpen: true
        });
    });

    it('should handle SET_CURRENT_CELL', () => {
        const action = {
            type: SET_CURRENT_CELL,
            payload: 'mxId'
        };
        expect(mxGraphReducer(undefined, action)).toEqual({
            ...initialState,
            currentCell: 'mxId'
        });
    });

    it('should handle SET_GRAPH_PARAMS', () => {
        const action = {
            type: SET_GRAPH_PARAMS,
            payload: {
                param1: 'value1'
            }
        };
        expect(mxGraphReducer(undefined, action)).toEqual({
            ...initialState,
            data: {
                params: {
                    param1: 'value1'
                }
            },
            dirty: true
        });
    });

    it('should handle SET_GRAPH_FIELDS', () => {
        const action = {
            type: SET_GRAPH_FIELDS,
            payload: {
                name: {
                    label: 'test',
                    type: 'text'
                }
            }
        };
        expect(mxGraphReducer(undefined, action)).toEqual({
            ...initialState,
            fields: {
                name: {
                    label: 'test',
                    type: 'text'
                }
            }
        });
    });

    it('should handle FETCH_JOB_SUCCESS', () => {
        const action = {
            type: FETCH_JOB_SUCCESS,
            payload: {}
        };
        expect(mxGraphReducer(undefined, action)).toEqual({
            ...initialState,
            dirty: false,
            loading: false,
            data: {}
        });
    });

    it('should handle FETCH_JOB_FAIL', () => {
        const action = {
            type: FETCH_JOB_FAIL,
            payload: { error: {} }
        };
        expect(mxGraphReducer(undefined, action)).toEqual({
            ...initialState,
            loading: false,
            error: {}
        });
    });

    it('should handle FETCH_JOB_START', () => {
        const action = {
            type: FETCH_JOB_START
        };
        expect(mxGraphReducer(undefined, action)).toEqual({
            ...initialState,
            loading: true
        });
    });

    it('should handle SET_ZOOM_VALUE', () => {
        const action = {
            type: SET_ZOOM_VALUE,
            payload: 0.4
        };
        expect(mxGraphReducer(undefined, action)).toEqual({
            ...initialState,
            zoomValue: 0.4
        });
    });

    describe('fetch pipiline', () => {
        const mockPipeline = { id: '123', name: 'mock_name' };
        const error = 'error';

        it('should handle FETCH_PIPELINE_START', () => {
            const action = {
                type: FETCH_PIPELINE_START
            };
            expect(mxGraphReducer(undefined, action)).toEqual({
                ...initialState,
                loading: true
            });
        });

        it('should handle FETCH_PIPELINE_SUCCESS', () => {
            const action = {
                type: FETCH_PIPELINE_SUCCESS,
                payload: { mockPipeline }
            };
            expect(mxGraphReducer(undefined, action)).toEqual({
                ...initialState,
                dirty: false,
                loading: false,
                data: { mockPipeline }
            });
        });

        it('should handle FETCH_PIPELINE_FAIL', () => {
            const action = {
                type: FETCH_PIPELINE_FAIL,
                payload: { error }
            };
            expect(mxGraphReducer(undefined, action)).toEqual({
                ...initialState,
                loading: false,
                error
            });
        });
    });
});
