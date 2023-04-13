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

import { mount, shallow } from 'enzyme';
import React from 'react';

import { useTranslation } from 'react-i18next';
import { Paper, TableBody, Typography } from '@material-ui/core';
import { EnhancedTable } from './EnhancedTable';
import TableToolbar from '../table-toolbar';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('EnhancedTable', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            data: [],
            classes: {},
            children: jest.fn(),
            page: 0,
            rowsPerPage: 50,
            setCurrentPage: jest.fn(),
            setRows: jest.fn(),
            setTableOrderBy: jest.fn(),
            orderColumns: [],
            order: 'asc',
            orderBy: 'name',
            onCheckTags: jest.fn(),
            resetTags: jest.fn(),
            tagsData: [['test', true]]
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<EnhancedTable {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper).toBeDefined();
    });

    it('should render table body', () => {
        const [wrapper] = init({
            data: [{ id: 'id_1' }, { id: 'id_2' }]
        });

        expect(wrapper.find(Paper).length).toBe(2);
    });

    it('should show "no items" message', () => {
        const [wrapper] = init({
            data: []
        });

        expect(wrapper.find(TableBody).exists()).toBeFalsy();
        expect(wrapper.find(Typography).text()).toBe('jobs:noItems');
    });

    it('should change the page', () => {
        const [wrapper, props] = init({}, true);

        const onChangePage = wrapper.find(TableToolbar).prop('onChangePage');

        onChangePage(undefined, 1);

        expect(props.setCurrentPage).toHaveBeenCalledWith(1);
    });

    it('should change rows per page', () => {
        const [wrapper, props] = init({}, true);

        const onChangeRowsPerPage = wrapper
            .find(TableToolbar)
            .prop('onChangeRowsPerPage');

        onChangeRowsPerPage({ target: { value: '1' } });

        expect(props.setCurrentPage).toHaveBeenCalledWith(0);
        expect(props.setRows).toHaveBeenCalledWith(1);
    });

    it('should set sort direction to "desc"', () => {
        const [wrapper, props] = init({ order: 'asc', orderBy: 'name' }, true);

        const onRequestSort = wrapper.find(TableToolbar).prop('onRequestSort');

        onRequestSort(undefined, 'name');

        expect(props.setTableOrderBy).toHaveBeenCalledWith('name', 'desc');
    });

    it('should set sort direction to "asc"', () => {
        const [wrapper, props] = init({ order: 'desc', orderBy: 'name' }, true);

        const onRequestSort = wrapper.find(TableToolbar).prop('onRequestSort');

        onRequestSort(undefined, 'name');

        expect(props.setTableOrderBy).toHaveBeenCalledWith('name', 'asc');
    });

    it('should handle select all click with not empty items', () => {
        const [wrapper] = init(
            { data: [{ id: 'id_1', pipelineId: null }] },
            false,
            mount
        );

        const onSelectAllClick = wrapper.find(TableToolbar).prop('onSelectAllClick');

        onSelectAllClick({ target: { checked: true } });

        wrapper.update();

        expect(wrapper.find(TableToolbar).prop('selected')).toEqual([
            {
                id: 'id_1',
                pipelineId: null
            }
        ]);
    });

    it('should handle select all click with empty items', () => {
        const [wrapper] = init({}, false, mount);

        const onSelectAllClick = wrapper.find(TableToolbar).prop('onSelectAllClick');

        onSelectAllClick({ target: { checked: false } });

        wrapper.update();

        expect(wrapper.find(TableToolbar).prop('selected')).toEqual([]);
    });

    it('should handle click with negative index', () => {
        const [wrapper, props] = init(
            { data: [{ id: 'id_1', pipelineInstances: [] }] },
            true,
            mount
        );

        const { onClick } = props.children.mock.calls[0][0];

        onClick(undefined);

        wrapper.update();

        expect(wrapper.find(TableToolbar).prop('selected')).toEqual([
            {
                id: 'id_1',
                pipelineInstances: []
            }
        ]);
    });
});
