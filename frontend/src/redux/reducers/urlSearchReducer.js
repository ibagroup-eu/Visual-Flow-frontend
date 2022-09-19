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

import qs from 'qs';

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
import { withoutEmptyKeys } from '../../utils/object';

const withSearch = state => ({
    ...state,
    search: qs.stringify(
        {
            page: state.page,
            rows: state.rowsPerPage,
            order: state.order,
            orderBy: state.orderBy,
            ...withoutEmptyKeys({
                jobLastRun: state.jobLastRun,
                jobStatus: state.jobStatus,
                pipelineLastRun: state.pipelineLastRun,
                pipelineStatus: state.pipelineStatus
            })
        },
        { addQueryPrefix: true }
    ),
    isInitial: false
});

const initialState = {
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
};

const urlSearchReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_JOBS_LAST_RUN:
            return withSearch({
                ...state,
                jobLastRun: action.payload
            });
        case SET_PIPELINES_LAST_RUN:
            return withSearch({
                ...state,
                pipelineLastRun: action.payload
            });
        case SET_JOBS_STATUS:
            return withSearch({
                ...state,
                jobStatus: action.payload
            });
        case SET_PIPELINES_STATUS:
            return withSearch({
                ...state,
                pipelineStatus: action.payload
            });
        case SET_CURRENT_PAGE:
            return withSearch({
                ...state,
                page: action.payload
            });
        case SET_ROWS_PER_PAGE:
            return withSearch({
                ...state,
                rowsPerPage: action.payload
            });
        case SET_ORDER_BY:
            return withSearch({
                ...state,
                orderBy: action.payload.orderBy,
                order: action.payload.order
            });
        case SET_DEFAULT:
            return { ...initialState };

        default:
            return state;
    }
};

export default urlSearchReducer;
