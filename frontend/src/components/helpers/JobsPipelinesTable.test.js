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

import React from 'react';
import {
    findByProp,
    jobDesignerHendler,
    joinDataNames,
    removeHandler,
    runWithValidation
} from './JobsPipelinesTable';
import api from '../../api/pipelines';
import showNotification from '../notification/showNotification';

jest.mock('../notification/showNotification', () => jest.fn());

describe('JobsPipelinesTable', () => {
    it('should not call "setCurrentPage" for removeHandler', () => {
        const [remove, setCurrentPage] = [
            jest.fn(() => Promise.resolve()),
            jest.fn()
        ];

        removeHandler(
            'projectId',
            [],
            0,
            { rowsPerPage: 10, currentPage: 0 },
            remove,
            setCurrentPage
        );

        expect(remove).toHaveBeenCalled();
        expect(setCurrentPage).not.toHaveBeenCalled();
    });

    it('should find by prop', () => {
        expect(findByProp([], 'value', 'prop')).toBeUndefined();
        expect(
            findByProp([{ prop: 'value', name: 'name' }], 'value', 'prop')
        ).toEqual({ prop: 'value', name: 'name' });
    });

    it('runWithValidation', async () => {
        const data = {
            definition: {
                graph: [
                    {
                        value: {
                            operation: undefined
                        }
                    }
                ]
            }
        };
        jest.spyOn(api, 'getPipelineById').mockResolvedValue({ data });
        const run = jest.fn();

        await runWithValidation(
            'projectId',
            'itemId',
            {},
            run,
            'message',
            jest.fn()
        );

        expect(run).toHaveBeenCalled();
    });

    it('runWithValidation - showNotification is called (stage value is JOB)', async () => {
        const data = {
            data: {
                definition: {
                    graph: [
                        {
                            value: {
                                operation: 'JOB'
                            }
                        }
                    ]
                }
            }
        };
        api.getPipelineById = jest.fn().mockResolvedValue(data);

        const run = jest.fn();
        const warning = jest.fn();

        await runWithValidation('projectId', 'itemId', {}, run, 'message', warning);

        expect(showNotification).toHaveBeenCalled();
    });

    it('runWithValidation - showNotification is called (stage value is NOTIFICATION)', async () => {
        const data = {
            data: {
                definition: {
                    graph: [
                        {
                            value: {
                                operation: 'NOTIFICATION'
                            }
                        }
                    ]
                }
            }
        };
        api.getPipelineById = jest.fn().mockResolvedValue(data);

        const run = jest.fn();
        const warning = jest.fn();

        await runWithValidation('projectId', 'itemId', {}, run, 'message', warning);

        expect(showNotification).toHaveBeenCalled();
    });

    it('runWithValidation - showNotification is called (stage value is CONTAINER)', async () => {
        const data = {
            data: {
                definition: {
                    graph: [
                        {
                            value: {
                                operation: 'CONTAINER'
                            }
                        }
                    ]
                }
            }
        };
        api.getPipelineById = jest.fn().mockResolvedValue(data);

        const run = jest.fn();
        const warning = jest.fn();

        await runWithValidation('projectId', 'itemId', {}, run, 'message', warning);

        expect(showNotification).toHaveBeenCalled();
    });

    it('runWithValidation - warning is called', async () => {
        const data = {
            data: {
                definition: {
                    graph: [
                        {
                            value: {
                                operation: 'JOB',
                                jobId: '12345'
                            }
                        }
                    ]
                }
            }
        };
        api.getPipelineById = jest.fn().mockResolvedValue(data);

        const run = jest.fn();
        const warning = jest.fn();

        await runWithValidation(
            'projectId',
            'itemId',
            { dataJobs: [{ id: '12345', runnable: false }], dataParams: {} },
            run,
            'message',
            warning
        );

        expect(warning).toHaveBeenCalled();
    });

    it('jobDesignerHendler', () => {
        const history = { push: jest.fn() };
        jobDesignerHendler(
            'projectId',
            { pipelineInstances: [], id: 'id' },
            {},
            history
        );

        expect(history.push).toHaveBeenCalledWith(`/jobs/projectId/id`);
    });

    it('joinDataNames', () => {
        expect(
            joinDataNames(
                ['id_1', 'id_2'],
                [
                    { id: 'id_1', name: 'name_1' },
                    { id: 'id_2', name: 'name_2' }
                ]
            )
        ).toEqual('name_1, name_2');
    });
});
