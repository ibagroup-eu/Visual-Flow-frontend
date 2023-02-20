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
import { shallow } from 'enzyme';
import { Button, FormControl, MenuItem, Select } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import LogsHeader from './LogsHeader';
import SearchInput from '../search-input';

describe('LogsHeader', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            onRefreshClick: jest.fn(),
            onSearch: jest.fn(),
            onSelect: jest.fn(),
            dropList: ['value_1', 'value_2'],
            levels: [],
            onSetAutoRefresh: jest.fn(),
            autoRefresh: true,
            autoRefreshDisabled: false
        };

        const wrapper = func(<LogsHeader {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(FormControl).exists()).toBeTruthy();
        expect(wrapper.find(MenuItem).length).toBe(2);
    });

    it('should handle "onSearch"', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(SearchInput).simulate('change');

        expect(props.onSearch).toHaveBeenCalled();
    });

    it('should handle "onSelect', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(Select).simulate('change');

        expect(props.onSelect).toHaveBeenCalled();
    });

    it('should handle "onRefreshClick"', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(Button).simulate('click');

        expect(props.onRefreshClick).toHaveBeenCalled();
    });

    it('should handle "onSetAutoRefresh"', () => {
        const [wrapper, props] = init({ autoRefresh: false }, true);

        wrapper.find(ToggleButton).simulate('change');

        expect(props.onSetAutoRefresh).toHaveBeenCalled();
    });
});
