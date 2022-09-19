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
    SET_ROWS_PER_PAGE,
    SET_DEFAULT,
    SET_ORDER_BY
} from '../actions/types';

const initialState = {
    page: 0,
    rowsPerPage: 5,
    orderBy: 'name',
    order: 'asc'
};

const enhancedTableReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_CURRENT_PAGE:
            return {
                ...state,
                page: action.payload
            };
        case SET_ROWS_PER_PAGE:
            return {
                ...state,
                rowsPerPage: action.payload
            };
        case SET_DEFAULT:
            return { ...initialState };
        case SET_ORDER_BY:
            return {
                ...state,
                orderBy: action.payload.orderBy,
                order: action.payload.order
            };
        default:
            return state;
    }
};

export default enhancedTableReducer;
