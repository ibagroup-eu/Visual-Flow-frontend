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
    FETCH_CURRENT_USER_START,
    FETCH_CURRENT_USER_SUCCESS,
    FETCH_CURRENT_USER_FAIL
} from '../actions/types';

const initialState = {
    loading: false,
    data: {},
    error: null
};

const currentUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CURRENT_USER_START:
            return { ...state, loading: true, error: null };
        case FETCH_CURRENT_USER_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case FETCH_CURRENT_USER_FAIL:
            return { ...state, loading: false, error: action.payload.error };
        default:
            return state;
    }
};

export default currentUserReducer;
