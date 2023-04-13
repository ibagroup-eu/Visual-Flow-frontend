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

import { ParametersPanel } from './ParametersPanel';
import { Divider, IconButton, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ParametersPanelButtons from './buttons';

describe('ParametersPanel', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            classes: {},
            open: true,
            close: jest.fn(),
            save: jest.fn(),
            saving: false,
            setPanelState: jest.fn(),
            confirmationWindow: jest.fn(),
            title: 'Create',
            data: {
                id: 'key_1',
                key: 'key_1',
                value: 'value_1',
                secret: false
            },
            parameterTypes: [
                { name: 'string', value: 'string', secret: false },
                { name: 'secureString', value: 'secureString', secret: true }
            ]
        };

        const wrapper = func(<ParametersPanel {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(TextField).exists()).toBeTruthy();
        expect(wrapper.find(Autocomplete).exists()).toBeTruthy();
        expect(wrapper.find(Divider).exists()).toBeTruthy();
        expect(wrapper.find(ParametersPanelButtons).prop('disabled')).toBeTruthy();
    });

    it('should not render value section', () => {
        const [wrapper] = init({
            data: {
                id: 'key_1',
                key: 'key_1',
                value: 'value_1'
            }
        });

        expect(wrapper.find(Divider).exists()).toBeFalsy();
    });

    it('should handle close icon', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(IconButton).simulate('click');

        expect(props.close).toHaveBeenCalled();
    });

    it('should handle close icon with confirmation', () => {
        const [wrapper, props] = init({}, true);

        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({
            target: { name: 'name', value: 'value' }
        });

        wrapper.find(IconButton).simulate('click');

        wrapper.update();

        expect(props.close).not.toHaveBeenCalled();
        expect(props.confirmationWindow).toHaveBeenCalled();

        const { callback } = props.confirmationWindow.mock.calls[0][0];

        callback();

        expect(props.close).toHaveBeenCalled();
    });

    it('should handle autocomplete changes', () => {
        const [wrapper] = init();

        wrapper.find(Autocomplete).prop('onChange')('', { name: 'secureString' });

        wrapper.update();

        expect(wrapper.find(Autocomplete).prop('value')).toEqual({
            name: 'secureString',
            value: 'secureString',
            secret: true
        });
    });

    it('should handle autocomplete cancellation', () => {
        const [wrapper] = init();

        wrapper.find(Autocomplete).prop('onChange')('', undefined);

        wrapper.update();

        expect(wrapper.find(Autocomplete).prop('value')).toBeNull();
    });

    it('should generate correct option for autocomplete', () => {
        const [wrapper] = init();

        const getOptionLabel = wrapper.find(Autocomplete).prop('getOptionLabel');

        expect(getOptionLabel('Hi!')).toBe('Hi!');
        expect(getOptionLabel({ name: 'Hi!' })).toEqual('Hi!');
    });

    it('should handle on save', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(ParametersPanelButtons).prop('save')();

        expect(props.save).toHaveBeenCalled();
    });

    it('should disable save button', () => {
        const [wrapper] = init();

        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({
            target: { name: 'name', value: 'value' }
        });

        wrapper.update();

        expect(wrapper.find(ParametersPanelButtons).prop('disabled')).toBeFalsy();
    });

    it('should disable save button if there are validation errors', () => {
        const [wrapper] = init({ data: { id: '', key: '', value: '' } });

        expect(wrapper.find(ParametersPanelButtons).prop('disabled')).toBeTruthy();
    });

    it('should use effect', () => {
        init({}, false, mount);
    });
});
