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
    EXPRESS: {
        PORT: 8000,
        HOST: '0.0.0.0',
        IS_LOCAL_ENV: true
    },
    APP: {
        BUILD_PATH: 'buildPath',
        PROXY: {
            API_SERVER: {
                HOST: 'host'
            },
            MOCK_SERVER: {}
        },
        BASE_URL: '/vf/ui/',
        PLATFORM: 'DATABRICS'
    },
    AUTH: {
        STRATEGY: 'GITHUB',
        PROVIDER: {
            GITHUB: {
                APP_ID: 'APP_ID',
                APP_SECRET: 'APP_SECRET',
                CALLBACK_URL: 'CALLBACK_URL',
                BASE_URL: 'BASE_URL'
            }
        }
    }
}));

const http = require('http');
const { app, listener } = require('../app');

describe('server', () => {
    it('server initiated with no errors', done => {
        const server = http.createServer(app);
        server.listen({ port: 8080 }, jest.fn());

        expect(server).toBeDefined();

        server.close(done);
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
