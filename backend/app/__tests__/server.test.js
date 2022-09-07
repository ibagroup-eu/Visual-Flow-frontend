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

jest.doMock('../config', () => ({
    express: {
        port: 8000,
        host: '0.0.0.0'
    },
    app: {
        buildPath: 'buildPath',
        proxy: {
            apiServer: {
                host: 'host'
            },
            mockServer: {}
        },
        baseUrl: '/vf/ui/'
    }
}));

const { server, listener } = require('../server');

describe('server.js', () => {
    it('server initiated with no errors', () => {
        expect(server).toBeDefined();
    });

    it('listener should exit if error', () => {
        const mockExit = jest
            .spyOn(process, 'exit')
            .mockImplementation(() => {});
        listener('error');
        expect(mockExit).toHaveBeenCalledWith(10);
    });

    it('listener should not exit if no error', () => {
        const mockExit = jest
            .spyOn(process, 'exit')
            .mockImplementation(() => {});
        listener();
        expect(mockExit).not.toHaveBeenCalledWith();
    });
});
