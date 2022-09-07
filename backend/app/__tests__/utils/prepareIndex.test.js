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

jest.mock('fs');

describe('utils/prepareIndex.js', () => {
    const readFile = jest.fn((file, coding, callback) => {
        if (typeof callback === 'function') {
            if (file.includes('error')) {
                callback('error', 'data: %BASE_URL%');
            } else {
                callback(null, 'data: %BASE_URL%');
            }
        }
    });

    const writeFile = jest.fn((file, content, coding, callback) => {
        if (typeof callback === 'function') {
            if (content.includes('error')) {
                callback('error');
            } else {
                callback();
            }
        }
    });

    beforeEach(() => {
        // eslint-disable-next-line global-require,no-underscore-dangle
        require('fs').__setMockFunctions({
            readFile,
            writeFile
        });
    });

    afterEach(() => {
        readFile.mockClear();
        writeFile.mockClear();
    });

    it('successful run', () => {
        // eslint-disable-next-line global-require
        const prepareIndex = require('../../utils/prepareIndex');
        prepareIndex({
            app: {
                buildPath: '',
                baseUrl: '/path'
            }
        });

        expect(readFile).toHaveBeenCalledWith(
            expect.stringContaining('/template.html'),
            'utf8',
            expect.any(Function)
        );
        expect(writeFile).toHaveBeenCalledWith(
            expect.stringContaining('/index.html'),
            'data: /path',
            'utf8',
            expect.any(Function)
        );
    });

    it('errors appear in readFile', () => {
        // eslint-disable-next-line global-require
        const prepareIndex = require('../../utils/prepareIndex');
        prepareIndex({
            app: {
                buildPath: 'error',
                baseUrl: '/path'
            }
        });

        expect(readFile).toHaveBeenCalledWith(
            expect.stringContaining('/template.html'),
            'utf8',
            expect.any(Function)
        );
        expect(writeFile).not.toHaveBeenCalled();
    });

    it('errors appear in writeFile', () => {
        // eslint-disable-next-line global-require
        const prepareIndex = require('../../utils/prepareIndex');
        prepareIndex({
            app: {
                buildPath: '',
                baseUrl: '/error'
            }
        });

        expect(readFile).toHaveBeenCalledWith(
            expect.stringContaining('/template.html'),
            'utf8',
            expect.any(Function)
        );
        expect(writeFile).toHaveBeenCalledWith(
            expect.stringContaining('/index.html'),
            'data: /error',
            'utf8',
            expect.any(Function)
        );
    });
});
