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
    DELETE_CONNECTION_SUCCESS
} from '../actions/types';

const initialState = {
    loading: false,
    connections: [],
    editable: undefined
};

const settingsConnectionsReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case FETCH_CONNECTIONS_START:
        case UPDATE_CONNECTION_START:
        case CREATE_CONNECTION_START:
        case DELETE_CONNECTION_START:
            return {
                ...state,
                loading: true
            };
        case FETCH_CONNECTIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                connections: action.payload?.connections,
                editable: action.payload?.editable
            };
        case FETCH_CONNECTIONS_FAIL:
        case UPDATE_CONNECTION_FAIL:
        case CREATE_CONNECTION_FAIL:
        case DELETE_CONNECTION_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        case UPDATE_CONNECTION_SUCCESS:
            return {
                ...state,
                loading: false,
                connections: state.connections.map(connection =>
                    connection.id === action.payload.connection.id
                        ? {
                              ...action.payload.connection,
                              id: action.payload.connection.connectionName
                          }
                        : connection
                )
            };
        case CREATE_CONNECTION_SUCCESS:
            return {
                ...state,
                loading: false,
                connections: [...state.connections, action.payload.connection]
            };
        case DELETE_CONNECTION_SUCCESS:
            return {
                ...state,
                loading: false,
                connections: state.connections.filter(
                    connection => connection.id !== action.payload.connectionId
                )
            };
        default:
            return state;
    }
};

export default settingsConnectionsReducer;
