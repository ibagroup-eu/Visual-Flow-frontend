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
    FETCH_PARAMETERS_START,
    FETCH_PARAMETERS_SUCCESS,
    FETCH_PARAMETERS_FAIL,
    UPDATE_PARAMETERS_START,
    UPDATE_PARAMETERS_SUCCESS,
    UPDATE_PARAMETERS_FAIL
} from './types';
import api from '../../api/projects';

export const fetchParameters = id => dispatch => {
    dispatch({
        type: FETCH_PARAMETERS_START
    });

    return api.getProjectParameters(id).then(
        response =>
            dispatch({
                type: FETCH_PARAMETERS_SUCCESS,
                payload: response.data
            }),
        error =>
            dispatch({
                type: FETCH_PARAMETERS_FAIL,
                payload: { error }
            })
    );
};

export const updateParameters = (id, newParameters) => dispatch => {
    dispatch({
        type: UPDATE_PARAMETERS_START,
        payload: newParameters
    });

    return api.updateProjectParameters(id, newParameters.params).then(
        () =>
            dispatch({
                type: UPDATE_PARAMETERS_SUCCESS,
                payload: newParameters
            }),
        error =>
            dispatch({
                type: UPDATE_PARAMETERS_FAIL,
                payload: { error }
            })
    );
};
