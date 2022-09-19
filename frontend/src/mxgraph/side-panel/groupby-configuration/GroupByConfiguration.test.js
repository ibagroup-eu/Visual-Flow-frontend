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

import { FormControlLabel } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { shallow } from 'enzyme';
import React from 'react';
import PropertyList from '../property-list';
import GroupByConfiguration from './GroupByConfiguration';

describe('GroupByConfiguration', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            state: { name: 'testname' },
            ableToEdit: true,
            onChange: jest.fn()
        };

        wrapper = shallow(<GroupByConfiguration {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls onChange prop with dropGroupingColumns', () => {
        wrapper
            .find(FormControlLabel)
            .prop('control')
            .props.onChange({ target: { checked: true } });
        expect(props.onChange).toBeCalledWith('dropGroupingColumns', 'true');
    });

    it('should calls onChange prop with groupingColumns', () => {
        wrapper.find(Autocomplete).prop('onChange')({}, ['test']);
        expect(props.onChange).toBeCalledWith('groupingColumns', 'test');
    });

    it('should render Chip for Autocomplete', () => {
        wrapper.find(Autocomplete).prop('renderTags')(['test'], jest.fn());
    });

    it('should render TextField for Autocomplete', () => {
        wrapper.find(Autocomplete).prop('renderInput')({});
    });

    it('should calls onAddItem prop for PropertyList with groupingCriteria', () => {
        wrapper.find(PropertyList).prop('onAddItem')();
        expect(props.onChange).toBeCalledWith('groupingCriteria', ':');
    });

    it('should calls onChange prop for PropertyList with groupingCriteria', () => {
        wrapper.find(PropertyList).prop('onChange')(['test']);
        expect(props.onChange).toBeCalledWith('groupingCriteria', 'test');
    });

    it('should calls handleItemChange prop for PropertyList with groupingCriteria', () => {
        wrapper.find(PropertyList).prop('handleItemChange')(1, ['test']);
        expect(props.onChange).toBeCalledWith('groupingCriteria', 'test');
    });
});
