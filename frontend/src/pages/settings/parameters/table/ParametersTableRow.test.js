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
import { ParametersTableRow } from './ParametersTableRow';
import { TableRow } from '@material-ui/core';

import PasswordInput from '../../../../components/password-input';
import ActionButton from '../../../../components/action-button';

describe('ParametersTableRow', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            parameter: {
                id: 'key_1',
                key: 'key_1',
                value: 'value_1',
                secret: true
            },
            classes: {},
            confirmationWindow: jest.fn(),
            handleEdit: jest.fn(),
            handleRemove: jest.fn(),
            editing: false,
            deleting: false,
            editableMode: true
        };

        const wrapper = func(<ParametersTableRow {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(TableRow).exists()).toBeTruthy();
    });

    it('should render password', () => {
        const [wrapper] = init();

        expect(wrapper.find(PasswordInput).exists()).toBeTruthy();
    });

    it('should not render password', () => {
        const [wrapper] = init({
            parameter: {
                id: 'key_1',
                key: 'key_1',
                value: 'value_1',
                secret: false
            }
        });

        expect(wrapper.find(PasswordInput).exists()).toBeFalsy();
    });

    it('should render all action buttons', () => {
        const [wrapper] = init();

        expect(wrapper.find(ActionButton).length).toBe(2);
    });

    it('should handle on delete click', () => {
        const [wrapper, props] = init({}, true);

        const [_, deleteBtn] = wrapper.find(ActionButton).map(x => x);

        deleteBtn.simulate('click');

        expect(props.confirmationWindow).toHaveBeenCalled();

        const { callback } = props.confirmationWindow.mock.calls[0][0];

        callback();

        expect(props.handleRemove).toHaveBeenCalled();
    });
});
