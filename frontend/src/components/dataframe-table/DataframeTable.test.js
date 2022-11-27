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

import { TablePagination } from '@material-ui/core';
import { shallow } from 'enzyme';
import React from 'react';
import DataframeTable from './DataframeTable';
import DataframeBody from './dataframe-body/DataframeBody';
import DataframeHead from './dataframe-head/DataframeHead';
import DataframeToolbar from './dataframe-toolbar/DataframeToolbar';

describe('DataframeTable', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            columns: [
                { column: 'test', type: 'String' },
                { column: 'test2', type: 'String' }
            ],
            rows: [
                { rowId: '123', data: ['1', '2'] },
                { rowId: '1234', data: ['1', '2'] },
                { rowId: '12345', data: ['1', '2'] },
                { rowId: '123456', data: ['1', '2'] },
                { rowId: '1234567', data: ['1', '2'] },
                { rowId: '12345678', data: ['1', '2'] }
            ],
            columnTypes: ['String'],
            setColumns: jest.fn(),
            setRows: jest.fn(),
            editable: true
        };

        wrapper = shallow(<DataframeTable {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render without rows', () => {
        wrapper = shallow(<DataframeTable {...props} columns={[]} />);
        expect(wrapper.find(DataframeBody).prop('rows')).toStrictEqual([]);
    });

    it('should calls handleSelectAllClick prop with checked', () => {
        wrapper.find(DataframeHead).prop('handleSelectAllClick')({
            target: { checked: true }
        });
    });

    it('should calls handleSelectAllClick prop with not checked', () => {
        wrapper.find(DataframeHead).prop('handleSelectAllClick')({
            target: { checked: false }
        });
    });

    it('should calls isSelected prop', () => {
        wrapper.find(DataframeBody).prop('isSelected')('123');
    });

    it('should calls isVisibled prop', () => {
        wrapper.find(DataframeBody).prop('isVisibled')('test');
    });

    it('should calls onSelect prop', () => {
        wrapper.find(DataframeBody).prop('onSelect')('123');
        wrapper.find(DataframeBody).prop('onSelect')('1234');
        wrapper.find(DataframeBody).prop('onSelect')('1234');
        wrapper.find(DataframeBody).prop('onSelect')('1234');
        wrapper.find(DataframeBody).prop('onSelect')('123');
        wrapper.find(DataframeBody).prop('onSelect')('123');
        wrapper.find(DataframeBody).prop('onSelect')('12345');
        wrapper.find(DataframeBody).prop('onSelect')('123');
    });

    it('should calls addColumn prop', () => {
        wrapper.find(DataframeToolbar).prop('addColumn')('test3', 'String');
    });

    it('should calls addColumn prop with rename', () => {
        wrapper.find(DataframeHead).prop('onSetRename')(0);
        wrapper.find(DataframeToolbar).prop('addColumn')('test4', 'String');
    });

    it('should calls addRow prop', () => {
        wrapper.find(DataframeToolbar).prop('addRow')();
    });

    it('should calls changeField prop', () => {
        wrapper.find(DataframeBody).prop('changeField')('3', '123', 2);
    });

    it('should calls onPageChange prop', () => {
        wrapper.find(TablePagination).prop('onPageChange')({}, 1);
    });

    it('should calls onRowsPerPageChange prop', () => {
        wrapper.find(TablePagination).prop('onRowsPerPageChange')({
            target: { value: '10' }
        });
    });

    it('should calls onDeleteRows prop', () => {
        wrapper.find(DataframeBody).prop('onSelect')('123');
        wrapper.find(DataframeToolbar).prop('onDeleteRows')(12345678);
    });

    it('should calls onDeleteRows prop with not first page', () => {
        wrapper.find(TablePagination).prop('onPageChange')({}, 1);
        wrapper.find(DataframeBody).prop('onSelect')('123');
        wrapper.find(DataframeToolbar).prop('onDeleteRows')(12345678);
    });

    it('should calls onSetRename prop without index', () => {
        wrapper.find(DataframeHead).prop('onSetRename')();
    });

    it('should calls onDeleteColumn prop', () => {
        wrapper.find(DataframeHead).prop('onDeleteColumn')(1);
    });

    it('should calls handleRequestSort prop', () => {
        wrapper.find(DataframeHead).prop('handleRequestSort')(1);
    });

    it('should calls handleRequestSort prop with desc', () => {
        wrapper.find(DataframeHead).prop('handleRequestSort')(1);
        wrapper.find(DataframeHead).prop('handleRequestSort')(1);
    });
});
