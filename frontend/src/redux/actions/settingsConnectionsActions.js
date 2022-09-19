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

import { omit } from 'lodash';
import {
    FETCH_CONNECTIONS_START,
    FETCH_CONNECTIONS_SUCCESS,
    FETCH_CONNECTIONS_FAIL,
    UPDATE_CONNECTION_START,
    UPDATE_CONNECTION_SUCCESS,
    UPDATE_CONNECTION_FAIL,
    CREATE_CONNECTION_START,
    CREATE_CONNECTION_SUCCESS,
    CREATE_CONNECTION_FAIL,
    DELETE_CONNECTION_START,
    DELETE_CONNECTION_SUCCESS,
    DELETE_CONNECTION_FAIL
} from './types';
import api from '../../api/projects';

const toKeyValue = connection => ({
    key: connection.connectionName,
    value: omit(connection, ['id', 'storageLabel'])
});

export const fetchConnections = id => dispatch => {
    dispatch({
        type: FETCH_CONNECTIONS_START
    });

    return api.getProjectConnections(id).then(
        response =>
            dispatch({
                type: FETCH_CONNECTIONS_SUCCESS,
                payload: {
                    ...response.data,
                    connections:
                        response.data?.connections?.map(c => ({
                            ...c.value,
                            id: c.value.connectionName
                        })) || []
                }
            }),
        error =>
            dispatch({
                type: FETCH_CONNECTIONS_FAIL,
                payload: { error }
            })
    );
};

export const updateConnection = (projectName, connection) => dispatch => {
    dispatch({
        type: UPDATE_CONNECTION_START
    });

    return api
        .updateProjectConnection(projectName, connection.id, toKeyValue(connection))
        .then(
            () =>
                dispatch({
                    type: UPDATE_CONNECTION_SUCCESS,
                    payload: { connection }
                }),
            error =>
                dispatch({
                    type: UPDATE_CONNECTION_FAIL,
                    payload: { error }
                })
        );
};

export const createConnection = (projectName, connection) => dispatch => {
    dispatch({
        type: CREATE_CONNECTION_START
    });

    return api
        .createProjectConnection(
            projectName,
            connection.connectionName,
            toKeyValue(connection)
        )
        .then(
            () =>
                dispatch({
                    type: CREATE_CONNECTION_SUCCESS,
                    payload: {
                        connection: {
                            ...connection,
                            id: connection.connectionName
                        }
                    }
                }),

            error =>
                dispatch({
                    type: CREATE_CONNECTION_FAIL,
                    payload: { error }
                })
        );
};

export const deleteConnection = (projectName, connectionId) => dispatch => {
    dispatch({
        type: DELETE_CONNECTION_START
    });

    return api.deleteProjectConnection(projectName, connectionId).then(
        () =>
            dispatch({
                type: DELETE_CONNECTION_SUCCESS,
                payload: { connectionId }
            }),
        error =>
            dispatch({
                type: DELETE_CONNECTION_FAIL,
                payload: { error }
            })
    );
};
