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

import { READ } from '../../mxgraph/constants';
import ExemplarSidePanel from './ExemplarSidePanel';
import ExemplarCheckboxes from './ExemplarCheckboxes';
import SearchWithClear from './SearchWithClear';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('ExemplarSidePanel', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            operation: READ,
            columns: [
                {
                    id: 'United States',
                    label: 'United States'
                },
                {
                    id: 'Canada',
                    label: 'Canada'
                }
            ],
            visibleColumns: [],
            selectAll: false,
            onSelectAll: jest.fn(),
            onColumnToggle: jest.fn()
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = mount(<ExemplarSidePanel {...defaultProps} />);
    });

    it('should render components', () => {
        expect(wrapper).toBeDefined();

        expect(wrapper.find(SearchWithClear).length).toBe(1);
        wrapper.find(SearchWithClear).prop('onSearch')({
            target: { value: 'CaNAda' }
        });
        wrapper.update();
        expect(wrapper.find(ExemplarCheckboxes).length).toBe(1);
        expect(wrapper.find(SearchWithClear).prop('searchText')).toBe('canada');

        wrapper.find(SearchWithClear).prop('onClear')();
        wrapper.update();
        expect(wrapper.find(SearchWithClear).prop('searchText')).toBe('');
    });

    it('should render nothingToShow message', () => {
        const props = {
            ...defaultProps,
            columns: []
        };
        wrapper = mount(<ExemplarSidePanel {...props} />);

        expect(
            wrapper
                .find(Typography)
                .at(0)
                .text()
                .includes('nothingToShow')
        ).toBeTruthy();
        expect(wrapper.find(ExemplarCheckboxes).length).toBe(0);
    });
});
