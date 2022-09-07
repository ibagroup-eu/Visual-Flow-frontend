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

import jobsReducer from './jobsReducer';
import {
    DELETE_JOBS_FAIL,
    DELETE_JOBS_SUCCESS,
    FETCH_JOBS_FAIL,
    FETCH_JOBS_START,
    FETCH_JOBS_SUCCESS,
    SET_JOB_SEARCH_FIELD,
    COPY_JOB_START,
    COPY_JOB_SUCCESS,
    COPY_JOB_FAIL,
    SET_JOBS_LAST_RUN,
    SET_JOBS_STATUS
} from '../actions/types';

describe('Jobs Reducer', () => {
    const payload = {
        data: []
    };

    it('should return the initial state', () => {
        expect(jobsReducer(undefined)).toEqual({
            loading: true,
            jobRun: false,
            data: [],
            searchField: '',
            lastRun: '',
            status: ''
        });
    });

    it('should handle FETCH_JOBS_SUCCESS', () => {
        const action = {
            type: FETCH_JOBS_SUCCESS,
            payload
        };
        expect(jobsReducer(undefined, action)).toEqual({
            loading: false,
            jobRun: false,
            searchField: '',
            data: payload,
            lastRun: '',
            status: ''
        });
    });

    it('should handle FETCH_JOBS_FAIL', () => {
        const action = {
            type: FETCH_JOBS_FAIL,
            payload: { error: {} }
        };
        expect(jobsReducer(undefined, action)).toEqual({
            loading: false,
            jobRun: false,
            data: [],
            searchField: '',
            error: {},
            lastRun: '',
            status: ''
        });
    });

    it('should handle FETCH_JOBS_START', () => {
        const action = {
            type: FETCH_JOBS_START
        };
        expect(jobsReducer(undefined, action)).toEqual({
            loading: true,
            jobRun: false,
            searchField: '',
            data: [],
            lastRun: '',
            status: ''
        });
    });

    it('should handle DELETE_JOBS_SUCCESS', () => {
        const success = ['success'];
        const action = {
            type: DELETE_JOBS_SUCCESS,
            payload: { id: ['job-id'], success }
        };
        const data = [{ name: 'job1', id: 'job-id' }];
        const initialState = { data: [{ name: 'job1', id: 'job-id' }, data] };
        expect(jobsReducer(initialState, action)).toEqual({
            ...initialState,
            success
        });
    });

    it('should handle DELETE_JOBS_FAIL', () => {
        const action = {
            type: DELETE_JOBS_FAIL,
            payload: { error: 'error' }
        };
        expect(jobsReducer(undefined, action).error).toEqual('error');
    });

    it('should handle SET_JOB_SEARCH_FIELD', () => {
        const action = {
            type: SET_JOB_SEARCH_FIELD,
            payload: 'search'
        };
        expect(jobsReducer(undefined, action)).toEqual({
            data: [],
            jobRun: false,
            loading: true,
            searchField: 'search',
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
                searchField: '',
                jobRun: false,
                lastRun: '',
                status: ''
            };
        });

        it('should handle COPY_JOB_START', () => {
            const action = {
                type: COPY_JOB_START
            };
            expect(jobsReducer(undefined, action)).toEqual({
                ...initialState,
                loading: true
            });
        });

        it('should handle COPY_JOB_SUCCESS', () => {
            const action = {
                type: COPY_JOB_SUCCESS
            };
            expect(jobsReducer(undefined, action)).toEqual({
                ...initialState,
                loading: false
            });
        });

        it('should handle COPY_JOB_FAIL', () => {
            const action = {
                type: COPY_JOB_FAIL,
                payload: { error: 'some_error' }
            };
            expect(jobsReducer(undefined, action)).toEqual({
                ...initialState,
                loading: false,
                error: 'some_error'
            });
        });

        it('should handle SET_JOBS_LAST_RUN', () => {
            const action = {
                type: SET_JOBS_LAST_RUN,
                payload: '1 day ago'
            };
            expect(jobsReducer(undefined, action)).toEqual({
                ...initialState,
                lastRun: '1 day ago'
            });
        });

        it('should handle SET_JOBS_STATUS', () => {
            const action = {
                type: SET_JOBS_STATUS,
                payload: 'draft'
            };
            expect(jobsReducer(undefined, action)).toEqual({
                ...initialState,
                status: 'draft'
            });
        });
    });
});
