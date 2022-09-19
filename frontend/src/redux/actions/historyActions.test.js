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

import api from '../../api/jobs';
import fetchJobHistory from './historyActions';
import {
    FETCH_HISTORY_START,
    FETCH_HISTORY_SUCCESS,
    FETCH_HISTORY_FAIL
} from './types';

describe('History action', () => {
    let dispatch;

    describe('getJobHistory', () => {
        let data;
        beforeEach(() => {
            data = [];
            dispatch = jest.fn();
            jest.spyOn(api, 'getHistory').mockResolvedValue({ data });
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
            jest.spyOn(api, 'getHistory').mockRejectedValue({});
            return fetchJobHistory()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_HISTORY_START }],
                    [{ type: FETCH_HISTORY_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });
});
