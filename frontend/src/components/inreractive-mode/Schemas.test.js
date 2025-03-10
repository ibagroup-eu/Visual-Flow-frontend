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
import { mount } from 'enzyme';

import { Paper } from '@material-ui/core';

import Schemas from './Schemas';
import { READ } from '../../mxgraph/constants';

describe('Schemas', () => {
    let wrapper;
    let defaultProps;

    const inputData = [
        {
            id: '1',
            status: 'succeeded',
            rowCount: 200,
            schema: [
                {
                    field: 'country',
                    type: 'string'
                },
                {
                    field: 'isocode',
                    type: 'string'
                },
                {
                    field: 'region',
                    type: 'string'
                },
                {
                    field: 'population',
                    type: 'integer'
                },
                {
                    field: 'area',
                    type: 'integer'
                },
                {
                    field: 'capital',
                    type: 'string'
                }
            ],
            exemplar: {
                records: [
                    {
                        country: 'United States',
                        isocode: 'US',
                        region: 'North America',
                        population: 331002651,
                        area: 9833520,
                        capital: 'Washington, D.C.'
                    },
                    {
                        country: 'Canada',
                        isocode: 'CA',
                        region: 'North America',
                        population: 37742154,
                        area: 9984670,
                        capital: 'Ottawa'
                    }
                ]
            }
        }
    ];

    const outputData = [
        {
            field: 'country',
            type: 'string'
        },
        {
            field: 'isocode',
            type: 'string'
        }
    ];

    beforeEach(() => {
        defaultProps = {
            inputData,
            outputData,
            operation: READ
        };

        wrapper = mount(<Schemas {...defaultProps} />);
    });

    it('should render components', () => {
        expect(wrapper).toBeDefined();

        expect(wrapper.find(Paper).length).toBe(3);
        expect(
            wrapper
                .find(Paper)
                .at(0)
                .props()
                .className.includes('tableContainer')
        ).toBeTruthy();
    });

    it('should render 2 input schemas ', () => {
        const props = {
            ...defaultProps,
            inputData: [
                {
                    id: '1',
                    status: 'succeeded',
                    rowCount: 200,
                    schema: [
                        {
                            field: 'country',
                            type: 'string'
                        },
                        {
                            field: 'isocode',
                            type: 'string'
                        }
                    ]
                },
                {
                    id: '2',
                    status: 'succeeded',
                    rowCount: 200,
                    schema: [
                        {
                            field: 'country',
                            type: 'string'
                        },
                        {
                            field: 'isocode',
                            type: 'string'
                        }
                    ]
                }
            ]
        };

        wrapper = mount(<Schemas {...props} />);

        expect(wrapper.find(Paper).length).toBe(3);
        expect(
            wrapper
                .find(Paper)
                .at(0)
                .props()
                .className.includes('tableContainer')
        ).toBeFalsy();
    });
});
