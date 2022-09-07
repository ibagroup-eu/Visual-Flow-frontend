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
    CREATE_CRON_SUCCESS,
    CREATE_CRON_FAIL,
    UPDATE_CRON_START,
    UPDATE_CRON_SUCCESS,
    UPDATE_CRON_FAIL
} from './types';
import api from '../../api/cron';
import { fetchPipelines } from './pipelinesActions';

export const createCron = (projectId, pipelineId, cron) => dispatch => {
    dispatch({ type: CREATE_CRON_START });

    return api.createCron(projectId, pipelineId, cron).then(
        () => {
            dispatch({
                type: CREATE_CRON_SUCCESS
            });
            dispatch(fetchPipelines(projectId));
        },
        error => {
            dispatch({
                type: CREATE_CRON_FAIL,
                payload: { error }
            });
            dispatch(fetchPipelines(projectId));
        }
    );
};

export const getCron = (projectId, pipelineId) => dispatch => {
    dispatch({ type: FETCH_CRON_START });

    return api.getCron(projectId, pipelineId).then(
        response => {
            dispatch({
                type: FETCH_CRON_SUCCESS,
                payload: response.data
            });
        },
        error => {
            dispatch({
                type: FETCH_CRON_FAIL,
                payload: { error }
            });
        }
    );
};

export const updateCron = (projectId, pipelineId, cron) => dispatch => {
    dispatch({ type: UPDATE_CRON_START });

    return api.updateCron(projectId, pipelineId, cron).then(
        () => {
            dispatch({
                type: UPDATE_CRON_SUCCESS
            });
            dispatch(fetchPipelines(projectId));
        },
        error => {
            dispatch({
                type: UPDATE_CRON_FAIL,
                payload: { error }
            });
            dispatch(fetchPipelines(projectId));
        }
    );
};
