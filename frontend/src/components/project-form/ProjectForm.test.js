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
import { ProjectForm } from './ProjectForm';
import FormWrapper from '../form-wrapper';
import history from '../../utils/history';
import { TextField } from '@material-ui/core';

jest.mock('../../utils/history', () => ({
    push: jest.fn(),
    listen: jest.fn()
}));

describe('ProjectForm', () => {
    beforeEach(() => {
        history.push.mockClear();
        history.listen.mockClear();
    });

    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            update: jest.fn(),
            create: jest.fn(),
            confirmationWindow: jest.fn()
        };

        const wrapper = func(<ProjectForm {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(FormWrapper).exists()).toBeTruthy();
    });

    it('should handle "onSubmit" when a project exists', () => {
        const [wrapper, props] = init({ project: {} }, true);

        wrapper.find(FormWrapper).simulate('submit');

        expect(props.update).toHaveBeenCalled();
    });

    it('should handle "onSubmit" when a project does not exists', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(FormWrapper).simulate('submit');

        expect(props.create).toHaveBeenCalled();
    });

    it('should handle "onCancel" when a project does not exist', () => {
        const [wrapper, _] = init({}, true);

        wrapper.find(FormWrapper).simulate('cancel');

        expect(history.push).toHaveBeenCalled();
    });

    it('should handle "onCancel" when a project does exist', () => {
        const [wrapper, props] = init({ project: {} }, true);

        wrapper.find(FormWrapper).simulate('cancel');
        expect(props.confirmationWindow).not.toHaveBeenCalled();
        expect(history.push).not.toHaveBeenCalled();
    });

    it('should show confirmation window when cancel changes', () => {
        const [wrapper, props] = init({ project: {} }, true);
        const textField = wrapper.find(TextField);
        textField.at(0).simulate('change', {
            target: { name: 'name', value: 'test' },
            persist: jest.fn()
        });
        wrapper.find(FormWrapper).simulate('cancel');
        expect(props.confirmationWindow).toBeCalled();
        expect(history.push).not.toHaveBeenCalled();
    });
});
