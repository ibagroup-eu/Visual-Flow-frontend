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

import React from 'react';
import { useSelector } from 'react-redux';
import { mount } from 'enzyme';
import { omit } from 'lodash';

import ScriptsSchema, { toField, toSchema } from './ScriptsSchema';
import sources from './sources';
import Row from './row';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

describe('ScriptsSchema', () => {
    afterEach(() => jest.clearAllMocks());
    const schemaFields = [
        {
            source: sources.Workspace,
            filePath: ''
        },
        {
            source: sources.Volumes,
            filePath: '/Volumes/'
        },
        {
            source: sources.Volumes,
            filePath: 'dbfs:/Volumes/'
        },
        {
            source: sources.S3,
            filePath: 's3://',
            region: 'auto'
        }
    ];

    const schemaFieldsTransformation = [
        [
            {
                source: sources.Workspace,
                filePath: ''
            },
            {
                source: sources.Workspace,
                filePath: ''
            }
        ],
        [
            {
                source: sources.Volumes,
                filePath: '/Volumes/'
            },
            {
                source: sources.Volumes,
                filePath: '/Volumes/'
            }
        ],
        [
            {
                source: sources.Volumes,
                filePath: 'dbfs:/Volumes/'
            },
            {
                source: sources.Volumes,
                filePath: 'dbfs:/Volumes/'
            }
        ],
        [
            {
                source: sources.S3,
                filePath: 's3://'
            },
            {
                source: sources.S3,
                filePath: 's3://'
            }
        ]
    ];

    const init = (
        props = {},
        returnProps = false,
        zones = ['us-east-1d'],
        func = mount
    ) => {
        const defaultProps = {
            schemaFields: [{ source: 'workspace', filePath: '' }],
            onSave: jest.fn(),
            setIsValid: jest.fn(),
            setFields: jest.fn(),
            ableToEdit: true,
            cloud: 'AWS'
        };

        useSelector.mockImplementation(_ => zones);
        const wrapper = func(<ScriptsSchema {...defaultProps} {...props} />);
        return returnProps
            ? [
                  wrapper,
                  {
                      ...defaultProps,
                      ...props
                  }
              ]
            : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper, _] = init();
        expect(wrapper).toBeDefined();
    });

    it('should render one row if schemaFields is empty', () => {
        const [wrapper, _] = init({ schemaFields: [] });
        expect(wrapper.find(Row).length).toBe(1);
    });

    it('should not disable delete button', () => {
        const defaultProps = {
            onSave: jest.fn(),
            setIsValid: jest.fn(),
            schemaFields,
            cloud: 'AWS'
        };

        const wrapper = mount(<ScriptsSchema {...defaultProps} />);
        expect(
            wrapper
                .find(Row)
                .at(0)
                .prop('shouldDisableDeleteBtn')
        ).toBe(false);
    });

    it('should disable delete button', () => {
        const [wrapper] = init({ schemaFields: [] });
        expect(wrapper.find(Row).prop('shouldDisableDeleteBtn')).toBe(true);
    });

    it('should transform to fields correctly', () => {
        const testCases = [...schemaFieldsTransformation];

        testCases.forEach(([field, result]) =>
            expect(omit(toField(field), ['id'])).toEqual({
                ...result,
                defaultSource: result.source,
                defaultFilePath: result.filePath
            })
        );
    });

    it('should transform to schema correctly', () => {
        const testCases = [...schemaFieldsTransformation];

        testCases.forEach(([field, result]) =>
            expect(
                toSchema({
                    ...field,
                    defaultSource: field.source,
                    defaultFilePath: field.filePath
                })
            ).toEqual(result)
        );
    });

    it('should call onSaveScriptsSchema', () => {
        const defaultProps = {
            onSave: jest.fn(),
            setIsValid: jest.fn(),
            schemaFields,
            cloud: 'Azure'
        };
        const ref = React.createRef();
        const wrapper = mount(<ScriptsSchema ref={ref} {...defaultProps} />);
        ref.current.onSaveScriptsSchema();
        expect(wrapper).toBeDefined();
    });

    it('should remove a row', () => {
        const defaultProps = {
            setIsValid: jest.fn(),
            onSave: jest.fn(),
            schemaFields,
            cloud: 'GCP'
        };

        const wrapper = mount(<ScriptsSchema {...defaultProps} />);

        expect(wrapper.find(Row).length).toBe(defaultProps.schemaFields.length);

        const firstRow = wrapper.find(Row).at(0);

        firstRow.prop('onRemove')();

        wrapper.update();

        expect(wrapper.find(Row).length).toBe(defaultProps.schemaFields.length - 1);
    });

    it('should add a row', () => {
        const defaultProps = {
            onSave: jest.fn(),
            setIsValid: jest.fn(),
            schemaFields,
            cloud: 'AWS'
        };

        const wrapper = mount(<ScriptsSchema {...defaultProps} />);

        expect(wrapper.find(Row).length).toBe(defaultProps.schemaFields.length);

        const firstRow = wrapper.find(Row).at(0);

        firstRow.prop('onAdd')();

        wrapper.update();

        expect(wrapper.find(Row).length).toBe(defaultProps.schemaFields.length + 1);
    });

    it('should move up', () => {
        const defaultProps = {
            setIsValid: jest.fn(),
            onSave: jest.fn(),
            schemaFields,
            cloud: 'GCP'
        };

        const wrapper = mount(<ScriptsSchema {...defaultProps} />);

        expect(wrapper.find(Row).length).toBe(defaultProps.schemaFields.length);

        const firstRow = wrapper.find(Row).at(1);

        firstRow.prop('onMoveTop')();

        wrapper.update();

        expect(wrapper.find(Row).map(x => x.prop('source'))).toEqual([
            sources.Volumes,
            sources.Workspace,
            sources.Volumes,
            sources.S3
        ]);
    });

    it('should move down', () => {
        const defaultProps = {
            setIsValid: jest.fn(),
            onSave: jest.fn(),
            schemaFields,
            cloud: 'GCP'
        };

        const wrapper = mount(<ScriptsSchema {...defaultProps} />);

        expect(wrapper.find(Row).length).toBe(defaultProps.schemaFields.length);

        const firstRow = wrapper.find(Row).at(0);

        firstRow.prop('onMoveDown')();

        wrapper.update();

        expect(wrapper.find(Row).map(x => x.prop('source'))).toEqual([
            sources.Volumes,
            sources.Workspace,
            sources.Volumes,
            sources.S3
        ]);
    });
});
