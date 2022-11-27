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

import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { shallow } from 'enzyme';
import React from 'react';
import ValidateColumnMenu from './ValidateColumnMenu';

describe('ValidateColumnMenu', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            onSetRename: jest.fn(),
            onDeleteColumn: jest.fn(),
            editible: true,
            className: ''
        };

        wrapper = shallow(<ValidateColumnMenu {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls onClick prop for IconButton', () => {
        wrapper.find(IconButton).prop('onClick')({ currentTarget: {} });
        expect(wrapper.find(Menu).prop('open')).toBe(true);
    });

    it('should calls onClick prop for IconButton with close menu', () => {
        wrapper.find(IconButton).prop('onClick')({ currentTarget: {} });
        wrapper.find(IconButton).prop('onClick')();
        expect(wrapper.find(Menu).prop('open')).toBe(false);
    });

    it('should calls onClick prop for MenuItem rename', () => {
        wrapper.find(IconButton).prop('onClick')({ currentTarget: {} });
        wrapper
            .find(MenuItem)
            .at(0)
            .prop('onClick')();
        expect(props.onSetRename).toBeCalled();
    });

    it('should calls onClick prop for MenuItem delete', () => {
        wrapper.find(IconButton).prop('onClick')({ currentTarget: {} });
        wrapper
            .find(MenuItem)
            .at(1)
            .prop('onClick')();
        expect(props.onDeleteColumn).toBeCalled();
    });
});
