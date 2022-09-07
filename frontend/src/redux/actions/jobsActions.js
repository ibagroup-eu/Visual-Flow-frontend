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
    FETCH_JOBS_START,
    FETCH_JOBS_FAIL,
    FETCH_JOBS_SUCCESS,
    CREATE_JOB_START,
    CREATE_JOB_FAIL,
    CREATE_JOB_SUCCESS,
    DELETE_JOBS_START,
    DELETE_JOBS_FAIL,
    DELETE_JOBS_SUCCESS,
    UPDATE_JOB_START,
    UPDATE_JOB_SUCCESS,
    UPDATE_JOB_FAIL,
    RUN_JOB_START,
    RUN_JOB_FAIL,
    RUN_JOB_SUCCESS,
    STOP_JOB_START,
    STOP_JOB_FAIL,
    STOP_JOB_SUCCESS,
    SET_JOB_SEARCH_FIELD,
    COPY_JOB_START,
    COPY_JOB_SUCCESS,
    COPY_JOB_FAIL,
    SET_JOBS_LAST_RUN,
    SET_JOBS_STATUS
} from './types';
import api from '../../api/jobs';
import history from '../../utils/history';
import { fetchJob } from './mxGraphActions';
import fetchJobStatus from './oneJobStatusAction';
import stringifyWithoutCircular from '../../utils/stringifyWithoutCircular';

export const fetchJobs = projectId => dispatch => {
    dispatch({
        type: FETCH_JOBS_START
    });

    return api.getJobs(projectId).then(
        response =>
            dispatch({
                type: FETCH_JOBS_SUCCESS,
                payload: response.data
            }),
        error =>
            dispatch({
                type: FETCH_JOBS_FAIL,
                payload: { error }
            })
    );
};

export const deleteJob = (projectId, jobIds) => dispatch => {
    dispatch({
        type: DELETE_JOBS_START
    });
    return Promise.all(jobIds.map(jobId => api.deleteJob(projectId, jobId))).then(
        response => {
            dispatch({
                type: DELETE_JOBS_SUCCESS,
                payload: { success: response, id: jobIds }
            });
            dispatch(fetchJobs(projectId));
        },
        error => {
            dispatch({
                type: DELETE_JOBS_FAIL,
                payload: { error }
            });
            dispatch(fetchJobs(projectId));
        }
    );
};

export const createJob = (graph, projectId, jobData) => dispatch => {
    const currentGraph = JSON.parse(stringifyWithoutCircular(graph));

    dispatch({
        type: CREATE_JOB_START
    });

    return api
        .createJob(projectId, {
            definition: currentGraph,
            name: jobData.name,
            params: jobData.params
        })
        .then(
            response => {
                dispatch({
                    type: CREATE_JOB_SUCCESS,
                    payload: response.data
                });
                dispatch(fetchJob(projectId, response.data));
                history.push(`/jobs/${projectId}/${response.data}`);
            },
            error => {
                dispatch({
                    type: CREATE_JOB_FAIL,
                    payload: { error }
                });
            }
        );
};

export const updateJob = (graph, projectId, id, jobData) => dispatch => {
    const currentGraph = JSON.parse(stringifyWithoutCircular(graph));

    dispatch({
        type: UPDATE_JOB_START
    });

    return api
        .updateJob(
            projectId,
            {
                definition: currentGraph,
                name: jobData.name,
                params: jobData.params
            },
            id
        )
        .then(
            () => {
                dispatch({
                    type: UPDATE_JOB_SUCCESS
                });
                dispatch(fetchJob(projectId, id));
            },
            error => {
                dispatch({
                    type: UPDATE_JOB_FAIL,
                    payload: { error }
                });
            }
        );
};

export const runJob = (projId, jobId, disp) => dispatch => {
    dispatch({
        type: RUN_JOB_START
    });

    return api.runJob(projId, jobId).then(
        response => {
            dispatch({
                type: RUN_JOB_SUCCESS,
                payload: response.data
            });
            disp ? dispatch(disp) : dispatch(fetchJobs(projId));
        },
        error =>
            dispatch({
                type: RUN_JOB_FAIL,
                payload: { error }
            })
    );
};
export const runJobAndRefreshIt = (projectId, jobId) =>
    runJob(projectId, jobId, fetchJobStatus(projectId, jobId));

export const stopJob = (projectId, jobId, disp) => dispatch => {
    dispatch({
        type: STOP_JOB_START
    });

    return api.stopJob(projectId, jobId).then(
        response => {
            dispatch({
                type: STOP_JOB_SUCCESS,
                payload: response.data
            });
            setTimeout(
                () => (disp ? dispatch(disp) : dispatch(fetchJobs(projectId))),
                2000
            );
        },
        error =>
            dispatch({
                type: STOP_JOB_FAIL,
                payload: { error }
            })
    );
};
export const stopJobAndRefreshIt = (projectId, jobId) =>
    stopJob(projectId, jobId, fetchJobStatus(projectId, jobId));

export const setJobSearchField = searchField => ({
    type: SET_JOB_SEARCH_FIELD,
    payload: searchField
});

export const copyJob = (projectId, jobId) => dispatch => {
    dispatch({
        type: COPY_JOB_START
    });

    return api.copyJob(projectId, jobId).then(
        () => {
            dispatch({
                type: COPY_JOB_SUCCESS
            });
            dispatch(fetchJobs(projectId));
        },
        error => {
            dispatch({
                type: COPY_JOB_FAIL,
                payload: { error }
            });
        }
    );
};

export const setJobsLastRun = val => ({
    type: SET_JOBS_LAST_RUN,
    payload: val
});

export const setJobsStatus = val => ({
    type: SET_JOBS_STATUS,
    payload: val
});

export default fetchJobs;
