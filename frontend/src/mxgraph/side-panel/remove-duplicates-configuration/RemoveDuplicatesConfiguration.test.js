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
import Autocomplete from '@material-ui/lab/Autocomplete';

import RemoveDuplicatesConfiguration from './RemoveDuplicatesConfiguration';
import PropertyList from '../property-list';

describe('RemoveDuplicatesConfiguration', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            ableToEdit: true,
            onChange: jest.fn(),
            state: {
                orderColumns: '',
                keyColumns: ''
            }
        };

        const wrapper = func(
            <RemoveDuplicatesConfiguration {...defaultProps} {...props} />
        );

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(Autocomplete).exists()).toBeTruthy();
        expect(wrapper.find(PropertyList).exists()).toBeTruthy();
    });

    it('should handle change', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(PropertyList).simulate('change', ['a', 'b']);

        expect(props.onChange).toHaveBeenCalledWith('orderColumns', 'a,b');
    });

    it('should handle on item add', () => {
        const [wrapper, props] = init(
            {
                state: {
                    orderColumns: 'a,b,c',
                    keyColumns: ''
                }
            },
            true
        );

        wrapper.find(PropertyList).prop('onAddItem')();

        expect(props.onChange).toHaveBeenCalledWith('orderColumns', 'a,b,c,:');
    });

    it('should handle item change', () => {
        const [wrapper, props] = init(
            {
                state: {
                    orderColumns: 'a,b,c',
                    keyColumns: ''
                }
            },
            true
        );

        wrapper.find(PropertyList).prop('handleItemChange')(1, 'value');

        expect(props.onChange).toHaveBeenCalledWith('orderColumns', 'a,value,c');
    });

    it('should handle autocomplete on change', () => {
        const [wrapper, props] = init(
            {
                state: {
                    orderColumns: 'a,b,c',
                    keyColumns: ''
                }
            },
            true
        );

        wrapper.find(Autocomplete).prop('onChange')(null, ['a', 'b']);

        expect(props.onChange).toHaveBeenCalledWith('keyColumns', 'a,b');
    });

    it('should render tags', () => {
        const [wrapper] = init();

        const values = ['a', 'b'];

        const tags = wrapper.find(Autocomplete).prop('renderTags')(
            values,
            jest.fn().mockImplementation(() => ({}))
        );

        expect(tags.length).toBe(values.length);
    });

    it('should render input', () => {
        const [wrapper] = init();

        const myProp = 'myProp';

        const input = wrapper.find(Autocomplete).prop('renderInput')({
            myProp
        });

        expect(shallow(input).prop(myProp)).toBe(myProp);
    });

    it('should use default order columns when render items', () => {
        const [wrapper] = init({
            state: {
                orderColumns: undefined,
                keyColumns: ''
            }
        });

        expect(wrapper.find(PropertyList).prop('items')).toEqual([]);
    });

    it('should use default key columns when render items', () => {
        const [wrapper] = init({
            state: {
                orderColumns: '',
                keyColumns: undefined
            }
        });

        expect(wrapper.find(Autocomplete).prop('value')).toEqual([]);
    });
});
