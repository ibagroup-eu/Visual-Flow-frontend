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
    FETCH_CONNECTIONS_START,
    FETCH_CONNECTIONS_SUCCESS,
    FETCH_CONNECTIONS_FAIL,
    UPDATE_CONNECTION_START,
    UPDATE_CONNECTION_SUCCESS,
    UPDATE_CONNECTION_FAIL,
    CREATE_CONNECTION_START,
    CREATE_CONNECTION_FAIL,
    CREATE_CONNECTION_SUCCESS,
    DELETE_CONNECTION_START,
    DELETE_CONNECTION_FAIL,
    DELETE_CONNECTION_SUCCESS,
    PING_CONNECTION_START,
    PING_CONNECTION_SUCCESS,
    PING_CONNECTION_FAIL
} from '../actions/types';

const initialState = {
    loading: false,
    connections: [],
    editable: undefined,
    pingingConnections: {},
    deletingConnections: {}
};
// eslint-disable-next-line complexity
const settingsConnectionsReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case FETCH_CONNECTIONS_START:
            return {
                ...state,
                loading: true
            };
        case UPDATE_CONNECTION_START:
        case CREATE_CONNECTION_START:
            return {
                ...state,
                uploading: true
            };
        case DELETE_CONNECTION_START:
            return {
                ...state,
                deletingConnections: {
                    ...state.deletingConnections,
                    [action.payload.key]: true
                }
            };
        case PING_CONNECTION_START:
            return {
                ...state,
                pingingConnections: {
                    ...state.pingingConnections,
                    [action.payload.key]: true
                }
            };
        case FETCH_CONNECTIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                connections: action.payload?.connections,
                editable: action.payload?.editable
            };
        case CREATE_CONNECTION_SUCCESS:
            return {
                ...state,
                uploading: false,
                connections: [...state.connections, action.payload]
            };
        case UPDATE_CONNECTION_SUCCESS:
            return {
                ...state,
                uploading: false,
                connections: state.connections.map(connection =>
                    connection.key === action.payload.connection.key
                        ? {
                              key: action.payload.connection.key,
                              value: action.payload.connection.value
                          }
                        : connection
                )
            };
        case DELETE_CONNECTION_SUCCESS:
            return {
                ...state,
                deletingConnections: {
                    ...state.deletingConnections,
                    [action.payload.key]: false
                },
                connections: state.connections.filter(
                    connection => connection.key !== action.payload.key
                )
            };
        case PING_CONNECTION_SUCCESS:
            return {
                ...state,
                pingingConnections: {
                    ...state.pingingConnections,
                    [action.payload.key]: false
                }
            };
        case FETCH_CONNECTIONS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        case CREATE_CONNECTION_FAIL:
        case UPDATE_CONNECTION_FAIL:
            return {
                ...state,
                uploading: false,
                error: action.payload.error
            };
        case DELETE_CONNECTION_FAIL:
            return {
                ...state,
                deletingConnections: {
                    ...state.deletingConnections,
                    [action.payload.key]: false
                },
                error: action.payload.error
            };
        case PING_CONNECTION_FAIL:
            return {
                ...state,
                pingingConnections: {
                    ...state.pingingConnections,
                    [action.payload.key]: false
                },
                error: action.payload.error
            };
        default:
            return state;
    }
};

export default settingsConnectionsReducer;
