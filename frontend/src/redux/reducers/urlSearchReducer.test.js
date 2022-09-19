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
    SET_CURRENT_PAGE,
    SET_DEFAULT,
    SET_JOBS_LAST_RUN,
    SET_JOBS_STATUS,
    SET_ORDER_BY,
    SET_PIPELINES_LAST_RUN,
    SET_PIPELINES_STATUS,
    SET_ROWS_PER_PAGE
} from '../actions/types';
import urlSearchReducer from './urlSearchReducer';

describe('urlSearchReducer', () => {
    it('should return a correct state for last_run', () => {
        expect(
            urlSearchReducer(undefined, {
                type: SET_JOBS_LAST_RUN,
                payload: 'last hour'
            })
        ).toEqual({
            jobLastRun: 'last hour',
            jobStatus: '',
            pipelineLastRun: '',
            pipelineStatus: '',
            page: 0,
            rowsPerPage: 5,
            orderBy: 'name',
            order: 'asc',
            isInitial: false,
            search: '?page=0&rows=5&order=asc&orderBy=name&jobLastRun=last%20hour'
        });

        expect(
            urlSearchReducer(undefined, {
                type: SET_PIPELINES_LAST_RUN,
                payload: 'last hour'
            })
        ).toEqual({
            jobLastRun: '',
            jobStatus: '',
            pipelineLastRun: 'last hour',
            pipelineStatus: '',
            page: 0,
            rowsPerPage: 5,
            orderBy: 'name',
            order: 'asc',
            isInitial: false,
            search:
                '?page=0&rows=5&order=asc&orderBy=name&pipelineLastRun=last%20hour'
        });
    });

    it('should return a correct state for status', () => {
        expect(
            urlSearchReducer(undefined, {
                type: SET_JOBS_STATUS,
                payload: 'Failed'
            })
        ).toEqual({
            jobLastRun: '',
            jobStatus: 'Failed',
            pipelineLastRun: '',
            pipelineStatus: '',
            page: 0,
            rowsPerPage: 5,
            orderBy: 'name',
            order: 'asc',
            isInitial: false,
            search: '?page=0&rows=5&order=asc&orderBy=name&jobStatus=Failed'
        });

        expect(
            urlSearchReducer(undefined, {
                type: SET_PIPELINES_STATUS,
                payload: 'Draft'
            })
        ).toEqual({
            jobLastRun: '',
            jobStatus: '',
            pipelineLastRun: '',
            pipelineStatus: 'Draft',
            page: 0,
            rowsPerPage: 5,
            orderBy: 'name',
            order: 'asc',
            isInitial: false,
            search: '?page=0&rows=5&order=asc&orderBy=name&pipelineStatus=Draft'
        });
    });

    it('should return the initial state', () => {
        expect(urlSearchReducer(undefined)).toEqual({
            jobLastRun: '',
            jobStatus: '',
            pipelineLastRun: '',
            pipelineStatus: '',
            page: 0,
            rowsPerPage: 5,
            orderBy: 'name',
            order: 'asc',
            isInitial: true,
            search: ''
        });
    });

    it('should handle SET_CURRENT_PAGE', () => {
        const action = {
            type: SET_CURRENT_PAGE,
            payload: 1
        };
        expect(urlSearchReducer(undefined, action)).toEqual({
            jobLastRun: '',
            jobStatus: '',
            pipelineLastRun: '',
            pipelineStatus: '',
            page: 1,
            rowsPerPage: 5,
            orderBy: 'name',
            order: 'asc',
            isInitial: false,
            search: '?page=1&rows=5&order=asc&orderBy=name'
        });
    });

    it('should handle SET_ROWS_PER_PAGE', () => {
        const action = {
            type: SET_ROWS_PER_PAGE,
            payload: 10
        };
        expect(urlSearchReducer(undefined, action)).toEqual({
            jobLastRun: '',
            jobStatus: '',
            pipelineLastRun: '',
            pipelineStatus: '',
            page: 0,
            rowsPerPage: 10,
            orderBy: 'name',
            order: 'asc',
            isInitial: false,
            search: '?page=0&rows=10&order=asc&orderBy=name'
        });
    });

    it('should handle SET_DEFAULT', () => {
        const action = {
            type: SET_DEFAULT
        };
        expect(urlSearchReducer(undefined, action)).toEqual({
            jobLastRun: '',
            jobStatus: '',
            pipelineLastRun: '',
            pipelineStatus: '',
            page: 0,
            rowsPerPage: 5,
            orderBy: 'name',
            order: 'asc',
            isInitial: true,
            search: ''
        });
    });

    it('should handle SET_ORDER_BY', () => {
        const action = {
            type: SET_ORDER_BY,
            payload: { orderBy: 'status', order: 'desc' }
        };
        expect(urlSearchReducer(undefined, action)).toEqual({
            jobLastRun: '',
            jobStatus: '',
            pipelineLastRun: '',
            pipelineStatus: '',
            page: 0,
            rowsPerPage: 5,
            orderBy: 'status',
            order: 'desc',
            isInitial: false,
            search: '?page=0&rows=5&order=desc&orderBy=status'
        });
    });
});
