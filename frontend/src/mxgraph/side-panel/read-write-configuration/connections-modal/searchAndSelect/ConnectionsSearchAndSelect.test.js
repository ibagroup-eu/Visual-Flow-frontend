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

import { shallow } from 'enzyme';
import React from 'react';
import SearchInput from '../../../../../components/search-input';
import DropdownFilter from '../../../../../components/table/dropdown-filter';
import ConnectionsSearchAndSelect from './ConnectionsSearchAndSelect';

describe('ConnectionsSearchAndSelect', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            searchValue: '',
            setSearchValue: jest.fn(),
            storageSelection: '',
            setStorageSelection: jest.fn(),
            connectionsLabels: [{ value: 'value', name: 'name' }]
        };

        wrapper = shallow(<ConnectionsSearchAndSelect {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should have specific placeholder for search', () => {
        expect(
            wrapper
                .find(SearchInput)
                .at(0)
                .props().placeholder
        ).toEqual('main:searchByName');
    });

    it('should calls onChange prop for SearchInput', () => {
        wrapper.find(SearchInput).prop('onChange')({ target: { value: 'test' } });
        expect(props.setSearchValue).toBeCalledWith('test');
    });

    it('should calls onChange prop for DropdownFilter', () => {
        wrapper.find(DropdownFilter).prop('onChange')({ target: { value: 'test' } });
        expect(props.setStorageSelection).toBeCalledWith('test');
    });
});
