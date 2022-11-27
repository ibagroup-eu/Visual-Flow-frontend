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

import { IconButton, MenuItem, TableSortLabel } from '@material-ui/core';
import { shallow } from 'enzyme';
import React from 'react';
import DataframeColumnCell from './DataframeColumnCell';

describe('DataframeColumnCell', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            name: 'test',
            index: 0,
            onSetRename: jest.fn(),
            onDelete: jest.fn(),
            order: 'asc',
            orderBy: 0,
            onRequestSort: jest.fn(),
            isVisibled: jest.fn(),
            setInvisibled: jest.fn(),
            editable: true
        };

        wrapper = shallow(<DataframeColumnCell {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render component with name length > 12', () => {
        wrapper = shallow(
            <DataframeColumnCell {...props} name="testnamewithbiglength" />
        );
    });

    it('should render component with orderBy !== index', () => {
        wrapper = shallow(<DataframeColumnCell {...props} orderBy={-1} />);
    });

    it('should calls onClick for IconButton', () => {
        wrapper.find(IconButton).prop('onClick')({
            currentTarget: {}
        });
    });

    it('should calls onClick prop for IconButton with set null', () => {
        wrapper.find(IconButton).prop('onClick')({
            currentTarget: {}
        });
        wrapper.find(IconButton).prop('onClick')();
    });

    it('should calls onClick prop for TableSortLabel', () => {
        wrapper.find(TableSortLabel).prop('onClick')();
        expect(props.onRequestSort).toBeCalledWith(0);
    });

    it('should calls onClick prop for first MenuItem', () => {
        wrapper.find(IconButton).prop('onClick')({
            currentTarget: {}
        });
        wrapper
            .find(MenuItem)
            .at(0)
            .prop('onClick')();
        expect(props.onRequestSort).toBeCalledWith(-1);
    });

    it('should calls onClick prop for second MenuItem', () => {
        wrapper.find(IconButton).prop('onClick')({
            currentTarget: {}
        });
        wrapper
            .find(MenuItem)
            .at(1)
            .prop('onClick')();
        expect(props.onSetRename).toBeCalledWith(0);
    });

    it('should calls onClick prop for third MenuItem', () => {
        wrapper.find(IconButton).prop('onClick')({
            currentTarget: {}
        });
        wrapper
            .find(MenuItem)
            .at(2)
            .prop('onClick')();
        expect(props.setInvisibled).toBeCalled();
    });

    it('should calls onClick prop for fourth MenuItem', () => {
        wrapper
            .find(MenuItem)
            .at(3)
            .prop('onClick')();
        expect(props.onDelete).toBeCalledWith(0);
    });

    // it('should calls handleSelectAllClick prop with checked', () => {
    //     wrapper.find(DataframeHead).prop('handleSelectAllClick')({
    //         target: { checked: true }
    //     });
    // });

    // it('should render without rows', () => {
    //     wrapper = shallow(<DataframeTable {...props} columns={[]} />);
    //     expect(wrapper.find(DataframeBody).prop('rows')).toStrictEqual([]);
    // });

    // it('should calls handleSelectAllClick prop with checked', () => {
    //     wrapper.find(DataframeHead).prop('handleSelectAllClick')({
    //         target: { checked: true }
    //     });
    // });

    // it('should calls handleSelectAllClick prop with not checked', () => {
    //     wrapper.find(DataframeHead).prop('handleSelectAllClick')({
    //         target: { checked: false }
    //     });
    // });

    // it('should calls isSelected prop', () => {
    //     wrapper.find(DataframeBody).prop('isSelected')('123');
    // });

    // it('should calls isVisibled prop', () => {
    //     wrapper.find(DataframeBody).prop('isVisibled')('test');
    // });

    // it('should calls onSelect prop', () => {
    //     wrapper.find(DataframeBody).prop('onSelect')('123');
    //     wrapper.find(DataframeBody).prop('onSelect')('1234');
    //     wrapper.find(DataframeBody).prop('onSelect')('1234');
    //     wrapper.find(DataframeBody).prop('onSelect')('1234');
    //     wrapper.find(DataframeBody).prop('onSelect')('123');
    //     wrapper.find(DataframeBody).prop('onSelect')('123');
    //     wrapper.find(DataframeBody).prop('onSelect')('12345');
    //     wrapper.find(DataframeBody).prop('onSelect')('123');
    // });

    // it('should calls addColumn prop', () => {
    //     wrapper.find(DataframeToolbar).prop('addColumn')('test3', 'String');
    // });

    // it('should calls addColumn prop with rename', () => {
    //     wrapper.find(DataframeHead).prop('onSetRename')(0);
    //     wrapper.find(DataframeToolbar).prop('addColumn')('test4', 'String');
    // });

    // it('should calls addRow prop', () => {
    //     wrapper.find(DataframeToolbar).prop('addRow')();
    // });

    // it('should calls changeField prop', () => {
    //     wrapper.find(DataframeBody).prop('changeField')('3', '123', 2);
    // });

    // it('should calls onPageChange prop', () => {
    //     wrapper.find(TablePagination).prop('onPageChange')({}, 1);
    // });

    // it('should calls onRowsPerPageChange prop', () => {
    //     wrapper.find(TablePagination).prop('onRowsPerPageChange')({
    //         target: { value: '10' }
    //     });
    // });

    // it('should calls onDeleteRows prop', () => {
    //     wrapper.find(DataframeBody).prop('onSelect')('123');
    //     wrapper.find(DataframeToolbar).prop('onDeleteRows')(12345678);
    // });

    // it('should calls onDeleteRows prop with not first page', () => {
    //     wrapper.find(TablePagination).prop('onPageChange')({}, 1);
    //     wrapper.find(DataframeBody).prop('onSelect')('123');
    //     wrapper.find(DataframeToolbar).prop('onDeleteRows')(12345678);
    // });

    // it('should calls onSetRename prop without index', () => {
    //     wrapper.find(DataframeHead).prop('onSetRename')();
    // });

    // it('should calls onDeleteColumn prop', () => {
    //     wrapper.find(DataframeHead).prop('onDeleteColumn')(1);
    // });

    // it('should calls handleRequestSort prop', () => {
    //     wrapper.find(DataframeHead).prop('handleRequestSort')(1);
    // });

    // it('should calls handleRequestSort prop with desc', () => {
    //     wrapper.find(DataframeHead).prop('handleRequestSort')(1);
    //     wrapper.find(DataframeHead).prop('handleRequestSort')(1);
    // });
});
