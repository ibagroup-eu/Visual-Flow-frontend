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
    FETCH_PIPELINES_START,
    FETCH_PIPELINES_FAIL,
    FETCH_PIPELINES_SUCCESS,
    DELETE_PIPELINES_START,
    DELETE_PIPELINES_FAIL,
    DELETE_PIPELINES_SUCCESS,
    RUN_PIPELINE_START,
    RUN_PIPELINE_SUCCESS,
    RUN_PIPELINE_FAIL,
    STOP_PIPELINE_START,
    STOP_PIPELINE_SUCCESS,
    STOP_PIPELINE_FAIL,
    RESUME_PIPELINE_START,
    RESUME_PIPELINE_SUCCESS,
    RESUME_PIPELINE_FAIL,
    CREATE_PIPELINE_START,
    CREATE_PIPELINE_SUCCESS,
    CREATE_PIPELINE_FAIL,
    UPDATE_PIPELINE_START,
    UPDATE_PIPELINE_SUCCESS,
    UPDATE_PIPELINE_FAIL,
    COPY_PIPELINE_START,
    COPY_PIPELINE_SUCCESS,
    COPY_PIPELINE_FAIL,
    SET_PIPELINES_LAST_RUN,
    SET_PIPELINES_STATUS
} from './types';
import api from '../../api/pipelines';
import history from '../../utils/history';
import { fetchPipelineById } from './mxGraphActions';
import fetchPipelineStatus from './onePipelineStatusActions';
import stringifyWithoutCircular from '../../utils/stringifyWithoutCircular';

export const fetchPipelines = projectId => dispatch => {
    dispatch({
        type: FETCH_PIPELINES_START
    });

    return api.getPipelines(projectId).then(
        response =>
            dispatch({
                type: FETCH_PIPELINES_SUCCESS,
                payload: response.data
            }),
        error =>
            dispatch({
                type: FETCH_PIPELINES_FAIL,
                payload: { error }
            })
    );
};

export const deletePipeline = (projectId, pipelineIds) => dispatch => {
    dispatch({
        type: DELETE_PIPELINES_START
    });
    return Promise.all(
        pipelineIds.map(pipelineId => api.deletePipeline(projectId, pipelineId))
    ).then(
        response => {
            dispatch({
                type: DELETE_PIPELINES_SUCCESS,
                payload: { success: response, id: pipelineIds }
            });
            dispatch(fetchPipelines(projectId));
        },
        error => {
            dispatch({
                type: DELETE_PIPELINES_FAIL,
                payload: { error }
            });
            dispatch(fetchPipelines(projectId));
        }
    );
};

export const runPipeline = (projectId, pipelineId, action) => dispatch => {
    dispatch({
        type: RUN_PIPELINE_START
    });

    return api.runPipeline(projectId, pipelineId).then(
        response => {
            dispatch({
                type: RUN_PIPELINE_SUCCESS,
                payload: response.data
            });
            action ? dispatch(action) : dispatch(fetchPipelines(projectId));
        },
        error =>
            dispatch({
                type: RUN_PIPELINE_FAIL,
                payload: { error }
            })
    );
};

export const runPipelineAndRefreshIt = (projectId, pipelineId) =>
    runPipeline(projectId, pipelineId, fetchPipelineStatus(projectId, pipelineId));

export const stopPipeline = (projectId, pipelineId, action) => dispatch => {
    dispatch({
        type: STOP_PIPELINE_START
    });

    return api.stopPipeline(projectId, pipelineId).then(
        response => {
            dispatch({
                type: STOP_PIPELINE_SUCCESS,
                payload: response.data
            });
            setTimeout(
                () =>
                    action ? dispatch(action) : dispatch(fetchPipelines(projectId)),
                2000
            );
        },
        error =>
            dispatch({
                type: STOP_PIPELINE_FAIL,
                payload: { error }
            })
    );
};

export const stopPipelineAndRefreshIt = (projectId, pipelineId) =>
    stopPipeline(projectId, pipelineId, fetchPipelineStatus(projectId, pipelineId));

export const resumePipeline = (projectId, pipelineId) => dispatch => {
    dispatch({
        type: RESUME_PIPELINE_START
    });

    return api.resumePipeline(projectId, pipelineId).then(
        response => {
            dispatch({
                type: RESUME_PIPELINE_SUCCESS,
                payload: response.data
            });
            setTimeout(() => dispatch(fetchPipelines(projectId)), 2000);
        },
        error =>
            dispatch({
                type: RESUME_PIPELINE_FAIL,
                payload: { error }
            })
    );
};

export const createPipeline = (graph, projectId, pipelineData) => dispatch => {
    const currentGraph = JSON.parse(stringifyWithoutCircular(graph));

    dispatch({
        type: CREATE_PIPELINE_START
    });

    return api
        .createPipeline(projectId, {
            definition: currentGraph,
            name: pipelineData.name
        })
        .then(
            response => {
                dispatch({
                    type: CREATE_PIPELINE_SUCCESS,
                    payload: response.data
                });
                dispatch(fetchPipelineById(projectId, response.data));
                history.push(`/pipelines/${projectId}/${response.data}`);
            },
            error => {
                dispatch({
                    type: CREATE_PIPELINE_FAIL,
                    payload: { error }
                });
            }
        );
};

export const updatePipeline = (graph, projectId, id, pipelineData) => dispatch => {
    const currentGraph = JSON.parse(stringifyWithoutCircular(graph));

    dispatch({
        type: UPDATE_PIPELINE_START
    });

    return api
        .updatePipeline(
            projectId,
            {
                definition: currentGraph,
                name: pipelineData.name
            },
            id
        )
        .then(
            () => {
                dispatch({
                    type: UPDATE_PIPELINE_SUCCESS
                });
                dispatch(fetchPipelineById(projectId, id));
            },
            error => {
                dispatch({
                    type: UPDATE_PIPELINE_FAIL,
                    payload: { error }
                });
            }
        );
};

export const copyPipeline = (projectId, pipelineId) => dispatch => {
    dispatch({
        type: COPY_PIPELINE_START
    });

    return api.copyPipeline(projectId, pipelineId).then(
        () => {
            dispatch({
                type: COPY_PIPELINE_SUCCESS
            });
            dispatch(fetchPipelines(projectId));
        },
        error => {
            dispatch({
                type: COPY_PIPELINE_FAIL,
                payload: { error }
            });
        }
    );
};

export const setPipelinesLastRun = val => ({
    type: SET_PIPELINES_LAST_RUN,
    payload: val
});

export const setPipelinesStatus = val => ({
    type: SET_PIPELINES_STATUS,
    payload: val
});
