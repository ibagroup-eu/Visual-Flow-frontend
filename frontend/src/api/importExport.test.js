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

import api from './importExport';
import axiosInstance from './axiosInstance';

describe('jobs', () => {
    const projectId = 'some_id';
    const expected = { data: {} };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should import data by importResources', () => {
        const data = {
            jobs: [],
            pipelines: []
        };
        jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return api.importResources(projectId, data).then(result => {
            expect(result).toEqual(expected);
        });
    });

    it('should export data by exportResources', () => {
        const data = {
            jobs: [],
            pipelines: []
        };
        jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return api.exportResources(projectId, data).then(result => {
            expect(result).toEqual(expected);
        });
    });

    it('should check access by checkAccessToImport', () => {
        jest.spyOn(axiosInstance, 'get').mockResolvedValue(expected);
        return api.checkAccessToImport(projectId).then(result => {
            expect(result).toEqual(expected);
        });
    });
});
