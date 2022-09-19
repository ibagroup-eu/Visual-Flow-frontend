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
import { shallow } from 'enzyme';
import RenderJobConfiguration, {
    checkGroupByFields,
    checkReadWriteFields, checkRemoveDuplicateFields,
    checkSortFields,
    checkTransformerFields
} from './RenderJobConfiguration';
import { EDGE } from '../../constants';
import EdgeConfiguration from '../edge-configuration';

describe('RenderJobConfiguration', () => {
    const graph = {
        getSelectionCell: jest.fn()
    };

    it('should render component matching operation', () => {
        const configuration = {
            operation: EDGE
        };

        const wrapper = shallow(
            <RenderJobConfiguration configuration={configuration} graph={graph} />
        );
        expect(wrapper.find(EdgeConfiguration).exists()).toBeTruthy();
    });

    it('should not render when operation does not exist', () => {
        const configuration = {};
        const wrapper = shallow(
            <RenderJobConfiguration configuration={configuration} graph={graph} />
        );
        expect(wrapper.children().length).toBe(0);
    });
});

describe('checkReadWriteFields', () => {
    const name = 'name';
    it.each([
        { source: {}, expected: true },
        { source: { name }, expected: true },
        { source: { name, storage: 's3', anonymousAccess: true }, expected: false },
        { source: { name, storage: 's3' }, expected: true },
        { source: { name, storage: 'stdout' }, expected: true },
        { source: { name, storage: 'stdout', quantity: 0.5 }, expected: true },
        {
            source: { name, storage: 'stdout', quantity: 2147483632 },
            expected: true
        },
        { source: { name, storage: 'db2' }, expected: false },
        { source: { name, storage: 'db2', writeMode: 'Overwrite' }, expected: true },
        {
            source: {
                name,
                storage: 'db2',
                writeMode: 'Overwrite',
                truncateMode: true
            },
            expected: false
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
        { source: { name, sortType, orderColumns: 'a:' }, expected: false },
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
        { source: { name,  groupingColumns }, expected: true },
        { source: { name,  groupingColumns, groupingCriteria: 'groupingCriteria' }, expected: true },
        { source: { name,  groupingColumns, groupingCriteria: 'a,b:c' }, expected: true },
        { source: { name,  groupingColumns, groupingCriteria: 'a:b' }, expected: false },
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
        { source: { name,  keyColumns }, expected: true },
        { source: { name,  keyColumns, orderColumns: 'a,b,c' }, expected: true },
        { source: { name,  keyColumns, orderColumns: 'a:b,c:d' }, expected: false },
    ])(
        'should return $expected when called with $source',
        ({ source, expected }) => {
            expect(checkRemoveDuplicateFields(source)).toBe(expected);
        }
    );
});