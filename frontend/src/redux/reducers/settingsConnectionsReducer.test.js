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
    UPDATE_CONNECTION_SUCCESS,
    PING_CONNECTION_START,
    PING_CONNECTION_FAIL,
    PING_CONNECTION_SUCCESS
} from '../actions/types';

describe('settingsConnectionsReducer', () => {
    it('FETCH_CONNECTIONS_START', () => {
        const action = { type: FETCH_CONNECTIONS_START };

        expect(settingsConnectionsReducer(undefined, action)).toEqual({
            loading: true,
            connections: [],
            editable: undefined,
            pingingConnections: {},
            deletingConnections: {}
        });
    });

    it('CONNECTIONS_START', () => {
        [UPDATE_CONNECTION_START, CREATE_CONNECTION_START].forEach(type => {
            expect(settingsConnectionsReducer(undefined, { type })).toEqual({
                uploading: true,
                loading: false,
                connections: [],
                editable: undefined,
                pingingConnections: {},
                deletingConnections: {}
            });
        });
    });

    it('DELETE_CONNECTION_START', () => {
        const actions = [
            { type: DELETE_CONNECTION_START, payload: { key: '0' } },
            { type: DELETE_CONNECTION_START, payload: { key: '1' } },
            { type: DELETE_CONNECTION_START, payload: { key: '3' } }
        ];

        const initialState = actions.reduce(
            (state, action) => settingsConnectionsReducer(state, action),
            undefined
        );

        expect(initialState).toEqual({
            loading: false,
            connections: [],
            editable: undefined,
            pingingConnections: {},
            deletingConnections: {
                '0': true,
                '1': true,
                '3': true
            }
        });
    });

    it('PING CONNECTIONS_START', () => {
        const actions = [
            { type: PING_CONNECTION_START, payload: { key: '0' } },
            { type: PING_CONNECTION_START, payload: { key: '1' } },
            { type: PING_CONNECTION_START, payload: { key: '3' } }
        ];

        const initialState = actions.reduce(
            (state, action) => settingsConnectionsReducer(state, action),
            undefined
        );

        expect(initialState).toEqual({
            loading: false,
            connections: [],
            editable: undefined,
            pingingConnections: {
                '0': true,
                '1': true,
                '3': true
            },
            deletingConnections: {}
        });
    });

    it('FETCH_CONNECTIONS_FAIL', () => {
        const action = {
            type: FETCH_CONNECTIONS_FAIL,
            payload: { error: { msg: 'Error!' } }
        };

        const initialState = {
            uploading: false,
            connections: [{ connectionName: 'AWS_2' }],
            editable: undefined
        };

        expect(settingsConnectionsReducer(initialState, action)).toEqual({
            uploading: false,
            loading: false,
            connections: [{ connectionName: 'AWS_2' }],
            editable: undefined,
            error: { msg: 'Error!' }
        });
    });

    it('CONNECTIONS_FAIL', () => {
        [UPDATE_CONNECTION_FAIL, CREATE_CONNECTION_FAIL].forEach(type => {
            const initialState = {
                uploading: false,
                connections: [{ connectionName: 'AWS_2' }],
                editable: undefined
            };

            expect(
                settingsConnectionsReducer(initialState, {
                    type,
                    payload: { error: { msg: 'Error!' } }
                })
            ).toEqual({
                uploading: false,
                connections: [{ connectionName: 'AWS_2' }],
                editable: undefined,
                error: { msg: 'Error!' }
            });
        });
    });

    it('DELETE_CONNECTION_FAIL', () => {
        const action = {
            type: DELETE_CONNECTION_FAIL,
            payload: { key: '0', error: 'Error' }
        };

        const initialState = {
            connections: [{ connectionName: 'AWS_2' }],
            editable: undefined
        };

        expect(settingsConnectionsReducer(initialState, action)).toEqual({
            connections: [{ connectionName: 'AWS_2' }],
            editable: undefined,
            error: 'Error',
            deletingConnections: {
                '0': false
            }
        });
    });

    it('PING_CONNECTIONS_FAIL', () => {
        const action = {
            type: PING_CONNECTION_FAIL,
            payload: { key: '0', error: 'Something went wrong!' }
        };

        const initialState = {
            connections: [{ connectionName: 'AWS_2' }],
            editable: undefined
        };

        expect(settingsConnectionsReducer(initialState, action)).toEqual({
            connections: [{ connectionName: 'AWS_2' }],
            editable: undefined,
            error: 'Something went wrong!',
            pingingConnections: {
                '0': false
            }
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
                connection: {
                    key: 'Id1',
                    value: { connectionName: 'AWS_updated', ssl: false }
                }
            }
        };

        const initialState = {
            uploading: true,
            connections: [
                { key: 'Id1', value: { connectionName: 'AWS_1' } },
                { key: 'Id2', value: { connectionName: 'AWS_2' } }
            ],
            editable: undefined
        };

        expect(settingsConnectionsReducer(initialState, action)).toEqual({
            uploading: false,
            connections: [
                { key: 'Id1', value: { connectionName: 'AWS_updated', ssl: false } },
                { key: 'Id2', value: { connectionName: 'AWS_2' } }
            ],
            editable: undefined
        });
    });

    it('CREATE_CONNECTION_SUCCESS', () => {
        const action = {
            type: CREATE_CONNECTION_SUCCESS,
            payload: {
                key: 'Id3',
                value: { connectionName: 'AWS_3', ssl: false }
            }
        };

        const initialState = {
            uploading: true,
            connections: [
                { key: 'Id1', value: { connectionName: 'AWS_1' } },
                { key: 'Id2', value: { connectionName: 'AWS_2' } }
            ],
            editable: undefined
        };

        expect(settingsConnectionsReducer(initialState, action)).toEqual({
            uploading: false,
            connections: [
                { key: 'Id1', value: { connectionName: 'AWS_1' } },
                { key: 'Id2', value: { connectionName: 'AWS_2' } },
                { key: 'Id3', value: { connectionName: 'AWS_3', ssl: false } }
            ],
            editable: undefined
        });
    });

    it('DELETE_CONNECTION_SUCCESS', () => {
        const actions = [
            { type: DELETE_CONNECTION_START, payload: { key: '0' } },
            { type: DELETE_CONNECTION_START, payload: { key: '1' } },
            { type: DELETE_CONNECTION_START, payload: { key: '3' } },
            { type: DELETE_CONNECTION_SUCCESS, payload: { key: '1' } }
        ];

        const initialState = actions.reduce(
            (state, action) => settingsConnectionsReducer(state, action),
            undefined
        );

        expect(initialState).toEqual({
            loading: false,
            connections: [],
            editable: undefined,
            pingingConnections: {},
            deletingConnections: {
                '0': true,
                '1': false,
                '3': true
            }
        });
    });

    it('PING_CONNECTION_SUCCESS', () => {
        const actions = [
            { type: PING_CONNECTION_START, payload: { key: '0' } },
            { type: PING_CONNECTION_START, payload: { key: '1' } },
            { type: PING_CONNECTION_START, payload: { key: '3' } },
            { type: PING_CONNECTION_SUCCESS, payload: { key: '1' } }
        ];

        const initialState = actions.reduce(
            (state, action) => settingsConnectionsReducer(state, action),
            undefined
        );

        expect(initialState).toEqual({
            loading: false,
            connections: [],
            editable: undefined,
            pingingConnections: {
                '0': true,
                '1': false,
                '3': true
            },
            deletingConnections: {}
        });
    });

    it('should return default state', () => {
        expect(settingsConnectionsReducer({}, {})).toEqual({});
    });
});
