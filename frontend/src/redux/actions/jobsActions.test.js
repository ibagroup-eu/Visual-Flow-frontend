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
    createJob,
    deleteJob,
    fetchJobs,
    updateJob,
    runJob,
    stopJob,
    copyJob
} from './jobsActions';
import fetchJobStatus from './oneJobStatusAction';
import api from '../../api/jobs';
import {
    FETCH_JOBS_START,
    FETCH_JOBS_FAIL,
    FETCH_JOBS_SUCCESS,
    DELETE_JOBS_START,
    DELETE_JOBS_FAIL,
    DELETE_JOBS_SUCCESS,
    CREATE_JOB_START,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_FAIL,
    UPDATE_JOB_START,
    UPDATE_JOB_SUCCESS,
    UPDATE_JOB_FAIL,
    FETCH_JOB_STATUS_START,
    STOP_JOB_START,
    STOP_JOB_SUCCESS,
    STOP_JOB_FAIL,
    RUN_JOB_START,
    RUN_JOB_SUCCESS,
    RUN_JOB_FAIL,
    COPY_JOB_START,
    COPY_JOB_SUCCESS,
    COPY_JOB_FAIL
} from './types';

describe('Jobs action', () => {
    let dispatch;

    describe('getJobs', () => {
        let data;
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'getJobs').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_JOBS_START', () => {
            fetchJobs()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_JOBS_START });
        });

        it('should dispatch FETCH_JOBS_SUCCESS on success', () => {
            return fetchJobs()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_JOBS_START }],
                    [{ type: FETCH_JOBS_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch FETCH_JOBS_FAIL on failure', () => {
            jest.spyOn(api, 'getJobs').mockRejectedValue({});
            return fetchJobs()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_JOBS_START }],
                    [{ type: FETCH_JOBS_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('DeleteJob', () => {
        const success = 'SUCCESS';
        const jobIds = ['id1'];
        const projectId = 'some_id';

        beforeEach(() => {
            dispatch = jest.fn();
            jest.spyOn(api, 'deleteJob').mockResolvedValue(success);
        });

        it('should dispatch DELETE_JOBS_START', () => {
            return deleteJob(
                projectId,
                jobIds
            )(dispatch).then(() =>
                expect(dispatch).toHaveBeenCalledWith({
                    type: DELETE_JOBS_START
                })
            );
        });

        it('should dispatch DELETE_JOBS_SUCCESS on success', () => {
            return deleteJob(
                projectId,
                jobIds
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual(
                    expect.objectContaining([
                        [{ type: DELETE_JOBS_START }],
                        [
                            {
                                type: DELETE_JOBS_SUCCESS,
                                payload: { success: [success], id: jobIds }
                            }
                        ]
                    ])
                );
            });
        });

        it('should dispatch DELETE_JOBS_FAIL on failure', () => {
            const error = 'error';
            jest.spyOn(api, 'deleteJob').mockRejectedValue(error);
            return deleteJob(
                projectId,
                jobIds
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual(
                    expect.arrayContaining([
                        [{ type: DELETE_JOBS_START }],
                        [{ type: DELETE_JOBS_FAIL, payload: { error } }]
                    ])
                );
            });
        });
    });

    describe('updateJob', () => {
        let data;
        const graph = { getModel: jest.fn(() => ({ cells: [] })) };
        const jobData = {};
        const id = 'id';
        const projectId = 'some_id';
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'updateJob').mockResolvedValue({ data });
        });

        it('should dispatch UPDATE_JOB_START', () => {
            updateJob(graph, projectId, id, jobData)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: UPDATE_JOB_START });
        });

        it('should dispatch UPDATE_JOB_SUCCESS on success', () => {
            return updateJob(
                graph,
                projectId,
                id,
                jobData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: UPDATE_JOB_START }],
                    [{ type: UPDATE_JOB_SUCCESS }],
                    [expect.any(Function)]
                ]);
            });
        });

        it('should dispatch UPDATE_JOB_FAIL on failure', () => {
            jest.spyOn(api, 'updateJob').mockRejectedValue({});
            return updateJob(
                graph,
                projectId,
                id,
                jobData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: UPDATE_JOB_START }],
                    [{ type: UPDATE_JOB_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('createJob', () => {
        let data;
        const graph = { getModel: jest.fn(() => ({ cells: [] })) };
        const jobData = {};
        const projectId = 'some_id';
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'createJob').mockResolvedValue({ data });
        });

        it('should dispatch CREATE_JOB_START', () => {
            createJob(graph, projectId, jobData)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: CREATE_JOB_START });
        });

        it('should dispatch CREATE_JOB_SUCCESS on success', () => {
            return createJob(
                graph,
                projectId,
                jobData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: CREATE_JOB_START }],
                    [{ type: CREATE_JOB_SUCCESS, payload: data }],
                    [expect.any(Function)]
                ]);
            });
        });

        it('should dispatch CREATE_JOB_FAIL on failure', () => {
            jest.spyOn(api, 'createJob').mockRejectedValue({});
            return createJob(
                graph,
                projectId,
                jobData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: CREATE_JOB_START }],
                    [{ type: CREATE_JOB_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('runJob', () => {
        let data;
        let disp;
        beforeEach(() => {
            data = {
                project: '',
                id: '',
                status: ''
            };
            dispatch = jest.fn();
            disp = jest.fn();
            jest.spyOn(api, 'runJob').mockResolvedValue({ data });
        });

        it('should dispatch RUN_JOB_START', () => {
            runJob()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: RUN_JOB_START });
        });

        it('should dispatch RUN_JOB_START', () => {
            runJob(data.project, data.id, disp)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: RUN_JOB_START });
        });

        it('should dispatch RUN_JOB_SUCCESS on success', () => {
            return runJob()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: RUN_JOB_START }],
                    [
                        {
                            type: RUN_JOB_SUCCESS,
                            payload: { project: '', id: '', status: '' }
                        }
                    ],
                    [expect.any(Function)]
                ]);
            });
        });

        it('should dispatch RUN_JOB_FAIL on failure', () => {
            jest.spyOn(api, 'runJob').mockRejectedValue({});
            return runJob()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: RUN_JOB_START }],
                    [{ type: RUN_JOB_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('runJobAndRefreshIt', () => {
        let data;
        let projectId;
        let jobId;
        beforeEach(() => {
            data = { status: '' };
            projectId = 'vf-test';
            jobId = 'test_id';
            dispatch = jest.fn();
            jest.spyOn(api, 'runJob').mockResolvedValue({ ...data });
        });

        it('should dispatch RUN_JOB_FAIL on failure', () => {
            jest.spyOn(api, 'runJob').mockRejectedValue({});
            return runJob(
                projectId,
                jobId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: RUN_JOB_START }],
                    [{ type: RUN_JOB_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('stopJob', () => {
        let data;
        let projectId;
        let jobId;
        beforeEach(() => {
            data = { status: '' };
            projectId = 'vf-test';
            jobId = 'test_id';
            dispatch = jest.fn();
            jest.spyOn(api, 'stopJob').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_JOB_STATUS_START without using params', () => {
            fetchJobStatus()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_JOB_STATUS_START });
        });

        it('should dispatch STOP_JOB_START without using params', () => {
            stopJob()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: STOP_JOB_START });
        });

        it('should dispatch jobId with STOP_JOB_SUCCESS on success', () => {
            return stopJob(
                projectId,
                jobId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: STOP_JOB_START }],
                    [
                        {
                            type: STOP_JOB_SUCCESS,
                            payload: { status: '' }
                        }
                    ]
                ]);
            });
        });

        it('should dispatch STOP_JOB_FAIL on failure', () => {
            jest.spyOn(api, 'stopJob').mockRejectedValue({});
            return stopJob()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: STOP_JOB_START }],
                    [{ type: STOP_JOB_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('copyJob', () => {
        let data;
        let projectId;
        let jobId;
        beforeEach(() => {
            data = { status: '' };
            projectId = 'some_id';
            jobId = 'id';
            dispatch = jest.fn();
            jest.spyOn(api, 'copyJob').mockResolvedValue({ data });
        });

        it('should dispatch COPY_JOB_START', () => {
            copyJob()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: COPY_JOB_START });
        });

        it('should dispatch COPY_JOB_SUCCESS on success', () => {
            return copyJob(
                projectId,
                jobId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: COPY_JOB_START }],
                    [{ type: COPY_JOB_SUCCESS }],
                    [expect.any(Function)]
                ]);
            });
        });

        it('should dispatch COPY_JOB_FAIL on failure', () => {
            jest.spyOn(api, 'copyJob').mockRejectedValue('error');
            return copyJob(
                projectId,
                jobId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: COPY_JOB_START }],
                    [{ type: COPY_JOB_FAIL, payload: { error: 'error' } }]
                ]);
            });
        });
    });
});
