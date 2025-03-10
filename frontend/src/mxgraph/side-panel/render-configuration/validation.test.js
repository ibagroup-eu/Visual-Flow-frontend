/*
 * Copyright (c) 2022 IBA Group, a.s. All rights reserved.
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

import {
    checkCassandraRequiredFields,
    checkClickHouseRequiredFields,
    checkCosRequiredFields,
    checkDatatimeFields,
    checkElasticsearchRequiredFields,
    checkGroupByFields,
    checkMongoRequiredFields,
    checkPivotFields,
    checkReadWriteFields,
    checkRemoveDuplicateFields,
    checkSortFields,
    checkTransformerFields,
    checkWithColumnFields,
    isAnyEmpty,
    windowFunctionRequiredFields,
    checkStringFunctionsFields,
    checkHandleNullFields,
    checkDatabricksRequiredFields,
    checkAzureBlobRequiredFields,
    checkGoogleCloudRequiredFields,
    checkDatabricksJDBCRequiredFields,
    checkDb2RequiredFields,
    checkAWSRequiredFields,
    checkKafkaReqiredFields,
    checkRedisRequiredFields,
    checkRedshiftRequiredFields,
    checkAiValidation
} from './validation';
import {
    ADD_CONSTANT,
    CHANGE_TYPE,
    DERIVE_COLUMN,
    LAG,
    MIN,
    NTILE,
    PIVOT,
    RANK,
    DATETIME,
    READ,
    RENAME_COLUMN,
    USE_CONDITIONS,
    WRITE
} from '../../constants';

describe('validation', () => {
    describe('checkReadWriteFields', () => {
        const name = 'name';
        it.each([
            { source: {}, expected: true },
            { source: { name }, expected: true },
            {
                source: { name, storage: 's3', anonymousAccess: true },
                expected: true
            },
            { source: { name, storage: 's3' }, expected: true },
            { source: { name, storage: 'stdout' }, expected: true },
            { source: { name, storage: 'stdout', quantity: 0.5 }, expected: true },
            {
                source: { name, storage: 'stdout', quantity: 2147483632 },
                expected: true
            },
            { source: { name, storage: 'db2' }, expected: true },
            {
                source: { name, storage: 'db2', writeMode: 'Overwrite' },
                expected: true
            },
            {
                source: {
                    name,
                    storage: 'db2',
                    writeMode: 'Overwrite',
                    truncateMode: true
                },
                expected: true
            },
            {
                source: {
                    name,
                    storage: 'cluster',
                    operation: READ
                },
                expected: true
            },
            {
                source: {
                    name,
                    storage: 'cluster',
                    operation: WRITE
                },
                expected: true
            },
            {
                source: { name, storage: 'dataframe' },
                expected: true
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkReadWriteFields(source)).toBe(expected);
            }
        );
    });

    describe('checkTransformerFields', () => {
        const name = 'name';
        const statement = 'statement';
        const mode = 'Full_SQL';
        it.each([
            { source: {}, expected: true },
            { source: { name }, expected: true },
            { source: { name, statement }, expected: true },
            { source: { name, statement, mode }, expected: true },
            {
                source: { name, statement, mode, tableName: 'tableName' },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkTransformerFields(source)).toBe(expected);
            }
        );
    });

    describe('checkSortFields', () => {
        const name = 'name';
        const sortType = 'sortType';
        it.each([
            { source: {}, expected: true },
            { source: { name }, expected: true },
            { source: { name, sortType }, expected: true },
            { source: { name, sortType, orderColumns: 'a,b:' }, expected: true },
            { source: { name, sortType, orderColumns: 'a,:b' }, expected: true },
            { source: { name, sortType, orderColumns: 'a:' }, expected: false }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkSortFields(source)).toBe(expected);
            }
        );
    });

    describe('checkGroupByFields', () => {
        const name = 'name';
        const groupingColumns = 'groupingColumns';
        it.each([
            { source: {}, expected: true },
            { source: { name }, expected: true },
            { source: { name, groupingColumns }, expected: true },
            {
                source: {
                    name,
                    groupingColumns,
                    groupingCriteria: 'groupingCriteria'
                },
                expected: true
            },
            {
                source: { name, groupingColumns, groupingCriteria: 'a,b:c' },
                expected: true
            },
            {
                source: { name, groupingColumns, groupingCriteria: 'a:b' },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkGroupByFields(source)).toBe(expected);
            }
        );
    });

    describe('checkRemoveDuplicateFields', () => {
        const name = 'name';
        const keyColumns = 'keyColumns';
        it.each([
            { source: {}, expected: true },
            { source: { name }, expected: true },
            { source: { name, keyColumns }, expected: true },
            { source: { name, keyColumns, orderColumns: 'a,b,c' }, expected: true },
            {
                source: { name, keyColumns, orderColumns: 'a:b,c:d' },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkRemoveDuplicateFields(source)).toBe(expected);
            }
        );
    });

    it('isAnyEmpty should check empty values', () => {
        expect(isAnyEmpty('name', 'type')({ name: '', type: 'test' })).toBeTruthy();
    });

    // checkDb2RequiredFields
    describe('checkDb2RequiredFields', () => {
        it.each([
            {
                source: {
                    jdbcUrl: 'jdbcUrl',
                    user: 'user',
                    password: 'pw'
                },
                expected: false
            },
            {
                source: {
                    jdbcUrl: 'jdbcUrl',
                    user: 'user',
                    password: 'pw',
                    operation: READ,
                    incrementalLoad: 'true',
                    incrementalOffsetKey: 'incrementalOffsetKey',
                    readingInParallel: 'true'
                },
                expected: false
            },
            {
                source: {
                    jdbcUrl: 'jdbcUrl',
                    user: 'user',
                    password: 'pw',
                    operation: READ,
                    incrementalLoad: 'true'
                },
                expected: true
            },
            {
                source: {
                    operation: WRITE,
                    jdbcUrl: 'jdbcUrl',
                    user: 'user',
                    password: 'pw'
                },
                expected: true
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkDb2RequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkMongoRequiredFields ', () => {
        it.each([
            {
                source: {
                    host: 'host',
                    port: 'port',
                    user: 'user',
                    password: 'pw',
                    database: 'database',
                    collection: 'collection'
                },
                expected: false
            },
            {
                source: {
                    host: 'host',
                    port: 'port',
                    user: 'user',
                    password: 'pw',
                    database: 'database',
                    collection: 'collection',
                    operation: READ,
                    incrementalLoad: 'true'
                },
                expected: true
            },
            {
                source: {
                    host: 'host',
                    port: 'port',
                    user: 'user',
                    password: 'pw',
                    database: 'database',
                    operation: READ,
                    incrementalLoad: 'true',
                    incrementalOffsetKey: 'incrementalOffsetKey',
                    isConnectionPage: true
                },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkMongoRequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkRedisRequiredFields', () => {
        it.each([
            {
                source: {
                    host: 'host',
                    port: 'port',
                    password: 'password',
                    model: 'model'
                },
                expected: false
            },
            {
                source: {
                    isConnectionPage: true,
                    host: 'host',
                    port: 'port',
                    password: 'password',
                    operation: READ,
                    readMode: 'readMode'
                },
                expected: false
            },
            {
                source: {
                    isConnectionPage: true,
                    host: 'host',
                    port: 'port',
                    password: 'password',
                    operation: READ,
                    readMode: 'pattern'
                },
                expected: true
            },
            {
                source: {
                    isConnectionPage: true,
                    host: 'host',
                    port: 'port',
                    password: 'password',
                    operation: READ,
                    readMode: 'pattern',
                    keysPattern: 'keysPattern'
                },
                expected: false
            },
            {
                source: {
                    isConnectionPage: true,
                    host: 'host',
                    port: 'port',
                    password: 'password',
                    operation: READ,
                    readMode: 'key',
                    table: 'table'
                },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkRedisRequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkKafkaReqiredFields', () => {
        it.each([
            {
                source: {
                    bootstrapServers: 'bootstrapServers',
                    operation: READ,
                    subscribe: 'subscribe',
                    incrementalLoad: 'false'
                },
                expected: false
            },
            {
                source: {
                    bootstrapServers: 'bootstrapServers',
                    operation: READ,
                    subscribe: 'subscribe',
                    incrementalLoad: 'true',
                    incrementalOffsetKey: 'incrementalOffsetKey'
                },
                expected: false
            },
            {
                source: {
                    bootstrapServers: 'bootstrapServers',
                    isConnectionPage: true,
                    subscribe: 'subscribe'
                },
                expected: false
            },
            {
                source: {
                    bootstrapServers: 'bootstrapServers',
                    topic: 'topic'
                },
                expected: false
            },
            {
                source: {
                    operation: READ,
                    incrementalLoad: 'true'
                },
                expected: true
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkKafkaReqiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkRedshiftRequiredFields', () => {
        it.each([
            {
                source: {
                    host: 'host',
                    port: 'port',
                    user: 'user',
                    password: 'password',
                    accessKey: 'accessKey',
                    secretKey: 'secretKey',
                    database: 'database',
                    bucket: 'bucket'
                },
                expected: false
            },
            {
                source: {
                    isConnectionPage: true,
                    host: 'host',
                    port: 'port',
                    user: 'user',
                    password: 'password',
                    accessKey: 'accessKey',
                    secretKey: 'secretKey',
                    database: 'database'
                },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkRedshiftRequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkAWSRequiredFields', () => {
        it.each([
            {
                source: {
                    isConnectionPage: true,
                    endpoint: 'endpoint',
                    anonymousAccess: 'anonymousAccess',
                    format: 'binaryFile',
                    binaryFormat: 'binaryFormat',
                    outputContentColumn: 'outputContentColumn',
                    outputPathColumn: 'outputPathColumn'
                },
                expected: false
            },
            {
                source: {
                    operation: READ,
                    incrementalLoad: 'true',
                    isConnectionPage: false,
                    endpoint: 'endpoint',
                    anonymousAccess: 'false',
                    format: 'binaryFile'
                },
                expected: true
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkAWSRequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkAiValidation', () => {
        it.each([
            {
                source: {
                    task: 'parseText',
                    sourceColumn: 'sourceColumn',
                    name: 'name',
                    llm: 'llm',
                    endpoint: 'endpoint',
                    model: 'model',
                    apiKey: 'apiKey'
                },
                expected: false
            },
            {
                source: {
                    task: 'parseText',
                    sourceColumn: 'sourceColumn'
                },
                expected: true
            },
            {
                source: {
                    task: 'generateTask',
                    sourceColumn: 'sourceColumn',
                    name: 'name',
                    llm: 'llm',
                    endpoint: 'endpoint',
                    model: 'model',
                    apiKey: 'apiKey',
                    numberOfRecords: 1,
                    outputColumn: 'outputColumn'
                },
                expected: false
            },
            {
                source: {
                    task: 'transcribe',
                    sourceColumn: 'sourceColumn',
                    name: 'name',
                    llm: 'llm',
                    endpoint: 'endpoint',
                    model: 'model',
                    apiKey: 'apiKey',
                    outputColumn: 'outputColumn',
                    pathColumn: 'pathColumn'
                },
                expected: false
            },
            {
                source: {
                    task: 'generateData',
                    sourceColumn: 'sourceColumn',
                    name: 'name',
                    llm: 'llm',
                    endpoint: 'endpoint',
                    model: 'model',
                    apiKey: 'apiKey',
                    numberOfRecords: 1
                },
                expected: false
            },
            {
                source: {
                    task: 'generateData',
                    sourceColumn: 'sourceColumn',
                    name: 'name',
                    llm: 'llm',
                    endpoint: 'endpoint',
                    model: 'model',
                    apiKey: 'apiKey'
                },
                expected: true
            },
            {
                source: {
                    task: 'task',
                    name: 'name',
                    llm: 'llm',
                    endpoint: 'endpoint',
                    model: 'model',
                    apiKey: 'apiKey'
                },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkAiValidation(source)).toBe(expected);
            }
        );
    });

    describe('checkElasticsearchRequiredFields', () => {
        it.each([
            {
                source: {
                    nodes: 'nodes',
                    port: 'port',
                    user: 'user',
                    password: 'pw',
                    certData: 'cert',
                    isConnectionPage: true
                },
                expected: false
            },
            {
                source: {
                    nodes: '',
                    port: 'port',
                    user: 'user',
                    password: 'pw',
                    index: 'index',
                    certData: 'cert'
                },
                expected: true
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkElasticsearchRequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkCassandraRequiredFields', () => {
        it.each([
            {
                source: {
                    keyspace: 'key',
                    host: 'host',
                    port: 'port',
                    username: 'user',
                    password: 'pw',
                    isConnectionPage: true
                },
                expected: false
            },
            {
                source: {
                    keyspace: 'key',
                    host: 'host',
                    port: 'port',
                    username: 'user',
                    password: 'pw',
                    table: 'table'
                },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkCassandraRequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkCosRequiredFields', () => {
        it.each([
            {
                source: {
                    endpoint: 'endpoint',
                    authType: 'IAM',
                    iamApiKey: 'iamApiKey',
                    iamServiceId: 'iamServiceId',
                    isConnectionPage: true
                },
                expected: false
            },
            {
                source: {
                    endpoint: 'endpoint',
                    authType: 'IAM',
                    bucket: 'bucket',
                    path: 'path',
                    format: 'csv',
                    iamApiKey: 'iamApiKey',
                    iamServiceId: 'iamServiceId'
                },
                expected: false
            },
            {
                source: {
                    endpoint: 'endpoint',
                    authType: 'HMAC',
                    bucket: 'bucket',
                    path: 'path',
                    format: 'csv',
                    accessKey: 'accessKey',
                    secretKey: 'secretKey'
                },
                expected: false
            },
            {
                source: {
                    endpoint: 'endpoint',
                    authType: 'HMAC',
                    bucket: 'bucket',
                    path: 'path',
                    format: 'csv',
                    accessKey: 'accessKey',
                    secretKey: ''
                },
                expected: true
            },
            {
                source: {
                    endpoint: 'endpoint',
                    authType: 'IAM',
                    bucket: 'bucket',
                    path: 'path',
                    format: 'csv',
                    iamApiKey: 'iamApiKey',
                    iamServiceId: ''
                },
                expected: true
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkCosRequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkClickHouseRequiredFields', () => {
        const common = {
            host: 'host',
            port: 'port',
            user: 'user',
            password: 'password'
        };

        it.each([
            {
                source: {
                    operation: READ,
                    ...common,
                    customSql: 'false',
                    database: 'database',
                    schema: 'schema',
                    table: 'table'
                },
                expected: false
            },
            {
                source: { operation: READ, ...common, customSql: undefined },
                expected: true
            },
            {
                source: {
                    operation: READ,
                    ...common,
                    customSql: 'true',
                    database: 'database',
                    'option.dbtable': 'option.dbtable'
                },
                expected: false
            },
            {
                source: {
                    operation: READ,
                    ...common,
                    customSql: 'true'
                },
                expected: true
            },
            {
                source: {
                    operation: WRITE,
                    ...common,
                    schema: 'schema',
                    table: 'table'
                },
                expected: false
            },
            {
                source: {
                    operation: WRITE,
                    ...common
                },
                expected: true
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkClickHouseRequiredFields(source)).toEqual(expected);
            }
        );
    });

    describe('checkWithColumnFields ', () => {
        const name = 'name';
        it.each([
            { source: {}, expected: true },
            { source: { name }, expected: true },
            { source: { name, column: 'column' }, expected: true },
            { source: { name, operationType: RENAME_COLUMN }, expected: true },
            {
                source: { name, column: 'column', operationType: RENAME_COLUMN },
                expected: true
            },
            {
                source: {
                    name,
                    column: 'column',
                    operationType: RENAME_COLUMN,
                    'option.columnName': 'col2'
                },
                expected: false
            },
            {
                source: {
                    name,
                    column: 'column',
                    operationType: DERIVE_COLUMN,
                    'option.expression': 'a+b'
                },
                expected: false
            },
            {
                source: {
                    name,
                    column: 'column',
                    operationType: ADD_CONSTANT,
                    'option.constant': 'test'
                },
                expected: false
            },
            {
                source: {
                    name,
                    column: 'column',
                    operationType: CHANGE_TYPE,
                    'option.columnType': 'double'
                },
                expected: false
            },
            {
                source: {
                    name,
                    column: 'column',
                    operationType: CHANGE_TYPE,
                    'option.columnType': 'decimal(10,2)'
                },
                expected: false
            },
            {
                source: {
                    name,
                    column: 'column',
                    operationType: CHANGE_TYPE,
                    'option.columnType': ''
                },
                expected: true
            },
            {
                source: {
                    name,
                    column: 'column',
                    operationType: USE_CONDITIONS,
                    'option.conditions': 'test'
                },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkWithColumnFields(source)).toBe(expected);
            }
        );
    });

    describe('checkDatabricksRequiredFields', () => {
        const common = {
            catalog: 'ctlg',
            schema: 'schm'
        };
        it.each([
            {
                source: {
                    operation: READ,
                    ...common,
                    objectType: 'table',
                    table: '1'
                },
                expected: false
            },
            {
                source: {
                    operation: READ,
                    ...common,
                    objectType: 'volume',
                    volume: 'volume',
                    volumePath: 'volumePath',
                    format: 'format'
                },
                expected: false
            },
            {
                source: {
                    operation: READ,
                    ...common,
                    objectType: 'objectType'
                },
                expected: false
            },
            {
                source: {
                    operation: WRITE,
                    ...common,
                    writeMode: 'mode',
                    objectType: 'table',
                    table: '1'
                },
                expected: false
            },
            {
                source: {
                    jdbcUrl: 'url',
                    user: 'user',
                    password: 'pw',
                    isConnectionPage: 'true'
                },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkDatabricksRequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkAzureBlobRequiredFields', () => {
        it.each([
            {
                source: {
                    storageAccount: 'test acc',
                    authType: 'storageAccountKey',
                    storageAccountKey: 'test key',
                    isConnectionPage: true
                },
                expected: false
            },
            {
                source: {
                    storageAccount: 'test acc',
                    authType: 'storageAccountKey',
                    storageAccountKey: 'test key',
                    isConnectionPage: false
                },
                expected: true
            },
            {
                source: {
                    storageAccount: 'test acc',
                    authType: 'SASToken',
                    SASToken: 'test token',
                    isConnectionPage: true
                },
                expected: false
            },
            {
                source: {
                    storageAccount: 'test acc',
                    authType: 'SASToken',
                    SASToken: 'test token',
                    container: 'test container',
                    containerPath: 'test container path',
                    format: 'test format',
                    isConnectionPage: false
                },
                expected: false
            },
            {
                source: {
                    storageAccount: 'test acc',
                    authType: 'SASToken',
                    SASToken: 'test token',
                    container: 'test container',
                    containerPath: 'test container path',
                    format: 'binaryFile',
                    binaryFormat: 'binaryFormat',
                    outputContentColumn: 'outputContentColumn',
                    outputPathColumn: 'outputPathColumn',
                    isConnectionPage: false
                },
                expected: false
            },
            {
                source: {
                    storageAccount: 'test acc',
                    authType: '',
                    isConnectionPage: true
                },
                expected: true
            }
        ])(
            'should return $expected when call with $source',
            ({ source, expected }) => {
                expect(checkAzureBlobRequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkGoogleCloudRequiredFields', () => {
        it.each([
            {
                source: {
                    pathToKeyFile: '',
                    isConnectionPage: true
                },
                expected: true
            },
            {
                source: {
                    pathToKeyFile: 'test path',
                    isConnectionPage: true
                },
                expected: false
            },
            {
                source: {
                    pathToKeyFile: 'test path',
                    isConnectionPage: false
                },
                expected: true
            },
            {
                source: {
                    pathToKeyFile: 'test path',
                    bucket: 'test bucket',
                    path: 'test path',
                    format: 'test format',
                    isConnectionPage: false
                },
                expected: false
            },
            {
                source: {
                    pathToKeyFile: 'test path',
                    bucket: 'test bucket',
                    path: 'test path',
                    format: 'binaryFile',
                    isConnectionPage: false
                },
                expected: true
            },
            {
                source: {
                    pathToKeyFile: 'test path',
                    bucket: 'test bucket',
                    path: 'test path',
                    format: 'binaryFile',
                    binaryFormat: 'binaryFormat',
                    outputContentColumn: 'outputContentColumn',
                    outputPathColumn: 'outputPathColumn',
                    isConnectionPage: false
                },
                expected: false
            }
        ])(
            'should return $expected when call with $source',
            ({ source, expected }) => {
                expect(checkGoogleCloudRequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkDatabricksJDBCRequiredFields', () => {
        it.each([
            {
                source: {
                    jdbcUrl: 'url',
                    user: 'user',
                    password: 'pass',
                    isConnectionPage: true
                },
                expected: false
            },
            {
                source: {
                    jdbcUrl: '',
                    isConnectionPage: true
                },
                expected: true
            },
            {
                source: {
                    jdbcUrl: 'url',
                    user: 'user',
                    password: 'pass',
                    isConnectionPage: false
                },
                expected: true
            },
            {
                source: {
                    jdbcUrl: 'url',
                    user: 'user',
                    password: 'pass',
                    catalog: 'catalog',
                    isConnectionPage: false
                },
                expected: false
            },
            {
                source: {
                    jdbcUrl: 'url',
                    user: 'user',
                    password: 'pass',
                    catalog: 'catalog',
                    isConnectionPage: false
                },
                expected: false
            },
            {
                source: {
                    operation: WRITE,
                    jdbcUrl: 'url',
                    user: 'user',
                    password: 'pass',
                    catalog: 'catalog',
                    isConnectionPage: false
                },
                expected: true
            },
            {
                source: {
                    operation: WRITE,
                    jdbcUrl: 'url',
                    user: 'user',
                    password: 'pass',
                    catalog: 'catalog',
                    isConnectionPage: false,
                    schema: 'schema',
                    table: 'table',
                    writeMode: 'write mode',
                    readingInParallel: 'true',
                    numPartitions: '1',
                    batchsize: '1'
                },
                expected: false
            },
            {
                source: {
                    operation: WRITE,
                    jdbcUrl: 'urle',
                    user: 'user',
                    password: 'pass',
                    catalog: 'catalog',
                    isConnectionPage: false,
                    schema: 'schema',
                    table: 'table',
                    writeMode: 'write mode',
                    batchsize: '-1'
                },
                expected: true
            },
            {
                source: {
                    operation: READ,
                    jdbcUrl: 'url',
                    user: 'user',
                    password: 'pass',
                    catalog: 'catalog',
                    isConnectionPage: false,
                    customSql: 'false',
                    schema: 'schema',
                    table: 'table',
                    fetchSize: '1'
                },
                expected: false
            }
        ])(
            'should return $expected when call with $source',
            ({ source, expected }) => {
                expect(checkDatabricksJDBCRequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('windowFunctionRequiredFields', () => {
        it.each([
            { source: { 'option.windowFunction': MIN }, expected: true },
            {
                source: { 'option.windowFunction': MIN, 'option.column': 'a' },
                expected: false
            },
            { source: { 'option.windowFunction': RANK }, expected: true },
            {
                source: {
                    'option.windowFunction': RANK,
                    'option.orderBy': 'a:desc'
                },
                expected: false
            },
            { source: { 'option.windowFunction': NTILE }, expected: true },
            {
                source: {
                    'option.windowFunction': NTILE,
                    'option.n': '3',
                    'option.orderBy': 'a:desc'
                },
                expected: false
            },
            {
                source: { 'option.windowFunction': LAG, 'option.orderBy': 'a' },
                expected: true
            },
            {
                source: {
                    'option.windowFunction': LAG,
                    'option.orderBy': 'a:desc',
                    'option.expression': 'test'
                },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(windowFunctionRequiredFields(source)).toBe(expected);
            }
        );
    });

    describe('checkPivotFields ', () => {
        it.each([
            { source: {}, expected: true },
            { source: { name: 'test' }, expected: true },
            { source: { name: 'test', operation: PIVOT }, expected: true },
            { source: { name: 'test', operationType: 'pivot' }, expected: true },
            {
                source: {
                    name: 'test',
                    operation: PIVOT,
                    operationType: 'unpivot',
                    'option.unchangedColumns': 'test',
                    'option.unpivotColumns': 'test',
                    'option.unpivotNames': 'test'
                },
                expected: false
            },
            {
                source: {
                    name: 'test',
                    operation: PIVOT,
                    operationType: 'pivot',
                    'option.groupBy': 'test',
                    'option.pivotColumn': 'test',
                    'option.aggregation': 'test()'
                },
                expected: true
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkPivotFields(source)).toBe(expected);
            }
        );
    });

    describe('checkStringFunctionsFields', () => {
        const common = {
            name: 'name',
            'option.sourceColumn': 'test',
            'option.targetColumn': 'test'
        };

        it.each([
            {
                source: {
                    function: 'base64',
                    ...common
                },
                expected: false
            },
            {
                source: {
                    function: 'concat_ws',
                    ...common,
                    'option.separator': ','
                },
                expected: false
            },
            {
                source: {
                    function: 'decode' || 'encode',
                    ...common,
                    'option.charset': 'test'
                },
                expected: false
            },
            {
                source: {
                    function: 'format_number',
                    ...common,
                    'option.decimalPlaces': 'test'
                },
                expected: false
            },
            {
                source: {
                    function: 'format_string',
                    ...common,
                    'option.formatString': 'test'
                },
                expected: false
            },
            {
                source: {
                    function: 'instr' || 'locate',
                    ...common,
                    'option.substring': 'test'
                },
                expected: false
            },
            {
                source: {
                    function: 'repeat',
                    ...common,
                    'option.repeatNumber': 'test'
                },
                expected: false
            },
            {
                source: {
                    function: 'lpad' || 'rpad',
                    ...common,
                    'option.pad': 'test',
                    'option.length': 'test'
                },
                expected: false
            },
            {
                source: {
                    function: 'regexp_extract',
                    ...common,
                    'option.regex': 'test',
                    'option.groupIndex': 'test'
                },
                expected: false
            },
            {
                source: {
                    function: 'substring',
                    ...common,
                    'option.position': 'test',
                    'option.length': 'test'
                },
                expected: false
            },
            {
                source: {
                    function: 'substring_index',
                    ...common,
                    'option.delimiter': 'test',
                    'option.count': 'test'
                },
                expected: false
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkStringFunctionsFields(source)).toEqual(expected);
            }
        );
    });

    describe('checkDatatimeFields', () => {
        it.each([
            {
                source: {
                    operation: DATETIME,
                    name: 'test',
                    function: 'test',
                    'option.targetColumn': 'test'
                },
                expected: false
            },
            {
                source: { operation: DATETIME, name: 'test', function: 'test' },
                expected: true
            },
            {
                source: { operation: DATETIME },
                expected: true
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkDatatimeFields(source)).toEqual(expected);
            }
        );
    });

    describe('checkHandleNullFields', () => {
        it.each([
            {
                source: {
                    mode: 'DROP',
                    name: 'test',
                    'option.dropType': 'column'
                },
                expected: true
            },
            {
                source: {
                    mode: 'DROP',
                    name: 'test',
                    'option.dropType': 'column',
                    'option.dropChoice': 'all'
                },
                expected: false
            },
            {
                source: {
                    mode: 'DROP',
                    name: 'test',
                    'option.dropType': 'column',
                    'option.dropChoice': 'names'
                },
                expected: true
            },
            {
                source: {
                    mode: 'fill',
                    name: 'test',
                    'option.fillValueType': 'custom'
                },
                expected: true
            },
            {
                source: {
                    mode: 'fill',
                    name: 'test',
                    'option.fillValueType': 'custom',
                    'option.fillChoice': 'all',
                    'option.fillValues': 'test'
                },
                expected: false
            },
            {
                source: {
                    mode: 'fill',
                    name: 'test',
                    'option.fillValueType': 'custom',
                    'option.fillChoice': 'names',
                    'option.fillColumns': 'a,b'
                },
                expected: true
            },

            {
                source: {
                    mode: 'fill',
                    name: 'test',
                    'option.fillValueType': 'custom',
                    'option.fillChoice': 'names',
                    'option.fillColumns': 'a,b',
                    'option.fillValues': 'a,b'
                },
                expected: false
            },
            {
                source: {
                    mode: 'fill',
                    name: 'test',
                    'option.fillValueType': 'custom',
                    'option.fillChoice': 'all',
                    'option.fillValues': ''
                },
                expected: true
            },
            {
                source: {
                    mode: 'fill',
                    name: 'test',
                    'option.fillValueType': 'agg',
                    'option.fillStrategy': 'mean',
                    'option.fillColumns': 'a,b'
                },
                expected: false
            },
            {
                source: {
                    mode: 'fill',
                    name: 'test',
                    'option.fillValueType': 'agg',
                    'option.fillStrategy': 'mean',
                    'option.fillColumns': ''
                },
                expected: true
            },
            {
                source: {
                    mode: 'fill',
                    name: 'test',
                    'option.fillValueType': ''
                },
                expected: true
            }
        ])(
            'should return $expected when called with $source',
            ({ source, expected }) => {
                expect(checkHandleNullFields(source)).toEqual(expected);
            }
        );
    });
});
