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
import { useTranslation } from 'react-i18next';

import InteractiveModeToggle from './InteractiveModeToggle';
import { ParamsSwitchField } from '../../sidebar/params/fields';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

jest.mock('./useFetchJobMetadata', () => jest.fn());

describe('InteractiveModeToggle', () => {
    const init = (props = {}, returnProps = false) => {
        const defaultProps = {
            interactiveMode: false,
            toggleInteractiveMode: jest.fn(),
            currentProject: 'test-project',
            currentJob: 'test-job',
            runId: 'test-run-id',
            getJobMetadata: jest.fn(),
            run: jest.fn(),
            stop: jest.fn(() => Promise.resolve()),
            deleteJobSession: jest.fn()
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(
            <InteractiveModeToggle {...defaultProps} {...props} />
        );

        return returnProps
            ? [wrapper, { ...defaultProps, ...props }]
            : [wrapper, defaultProps];
    };

    it('should render without crashing', () => {
        const [wrapper] = init();
        expect(wrapper).toBeDefined();
    });

    it('should render ParamsSwitchField', () => {
        const [wrapper] = init();
        expect(wrapper.find(ParamsSwitchField)).toHaveLength(1);
    });

    it('should call toggleInteractiveMode when interactiveMode = true', () => {
        const [wrapper, props] = init({ interactiveMode: true });
        wrapper.find(ParamsSwitchField).simulate('change');
        expect(props.toggleInteractiveMode).toHaveBeenCalledWith(false);
        expect(props.stop).toHaveBeenCalledWith('test-project', 'test-job', true);
    });

    it('should call toggleInteractiveMode when interactiveMode = true 2', () => {
        const [wrapper, props] = init({ interactiveMode: true, runId: undefined });
        wrapper.find(ParamsSwitchField).simulate('change');
        expect(props.toggleInteractiveMode).toHaveBeenCalledWith(false);
        expect(props.stop).toHaveBeenCalledWith('test-project', 'test-job', true);
        expect(props.deleteJobSession).not.toHaveBeenCalled();
    });

    it('should call toggleInteractiveMode and run on enabling interactive mode', () => {
        const [wrapper, props] = init();
        wrapper.find(ParamsSwitchField).simulate('change');
        expect(props.toggleInteractiveMode).toHaveBeenCalledWith(true);
        expect(props.run).toHaveBeenCalledWith('test-project', 'test-job', true);
    });

    it('should pass correct props to ParamsSwitchField', () => {
        const [wrapper, props] = init();
        const switchField = wrapper.find(ParamsSwitchField);
        expect(switchField.prop('value')).toBe(props.interactiveMode);
        expect(switchField.prop('onChange')).toBeDefined();
        expect(switchField.prop('label')).toBe('jobs:Interactive Mode');
    });
});
