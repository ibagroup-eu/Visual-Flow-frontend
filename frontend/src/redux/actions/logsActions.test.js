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

import { fetchJobLogs, fetchContainerLogs } from './logsActions';
import apiJobs from '../../api/jobs';
import apiPipelines from '../../api/pipelines';
import { FETCH_LOGS_START, FETCH_LOGS_FAIL, FETCH_LOGS_SUCCESS } from './types';

describe('Logs action', () => {
    let dispatch;

    describe('getJobLogs', () => {
        let data;
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(apiJobs, 'getJobLogs').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_LOGS_START', () => {
            fetchJobLogs()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_LOGS_START });
        });

        it('should dispatch FETCH_LOGS_SUCCESS on success', () => {
            return fetchJobLogs()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_LOGS_START }],
                    [{ type: FETCH_LOGS_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch FETCH_LOGS_FAIL on failure', () => {
            jest.spyOn(apiJobs, 'getJobLogs').mockRejectedValue({});
            return fetchJobLogs()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_LOGS_START }],
                    [{ type: FETCH_LOGS_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('getPipelineLogs', () => {
        let data;
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(apiPipelines, 'getPipelineLogs').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_LOGS_START', () => {
            fetchContainerLogs()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_LOGS_START });
        });

        it('should dispatch FETCH_LOGS_SUCCESS on success', () => {
            return fetchContainerLogs()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_LOGS_START }],
                    [{ type: FETCH_LOGS_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch FETCH_LOGS_FAIL on failure', () => {
            jest.spyOn(apiPipelines, 'getPipelineLogs').mockRejectedValue({});
            return fetchContainerLogs()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_LOGS_START }],
                    [{ type: FETCH_LOGS_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });
});
