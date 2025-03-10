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

import { isNotValidFileContent, isNotValidJobPipeline } from './validateImportFile';

describe('validateImportFile', () => {
    describe('isNotValidFileContent', () => {
        it('should return true for json without jobs', () => {
            const data = { pipelines: [] };
            expect(isNotValidFileContent(data)).toBe(true);
        });

        it('should return false for empty jobs and pipelines', () => {
            const data = {
                pipelines: [],
                jobs: []
            };
            expect(isNotValidFileContent(data)).toBe(false);
        });

        it('should return false for not empty jobs and pipelines', () => {
            const data = {
                pipelines: [
                    {
                        definition: {
                            graph: [
                                {
                                    id: 1,
                                    value: {
                                        jobId: 'job1',
                                        jobName: 'Andrew',
                                        name: 'data',
                                        operation: 'JOB'
                                    }
                                }
                            ]
                        }
                    }
                ],
                jobs: [
                    {
                        definition: {
                            graph: [
                                {
                                    id: 1,
                                    value: {
                                        host: '1',
                                        method: 'GET',
                                        name: 'data',
                                        operation: 'READ',
                                        storage: 'request'
                                    }
                                }
                            ]
                        }
                    }
                ]
            };
            expect(isNotValidFileContent(data)).toBe(false);
        });
    });

    describe('isNotValidJobPipeline', () => {
        it('should return false for correct file', () => {
            const fileContent = {
                pipelines: [
                    {
                        definition: {
                            graph: [
                                {
                                    id: 1,
                                    value: {
                                        jobId: 'job1',
                                        jobName: 'Andrew',
                                        name: 'data',
                                        operation: 'JOB'
                                    }
                                }
                            ]
                        }
                    }
                ],
                jobs: [
                    {
                        definition: {
                            graph: [
                                {
                                    id: 1,
                                    value: {
                                        host: '1',
                                        method: 'GET',
                                        name: 'data',
                                        operation: 'READ',
                                        storage: 'request'
                                    }
                                }
                            ]
                        }
                    }
                ]
            };
            const jobsList = fileContent.jobs;
            const pipelinesList = fileContent.pipelines;
            expect(isNotValidJobPipeline(pipelinesList, jobsList)).toBe(false);
        });

        it('should return true if there is no operation JOB', () => {
            const fileContent = {
                pipelines: [
                    {
                        definition: {
                            graph: [
                                {
                                    id: 1,
                                    value: {
                                        jobId: 'job1',
                                        jobName: 'Andrew',
                                        name: 'data'
                                    }
                                }
                            ]
                        }
                    }
                ],
                jobs: [
                    {
                        definition: {
                            graph: [
                                {
                                    id: 1,
                                    value: {
                                        host: '1',
                                        method: 'GET',
                                        name: 'data',
                                        operation: 'READ',
                                        storage: 'request'
                                    }
                                }
                            ]
                        }
                    }
                ]
            };
            const jobsList = fileContent.jobs;
            const pipelinesList = fileContent.pipelines;

            expect(isNotValidJobPipeline(pipelinesList, jobsList)).toBe(true);
        });
    });
});
