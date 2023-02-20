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

import axiosInstance from './axiosInstance';
import api from './appSettings';

jest.mock('./axiosInstance', () => jest.fn());

describe('settings', () => {
    describe('version', () => {
        it('should get version', async () => {
            const response = { version: '1.0.0' };

            axiosInstance.mockImplementation(() => response);

            expect(await api.getVersion()).toEqual(response);
            expect(axiosInstance).toHaveBeenCalledWith({
                url: '/settings/version',
                baseURL: undefined
            });
        });
    });
});