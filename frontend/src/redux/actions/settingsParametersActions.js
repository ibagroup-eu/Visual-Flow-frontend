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

import { findIndex, get, omit, set } from 'lodash';

import {
    FETCH_PARAMETERS_START,
    FETCH_PARAMETERS_SUCCESS,
    FETCH_PARAMETERS_FAIL,
    DELETE_PARAMETER_START,
    DELETE_PARAMETER_SUCCESS,
    DELETE_PARAMETER_FAIL,
    CREATE_PARAMETER_START,
    CREATE_PARAMETER_SUCCESS,
    CREATE_PARAMETER_FAIL,
    UPDATE_PARAMETER_START,
    UPDATE_PARAMETER_SUCCESS,
    UPDATE_PARAMETER_FAIL
} from './types';
import api from '../../api/projects';
import { ParametersAdapter } from './adapters';

export const fetchParameters = id => dispatch => {
    dispatch({
        type: FETCH_PARAMETERS_START
    });

    return api.getProjectParameters(id).then(
        response =>
            dispatch({
                type: FETCH_PARAMETERS_SUCCESS,
                payload: {
                    ...response.data,
                    params: response.data.params.map(param =>
                        ParametersAdapter.deserialize({
                            ...param,
                            id: param.key
                        })
                    )
                }
            }),
        error =>
            dispatch({
                type: FETCH_PARAMETERS_FAIL,
                payload: { error }
            })
    );
};

export const updateParameter = (projectId, parameter) => (dispatch, getState) => {
    const params = [...get(getState(), 'pages.settingsParameters.params', [])];

    set(params, findIndex(params, { id: parameter.id }), {
        ...parameter,
        id: parameter.key
    });

    dispatch({
        type: UPDATE_PARAMETER_START,
        payload: { id: parameter.id }
    });

    return api
        .updateProjectParameter(
            projectId,
            parameter.id,
            ParametersAdapter.serialize(omit(parameter, ['id']))
        )
        .then(
            () =>
                dispatch({
                    type: UPDATE_PARAMETER_SUCCESS,
                    payload: { params, id: parameter.id }
                }),
            error =>
                dispatch({
                    type: UPDATE_PARAMETER_FAIL,
                    payload: { error, id: parameter.id }
                })
        );
};

export const createParameter = (projectId, parameter) => (dispatch, getState) => {
    const params = [
        ...get(getState(), 'pages.settingsParameters.params', []),
        parameter
    ];

    dispatch({
        type: CREATE_PARAMETER_START
    });

    return api
        .createProjectParameter(
            projectId,
            parameter.key,
            ParametersAdapter.serialize(omit(parameter, ['id']))
        )
        .then(
            () =>
                dispatch({
                    type: CREATE_PARAMETER_SUCCESS,
                    payload: { params }
                }),
            error =>
                dispatch({
                    type: CREATE_PARAMETER_FAIL,
                    payload: { error }
                })
        );
};

export const deleteParameter = (projectId, parameter) => (dispatch, getState) => {
    const params = [
        ...get(getState(), 'pages.settingsParameters.params', [])
    ].filter(param => param.id !== parameter.id);

    dispatch({
        type: DELETE_PARAMETER_START,
        payload: { id: parameter.id }
    });

    return api.deleteProjectParameter(projectId, parameter.id).then(
        () =>
            dispatch({
                type: DELETE_PARAMETER_SUCCESS,
                payload: { params, id: parameter.id }
            }),
        error =>
            dispatch({
                type: DELETE_PARAMETER_FAIL,
                payload: { error, id: parameter.id }
            })
    );
};
