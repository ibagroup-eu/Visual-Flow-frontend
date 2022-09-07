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
import Select from './Select';
import { FormHelperText, MenuItem, Select as SelectMU } from '@material-ui/core';

describe('Select', () => {
    const init = props => {
        const defaultProps = {
            defaultValue: 'defaultValue',
            onChange: jest.fn(),
            values: [{ key: 'key_1', value: 'value_1' }],
            label: 'label',
            error: false,
            helperText: undefined
        };

        return [
            shallow(<Select {...defaultProps} {...props} />),
            { ...defaultProps, ...props }
        ];
    };

    it('should render without crashes', () => {
        const [wrapper, _] = init();
        expect(wrapper).toBeDefined();
    });

    it('should render all options', () => {
        const [wrapper, _] = init({
            values: [
                { key: 'key_1', value: 'value_1' },
                { key: 'key_2', value: 'value_3' }
            ]
        });

        expect(wrapper.find(MenuItem).length).toBe(2);
    });

    it('should render / not render helperText', () => {
        const testCases = [
            [undefined, 0],
            ['helperText', 1]
        ];

        testCases.forEach(([helperText, result]) => {
            const [wrapper, _] = init({ helperText });

            expect(wrapper.find(FormHelperText).length).toBe(result);
        });
    });

    it('should render helperText with a correct text', () => {
        const [wrapper, _] = init({ helperText: 'helperText' });

        expect(wrapper.find(FormHelperText).length).toBe(1);
        expect(wrapper.find(FormHelperText).text()).toBe('helperText');
    });

    it('should call "onChange" handler', () => {
        const [wrapper, { onChange }] = init({ helperText: 'helperText' });

        wrapper.find(SelectMU).simulate('change', {
            target: { value: 'value_1' }
        });

        expect(onChange).toHaveBeenCalled();
    });
});
