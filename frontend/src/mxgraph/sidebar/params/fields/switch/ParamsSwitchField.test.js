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

import { noop } from 'lodash';
import { Switch, Typography } from '@material-ui/core';

import ParamsSwitchField from './ParamsSwitchField';
import ConfirmationDialog from '../../../../side-panel/helpers/ConfirmationDialog';

describe('ParamsSwitchField', () => {
    let defaultProps;
    const init = (props = {}, returnProps = false, func = shallow) => {
        defaultProps = {
            label: 'label',
            name: 'name',
            value: undefined,
            onChange: jest.fn(),
            currentUserEmail: 'Bruce@gmail.com',
            ableToEdit: true
        };

        const wrapper = func(<ParamsSwitchField {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper, props] = init({}, true);

        expect(wrapper.find(Typography).exists()).toBeTruthy();
        expect(wrapper.find(Switch).exists()).toBeTruthy();
        expect(wrapper.find(Switch).prop('disabled')).toBe(false);
        expect(wrapper.find(Typography).text()).toBe(props.label);
    });

    it('should handle change', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(Switch).prop('onChange')({ target: { checked: true } });

        expect(props.onChange).toHaveBeenCalledWith({
            target: { name: props.name, value: true },
            persist: noop
        });
    });

    it('should support only view mode', () => {
        const [wrapper] = init({ ableToEdit: false }, true, mount);

        expect(wrapper.find(Switch).prop('disabled')).toBe(true);
    });

    it('should set default value', () => {
        const [wrapperNull] = init({ value: null });

        const [wrapperUndefined] = init({ value: undefined });

        expect(wrapperNull.find(Switch).prop('checked')).toBe(false);
        expect(wrapperUndefined.find(Switch).prop('checked')).toBe(false);
    });

    it('should set value', () => {
        const [wrapper] = init({ value: true });

        expect(wrapper.find(Switch).prop('checked')).toBeTruthy();
    });

    it('should render ConfirmationDialog', () => {
        const [wrapper] = init({ initialValue: true, showConfirmation: true });
        wrapper.find(Switch).prop('onChange')({ target: { checked: false } });

        expect(wrapper.find(ConfirmationDialog).prop('open')).toBeTruthy();

        wrapper.find(ConfirmationDialog).prop('onClose')();
        expect(wrapper.find(ConfirmationDialog).prop('open')).toBeFalsy();
    });

    it('should clear fields', () => {
        const [wrapper] = init({
            initialValue: true,
            showConfirmation: true,
            fieldsToClear: ['field1', 'field2']
        });
        wrapper.find(Switch).prop('onChange')({ target: { checked: false } });

        expect(wrapper.find(ConfirmationDialog).prop('open')).toBeTruthy();

        wrapper.find(ConfirmationDialog).prop('onConfirm')();
        expect(wrapper.find(ConfirmationDialog).prop('open')).toBeFalsy();
        expect(defaultProps.onChange).toHaveBeenCalledTimes(3);
    });
});
