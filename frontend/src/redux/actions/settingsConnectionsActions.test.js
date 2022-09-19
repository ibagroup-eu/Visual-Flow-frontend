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

import api from '../../api/projects';
import {
    createConnection,
    deleteConnection,
    fetchConnections,
    updateConnection
} from './settingsConnectionsActions';
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
} from './types';

describe('settingsConnectionsActions', () => {
    let dispatch;

    const data = {
        editable: true,
        connections: [
            {
                key: '1',
                value: {
                    storage: 's3',
                    connectionName: '1',
                    anonymousAccess: 'false'
                }
            },
            {
                key: '2',
                value: {
                    storage: 's3',
                    connectionName: '2',
                    anonymousAccess: 'true'
                }
            }
        ]
    };

    describe('fetchConnections', () => {
        beforeEach(() => {
            dispatch = jest.fn();
            jest.spyOn(api, 'getProjectConnections').mockResolvedValue({ data });
        });

        it('FETCH_CONNECTIONS_START', () => {
            return fetchConnections('id')(dispatch).then(() => {
                expect(dispatch).toHaveBeenCalledWith({
                    type: FETCH_CONNECTIONS_START
                });
            });
        });

        it('FETCH_CONNECTIONS_SUCCESS', () => {
            return fetchConnections('id')(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_CONNECTIONS_START }],
                    [
                        {
                            type: FETCH_CONNECTIONS_SUCCESS,
                            payload: {
                                ...data,
                                connections: data.connections.map(c => ({
                                    ...c.value,
                                    id: c.value.connectionName
                                }))
                            }
                        }
                    ]
                ]);

                expect(api.getProjectConnections).toHaveBeenCalledWith('id');
            });
        });

        it('FETCH_CONNECTIONS_FAIL', () => {
            jest.spyOn(api, 'getProjectConnections').mockRejectedValue({
                msg: 'Error'
            });

            return fetchConnections('id')(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_CONNECTIONS_START }],
                    [
                        {
                            type: FETCH_CONNECTIONS_FAIL,
                            payload: { error: { msg: 'Error' } }
                        }
                    ]
                ]);
            });
        });
    });

    describe('updateConnection', () => {
        beforeEach(() => {
            dispatch = jest.fn();
            jest.spyOn(api, 'updateProjectConnection').mockResolvedValue({});
        });

        it('FETCH_CONNECTIONS_SUCCESS', () => {
            return updateConnection('projectName', { id: '1', connectionName: '1' })(
                dispatch
            ).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: UPDATE_CONNECTION_START }],
                    [
                        {
                            type: UPDATE_CONNECTION_SUCCESS,
                            payload: { connection: { id: '1', connectionName: '1' } }
                        }
                    ]
                ]);

                expect(api.updateProjectConnection).toHaveBeenCalledWith(
                    'projectName',
                    '1',
                    {
                        key: '1',
                        value: { connectionName: '1' }
                    }
                );
            });
        });

        it('FETCH_CONNECTIONS_FAIL', () => {
            jest.spyOn(api, 'updateProjectConnection').mockRejectedValue({
                msg: 'Error'
            });

            return updateConnection(
                'projectName',
                {}
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: UPDATE_CONNECTION_START }],
                    [
                        {
                            type: UPDATE_CONNECTION_FAIL,
                            payload: { error: { msg: 'Error' } }
                        }
                    ]
                ]);
            });
        });
    });

    describe('createConnection', () => {
        beforeEach(() => {
            dispatch = jest.fn();
            jest.spyOn(api, 'createProjectConnection').mockResolvedValue({});
        });

        it('FETCH_CONNECTIONS_SUCCESS', () => {
            return createConnection('projectName', {
                connectionName: 'connectionName'
            })(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: CREATE_CONNECTION_START }],
                    [
                        {
                            type: CREATE_CONNECTION_SUCCESS,
                            payload: {
                                connection: {
                                    id: 'connectionName',
                                    connectionName: 'connectionName'
                                }
                            }
                        }
                    ]
                ]);

                expect(api.createProjectConnection).toHaveBeenCalledWith(
                    'projectName',
                    'connectionName',
                    {
                        key: 'connectionName',
                        value: {
                            connectionName: 'connectionName'
                        }
                    }
                );
            });
        });

        it('FETCH_CONNECTIONS_FAIL', () => {
            jest.spyOn(api, 'createProjectConnection').mockRejectedValue({
                msg: 'Error'
            });

            return createConnection(
                'projectName',
                {}
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: CREATE_CONNECTION_START }],
                    [
                        {
                            type: CREATE_CONNECTION_FAIL,
                            payload: { error: { msg: 'Error' } }
                        }
                    ]
                ]);
            });
        });
    });

    describe('deleteConnection', () => {
        beforeEach(() => {
            dispatch = jest.fn();
            jest.spyOn(api, 'deleteProjectConnection').mockResolvedValue({});
        });

        it('FETCH_CONNECTIONS_SUCCESS', () => {
            return deleteConnection(
                'projectName',
                'connectionId'
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: DELETE_CONNECTION_START }],
                    [
                        {
                            type: DELETE_CONNECTION_SUCCESS,
                            payload: { connectionId: 'connectionId' }
                        }
                    ]
                ]);
            });
        });

        it('FETCH_CONNECTIONS_FAIL', () => {
            jest.spyOn(api, 'deleteProjectConnection').mockRejectedValue({
                msg: 'Error'
            });

            return deleteConnection(
                'projectName',
                'connectionId'
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: DELETE_CONNECTION_START }],
                    [
                        {
                            type: DELETE_CONNECTION_FAIL,
                            payload: { error: { msg: 'Error' } }
                        }
                    ]
                ]);

                expect(api.deleteProjectConnection).toHaveBeenCalledWith(
                    'projectName',
                    'connectionId'
                );
            });
        });
    });
});
