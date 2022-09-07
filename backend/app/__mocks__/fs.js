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

const fs = jest.genMockFromModule('fs');

let mockFunctions = Object.create(null);

// eslint-disable-next-line no-underscore-dangle
function __setMockFunctions(newMockFunctions) {
    mockFunctions = Object.create(null);
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const func in newMockFunctions) {
        mockFunctions[func] = newMockFunctions[func];
    }
}

function readFile() {
    // eslint-disable-next-line prefer-rest-params
    return mockFunctions.readFile.apply(null, arguments);
}

function writeFile() {
    // eslint-disable-next-line prefer-rest-params
    return mockFunctions.writeFile.apply(null, arguments);
}

function readFileSync() {
    // eslint-disable-next-line prefer-rest-params
    return mockFunctions.readFileSync.apply(null, arguments);
}

function writeFileSync() {
    // eslint-disable-next-line prefer-rest-params
    return mockFunctions.writeFileSync.apply(null, arguments);
}

function existsSync() {
    // eslint-disable-next-line prefer-rest-params
    return mockFunctions.existsSync.apply(null, arguments);
}

function mkdirSync() {
    // eslint-disable-next-line prefer-rest-params
    return mockFunctions.mkdirSync.apply(null, arguments);
}

// eslint-disable-next-line no-underscore-dangle
fs.__setMockFunctions = __setMockFunctions;
fs.readFile = readFile;
fs.writeFile = writeFile;
fs.readFileSync = readFileSync;
fs.writeFileSync = writeFileSync;
fs.existsSync = existsSync;
fs.mkdirSync = mkdirSync;

module.exports = fs;
