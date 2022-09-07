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
    FETCH_PIPELINE_STATUS_START,
    FETCH_PIPELINE_STATUS_SUCCESS,
    COPY_PIPELINE_START,
    COPY_PIPELINE_SUCCESS,
    COPY_PIPELINE_FAIL
} from './types';
import api from '../../api/pipelines';
import {
    fetchPipelines,
    deletePipeline,
    runPipeline,
    stopPipeline,
    resumePipeline,
    createPipeline,
    updatePipeline,
    copyPipeline
} from './pipelinesActions';
import fetchPipelineStatus from './onePipelineStatusActions';

describe('Pipelines action', () => {
    let dispatch;

    describe('getPipelines', () => {
        let data;
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'getPipelines').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_PIPELINES_START', () => {
            fetchPipelines()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_PIPELINES_START });
        });

        it('should dispatch FETCH_PIPELINES_SUCCESS on success', () => {
            return fetchPipelines()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_PIPELINES_START }],
                    [{ type: FETCH_PIPELINES_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch FETCH_PIPELINES_FAIL on failure', () => {
            jest.spyOn(api, 'getPipelines').mockRejectedValue({});
            return fetchPipelines()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_PIPELINES_START }],
                    [{ type: FETCH_PIPELINES_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('DeletePipelines', () => {
        const success = 'SUCCESS';
        const pipelineIds = ['id1'];
        const projectId = 'some_id';

        beforeEach(() => {
            dispatch = jest.fn();
            jest.spyOn(api, 'deletePipeline').mockResolvedValue(success);
        });

        it('should dispatch DELETE_PIPELINES_START', () => {
            return deletePipeline(
                projectId,
                pipelineIds
            )(dispatch).then(() =>
                expect(dispatch).toHaveBeenCalledWith({
                    type: DELETE_PIPELINES_START
                })
            );
        });

        it('should dispatch DELETE_PIPELINES_SUCCESS on success', () => {
            return deletePipeline(
                projectId,
                pipelineIds
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual(
                    expect.objectContaining([
                        [{ type: DELETE_PIPELINES_START }],
                        [
                            {
                                type: DELETE_PIPELINES_SUCCESS,
                                payload: { success: [success], id: pipelineIds }
                            }
                        ]
                    ])
                );
            });
        });

        it('should dispatch DELETE_PIPELINES_FAIL on failure', () => {
            const error = 'error';
            jest.spyOn(api, 'deletePipeline').mockRejectedValue(error);
            return deletePipeline(
                projectId,
                pipelineIds
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual(
                    expect.arrayContaining([
                        [{ type: DELETE_PIPELINES_START }],
                        [{ type: DELETE_PIPELINES_FAIL, payload: { error } }]
                    ])
                );
            });
        });
    });

    describe('runPipeline', () => {
        let data;
        let action;
        beforeEach(() => {
            data = {
                project: '',
                id: '',
                status: ''
            };
            dispatch = jest.fn();
            action = jest.fn();
            jest.spyOn(api, 'runPipeline').mockResolvedValue({ data });
        });

        it('should dispatch RUN_PIPELINE_START', () => {
            runPipeline()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: RUN_PIPELINE_START });
        });

        it('should dispatch RUN_PIPELINE_START', () => {
            runPipeline(data.project, data.id, action)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: RUN_PIPELINE_START });
        });

        it('should dispatch RUN_PIPELINE_SUCCESS on success', () => {
            return runPipeline()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: RUN_PIPELINE_START }],
                    [
                        {
                            type: RUN_PIPELINE_SUCCESS,
                            payload: { project: '', id: '', status: '' }
                        }
                    ],
                    [expect.any(Function)]
                ]);
            });
        });

        it('should dispatch RUN_PIPELINE_FAIL on failure', () => {
            jest.spyOn(api, 'runPipeline').mockRejectedValue({});
            return runPipeline()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: RUN_PIPELINE_START }],
                    [{ type: RUN_PIPELINE_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('stopPipeline', () => {
        let data;
        beforeEach(() => {
            data = { status: '' };
            dispatch = jest.fn();
            jest.spyOn(api, 'stopPipeline').mockResolvedValue({ data });
        });

        it('should dispatch STOP_PIPELINE_START', () => {
            stopPipeline()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: STOP_PIPELINE_START });
        });

        it('should dispatch STOP_PIPELINE_SUCCESS on success', () => {
            return stopPipeline()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: STOP_PIPELINE_START }],
                    [
                        {
                            type: STOP_PIPELINE_SUCCESS,
                            payload: { status: '' }
                        }
                    ]
                ]);
            });
        });

        it('should dispatch STOP_PIPELINE_FAIL on failure', () => {
            jest.spyOn(api, 'stopPipeline').mockRejectedValue({});
            return stopPipeline()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: STOP_PIPELINE_START }],
                    [{ type: STOP_PIPELINE_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('resumePipeline', () => {
        let data;
        beforeEach(() => {
            data = { status: '' };
            dispatch = jest.fn();
            jest.spyOn(api, 'resumePipeline').mockResolvedValue({ data });
        });

        it('should dispatch RESUME_PIPELINE_START', () => {
            resumePipeline()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: RESUME_PIPELINE_START });
        });

        it('should dispatch RESUME_PIPELINE_SUCCESS on success', () => {
            return resumePipeline()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: RESUME_PIPELINE_START }],
                    [
                        {
                            type: RESUME_PIPELINE_SUCCESS,
                            payload: { status: '' }
                        }
                    ]
                ]);
            });
        });

        it('should dispatch RESUME_PIPELINE_FAIL on failure', () => {
            jest.spyOn(api, 'resumePipeline').mockRejectedValue({});
            return resumePipeline()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: RESUME_PIPELINE_START }],
                    [{ type: RESUME_PIPELINE_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('createPipeline', () => {
        let data;
        let wrongData;
        const graph = { getModel: jest.fn(() => ({ cells: [] })) };
        const pipelineData = { param: 'value' };
        const projectId = 'some_id';
        beforeEach(() => {
            data = { param: 'value' };
            wrongData = { wrongParam: 'wrongValue' };
            dispatch = jest.fn();
            jest.spyOn(api, 'createPipeline').mockResolvedValue({ data });
        });

        it('should dispatch CREATE_PIPELINE_START', () => {
            createPipeline(graph, projectId, pipelineData)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: CREATE_PIPELINE_START });
        });

        it('should dispatch CREATE_PIPELINE_SUCCESS on success', () => {
            return createPipeline(
                graph,
                projectId,
                pipelineData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: CREATE_PIPELINE_START }],
                    [{ type: CREATE_PIPELINE_SUCCESS, payload: data }],
                    [expect.any(Function)]
                ]);
            });
        });

        it('should dispatch CREATE_PIPELINE_FAIL on failure', () => {
            jest.spyOn(api, 'createPipeline').mockRejectedValue({ wrongData });
            return createPipeline(
                graph,
                projectId,
                pipelineData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: CREATE_PIPELINE_START }],
                    [
                        {
                            type: CREATE_PIPELINE_FAIL,
                            payload: { error: { wrongData } }
                        }
                    ]
                ]);
            });
        });
    });

    describe('updatePipeline', () => {
        let data;
        let wrongData;
        const graph = { getModel: jest.fn(() => ({ cells: [] })) };
        const pipelineData = { param: 'value' };
        const id = 'id';
        const projectId = 'some_id';
        beforeEach(() => {
            data = { param: 'value' };
            wrongData = { wrongParam: 'wrongValue' };
            dispatch = jest.fn();
            jest.spyOn(api, 'updatePipeline').mockResolvedValue({ data });
        });

        it('should dispatch UPDATE_PIPELINE_START', () => {
            updatePipeline(graph, projectId, id, pipelineData)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: UPDATE_PIPELINE_START });
        });

        it('should dispatch UPDATE_PIPELINE_SUCCESS on success', () => {
            return updatePipeline(
                graph,
                projectId,
                id,
                pipelineData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: UPDATE_PIPELINE_START }],
                    [{ type: UPDATE_PIPELINE_SUCCESS }],
                    [expect.any(Function)]
                ]);
            });
        });

        it('should dispatch UPDATE_PIPELINE_FAIL on failure', () => {
            jest.spyOn(api, 'updatePipeline').mockRejectedValue({ wrongData });
            return updatePipeline(
                graph,
                projectId,
                id,
                pipelineData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: UPDATE_PIPELINE_START }],
                    [
                        {
                            type: UPDATE_PIPELINE_FAIL,
                            payload: { error: { wrongData } }
                        }
                    ]
                ]);
            });
        });
    });

    describe('runPipelineAndRefreshIt', () => {
        let data;
        let projectId;
        let pipelineId;
        beforeEach(() => {
            data = { status: '' };
            projectId = '';
            pipelineId = '';
            dispatch = jest.fn();
            jest.spyOn(api, 'runPipeline').mockResolvedValue({ data });
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
    });

    describe('stopPipelineAndRefreshIt', () => {
        let data;
        let projectId;
        let pipelineId;
        beforeEach(() => {
            data = { status: '' };
            projectId = '';
            pipelineId = '';
            dispatch = jest.fn();
            jest.spyOn(api, 'stopPipeline').mockResolvedValue({ data });
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
    });

    describe('copyPipeline', () => {
        let data;
        let projectId;
        let pipelineId;
        beforeEach(() => {
            data = { status: '' };
            projectId = 'some_id';
            pipelineId = 'id';
            dispatch = jest.fn();
            jest.spyOn(api, 'copyPipeline').mockResolvedValue({ data });
        });

        it('should dispatch COPY_PIPELINE_START', () => {
            copyPipeline()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: COPY_PIPELINE_START });
        });

        it('should dispatch COPY_PIPELINE_START_SUCCESS on success', () => {
            return copyPipeline(
                projectId,
                pipelineId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: COPY_PIPELINE_START }],
                    [{ type: COPY_PIPELINE_SUCCESS }],
                    [expect.any(Function)]
                ]);
            });
        });

        it('should dispatch COPY_PIPELINE_FAIL on failure', () => {
            jest.spyOn(api, 'copyPipeline').mockRejectedValue('error');
            return copyPipeline(
                projectId,
                pipelineId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: COPY_PIPELINE_START }],
                    [{ type: COPY_PIPELINE_FAIL, payload: { error: 'error' } }]
                ]);
            });
        });
    });
});
