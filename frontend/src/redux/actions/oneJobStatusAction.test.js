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

import fetchJobStatus from './oneJobStatusAction';
import api from '../../api/jobs';
import {
    FETCH_JOB_STATUS_START,
    FETCH_JOB_STATUS_SUCCESS,
    FETCH_JOB_STATUS_FAIL
} from './types';

describe('One Job Status action', () => {
    let dispatch;

    describe('getJobById', () => {
        let data;
        let projectId;
        let jobId;
        beforeEach(() => {
            data = { status: '' };
            projectId = 'vf-test';
            jobId = 'vftestid0';
            dispatch = jest.fn();
        });

        it('should dispatch FETCH_JOB_STATUS_START without using params', () => {
            fetchJobStatus(projectId, jobId)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_JOB_STATUS_START });
        });

        it('should dispatch jobId with FETCH_JOB_STATUS_SUCCESS on success', () => {
            jest.spyOn(api, 'getJobById').mockResolvedValue({ ...data });
            return fetchJobStatus(
                projectId,
                jobId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_JOB_STATUS_START }],
                    [
                        {
                            type: FETCH_JOB_STATUS_SUCCESS,
                            payload: {
                                id: jobId
                            }
                        }
                    ]
                ]);
            });
        });

        it('should dispatch jobId with FETCH_JOB_STATUS_FAIL on failure', () => {
            jest.spyOn(api, 'getJobById').mockRejectedValue('error');
            return fetchJobStatus(
                projectId,
                jobId
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_JOB_STATUS_START }],
                    [{ type: FETCH_JOB_STATUS_FAIL, payload: { error: 'error' } }]
                ]);
            });
        });
    });
});
