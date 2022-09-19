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

import { mount, shallow } from 'enzyme';
import React from 'react';

import { PropertyList } from './PropertyList';
import {
    FormControl,
    IconButton,
    Select,
    TextField,
    Tooltip
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('PropertyList', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            ableToEdit: true,
            classes: {},
            onChange: jest.fn(),
            onAddItem: jest.fn(),
            handleItemChange: jest.fn(),
            items: ['c_1:agg_1', 'c_2:agg_2'],
            options: [{ value: 'v_1', label: 'l_1' }]
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<PropertyList {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper, props] = init({}, true);

        expect(wrapper.find(FormControl).length).toBe(props.items.length);
    });

    it('should handle remove', () => {
        const [wrapper, props] = init({}, true);

        expect(wrapper.find(FormControl).length).toBe(props.items.length);

        wrapper
            .find(Tooltip)
            .map(x => x)
            .filter(x => x.prop('title') === 'main:tooltip.Delete')[0]
            .find(IconButton)
            .simulate('click');

        expect(props.onChange.mock.calls[0][0]).toEqual(['c_2:agg_2']);
    });

    it('should handle move down', () => {
        const [wrapper, props] = init({}, true);

        expect(wrapper.find(FormControl).length).toBe(props.items.length);

        wrapper
            .find(Tooltip)
            .map(x => x)
            .filter(x => x.prop('title') === 'main:tooltip.MoveDown')[0]
            .find(IconButton)
            .simulate('click');

        expect(props.onChange.mock.calls[0][0]).toEqual(['c_2:agg_2', 'c_1:agg_1']);
    });

    it('should handle move up', () => {
        const [wrapper, props] = init({}, true);

        expect(wrapper.find(FormControl).length).toBe(props.items.length);

        wrapper
            .find(Tooltip)
            .map(x => x)
            .filter(x => x.prop('title') === 'main:tooltip.MoveUp')[0]
            .find(IconButton)
            .simulate('click');

        expect(props.onChange.mock.calls[0][0]).toEqual(['c_2:agg_2', 'c_1:agg_1']);
    });

    it('should handle item change via text field', () => {
        const [wrapper, props] = init({}, true);

        wrapper
            .find(TextField)
            .at(0)
            .simulate('change', { target: { value: 'value' } });

        expect(props.handleItemChange);
    });

    it('should handle item change via select', () => {
        const [wrapper, props] = init({}, true);

        wrapper
            .find(Select)
            .at(0)
            .simulate('change', { target: { value: 'value' } });

        expect(props.handleItemChange);
    });

    it('should call use effect', () => {
        const [_, props] = init(
            { items: ['col_1:', 'col_2:'], defaultValue: 'default' },
            true,
            mount
        );

        expect(props.handleItemChange.mock.calls).toEqual([
            [0, 'col_1:default'],
            [1, 'col_2:default']
        ]);
    });

    it('should add item', () => {
        const [wrapper, props] = init({}, true);

        wrapper
            .find(Tooltip)
            .map(x => x)
            .filter(x => x.prop('title') === 'main:tooltip.Add')[0]
            .find(IconButton)
            .simulate('click');

        expect(props.onAddItem).toHaveBeenCalled();
    });
});
