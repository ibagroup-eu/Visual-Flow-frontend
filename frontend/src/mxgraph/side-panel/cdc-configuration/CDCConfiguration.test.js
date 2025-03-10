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
import { shallow, mount } from 'enzyme';
import { Chip, IconButton, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { SwapVert } from '@material-ui/icons';
import CDCConfiguration from './CDCConfiguration';
import SelectField from '../../../components/select-field';

describe('CDC configuration', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            state: {
                name: 'name',
                operation: 'CDC',
                keyColumns: 'a,b,c',
                mode: 'all'
            },
            ableToEdit: true,
            onChange: jest.fn(),
            edgeLabels: { Before: 'before', After: 'after' },
            handleSwap: jest.fn()
        };

        wrapper = shallow(<CDCConfiguration {...defaultProps} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render select field', () => {
        expect(wrapper.find(SelectField)).toHaveLength(1);
    });

    it('should render Typography', () => {
        expect(wrapper.find(Typography)).toHaveLength(5);
    });

    it('should render SwapVert', () => {
        expect(wrapper.find(IconButton)).toHaveLength(1);
        expect(wrapper.find(SwapVert)).toHaveLength(1);
    });

    it('should render correct keys', () => {
        wrapper = mount(<CDCConfiguration {...defaultProps} />);
        expect(wrapper.find(Chip)).toHaveLength(3);
        expect(wrapper.find(Autocomplete).prop('value')).toStrictEqual([
            'a',
            'b',
            'c'
        ]);
    });

    it('should call onChange prop', () => {
        wrapper.find(Autocomplete).simulate('change');
        expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('should set empty value to Autocomplete', () => {
        defaultProps = {
            ...defaultProps,
            state: { ...defaultProps.state, keyColumns: undefined }
        };
        wrapper = mount(<CDCConfiguration {...defaultProps} />);
        expect(wrapper.find(Autocomplete).prop('value')).toStrictEqual([]);
    });

    it('should call handleSwap prop', () => {
        wrapper.find(IconButton).simulate('click');
        expect(defaultProps.handleSwap).toHaveBeenCalled();
    });
});
