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

import { fetchResourceUtilization } from './overviewActions';
import api from '../../api/projects';
import {
    FETCH_RESOURCE_UTILIZATION_START,
    FETCH_RESOURCE_UTILIZATION_SUCCESS,
    FETCH_RESOURCE_UTILIZATION_FAIL
} from './types';
import jobApi from '../../api/jobs';
import pipelineApi from '../../api/pipelines';
import { DRAFT } from '../../mxgraph/constants';

describe('Overview actions', () => {
    const projectData = {
        id: 'id',
        name: 'name',
        description: 'description',
        usage: {
            limitsCpu: 5,
            limitsMemory: 1,
            requestsCpu: 5,
            requestsMemory: 1
        },
        limits: {
            limitsCpu: 5,
            limitsMemory: 1,
            requestsCpu: 5,
            requestsMemory: 1
        }
    };
    const usage = {
        cpu: 5,
        memory: 1
    };
    const transformData = {
        jobsStat: {
            Draft: 1,
            Pending: 0,
            Running: 0,
            Succeeded: 0,
            Failed: 0
        },
        pipelinesStat: {
            Draft: 1,
            Pending: 0,
            Running: 0,
            Succeeded: 0,
            Failed: 0,
            Error: 0,
            Stopped: 0,
            Suspended: 0,
            Terminated: 0
        },
        description: 'description',
        name: 'name',
        limits: {
            cpu: 1,
            memory: 1
        },
        requested: {
            cpu: 1,
            memory: 1
        },
        used: {
            cpu: 5,
            memory: 1
        }
    };
    let dispatch;
    describe('fetchResourceUtilization', () => {
        beforeEach(() => {
            dispatch = jest.fn();
            jest.spyOn(api, 'getResourceUtilization').mockResolvedValue({
                data: usage
            });
            jest.spyOn(api, 'getProjectById').mockResolvedValue({
                data: projectData
            });
            jest.spyOn(jobApi, 'getJobs').mockResolvedValue({
                data: {
                    jobs: [
                        {
                            id: 'job1',
                            status: DRAFT
                        }
                    ]
                }
            });
            jest.spyOn(pipelineApi, 'getPipelines').mockResolvedValue({
                data: {
                    pipelines: [
                        {
                            id: 'pipeline1',
                            status: DRAFT
                        }
                    ]
                }
            });
        });
        it('should dispatch FETCH_RESOURCE_UTILIZATION_START', () => {
            fetchResourceUtilization()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({
                type: FETCH_RESOURCE_UTILIZATION_START
            });
        });

        it('should dispatch FETCH_RESOURCE_UTILIZATION_SUCCESS on success', () => {
            return fetchResourceUtilization()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_RESOURCE_UTILIZATION_START }],
                    [
                        {
                            type: FETCH_RESOURCE_UTILIZATION_SUCCESS,
                            payload: transformData
                        }
                    ]
                ]);
            });
        });

        it('should dispatch FETCH_RESOURCE_UTILIZATION_FAIL on failure', () => {
            jest.spyOn(api, 'getResourceUtilization').mockRejectedValue({});
            return fetchResourceUtilization()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_RESOURCE_UTILIZATION_START }],
                    [
                        {
                            type: FETCH_RESOURCE_UTILIZATION_FAIL,
                            payload: { error: {} }
                        }
                    ]
                ]);
            });
        });
    });
});
