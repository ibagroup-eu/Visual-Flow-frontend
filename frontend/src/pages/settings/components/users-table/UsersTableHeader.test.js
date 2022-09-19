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

import { TableCell, TableHead, TableSortLabel } from '@material-ui/core';
import { shallow } from 'enzyme';
import React from 'react';
import UsersTableHeader from './UsersTableHeader';

describe('UsersTableHeader', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            numSelected: 1,
            onRequestSort: jest.fn(),
            onSelectAllClick: jest.fn(),
            order: 'desc',
            orderBy: 'test',
            rowCount: 5,
            headCells: [{ id: 'test' }],
            editMode: true
        };

        wrapper = shallow(<UsersTableHeader {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render TableHead', () => {
        expect(wrapper.find(TableHead)).toHaveLength(1);
    });

    it('should calls onClick prop', () => {
        wrapper.find(TableSortLabel).invoke('onClick')('test');
        expect(props.onRequestSort).toBeCalled();
    });
    it('should calls props with another values if ternary operator is falsy', () => {
        const changedProps = {
            order: 'asc',
            orderBy: '',
            headCells: [{ id: 'test', numeric: true, disablePadding: true }]
        };
        wrapper = shallow(<UsersTableHeader {...props} {...changedProps} />);
        expect(
            wrapper
                .find(TableCell)
                .at(1)
                .prop('align')
        ).toBe('right');
        expect(
            wrapper
                .find(TableCell)
                .at(1)
                .prop('sortDirection')
        ).toBe(false);
        expect(
            wrapper
                .find(TableCell)
                .at(1)
                .prop('padding')
        ).toBe('none');
    });
});
