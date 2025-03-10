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
import { mount } from 'enzyme';
import { omit } from 'lodash';
import TagsSchema, { checkDuplicates, toField, toSchema } from './TagsSchema';
import Row from './row';

describe('TagsSchema', () => {
    const schemaFields = [
        {
            clusterKey: 'Field_1',
            value: 'value'
        },
        {
            clusterKey: 'Field_2',
            value: 'value'
        }
    ];

    const init = (props = {}, returnProps = false, func = mount) => {
        const defaultProps = {
            onSave: jest.fn(),
            schemaFields,
            setIsValid: jest.fn(),
            setFields: jest.fn()
        };

        const wrapper = func(<TagsSchema {...defaultProps} {...props} />);
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
            schemaFields: [
                {
                    clusterKey: 'Field_1',
                    value: 'value'
                },
                {
                    clusterKey: 'Field_2',
                    value: 'value'
                }
            ]
        };

        const wrapper = mount(<TagsSchema {...defaultProps} />);
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
        const testCases = [
            [
                {
                    clusterKey: 'Field_1',
                    value: 'value'
                },
                {
                    clusterKey: 'Field_1',
                    value: 'value'
                }
            ]
        ];

        testCases.forEach(([field, result]) =>
            expect(omit(toField(field), ['id'])).toEqual({
                ...result,
                defaultKey: result.clusterKey,
                defaultValue: result.value
            })
        );
    });

    it('should transform to schema correctly', () => {
        const testCases = [
            [
                {
                    clusterKey: 'Field_1',
                    value: 'value'
                },
                {
                    clusterKey: 'Field_1',
                    value: 'value'
                }
            ]
        ];

        testCases.forEach(([field, result]) =>
            expect(
                toSchema({
                    ...field,
                    defaultKey: result.clusterKey,
                    defaultValue: result.value
                })
            ).toEqual(result)
        );
    });

    it('should call onSaveTagsSchema', () => {
        const defaultProps = {
            onSave: jest.fn(),
            setIsValid: jest.fn(),
            schemaFields
        };
        const ref = React.createRef();
        const wrapper = mount(<TagsSchema ref={ref} {...defaultProps} />);
        ref.current.onSaveTagsSchema();
        expect(wrapper).toBeDefined();
    });

    it('should check duplicates', () => {
        expect(
            checkDuplicates([
                {
                    clusterKey: 'Field_1',
                    value: 'value'
                }
            ])
        ).toEqual([{ clusterKey: 'Field_1', value: 'value', duplicated: false }]);

        expect(checkDuplicates([])).toEqual([]);

        expect(
            checkDuplicates([
                { clusterKey: 'Field_1', value: 'value' },
                { clusterKey: 'Field_1', value: 'value' }
            ])
        ).toEqual([
            { clusterKey: 'Field_1', value: 'value', duplicated: false },
            { clusterKey: 'Field_1', value: 'value', duplicated: true }
        ]);
    });

    it('should remove a row', () => {
        const defaultProps = {
            setIsValid: jest.fn(),
            onSave: jest.fn(),
            schemaFields: [
                {
                    clusterKey: 'Field_1',
                    value: 'value'
                },
                {
                    clusterKey: 'Field_2',
                    value: 'value'
                }
            ]
        };

        const wrapper = mount(<TagsSchema {...defaultProps} />);

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
            schemaFields: [
                {
                    clusterKey: 'Field_1',
                    value: 'value'
                },
                {
                    clusterKey: 'Field_2',
                    value: 'value'
                }
            ]
        };

        const wrapper = mount(<TagsSchema {...defaultProps} />);

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
            schemaFields: [
                {
                    clusterKey: 'Field_1',
                    value: 'value'
                },
                {
                    clusterKey: 'Field_2',
                    value: 'value'
                }
            ]
        };

        const wrapper = mount(<TagsSchema {...defaultProps} />);

        expect(wrapper.find(Row).length).toBe(defaultProps.schemaFields.length);

        const firstRow = wrapper.find(Row).at(1);

        firstRow.prop('onMoveTop')();

        wrapper.update();

        expect(wrapper.find(Row).map(x => x.prop('clusterKey'))).toEqual([
            'Field_2',
            'Field_1'
        ]);
    });

    it('should move down', () => {
        const defaultProps = {
            setIsValid: jest.fn(),
            onSave: jest.fn(),
            schemaFields: [
                {
                    clusterKey: 'Field_1',
                    value: 'value'
                },
                {
                    clusterKey: 'Field_2',
                    value: 'value'
                }
            ]
        };

        const wrapper = mount(<TagsSchema {...defaultProps} />);

        expect(wrapper.find(Row).length).toBe(defaultProps.schemaFields.length);

        const firstRow = wrapper.find(Row).at(0);

        firstRow.prop('onMoveDown')();

        wrapper.update();

        expect(wrapper.find(Row).map(x => x.prop('clusterKey'))).toEqual([
            'Field_2',
            'Field_1'
        ]);
    });
});
