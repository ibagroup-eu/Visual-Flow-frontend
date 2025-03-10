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

import { Grid } from '@material-ui/core';

import Exemplar from './Exemplar';
import ExemplarSidePanel from './ExemplarSidePanel';
import ExemplarTable from './ExemplarTable';
import PaperWithText from './PaperWithText';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('Exemplar', () => {
    let wrapper;
    let defaultProps;

    const columns = [
        { id: 0, label: 'country' },
        { id: 1, label: 'isocode' },
        { id: 2, label: 'region' },
        { id: 3, label: 'population' },
        { id: 4, label: 'area' },
        { id: 5, label: 'capital' }
    ];
    const data = [
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
    ];

    beforeEach(() => {
        defaultProps = {
            columns,
            data,
            openSidePanel: true
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = mount(<Exemplar {...defaultProps} />);
    });

    it('should render components', () => {
        expect(wrapper).toBeDefined();

        expect(wrapper.find(ExemplarSidePanel).length).toBe(1);

        expect(wrapper.find(Grid).length).toBe(3);
        expect(wrapper.find(ExemplarTable).length).toBe(1);
    });

    it('should render data for "deselect all"', () => {
        wrapper = shallow(<Exemplar {...defaultProps} />);
        wrapper.find(ExemplarSidePanel).prop('onSelectAll')();
        expect(wrapper.find(PaperWithText).length).toBe(1);
        expect(
            wrapper
                .find(PaperWithText)
                .props()
                .className.includes('Open')
        ).toBeFalsy();

        wrapper.find(ExemplarSidePanel).prop('onColumnToggle')(5);
        expect(wrapper.find(ExemplarTable).props().visibleColumns).toStrictEqual([
            5
        ]);

        wrapper.find(ExemplarSidePanel).prop('onColumnToggle')(5);
        expect(wrapper.find(ExemplarTable).length).toBe(0);

        wrapper.find(ExemplarSidePanel).prop('onSelectAll')();
        expect(wrapper.find(ExemplarTable).props().columns).toStrictEqual(
            defaultProps.columns
        );
    });

    it('should render data for "deselect all" when openSidePanel: false', () => {
        const props = {
            ...defaultProps,
            openSidePanel: false,
            columns: []
        };

        wrapper = shallow(<Exemplar {...props} />);
        expect(wrapper.find(PaperWithText).length).toBe(1);
        expect(
            wrapper
                .find(PaperWithText)
                .props()
                .className.includes('Open')
        ).toBeTruthy();
    });

    it('should render Table without Grid', () => {
        const props = {
            ...defaultProps,
            openSidePanel: false
        };

        wrapper = mount(<Exemplar {...props} />);

        expect(wrapper.find(Grid).length).toBe(1);
        expect(wrapper.find(ExemplarTable).length).toBe(1);
    });
});
