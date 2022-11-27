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

import { omit, uniqueId } from 'lodash';

import {
    FETCH_HISTORY_FAIL,
    FETCH_HISTORY_START,
    FETCH_HISTORY_SUCCESS
} from './types';
import jobApi from '../../api/jobs';
import pipelineApi from '../../api/pipelines';

export const fetchJobHistory = (projectId, jobId) => dispatch => {
    dispatch({
        type: FETCH_HISTORY_START
    });

    return jobApi.getJobHistory(projectId, jobId).then(
        response =>
            dispatch({
                type: FETCH_HISTORY_SUCCESS,
                payload: response.data.map(node => ({
                    ...node,
                    uniqId: uniqueId()
                }))
            }),
        error =>
            dispatch({
                type: FETCH_HISTORY_FAIL,
                payload: { error }
            })
    );
};

export const fetchPipelineHistory = (projectId, pipelineId) => dispatch => {
    dispatch({
        type: FETCH_HISTORY_START
    });

    return pipelineApi.getPipelineHistory(projectId, pipelineId).then(
        response =>
            dispatch({
                type: FETCH_HISTORY_SUCCESS,
                payload: response.data?.map(pipe =>
                    omit(
                        {
                            ...pipe,
                            uniqId: uniqueId(),
                            statuses: pipe.nodes.map(node => ({
                                ...node,
                                uniqId: uniqueId()
                            }))
                        },
                        ['nodes']
                    )
                )
            }),
        error =>
            dispatch({
                type: FETCH_HISTORY_FAIL,
                payload: {
                    error
                }
            })
    );
};
