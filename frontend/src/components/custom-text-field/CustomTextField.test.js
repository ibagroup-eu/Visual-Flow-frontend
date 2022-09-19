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
import { mount, shallow } from 'enzyme';
import { MenuItem, TextField } from '@material-ui/core';
import CustomTextField from './CustomTextField';

describe('CustomTextField', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            name: 'name',
            onChange: jest.fn(),
            defaultTextValue: 'defaultTextValue',
            defaultValue: 'defaultValue',
            selectValues: []
        };

        const wrapper = func(<CustomTextField {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(TextField).length).toBe(2);
    });

    it('should render select values', () => {
        const [wrapper] = init({
            selectValues: [{ key: 'key_1', value: 'value_1' }]
        });

        expect(wrapper.find(MenuItem).length).toBe(1);
    });

    it('should handle onChange with text', () => {
        const [, props] = init({}, true, mount);

        expect(props.onChange).toHaveBeenCalledWith({
            target: {
                value: props.defaultTextValue + props.defaultValue,
                name: props.name
            }
        });
    });

    it('should handle onChange not with text', () => {
        const [wrapper, props] = init({}, true);

        const target = { name: '', value: 'value' };

        wrapper
            .find(TextField)
            .at(0)
            .simulate('change', { target });

        expect(props.onChange).toHaveBeenCalledWith({
            target: {
                value: target.value,
                name: props.name
            }
        });
    });

    it('should calls useEffect with setCurrenValue', () => {
        const [wrapper] = init({ value: '213m' }, false, mount);

        expect(
            wrapper
                .find(TextField)
                .at(1)
                .prop('value')
        ).toBe('m');
    });
});
