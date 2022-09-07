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
    SET_CURRENT_CELL,
    SET_GRAPH_PARAMS,
    SET_SIDE_PANEL,
    SET_GRAPH_FIELDS,
    FETCH_JOB_SUCCESS,
    FETCH_JOB_FAIL,
    FETCH_JOB_START,
    FETCH_PIPELINE_START,
    FETCH_PIPELINE_SUCCESS,
    FETCH_PIPELINE_FAIL,
    SET_ZOOM_VALUE
} from './types';
import {
    setFields,
    setCurrentCell,
    setParams,
    setSidePanel,
    setZoomValue,
    fetchJob,
    fetchPipelineById
} from './mxGraphActions';
import api from '../../api/jobs';

import apiPipelines from '../../api/pipelines';

import { DRAFT } from '../../mxgraph/constants';

describe('mxGraph actions', () => {
    it('should call SET_SIDE_PANEL', () => {
        const expectedAction = { type: SET_SIDE_PANEL, payload: true };
        expect(setSidePanel(true)).toEqual(expectedAction);
    });

    it('should call SET_CURRENT_CELL', () => {
        const expectedAction = { type: SET_CURRENT_CELL, payload: 'mxId' };
        expect(setCurrentCell('mxId')).toEqual(expectedAction);
    });

    it('should call SET_GRAPH_PARAMS', () => {
        const expectedAction = { type: SET_GRAPH_PARAMS, payload: {} };
        expect(setParams({})).toEqual(expectedAction);
    });

    it('should call SET_GRAPH_FIELDS', () => {
        const expectedAction = { type: SET_GRAPH_FIELDS, payload: {} };
        expect(setFields({})).toEqual(expectedAction);
    });

    it('should call SET_ZOOM_VALUE', () => {
        const expectedAction = { type: SET_ZOOM_VALUE, payload: 0.4 };
        expect(setZoomValue(0.4)).toEqual(expectedAction);
    });

    describe('getJobById', () => {
        let data;
        let dispatch;
        let jobId;
        let projectId;
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jobId = 'id';
            projectId = 'project_id';

            jest.spyOn(api, 'getJobById').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_JOB_START', () => {
            fetchJob()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_JOB_START });
        });

        it('should dispatch FETCH_JOB_SUCCESS on success', () => {
            return fetchJob(
                projectId,
                jobId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_JOB_START }],
                    [{ type: FETCH_JOB_SUCCESS, payload: data }],
                    [expect.any(Function)]
                ]);
            });
        });

        it('fetchJob without jobId', () => {
            return fetchJob()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_JOB_START }],
                    [
                        {
                            type: FETCH_JOB_SUCCESS,
                            payload: {
                                definition: {},
                                status: DRAFT,
                                params: {}
                            }
                        }
                    ],
                    [expect.any(Function)]
                ]);
            });
        });

        it('should dispatch FETCH_JOB_FAIL on failure', () => {
            jest.spyOn(api, 'getJobById').mockRejectedValue({});
            return fetchJob(
                projectId,
                jobId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_JOB_START }],
                    [{ type: FETCH_JOB_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('fetchPipelineById', () => {
        let data;
        let dispatch;
        let pipelineId;
        let projectId;
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            pipelineId = 'id';
            projectId = 'project_id';

            jest.spyOn(apiPipelines, 'getPipelineById').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_PIPELINE_START', () => {
            fetchPipelineById()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_PIPELINE_START });
        });

        it('should dispatch FETCH_PIPELINE_SUCCESS on success', () => {
            return fetchPipelineById(
                projectId,
                pipelineId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_PIPELINE_START }],
                    [{ type: FETCH_PIPELINE_SUCCESS, payload: data }],
                    [expect.any(Function)]
                ]);
            });
        });

        it('fetchPipelineById without pipelineId', () => {
            return fetchPipelineById()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_PIPELINE_START }],
                    [
                        {
                            type: FETCH_PIPELINE_SUCCESS,
                            payload: {
                                definition: {},
                                params: {},
                                status: DRAFT
                            }
                        }
                    ],
                    [expect.any(Function)]
                ]);
            });
        });

        it('should dispatch FETCH_PIPELINE_FAIL on failure', () => {
            jest.spyOn(apiPipelines, 'getPipelineById').mockRejectedValue({});
            return fetchPipelineById(
                projectId,
                pipelineId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_PIPELINE_START }],
                    [{ type: FETCH_PIPELINE_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });
});
