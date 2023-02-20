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
import { Select, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PropertyListWrapper } from './PropertyListWrapper';

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
            items: ['c_1:agg_1'],
            options: [{ value: 'v_1', label: 'l_1' }]
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<PropertyList {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);

        expect(wrapper.find(PropertyListWrapper)).toBeTruthy();
    });

    it('should handle item change via text field', () => {
        const [wrapper, props] = init({}, true, mount);

        wrapper.find(TextField).prop('onChange')({ target: { value: 'value' } });

        expect(props.handleItemChange).toHaveBeenCalled();
    });

    it('should handle item change via select', () => {
        const [wrapper, props] = init({}, true, mount);

        wrapper.find(Select).prop('onChange')({ target: { value: 'value' } });

        expect(props.handleItemChange).toHaveBeenCalled();
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
});
