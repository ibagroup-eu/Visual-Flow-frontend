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
import PageHeader from './PageHeader';
import { Button } from '@material-ui/core';
import SearchInput from '../search-input';

describe('PageHeader', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            ableToEdit: true,
            onAddClick: jest.fn(),
            onRefreshClick: jest.fn(),
            onSearch: jest.fn()
        };

        const wrapper = func(<PageHeader {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper).toBeDefined();
    });

    it('should handle "onAddClick" & "onRefreshClick"', () => {
        const [wrapper, props] = init({}, true);

        const [refreshBtn, addBtn] = wrapper.find(Button).map(x => x);

        refreshBtn.simulate('click');
        addBtn.simulate('click');

        expect(props.onRefreshClick).toHaveBeenCalled();
        expect(props.onAddClick).toHaveBeenCalled();
    });

    it('should hide the add btn', () => {
        const [wrapper] = init({ ableToEdit: false });

        expect(wrapper.find(Button).length).toBe(1);
    });

    it('should handle "onSearch"', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(SearchInput).simulate('change');

        expect(props.onSearch).toHaveBeenCalled();
    });
});
