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
});
