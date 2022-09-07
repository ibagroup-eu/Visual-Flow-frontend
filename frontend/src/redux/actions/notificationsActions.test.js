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
    closeSnackbar,
    enqueueSnackbar,
    removeSnackbar
} from './notificationsActions';

import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } from './types';

describe('Notifications actions', () => {
    it('should call CLOSE_SNACKBAR', () => {
        const expectedAction = { type: CLOSE_SNACKBAR, dismissAll: true };
        expect(closeSnackbar()).toEqual(expectedAction);
    });

    it('should call CLOSE_SNACKBAR with key', () => {
        const key = '#1';
        const expectedAction = { type: CLOSE_SNACKBAR, dismissAll: false, key };
        expect(closeSnackbar(key)).toEqual(expectedAction);
    });

    it('should call REMOVE_SNACKBAR', () => {
        const key = '#1';
        const expectedAction = { type: REMOVE_SNACKBAR, key };
        expect(removeSnackbar(key)).toEqual(expectedAction);
    });

    it('should call ENQUEUE_SNACKBAR', () => {
        const key = '#1';
        const notification = {
            options: {
                key
            }
        };
        const expectedAction = {
            type: ENQUEUE_SNACKBAR,
            notification: { ...notification, key }
        };
        expect(enqueueSnackbar(notification)).toEqual(expectedAction);
    });
});
