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
import { useTranslation } from 'react-i18next';

import { Typography } from '@material-ui/core';

import { READ, WRITE } from '../../mxgraph/constants';
import SortedTable from './SortedTable';
import OutputSchema from './OutputSchema';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('OutputSchema', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            operation: READ,
            outputData: [
                {
                    country: 'United States',
                    isocode: 'US'
                },
                {
                    country: 'Canada',
                    isocode: 'CA'
                }
            ]
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = mount(<OutputSchema {...defaultProps} />);
    });

    it('should render components', () => {
        expect(wrapper).toBeDefined();

        expect(
            wrapper
                .find(Typography)
                .text()
                .includes('outputSchema')
        ).toBeTruthy();
        expect(wrapper.find(SortedTable).length).toBe(1);
    });

    it('should render components for WRITE', () => {
        const props = {
            ...defaultProps,
            operation: WRITE,
            outputData: undefined
        };
        wrapper = mount(<OutputSchema {...props} />);

        expect(
            wrapper
                .find(Typography)
                .text()
                .includes('noOutputSchema')
        ).toBeTruthy();
        expect(wrapper.find(SortedTable).length).toBe(0);
    });
});
