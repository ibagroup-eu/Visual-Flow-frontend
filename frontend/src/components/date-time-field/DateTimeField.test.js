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
import { shallow } from 'enzyme';
import { TextField } from '@material-ui/core';
import DateTimeField from '.';

describe('DateTimeField', () => {
    const init = (props = {}) => {
        const defaultProps = {
            name: 'testTimestamp',
            inputValues: {},
            ableToEdit: true
        };

        const wrapper = shallow(<DateTimeField {...defaultProps} {...props} />);

        return wrapper;
    };

    it('should render the component with correct props', () => {
        const wrapper = init();
        const textField = wrapper.find(TextField);

        expect(textField.length).toBe(1);
        expect(textField.prop('value')).toBe('');
        expect(textField.prop('disabled')).toBe(false);
    });

    it('should handle value change', () => {
        const inputValues = { testTimestamp: '2024-01-01' };
        const handleInputChange = jest.fn();
        const event = { target: { value: '2024-02-02' } };
        const wrapper = init({ inputValues, handleInputChange });
        const textField = wrapper.find(TextField);

        expect(textField.prop('value')).toBe(inputValues.testTimestamp);

        textField.simulate('change', event);

        expect(handleInputChange).toHaveBeenCalledWith(event);
    });
});
