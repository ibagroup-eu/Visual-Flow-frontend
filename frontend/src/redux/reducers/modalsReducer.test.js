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

import modalsReducer from './modalsReducer';
import { TOGGLE_CONFIRMATION } from '../actions/types';

describe('modals reducer', () => {
    it('should return the initial state for unknown action', () => {
        const state = { some: 'value' };
        expect(modalsReducer(state, { type: 'UNKNOWN ACTION' })).toEqual(state);
    });

    it('should return the initial state if id is absent', () => {
        const state = { some: 'value' };
        expect(
            modalsReducer(state, { type: TOGGLE_CONFIRMATION, payload: {} })
        ).toEqual(state);
    });

    it('should toggle open flag', () => {
        const state = { some: 'value' };
        const id = 'some_id';
        expect(
            modalsReducer(state, { type: TOGGLE_CONFIRMATION, payload: { id } })
        ).toMatchObject({ ...state, [id]: { open: true } });

        expect(
            modalsReducer(
                { ...state, [id]: { open: false } },
                { type: TOGGLE_CONFIRMATION, payload: { id } }
            )
        ).toMatchObject({ ...state, [id]: { open: true } });

        expect(
            modalsReducer(
                { ...state, [id]: { open: true } },
                { type: TOGGLE_CONFIRMATION, payload: { id } }
            )
        ).toMatchObject({ ...state, [id]: { open: false } });
    });

    it('should add full payload into the modal state', () => {
        const state = { some: 'value' };
        const id = 'some_id';
        const body = 'some body';
        const param = 'some param';

        expect(
            modalsReducer(state, {
                type: TOGGLE_CONFIRMATION,
                payload: { id, param, body }
            })
        ).toMatchObject({ ...state, [id]: { open: true, id, param, body } });
    });

    it('should keep body if it is absent', () => {
        const state = { some: 'value' };
        const id = 'some_id';
        const body = 'some body';

        expect(
            modalsReducer(
                { ...state, [id]: { body } },
                { type: TOGGLE_CONFIRMATION, payload: { id } }
            )
        ).toMatchObject({ ...state, [id]: { body } });
    });
});
