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
 *   http://www.apache.org/licenses/LICENSE-2.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { shallow } from 'enzyme';
import React from 'react';

import { TableToolbar } from './TableToolbar';
import { TablePagination } from '@material-ui/core';
import TableSort from '../table-sort';
import ActionButton from '../../action-button';

describe('TableToolbar', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            classes: {},
            page: 0,
            rowsPerPage: 50,
            setCurrentPage: jest.fn(),
            setRows: jest.fn(),
            setTableOrderBy: jest.fn(),
            orderColumns: [],
            order: 'asc',
            orderBy: 'name',
            selected: ['id_1', 'id_2'],
            actions: [{ title: 'Remove', onClick: jest.fn() }],
            onRequestSort: jest.fn()
        };

        const wrapper = func(<TableToolbar {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper).toBeDefined();
        expect(wrapper.find(TablePagination).exists()).toBeTruthy();
    });

    it('should render custom actions', () => {
        const [wrapper, props] = init({}, true);

        expect(wrapper.find(ActionButton).length).toBe(props.actions.length);

        const [action] = wrapper.find(ActionButton).map(x => x);

        expect(action.prop('title')).toBe(props.actions[0].title);

        action.simulate('click');

        expect(props.actions[0].onClick).toHaveBeenCalled();
    });

    it('should render sort table', () => {
        const [wrapper] = init({ selected: [] });

        expect(wrapper.find(ActionButton).length).toBe(0);
        expect(wrapper.find(TableSort).exists()).toBeTruthy();
    });
});
