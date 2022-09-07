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
import { shallow } from 'enzyme';
import { I18nextProvider } from 'react-i18next';

import AvroSchema, { toField, toSchema } from './AvroSchema';
import i18n from '../../i18n';
import types, { NULL } from './types';
import Row from './row';
import { omit } from 'lodash';

describe('AvroSchema', () => {
    const init = props => {
        const defaultProps = {
            onChange: jest.fn(),
            schemaFields: [
                {
                    name: 'Field_1',
                    type: [NULL, types.Boolean],
                    nullable: true
                },
                {
                    name: 'Field_2',
                    type: types.Double
                }
            ]
        };

        return [
            shallow(
                <I18nextProvider i18n={i18n}>
                    <AvroSchema {...defaultProps} {...props} />
                </I18nextProvider>
            )
                .dive()
                .dive(),
            { ...defaultProps, ...props }
        ];
    };

    it('should render without crashes', () => {
        const [wrapper, _] = init();
        expect(wrapper).toBeDefined();
    });

    it('should render correct number of rows', () => {
        const [wrapper, props] = init();
        expect(wrapper.find(Row).length).toBe(props.schemaFields.length);
    });

    it('should render one row if schemaFields is empty', () => {
        const [wrapper, _] = init({ schemaFields: [] });
        expect(wrapper.find(Row).length).toBe(1);
    });

    it('should transform to fields correctly', () => {
        const testCases = [
            [
                { name: 'F1', type: types.Bytes },
                {
                    name: 'F1',
                    nullable: false,
                    type: types.Bytes
                }
            ],
            [
                { name: 'F2', type: [NULL, types.String] },
                {
                    name: 'F2',
                    nullable: true,
                    type: types.String
                }
            ],
            [
                { name: 'F3', type: [types.Double, NULL] },
                {
                    name: 'F3',
                    nullable: true,
                    type: types.Double
                }
            ],
            [
                { name: 'F4', type: [types.Long] },
                {
                    name: 'F4',
                    nullable: false,
                    type: types.Long
                }
            ]
        ];

        testCases.forEach(([field, result]) =>
            expect(omit(toField(field), ['id'])).toEqual({
                ...result,
                defaultName: result.name,
                defaultType: result.type,
                defaultNullable: result.nullable
            })
        );
    });

    it('should transform to schema correctly', () => {
        const testCases = [
            [
                {
                    name: 'F1',
                    nullable: false,
                    type: types.Long
                },
                {
                    name: 'F1',
                    type: types.Long
                }
            ],
            [
                {
                    name: 'F2',
                    nullable: true,
                    type: types.Double
                },
                {
                    name: 'F2',
                    type: [NULL, types.Double]
                }
            ]
        ];

        testCases.forEach(([field, result]) =>
            expect(
                toSchema({
                    ...field,
                    defaultName: field.name,
                    defaultType: field.type,
                    defaultNullable: field.nullable
                })
            ).toEqual(result)
        );
    });
});
