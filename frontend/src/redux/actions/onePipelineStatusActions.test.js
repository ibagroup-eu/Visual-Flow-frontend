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

import api from '../../api/pipelines';
import {
    FETCH_PIPELINE_STATUS_START,
    FETCH_PIPELINE_STATUS_SUCCESS,
    FETCH_PIPELINE_STATUS_FAIL
} from './types';
import fetchPipelineStatus from './onePipelineStatusActions';

describe('OnePipelineStatus action', () => {
    let dispatch;

    describe('getPipelineById', () => {
        let data;
        let projectId;
        let pipelineId;
        beforeEach(() => {
            data = { status: '' };
            projectId = '';
            pipelineId = '';
            dispatch = jest.fn();
            jest.spyOn(api, 'getPipelineById').mockResolvedValue(data.status);
        });

        it('should dispatch FETCH_PIPELINE_STATUS_START', () => {
            fetchPipelineStatus()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({
                type: FETCH_PIPELINE_STATUS_START
            });
        });

        it('should dispatch FETCH_PIPELINE_STATUS_SUCCESS on success', () => {
            return fetchPipelineStatus(
                projectId,
                pipelineId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_PIPELINE_STATUS_START }],
                    [
                        {
                            type: FETCH_PIPELINE_STATUS_SUCCESS,
                            payload: { id: pipelineId }
                        }
                    ]
                ]);
            });
        });

        it('should dispatch FETCH_PIPELINE_STATUS_FAIL on failure', () => {
            const project = 'mock-project';
            const pipelineId = 'mock-id';
            const error = 'error';
            jest.spyOn(api, 'getPipelineById').mockRejectedValue(error);
            return fetchPipelineStatus(
                project,
                pipelineId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_PIPELINE_STATUS_START }],
                    [{ type: FETCH_PIPELINE_STATUS_FAIL, payload: { error } }]
                ]);
            });
        });
    });
});
