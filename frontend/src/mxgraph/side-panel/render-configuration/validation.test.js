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

import React from 'react';
import {
    checkCassandraRequiredFields,
    checkClickHouseRequiredFields,
    checkCosRequiredFields,
    checkElasticsearchRequiredFields,
    checkGroupByFields,
    checkMongoRequiredFields,
    checkReadWriteFields,
    checkRemoveDuplicateFields,
    checkSortFields,
    checkTransformerFields,
    isAnyEmpty
} from './validation';
import { READ, WRITE } from '../../constants';

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

    it('should check empty values for Mongo storage', () => {
        const fields = {
            host: '',
            port: 'port',
            user: 'user',
            password: 'pw',
            database: 'db',
            collection: 'collection'
        };
        expect(checkMongoRequiredFields(fields)).toBeTruthy();
    });

    it('should check empty values for Elasticsearch storage', () => {
        const fields = {
            nodes: '',
            port: 'port',
            user: 'user',
            password: 'pw',
            index: 'index',
            certData: 'cert'
        };
        expect(checkElasticsearchRequiredFields(fields)).toBeTruthy();
    });

    it('should check empty values for Cassandra storage', () => {
        const fields = {
            keyspace: '',
            host: '',
            port: 'port',
            username: 'user',
            password: 'pw',
            table: 'table'
        };
        expect(checkCassandraRequiredFields(fields)).toBeTruthy();
    });

    describe('checkCosRequiredFields', () => {
        it.each([
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
});
