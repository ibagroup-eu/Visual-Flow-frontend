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
    FETCH_CRON_START,
    FETCH_CRON_SUCCESS,
    FETCH_CRON_FAIL,
    CREATE_CRON_START,
    UPDATE_CRON_START,
    CREATE_CRON_FAIL,
    UPDATE_CRON_FAIL,
    CREATE_CRON_SUCCESS,
    UPDATE_CRON_SUCCESS
} from '../actions/types';

const initialState = {
    loading: false,
    data: { schedule: '', suspend: true }
};

// eslint-disable-next-line complexity
const cronReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case FETCH_CRON_START:
        case CREATE_CRON_START:
        case UPDATE_CRON_START:
            return {
                ...state,
                loading: true
            };
        case FETCH_CRON_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            };
        case FETCH_CRON_FAIL:
        case CREATE_CRON_FAIL:
        case UPDATE_CRON_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        case CREATE_CRON_SUCCESS:
        case UPDATE_CRON_SUCCESS:
            return {
                ...state,
                loading: false
            };
        default:
            return state;
    }
};

export default cronReducer;
