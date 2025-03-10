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
import { shallow } from 'enzyme';
import { useTranslation } from 'react-i18next';

import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { Accordion } from '@material-ui/core';

import Modal from './Modal';
import { READ } from '../../mxgraph/constants';
import PopupForm from '../popup-form';
import Schemas from './Schemas';
import Exemplar from './Exemplar';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('Interactive mode Modal', () => {
    let wrapper;
    let props;

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

    const outputData = {
        id: '1',
        status: 'succeeded',
        statusMessage: 'Dataset generation complete',
        rowCount: 20,
        schema: [
            {
                field: 'country',
                type: 'string'
            },
            {
                field: 'isocode',
                type: 'string'
            }
        ],
        exemplar: {
            records: [
                {
                    country: 'United States',
                    isocode: 'US'
                },
                {
                    country: 'Canada',
                    isocode: 'CA'
                }
            ]
        }
    };

    beforeEach(() => {
        props = {
            open: true,
            onClose: jest.fn(),
            operation: READ,
            inputData,
            outputData,
            stageName: 'Stage Name'
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = shallow(<Modal {...props} />);
    });

    it('should render components', () => {
        expect(wrapper).toBeDefined();

        expect(wrapper.find(PopupForm).props('open')).toBeTruthy();

        expect(wrapper.find(Accordion).length).toBe(2);
        expect(wrapper.find(Schemas).length).toBe(1);
        expect(wrapper.find(Exemplar).length).toBe(1);

        expect(wrapper.find(KeyboardArrowLeft).length).toBe(1);
        wrapper.find(KeyboardArrowLeft).prop('onClick')({
            stopPropagation: jest.fn()
        });
        expect(wrapper.find(KeyboardArrowLeft).length).toBe(0);
        expect(wrapper.find(KeyboardArrowRight).length).toBe(1);
    });
});
