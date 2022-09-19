/*
 *  Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import settingsConnectionsReducer from './settingsConnectionsReducer';
import {
    CREATE_CONNECTION_FAIL,
    CREATE_CONNECTION_START,
    CREATE_CONNECTION_SUCCESS,
    DELETE_CONNECTION_FAIL,
    DELETE_CONNECTION_START,
    DELETE_CONNECTION_SUCCESS,
    FETCH_CONNECTIONS_FAIL,
    FETCH_CONNECTIONS_START,
    FETCH_CONNECTIONS_SUCCESS,
    UPDATE_CONNECTION_FAIL,
    UPDATE_CONNECTION_START,
    UPDATE_CONNECTION_SUCCESS
} from '../actions/types';

describe('settingsConnectionsReducer', () => {
    it('CONNECTIONS_START', () => {
        [
            FETCH_CONNECTIONS_START,
            UPDATE_CONNECTION_START,
            CREATE_CONNECTION_START,
            DELETE_CONNECTION_START
        ].forEach(type => {
            expect(settingsConnectionsReducer(undefined, { type })).toEqual({
                loading: true,
                connections: [],
                editable: undefined
            });
        });
    });

    it('CONNECTIONS_FAIL', () => {
        [
            FETCH_CONNECTIONS_FAIL,
            UPDATE_CONNECTION_FAIL,
            CREATE_CONNECTION_FAIL,
            DELETE_CONNECTION_FAIL
        ].forEach(type => {
            const initialState = {
                loading: true,
                connections: [{ connectionName: 'AWS_2' }],
                editable: undefined
            };

            expect(
                settingsConnectionsReducer(initialState, {
                    type,
                    payload: { error: { msg: 'Error!' } }
                })
            ).toEqual({
                loading: false,
                connections: [{ connectionName: 'AWS_2' }],
                editable: undefined,
                error: { msg: 'Error!' }
            });
        });
    });

    it('FETCH_CONNECTIONS_SUCCESS', () => {
        const action = {
            type: FETCH_CONNECTIONS_SUCCESS,
            payload: { editable: true, connections: [{ connectionName: 'AWS_1' }] }
        };

        const initialState = {
            loading: true,
            connections: [{ connectionName: 'AWS_2' }],
            editable: undefined
        };

        expect(settingsConnectionsReducer(initialState, action)).toEqual({
            loading: false,
            connections: [{ connectionName: 'AWS_1' }],
            editable: true
        });
    });

    it('UPDATE_CONNECTION_SUCCESS', () => {
        const action = {
            type: UPDATE_CONNECTION_SUCCESS,
            payload: {
                connection: { id: 'AWS_1', connectionName: 'AWS_3', ssl: false }
            }
        };

        const initialState = {
            loading: true,
            connections: [
                { id: 'AWS_1', connectionName: 'AWS_1' },
                { id: 'AWS_2', connectionName: 'AWS_2' }
            ],
            editable: undefined
        };

        expect(settingsConnectionsReducer(initialState, action)).toEqual({
            loading: false,
            connections: [
                { id: 'AWS_3', connectionName: 'AWS_3', ssl: false },
                { id: 'AWS_2', connectionName: 'AWS_2' }
            ],
            editable: undefined
        });
    });

    it('CREATE_CONNECTION_SUCCESS', () => {
        const action = {
            type: CREATE_CONNECTION_SUCCESS,
            payload: {
                connection: { id: 'AWS_1', connectionName: 'AWS_3', ssl: false }
            }
        };

        const initialState = {
            loading: true,
            connections: [
                { id: 'AWS_1', connectionName: 'AWS_1' },
                { id: 'AWS_2', connectionName: 'AWS_2' }
            ],
            editable: undefined
        };

        expect(settingsConnectionsReducer(initialState, action)).toEqual({
            loading: false,
            connections: [
                { id: 'AWS_1', connectionName: 'AWS_1' },
                { id: 'AWS_2', connectionName: 'AWS_2' },
                { id: 'AWS_1', connectionName: 'AWS_3', ssl: false }
            ],
            editable: undefined
        });
    });

    it('DELETE_CONNECTION_SUCCESS', () => {
        const action = {
            type: DELETE_CONNECTION_SUCCESS,
            payload: {
                connectionId: 'AWS_1'
            }
        };

        const initialState = {
            loading: true,
            connections: [
                { id: 'AWS_1', connectionName: 'AWS_1' },
                { id: 'AWS_2', connectionName: 'AWS_2' }
            ],
            editable: undefined
        };

        expect(settingsConnectionsReducer(initialState, action)).toEqual({
            loading: false,
            connections: [{ id: 'AWS_2', connectionName: 'AWS_2' }],
            editable: undefined
        });
    });
});
