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

import { isEmpty, get } from 'lodash';
import {
    FETCH_JOB_START,
    FETCH_JOB_SUCCESS,
    FETCH_JOB_FAIL,
    FETCH_PIPELINE_START,
    FETCH_PIPELINE_FAIL,
    FETCH_PIPELINE_SUCCESS,
    SET_CURRENT_CELL,
    SET_GRAPH_DIRTY,
    SET_GRAPH_FIELDS,
    SET_GRAPH_PARAMS,
    SET_PARAMS_DIRTY,
    SET_SIDE_PANEL,
    SET_SIDE_PANEL_DIRTY,
    SET_ZOOM_VALUE,
    SET_PANNING,
    SET_LOGS_MODAL,
    SET_STAGE_COPY,
    SET_INTERACTIVE_MODE,
    FETCH_JOB_METADATA_START,
    FETCH_JOB_METADATA_SUCCESS,
    FETCH_JOB_METADATA_FAIL,
    INTERACTIVE_SESSION_EVENT_START,
    INTERACTIVE_SESSION_EVENT_SUCCESS,
    INTERACTIVE_SESSION_EVENT_FAIL,
    UPDATE_JOB_DEFINITION,
    SET_RUN_ID,
    DELETE_INTERACTIVE_JOB_SESSION_SUCCESS,
    DELETE_INTERACTIVE_JOB_SESSION_FAIL,
    UPDATE_INTERACTIVE_JOB_SESSION_SUCCESS,
    UPDATE_INTERACTIVE_JOB_SESSION_FAIL,
    CLEAR_INTERACTIVE_DATA,
    SET_INTERACTIVE_DATA
} from './types';
import jobsApi from '../../api/jobs';
import pipelinesApi from '../../api/pipelines';
import { updateJobStatus } from './oneJobStatusAction';
import { updatePipelineStatus } from './onePipelineStatusActions';
import history from '../../utils/history';
import showNotification from '../../components/notification/showNotification';
import { DRAFT } from '../../mxgraph/constants';
import { setTemporaryStatuses } from '../../utils/stageStatuses';

export const setSidePanel = isOpen => ({
    type: SET_SIDE_PANEL,
    payload: isOpen
});

export const setCurrentCell = cell => ({
    type: SET_CURRENT_CELL,
    payload: cell
});

export const setFields = fields => ({
    type: SET_GRAPH_FIELDS,
    payload: fields
});

export const setGraphDirty = dirty => ({
    type: SET_GRAPH_DIRTY,
    payload: dirty
});

export const setSidePanelDirty = dirty => ({
    type: SET_SIDE_PANEL_DIRTY,
    payload: dirty
});

export const setParamsDirty = dirty => ({
    type: SET_PARAMS_DIRTY,
    payload: dirty
});

export const setParams = params => ({
    type: SET_GRAPH_PARAMS,
    payload: params
});

const checkIsCreatedFromUI = (dispatch, data, t, func, success, fail) => {
    let isCreatedFromUI;
    if (isEmpty(data.definition) || isEmpty(data.definition.graph)) {
        // new, definition is empty or
        // entered only params, graph is empty
        isCreatedFromUI = true;
    } else {
        // existing, check if contains data for graph
        isCreatedFromUI = !!data.definition?.graph[0].geometry;
    }
    if (isCreatedFromUI) {
        dispatch({ type: success, payload: data });
        dispatch(func);
    } else {
        history.goBack();
        showNotification(t('main:error.GUI'), 'error');
        dispatch({ type: fail, payload: { error: t('main:error.GUI') } });
    }
};

export const fetchJob = (projectId, jobId, t) => dispatch => {
    dispatch({
        type: FETCH_JOB_START
    });

    const promise = jobId
        ? jobsApi.getJobById(projectId, jobId)
        : Promise.resolve({ data: { definition: {}, status: DRAFT, params: {} } });

    return promise.then(
        response => {
            const { runId } = response.data;
            dispatch({
                type: SET_RUN_ID,
                payload: runId
            });

            checkIsCreatedFromUI(
                dispatch,
                response.data,
                t,
                updateJobStatus(jobId, response.data.status),
                FETCH_JOB_SUCCESS,
                FETCH_JOB_FAIL
            );
        },
        error =>
            dispatch({
                type: FETCH_JOB_FAIL,
                payload: { error }
            })
    );
};

export const fetchJobMetadata = (projectId, jobId, runId) => (
    dispatch,
    getState
) => {
    const offset = get(getState(), 'mxGraph.interactive.offset', 0);

    dispatch({
        type: FETCH_JOB_METADATA_START
    });

    return jobsApi.fetchJobMetadata(projectId, jobId, runId, offset).then(
        response =>
            dispatch({
                type: FETCH_JOB_METADATA_SUCCESS,
                payload: response.data
            }),
        error =>
            dispatch({
                type: FETCH_JOB_METADATA_FAIL,
                payload: { error }
            })
    );
};

export const getInteractiveJobSession = (projectId, jobId, runId) => dispatch => {
    return jobsApi
        .getInteractiveJobSession(projectId, jobId, runId)
        .then(response => {
            if (response?.data?.graph) {
                dispatch({
                    type: UPDATE_JOB_DEFINITION,
                    payload: {
                        definition: {
                            graph: response.data.graph
                        }
                    }
                });

                dispatch({
                    type: SET_INTERACTIVE_MODE,
                    payload: true
                });
            }
        });
};

export const clearInteractiveData = () => ({
    type: CLEAR_INTERACTIVE_DATA
});

export const deleteInteractiveJobSession = (projectId, jobId, runId) => dispatch => {
    return jobsApi.deleteInteractiveJobSession(projectId, jobId, runId).then(
        () => {
            dispatch({ type: DELETE_INTERACTIVE_JOB_SESSION_SUCCESS });
            dispatch(clearInteractiveData());
        },
        error => {
            dispatch({
                type: DELETE_INTERACTIVE_JOB_SESSION_FAIL,
                payload: { error }
            });
        }
    );
};

export const updateInteractiveJobSession = (
    projectId,
    jobId,
    runId,
    definition
) => dispatch => {
    return jobsApi
        .updateInteractiveJobSession(projectId, jobId, runId, definition)
        .then(() => {
            dispatch({ type: UPDATE_INTERACTIVE_JOB_SESSION_SUCCESS });
        })
        .catch(error => {
            dispatch({
                type: UPDATE_INTERACTIVE_JOB_SESSION_FAIL,
                payload: { error }
            });
        });
};

export const fetchPipelineById = (
    projectId,
    pipelineId,
    t,
    skipLoading
) => dispatch => {
    if (!skipLoading) {
        dispatch({
            type: FETCH_PIPELINE_START
        });
    }
    const promise = pipelineId
        ? pipelinesApi.getPipelineById(projectId, pipelineId)
        : Promise.resolve({ data: { definition: {}, status: DRAFT, params: {} } });
    return promise.then(
        response => {
            checkIsCreatedFromUI(
                dispatch,
                response.data,
                t,
                updatePipelineStatus(
                    pipelineId,
                    response.data.status,
                    response.data.progress
                ),
                FETCH_PIPELINE_SUCCESS,
                FETCH_PIPELINE_FAIL
            );
        },
        error =>
            dispatch({
                type: FETCH_PIPELINE_FAIL,
                payload: { error }
            })
    );
};

export const setInteractiveData = (
    data = [],
    command,
    targetStageIds = [],
    definition = {}
) => {
    const updatedData = setTemporaryStatuses(
        data,
        command,
        targetStageIds,
        definition
    );
    return {
        type: SET_INTERACTIVE_DATA,
        payload: updatedData
    };
};

export const interactiveSessionEvent = (projectId, jobId, runId, data) => (
    dispatch,
    getState
) => {
    const definition = get(getState(), 'mxGraph.data.definition', {});
    const interactiveData = get(getState(), 'mxGraph.interactive.data', []);

    dispatch({
        type: INTERACTIVE_SESSION_EVENT_START
    });

    return jobsApi
        .interactiveSessionEvent(projectId, jobId, runId, data)
        .then(() => {
            const { command, id } = data;

            dispatch(setInteractiveData(interactiveData, command, id, definition));

            dispatch({
                type: INTERACTIVE_SESSION_EVENT_SUCCESS
            });
        })
        .catch(error => {
            dispatch({
                type: INTERACTIVE_SESSION_EVENT_FAIL,
                payload: { error }
            });
        });
};

export const setZoomValue = val => ({
    type: SET_ZOOM_VALUE,
    payload: val
});

export const setPanning = val => ({
    type: SET_PANNING,
    payload: val
});

export const setLogsModal = val => ({
    type: SET_LOGS_MODAL,
    payload: val
});

export const setStageCopy = val => ({
    type: SET_STAGE_COPY,
    payload: val
});

export const setInteractiveMode = val => ({
    type: SET_INTERACTIVE_MODE,
    payload: val
});
