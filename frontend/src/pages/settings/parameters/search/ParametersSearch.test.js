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

import React from 'react';
import { shallow } from 'enzyme';

import { ParametersSearch } from './ParametersSearch';
import SearchInput from '../../../../components/search-input';
import DropdownFilter from '../../../../components/table/dropdown-filter';

describe('ParametersSearch', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            classes: {},
            onFilter: jest.fn(),
            filterValue: 'filterValue',
            searchValue: 'searchValue',
            filterOptions: []
        };

        const wrapper = func(<ParametersSearch {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(SearchInput).exists()).toBeTruthy();
        expect(wrapper.find(DropdownFilter).exists()).toBeTruthy();
    });

    it('should have specific placeholder for search', () => {
        const [wrapper] = init();

        expect(
            wrapper
                .find(SearchInput)
                .at(0)
                .props().placeholder
        ).toEqual('main:searchByName');
    });

    it('should handle on search', () => {
        const [wrapper, props] = init({}, true);

        wrapper
            .find(SearchInput)
            .simulate('change', { target: { value: 'onSearch' } });

        expect(props.onFilter).toHaveBeenCalledWith(['onSearch', props.filterValue]);
    });

    it('should handle on filter', () => {
        const [wrapper, props] = init({}, true);

        wrapper
            .find(DropdownFilter)
            .simulate('change', { target: { value: 'onFilter' } });

        expect(props.onFilter).toHaveBeenCalledWith([props.searchValue, 'onFilter']);
    });
});
