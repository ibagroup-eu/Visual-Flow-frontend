/*
 *  Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import React from 'react';
import { mount, shallow } from 'enzyme';
import { useTranslation } from 'react-i18next';

import { Tab, Tabs, Typography } from '@material-ui/core';

import InputSchemas from './InputSchemas';
import { READ, SLICE } from '../../mxgraph/constants';
import SortedTable from './SortedTable';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('InputSchemas', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            operation: READ,
            panels: [
                {
                    key: 0,
                    header: ['field', 'type'],
                    schema: [
                        {
                            field: 'country',
                            type: 'string'
                        },
                        {
                            field: 'code',
                            type: 'string'
                        }
                    ]
                },
                {
                    key: 1,
                    header: ['field', 'type'],
                    schema: [
                        {
                            field: 'country',
                            type: 'string'
                        },
                        {
                            field: 'code',
                            type: 'string'
                        }
                    ]
                }
            ],
            tabs: [
                {
                    key: 0,
                    label: '#1'
                },
                {
                    key: 1,
                    label: '#2'
                }
            ]
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = mount(<InputSchemas {...defaultProps} />);
    });

    it('should render components', () => {
        expect(wrapper).toBeDefined();

        expect(
            wrapper
                .find(Typography)
                .text()
                .includes('noInputSchema')
        ).toBeTruthy();
    });

    it('should render components for SLICE', () => {
        const props = {
            ...defaultProps,
            operation: SLICE
        };

        wrapper = shallow(<InputSchemas {...props} />);

        expect(wrapper.find(Tabs).length).toBe(1);
        wrapper.find(Tabs).prop('onChange')({}, 1);
        expect(wrapper.find(Tabs).prop('value')).toBe(1);

        expect(wrapper.find(Tab).length).toBe(2);
        expect(wrapper.find(SortedTable).length).toBe(1);
    });

    it('should render components for SLICE with 1 input schema', () => {
        const props = {
            ...defaultProps,
            operation: SLICE,
            panels: [
                {
                    key: 1,
                    header: ['field', 'type'],
                    schema: [
                        {
                            field: 'country',
                            type: 'string'
                        },
                        {
                            field: 'code',
                            type: 'string'
                        }
                    ]
                }
            ]
        };

        wrapper = shallow(<InputSchemas {...props} />);

        expect(wrapper.find(Tabs).length).toBe(0);
        expect(wrapper.find(SortedTable).length).toBe(1);
    });
});
