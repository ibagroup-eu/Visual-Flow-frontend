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
import ParamsTextField from './ParamsTextField';
import { TextField } from '@material-ui/core';

describe('ParamsTextField', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            onChange: jest.fn(),
            adornment: 'adornment',
            ableToEdit: true,
            validate: jest.fn()
        };

        const wrapper = func(<ParamsTextField {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(TextField).exists()).toBeTruthy();
    });

    it('should handle on change', () => {
        const [wrapper, props] = init({}, true);

        const event = { target: { value: 'value' } };

        wrapper.find(TextField).simulate('change', event);

        expect(props.onChange).toHaveBeenCalledWith(event);
        expect(props.validate).toHaveBeenCalledWith('value');
    });

    it('should set an error', () => {
        const [wrapper] = init({ validate: x => x });

        expect(wrapper.find(TextField).prop('helperText')).toBeNull();

        const event = { target: { value: 'value' } };

        wrapper.find(TextField).simulate('change', event);

        wrapper.update();

        expect(wrapper.find(TextField).prop('helperText')).toBe('value');
    });

    it('should show adornment', () => {
        const [wrapper] = init();

        expect(
            wrapper.find(TextField).prop('InputProps').endAdornment
        ).not.toBeFalsy();
    });

    it('should not show adornment', () => {
        const [wrapper] = init({ adornment: false });

        expect(wrapper.find(TextField).prop('InputProps').endAdornment).toBeFalsy();
    });
});
