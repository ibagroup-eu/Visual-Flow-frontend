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
    FETCH_PIPELINE_STATUS_START,
    FETCH_PIPELINE_STATUS_SUCCESS,
    FETCH_PIPELINE_STATUS_FAIL,
    UPDATE_PIPELINE_STATUS_START,
    UPDATE_PIPELINE_STATUS_SUCCESS,
    UPDATE_PIPELINE_STATUS_FAIL
} from './types';
import api from '../../api/pipelines';
import { DRAFT } from '../../mxgraph/constants';

const fetchPipelineStatus = (projectId, pipelineId) => dispatch => {
    dispatch({
        type: FETCH_PIPELINE_STATUS_START
    });
    const promise = pipelineId
        ? api.getPipelineById(projectId, pipelineId)
        : Promise.resolve({ status: DRAFT, progress: 0 });
    return promise.then(
        response =>
            dispatch({
                type: FETCH_PIPELINE_STATUS_SUCCESS,
                payload: { ...response.data, id: pipelineId }
            }),
        error =>
            dispatch({
                type: FETCH_PIPELINE_STATUS_FAIL,
                payload: { error }
            })
    );
};

export const updatePipelineStatus = (pipelineId, status, progress) => dispatch => {
    dispatch({
        type: UPDATE_PIPELINE_STATUS_START
    });
    return pipelineId
        ? dispatch({
              type: UPDATE_PIPELINE_STATUS_SUCCESS,
              payload: { status, progress, id: pipelineId }
          })
        : dispatch({
              type: UPDATE_PIPELINE_STATUS_FAIL,
              payload: 'Pipeline status has not been updated'
          });
};

export default fetchPipelineStatus;
