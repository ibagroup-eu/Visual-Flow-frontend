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
    updateConnection,
    pingConnection
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
    UPDATE_CONNECTION_SUCCESS,
    PING_CONNECTION_START,
    PING_CONNECTION_FAIL,
    PING_CONNECTION_SUCCESS
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
                                connections: data.connections
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

    describe('fetchConnections for Kafka', () => {
        const dataKafka = {
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
                },
                {
                    key: '3',
                    value: {
                        storage: 'kafka',
                        connectionName: 'kafka_connection',
                        anonymousAccess: 'true',
                        subscribe: 'kafka_topic_name'
                    }
                }
            ]
        };

        beforeEach(() => {
            dispatch = jest.fn();
            jest.spyOn(api, 'getProjectConnections').mockResolvedValue({
                data: dataKafka
            });
        });

        it('FETCH_CONNECTIONS_SUCCESS kafka', () => {
            return fetchConnections('id')(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_CONNECTIONS_START }],
                    [
                        {
                            type: FETCH_CONNECTIONS_SUCCESS,
                            payload: {
                                ...dataKafka,
                                connections: dataKafka.connections
                            }
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

        it('UPDATE_CONNECTION_SUCCESS', () => {
            return updateConnection('projectName', {
                key: '1',
                value: { connectionName: '1' }
            })(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: UPDATE_CONNECTION_START }],
                    [
                        {
                            type: UPDATE_CONNECTION_SUCCESS,
                            payload: {
                                connection: {
                                    key: '1',
                                    value: { connectionName: '1' }
                                }
                            }
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

        it('UPDATE_CONNECTION_FAIL', () => {
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
            const connectionId = 'id';
            jest.spyOn(api, 'createProjectConnection').mockResolvedValue({
                connectionId
            });
        });

        it('CREATE_CONNECTION_SUCCESS', () => {
            return createConnection('projectName', {
                value: {
                    connectionName: 'connectionName'
                }
            })(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: CREATE_CONNECTION_START }],
                    [
                        {
                            type: CREATE_CONNECTION_SUCCESS,
                            payload: {
                                value: {
                                    connectionName: 'connectionName'
                                }
                            }
                        }
                    ]
                ]);

                expect(api.createProjectConnection).toHaveBeenCalledWith(
                    'projectName',
                    {
                        value: {
                            connectionName: 'connectionName'
                        }
                    }
                );
            });
        });

        it('CREATE_CONNECTION_FAIL', () => {
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

        it('DELETE_CONNECTION_START', () => {
            return deleteConnection(
                'projectName',
                'connectionId'
            )(dispatch).then(() => {
                expect(dispatch).toHaveBeenCalledWith({
                    type: DELETE_CONNECTION_START,
                    payload: { key: 'connectionId' }
                });
            });
        });

        it('DELETE_CONNECTION_SUCCESS', () => {
            return deleteConnection(
                'projectName',
                'connectionId'
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [
                        {
                            type: DELETE_CONNECTION_START,
                            payload: { key: 'connectionId' }
                        }
                    ],
                    [
                        {
                            type: DELETE_CONNECTION_SUCCESS,
                            payload: { key: 'connectionId' }
                        }
                    ]
                ]);
            });
        });

        it('DELETE_CONNECTION_FAIL', () => {
            jest.spyOn(api, 'deleteProjectConnection').mockRejectedValue({
                msg: 'Error'
            });

            return deleteConnection(
                'projectName',
                'connectionId'
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [
                        {
                            type: DELETE_CONNECTION_START,
                            payload: { key: 'connectionId' }
                        }
                    ],
                    [
                        {
                            type: DELETE_CONNECTION_FAIL,
                            payload: { key: 'connectionId', error: { msg: 'Error' } }
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

    describe('pingConnection', () => {
        beforeEach(() => {
            dispatch = jest.fn();
            jest.spyOn(api, 'pingProjectConnection').mockResolvedValue({ data });
        });

        it('PING_CONNECTIONS_START', () => {
            return pingConnection('projectName', {
                key: 'connectionName',
                value: { connectionName: 'connectionName' }
            })(dispatch).then(() => {
                expect(dispatch).toHaveBeenCalledWith({
                    type: PING_CONNECTION_START,
                    payload: { key: 'connectionName' }
                });
            });
        });

        it('PING_CONNECTIONS_SUCCESS', () => {
            return pingConnection('projectName', {
                key: 'connectionName',
                value: { connectionName: 'connectionName' }
            })(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [
                        {
                            type: PING_CONNECTION_START,
                            payload: { key: 'connectionName' }
                        }
                    ],
                    [
                        {
                            type: PING_CONNECTION_SUCCESS,
                            payload: { key: 'connectionName' }
                        }
                    ]
                ]);
            });
        });

        it('PING_CONNECTIONS_FAIL', () => {
            jest.spyOn(api, 'pingProjectConnection').mockRejectedValue({
                msg: 'Error'
            });

            return pingConnection('projectName', { key: 'connectionName' })(
                dispatch
            ).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [
                        {
                            type: PING_CONNECTION_START,
                            payload: { key: 'connectionName' }
                        }
                    ],
                    [
                        {
                            type: PING_CONNECTION_FAIL,
                            payload: {
                                key: 'connectionName',
                                error: { msg: 'Error' }
                            }
                        }
                    ]
                ]);
            });
        });
    });
});
