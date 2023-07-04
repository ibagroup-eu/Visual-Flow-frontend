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
import { shallow, mount } from 'enzyme';
import { useTranslation } from 'react-i18next';
import { Chip, IconButton } from '@material-ui/core';
import JoinConfiguration from './JoinConfiguration';
import SelectField from '../../../components/select-field';
import AutocompleteParameter from '../autocomplete-parameter';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('Join configuration', () => {
    let wrapper;
    const defaultProps = {
        state: {
            leftColumns: 'col1',
            rightColumns: 'col1',
            joinType: 'inner',
            name: 'join',
            operation: 'JOIN'
        },
        ableToEdit: true,
        onChange: jest.fn(),
        edgeLabels: {
            Left: 'left',
            Right: 'right'
        },
        handleSwap: jest.fn()
    };

    beforeEach(() => {
        useTranslation.mockImplementation(() => ({ t: x => x }));
        wrapper = shallow(<JoinConfiguration {...defaultProps} />);
    });

    afterEach(() => useTranslation.mockClear());

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render SelectField', () => {
        expect(wrapper.find(SelectField)).toHaveLength(1);
    });

    it('should render no chips for 0 keys(columns)', () => {
        wrapper = mount(<JoinConfiguration {...defaultProps} />);
        wrapper.setProps({
            state: {
                joinType: 'inner',
                name: 'join',
                operation: 'JOIN'
            }
        });
        expect(wrapper.find(Chip)).toHaveLength(0);
    });

    it('should render 2 chips for 2 keys(leftColumns,rightColumns)', () => {
        wrapper = mount(<JoinConfiguration {...defaultProps} />);
        expect(wrapper.find(Chip)).toHaveLength(2);
    });

    it('should call onChange prop by SelectField', () => {
        wrapper.find(SelectField).prop('handleInputChange')();
        expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('should call onChange prop by Autocomplete', () => {
        wrapper
            .find(AutocompleteParameter)
            .at(0)
            .prop('handleInputChange')({
            target: { name: 'test', value: 'testValue' }
        });
        expect(defaultProps.onChange).toBeCalledWith('test', 'testValue');
    });

    it('should call handleSwap prop', () => {
        wrapper.find(IconButton).simulate('click');
        expect(defaultProps.handleSwap).toHaveBeenCalled();
    });
});
