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
    CREATE_CRON_FAIL,
    CREATE_CRON_START,
    CREATE_CRON_SUCCESS,
    FETCH_CRON_FAIL,
    FETCH_CRON_START,
    FETCH_CRON_SUCCESS,
    UPDATE_CRON_FAIL,
    UPDATE_CRON_START,
    UPDATE_CRON_SUCCESS
} from './types';
import api from '../../api/cron';
import { createCron, getCron, updateCron } from './cronActions';

describe('cron action', () => {
    let dispatch;

    describe('createCron', () => {
        let cronData;
        let wrongData;
        const id = 'id';
        const projectId = 'some_id';
        beforeEach(() => {
            cronData = { schedule: '', suspend: false };
            wrongData = { wrongSchedule: 'wrongValue' };
            dispatch = jest.fn();
            jest.spyOn(api, 'createCron').mockResolvedValue({ cronData });
        });

        it('should dispatch CREATE_CRON_START', () => {
            createCron(projectId, id, cronData)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: CREATE_CRON_START });
        });

        it('should dispatch CREATE_CRON_SUCCESS on success', () => {
            return createCron(
                projectId,
                id,
                cronData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: CREATE_CRON_START }],
                    [{ type: CREATE_CRON_SUCCESS }],
                    [expect.any(Function)]
                ]);
            });
        });

        it('should dispatch CREATE_CRON_FAIL on failure', () => {
            jest.spyOn(api, 'createCron').mockRejectedValue({ wrongData });
            return createCron(
                projectId,
                id,
                cronData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: CREATE_CRON_START }],
                    [
                        {
                            type: CREATE_CRON_FAIL,
                            payload: { error: { wrongData } }
                        }
                    ],
                    [expect.any(Function)]
                ]);
            });
        });
    });

    describe('getCron', () => {
        let data;
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'getCron').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_CRON_START', () => {
            getCron()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_CRON_START });
        });

        it('should dispatch FETCH_CRON_SUCCESS on success', () => {
            return getCron()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_CRON_START }],
                    [{ type: FETCH_CRON_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch FETCH_CRON_FAIL on failure', () => {
            jest.spyOn(api, 'getCron').mockRejectedValue({});
            return getCron()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_CRON_START }],
                    [{ type: FETCH_CRON_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('updateCron', () => {
        let cronData;
        let wrongData;
        const id = 'id';
        const projectId = 'some_id';
        beforeEach(() => {
            cronData = { schedule: '', suspend: false };
            wrongData = { wrongSchedule: 'wrongValue' };
            dispatch = jest.fn();
            jest.spyOn(api, 'updateCron').mockResolvedValue({ cronData });
        });

        it('should dispatch UPDATE_CRON_START', () => {
            updateCron(projectId, id, cronData)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: UPDATE_CRON_START });
        });

        it('should dispatch UPDATE_CRON_SUCCESS on success', () => {
            return updateCron(
                projectId,
                id,
                cronData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: UPDATE_CRON_START }],
                    [{ type: UPDATE_CRON_SUCCESS }],
                    [expect.any(Function)]
                ]);
            });
        });

        it('should dispatch UPDATE_CRON_FAIL on failure', () => {
            jest.spyOn(api, 'updateCron').mockRejectedValue({ wrongData });
            return updateCron(
                projectId,
                id,
                cronData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: UPDATE_CRON_START }],
                    [
                        {
                            type: UPDATE_CRON_FAIL,
                            payload: { error: { wrongData } }
                        }
                    ],
                    [expect.any(Function)]
                ]);
            });
        });
    });
});
