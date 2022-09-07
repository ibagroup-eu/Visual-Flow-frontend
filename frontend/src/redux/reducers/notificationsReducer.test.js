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

import notificationsReducer from './notificationsReducer';
import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } from '../actions/types';

describe('notifications Reducer', () => {
    const key = '#1';
    const notification = { key };
    const initialState = [{ ...notification }, { key: '#2' }];

    it('should return the initial state', () => {
        expect(notificationsReducer(undefined, {})).toEqual([]);
    });

    it('should handle ENQUEUE_SNACKBAR', () => {
        const action = {
            type: ENQUEUE_SNACKBAR,
            notification
        };
        expect(notificationsReducer(undefined, action)).toEqual([notification]);
    });

    it('should handle CLOSE_SNACKBAR with key', () => {
        const action = {
            type: CLOSE_SNACKBAR,
            key
        };
        expect(
            notificationsReducer(initialState, action).filter(v => v.key === key)
        ).toEqual([{ ...notification, dismissed: true }]);
    });

    it('should handle CLOSE_SNACKBAR dismissAll', () => {
        const action = {
            type: CLOSE_SNACKBAR,
            dismissAll: true
        };
        const expected = [
            { dismissed: true, key: '#1' },
            { dismissed: true, key: '#2' }
        ];
        expect(notificationsReducer(initialState, action)).toEqual(expected);
    });

    it('should handle REMOVE_SNACKBAR', () => {
        const action = {
            type: REMOVE_SNACKBAR,
            key: '#2'
        };
        expect(notificationsReducer(initialState, action)).toEqual([notification]);
    });
});
