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

import jobApi from '../../api/jobs';
import pipelineApi from '../../api/pipelines';
import { fetchJobHistory, fetchPipelineHistory } from './historyActions';
import {
    FETCH_HISTORY_FAIL,
    FETCH_HISTORY_START,
    FETCH_HISTORY_SUCCESS
} from './types';

describe('History action', () => {
    let dispatch;

    describe('getJobHistory', () => {
        let data;
        beforeEach(() => {
            data = [];
            dispatch = jest.fn();
            jest.spyOn(jobApi, 'getJobHistory').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_HISTORY_START', () => {
            fetchJobHistory()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_HISTORY_START });
        });

        it('should dispatch FETCH_HISTORY_SUCCESS on success', () => {
            return fetchJobHistory()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_HISTORY_START }],
                    [{ type: FETCH_HISTORY_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch FETCH_LOGS_FAIL on failure', () => {
            jest.spyOn(jobApi, 'getJobHistory').mockRejectedValue({});
            return fetchJobHistory()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_HISTORY_START }],
                    [{ type: FETCH_HISTORY_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('getPipelineHistory', () => {
        let data;
        beforeEach(() => {
            data = [];
            dispatch = jest.fn();
            jest.spyOn(pipelineApi, 'getPipelineHistory').mockResolvedValue({
                data
            });
        });

        it('should dispatch FETCH_HISTORY_START', () => {
            fetchPipelineHistory()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_HISTORY_START });
        });

        it('should dispatch FETCH_HISTORY_SUCCESS on success', () => {
            jest.spyOn(pipelineApi, 'getPipelineHistory').mockResolvedValue({
                data: [
                    {
                        id: '07062203-c65c-4ceb-add1-7458ece5912a',
                        type: 'pipeline',
                        startedAt: '2022-11-07T13:31:23.000Z',
                        finishedAt: '2022-11-07T13:33:28.000Z',
                        startedBy: 'uladzislaukhizhanok',
                        status: 'Failed',
                        nodes: [
                            {
                                id:
                                    '07062203-c65c-4ceb-add1-7458ece5912a-2384349284',
                                name: 'df1',
                                operation: 'JOB',
                                startedAt: '2022-11-07T13:31:23.000Z',
                                finishedAt: '2022-11-07T13:32:21.000Z',
                                status: 'Succeeded',
                                logId: '1667828008509'
                            }
                        ]
                    }
                ]
            });
            return fetchPipelineHistory()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_HISTORY_START }],
                    [
                        {
                            type: FETCH_HISTORY_SUCCESS,
                            payload: [
                                {
                                    id: '07062203-c65c-4ceb-add1-7458ece5912a',
                                    type: 'pipeline',
                                    startedAt: '2022-11-07T13:31:23.000Z',
                                    finishedAt: '2022-11-07T13:33:28.000Z',
                                    startedBy: 'uladzislaukhizhanok',
                                    status: 'Failed',
                                    uniqId: expect.any(String),
                                    statuses: [
                                        {
                                            id:
                                                '07062203-c65c-4ceb-add1-7458ece5912a-2384349284',
                                            name: 'df1',
                                            operation: 'JOB',
                                            startedAt: '2022-11-07T13:31:23.000Z',
                                            finishedAt: '2022-11-07T13:32:21.000Z',
                                            status: 'Succeeded',
                                            logId: '1667828008509',
                                            uniqId: expect.any(String)
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                ]);
            });
        });

        it('should dispatch FETCH_LOGS_FAIL on failure', () => {
            jest.spyOn(pipelineApi, 'getPipelineHistory').mockRejectedValue({});
            return fetchPipelineHistory()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_HISTORY_START }],
                    [{ type: FETCH_HISTORY_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });
});
