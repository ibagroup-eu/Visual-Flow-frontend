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

import { TOGGLE_CONFIRMATION } from './types';
import toggleConfirmationWindow, { GLOBAL_CONFIRMATION_ID } from './modalsActions';

describe('modals', () => {
    const unknownParam = 'some param';

    const dispatch = jest.fn();

    beforeEach(() => {
        dispatch.mockClear();
    });

    it('toggleConfirmationWindow with no params', () => {
        toggleConfirmationWindow()(dispatch);
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: TOGGLE_CONFIRMATION,
                payload: { id: GLOBAL_CONFIRMATION_ID }
            })
        );
    });

    it('toggleConfirmationWindow with default id', () => {
        const params = { body: 'some body' };
        toggleConfirmationWindow({ ...params, unknownParam })(dispatch);
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: TOGGLE_CONFIRMATION,
                payload: { ...params, id: GLOBAL_CONFIRMATION_ID }
            })
        );
    });

    it('toggleConfirmationWindow with specific id', () => {
        const params = { id: 'some id', body: 'some body' };
        toggleConfirmationWindow({ ...params, unknownParam })(dispatch);
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: TOGGLE_CONFIRMATION,
                payload: { ...params }
            })
        );
    });

    it('toggleConfirmationWindow with all params', () => {
        const params = {
            id: 'some id',
            body: 'some body',
            callback: 'some callback',
            title: 'some title',
            ok: 'yes',
            cancel: 'no'
        };
        toggleConfirmationWindow({ ...params, unknownParam })(dispatch);
        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: TOGGLE_CONFIRMATION,
                payload: { ...params }
            })
        );
    });
});
