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

import { Table, TableSortLabel } from '@material-ui/core';

import ExemplarTable from './ExemplarTable';
import { StyledTableCell, StyledTableRow } from './TableStyles';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('ExemplarTable', () => {
    let wrapper;
    let defaultProps;

    const columns = [{ id: 'country', label: 'country' }];
    const rows = [
        {
            country: 'United States'
        },
        {
            country: 'Canada'
        }
    ];

    beforeEach(() => {
        defaultProps = {
            columns,
            rows,
            visibleColumns: ['country']
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = mount(<ExemplarTable {...defaultProps} />);
    });

    it('should render components', () => {
        expect(wrapper).toBeDefined();

        expect(wrapper.find(Table).length).toBe(1);
        expect(wrapper.find(StyledTableRow).length).toBe(3);
    });

    it('sorting', () => {
        const props = {
            ...defaultProps,
            rows: [
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
        wrapper = mount(<ExemplarTable {...props} />);

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
});
