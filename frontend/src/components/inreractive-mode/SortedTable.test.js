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

import { Table, TableSortLabel, Typography } from '@material-ui/core';

import { StyledTableCell, StyledTableRow } from './TableStyles';
import SortedTable from './SortedTable';
import SearchWithClear from './SearchWithClear';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('SortedTable', () => {
    let wrapper;
    let defaultProps;

    const headers = ['country'];
    const originalRows = [
        {
            country: 'United States'
        },
        {
            country: 'Canada'
        }
    ];

    beforeEach(() => {
        defaultProps = {
            headers,
            originalRows
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = mount(<SortedTable {...defaultProps} />);
    });

    it('should render components', () => {
        expect(wrapper).toBeDefined();

        expect(wrapper.find(Table).length).toBe(1);
        expect(wrapper.find(StyledTableRow).length).toBe(3);
    });

    it('sorting', () => {
        const props = {
            ...defaultProps,
            originalRows: [
                {
                    country: 'Canada'
                },
                {
                    country: 'Albania'
                },
                {
                    country: 'United States'
                },
                {
                    country: 'Poland'
                },
                {
                    country: 'Poland'
                },
                {
                    country: 'Austria'
                }
            ]
        };
        wrapper = mount(<SortedTable {...props} />);

        expect(wrapper.find(StyledTableCell).length).toBe(7);
        wrapper.find(TableSortLabel).prop('onClick')('country');
        wrapper.update();
        expect(
            wrapper
                .find(StyledTableCell)
                .at(1)
                .text()
        ).toBe('Albania');

        wrapper.find(TableSortLabel).prop('onClick')('country');
        wrapper.update();
        expect(
            wrapper
                .find(StyledTableCell)
                .at(1)
                .text()
        ).toBe('United States');

        wrapper.find(TableSortLabel).prop('onClick')('country');
        expect(
            wrapper
                .find(StyledTableCell)
                .at(1)
                .text()
        ).toBe('Canada');
        wrapper.update();

        wrapper.find(TableSortLabel).prop('onClick')('country');
        expect(
            wrapper
                .find(StyledTableCell)
                .at(1)
                .text()
        ).toBe('Albania');
        wrapper.update();
    });

    it('search', () => {
        expect(wrapper.find(SearchWithClear).length).toBe(1);
        wrapper.find(SearchWithClear).prop('onSearch')({
            target: { value: 'canada' }
        });
        wrapper.update();
        expect(wrapper.find(SearchWithClear).prop('searchText')).toBe('canada');

        wrapper.find(SearchWithClear).prop('onClear')();
        wrapper.update();
        expect(wrapper.find(SearchWithClear).prop('searchText')).toBe('');

        wrapper.find(SearchWithClear).prop('onSearch')({
            target: { value: 'poland' }
        });
        wrapper.update();
        expect(
            wrapper
                .find(Typography)
                .text()
                .includes('nothingToShow')
        ).toBeTruthy();
    });
});
