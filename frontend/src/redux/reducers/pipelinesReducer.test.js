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

import pipelinesReducer from './pipelinesReducer';
import {
    FETCH_PIPELINES_START,
    FETCH_PIPELINES_FAIL,
    FETCH_PIPELINES_SUCCESS,
    DELETE_PIPELINES_FAIL,
    DELETE_PIPELINES_SUCCESS,
    RUN_PIPELINE_START,
    RUN_PIPELINE_SUCCESS,
    RUN_PIPELINE_FAIL,
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
    SET_PIPELINES_STATUS,
    SET_PIPELINES_LAST_RUN
} from '../actions/types';

describe('pipelines Reducer', () => {
    const mockData = {
        id: '123',
        name: 'some_name'
    };
    const error = 'error';

    it('should return the initial state', () => {
        expect(pipelinesReducer(undefined)).toEqual({
            loading: true,
            data: [],
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle FETCH_PIPELINES_SUCCESS', () => {
        const action = {
            type: FETCH_PIPELINES_SUCCESS,
            payload: { ...mockData }
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: false,
            data: mockData,
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle FETCH_PIPELINES_FAIL', () => {
        const action = {
            type: FETCH_PIPELINES_FAIL,
            payload: { error }
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: false,
            data: [],
            error,
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle FETCH_PIPELINES_START', () => {
        const action = {
            type: FETCH_PIPELINES_START
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: true,
            data: [],
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle DELETE_PIPELINES_SUCCESS', () => {
        const success = ['success'];
        const action = {
            type: DELETE_PIPELINES_SUCCESS,
            payload: { id: ['pipeline-id'], success }
        };
        const data = { pipelines: [{ name: 'pipeline2', id: 'pipeline2-id' }] };
        const initialState = {
            data: { pipelines: [{ name: 'pipeline1', id: 'pipeline-id' }, data] }
        };
        expect(pipelinesReducer(initialState, action)).toEqual({
            data: [data],
            success
        });
    });

    it('should handle DELETE_PIPELINES_FAIL', () => {
        const action = {
            type: DELETE_PIPELINES_FAIL,
            payload: { error }
        };
        expect(pipelinesReducer(undefined, action).error).toEqual(error);
    });

    it('should handle RUN_PIPELINE_START', () => {
        const action = {
            type: RUN_PIPELINE_START
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: true,
            data: [],
            pipelineRun: true,
            lastRun: '',
            status: ''
        });
    });

    it('should handle RUN_PIPELINE_SUCCESS', () => {
        const action = {
            type: RUN_PIPELINE_SUCCESS,
            payload: { ...mockData }
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: true,
            data: [],
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle RUN_PIPELINE_FAIL', () => {
        const action = {
            type: RUN_PIPELINE_FAIL,
            payload: { error }
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: true,
            data: [],
            error,
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle RESUME_PIPELINE_START', () => {
        const action = {
            type: RESUME_PIPELINE_START
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: true,
            data: [],
            pipelineRun: true,
            lastRun: '',
            status: ''
        });
    });

    it('should handle RESUME_PIPELINE_SUCCESS', () => {
        const action = {
            type: RESUME_PIPELINE_SUCCESS,
            payload: { ...mockData }
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: true,
            data: [],
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle RESUME_PIPELINE_FAIL', () => {
        const action = {
            type: RESUME_PIPELINE_FAIL,
            payload: { error }
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: true,
            data: [],
            error,
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle CREATE_PIPELINE_START', () => {
        const action = {
            type: CREATE_PIPELINE_START
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: true,
            data: [],
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle CREATE_PIPELINE_SUCCESS', () => {
        const action = {
            type: CREATE_PIPELINE_SUCCESS,
            payload: { ...mockData }
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: false,
            data: [],
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle CREATE_PIPELINE_FAIL', () => {
        const action = {
            type: CREATE_PIPELINE_FAIL,
            payload: { error }
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: false,
            data: [],
            error,
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle UPDATE_PIPELINE_START', () => {
        const action = {
            type: UPDATE_PIPELINE_START
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: true,
            data: [],
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle UPDATE_PIPELINE_SUCCESS', () => {
        const action = {
            type: UPDATE_PIPELINE_SUCCESS,
            payload: { ...mockData }
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: false,
            data: [],
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    it('should handle UPDATE_PIPELINE_FAIL', () => {
        const action = {
            type: UPDATE_PIPELINE_FAIL,
            payload: { error }
        };
        expect(pipelinesReducer(undefined, action)).toEqual({
            loading: false,
            data: [],
            error,
            pipelineRun: false,
            lastRun: '',
            status: ''
        });
    });

    describe('copy', () => {
        let initialState;
        beforeEach(() => {
            initialState = {
                loading: true,
                data: [],
                pipelineRun: false,
                lastRun: '',
                status: ''
            };
        });

        it('should handle COPY_PIPELINE_START', () => {
            const action = {
                type: COPY_PIPELINE_START
            };
            expect(pipelinesReducer(undefined, action)).toEqual({
                ...initialState,
                loading: true
            });
        });

        it('should handle COPY_PIPELINE_SUCCESS', () => {
            const action = {
                type: COPY_PIPELINE_SUCCESS
            };
            expect(pipelinesReducer(undefined, action)).toEqual({
                ...initialState,
                loading: false
            });
        });

        it('should handle COPY_PIPELINE_FAIL', () => {
            const action = {
                type: COPY_PIPELINE_FAIL,
                payload: { error: 'some_error' }
            };
            expect(pipelinesReducer(undefined, action)).toEqual({
                ...initialState,
                loading: false,
                error: 'some_error'
            });
        });

        it('should handle SET_PIPELINES_LAST_RUN', () => {
            const action = {
                type: SET_PIPELINES_LAST_RUN,
                payload: '1 day ago'
            };
            expect(pipelinesReducer(undefined, action)).toEqual({
                ...initialState,
                lastRun: '1 day ago'
            });
        });

        it('should handle SET_PIPELINES_STATUS', () => {
            const action = {
                type: SET_PIPELINES_STATUS,
                payload: 'draft'
            };
            expect(pipelinesReducer(undefined, action)).toEqual({
                ...initialState,
                status: 'draft'
            });
        });
    });
});
