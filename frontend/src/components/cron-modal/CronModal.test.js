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
import { CronModal } from './CronModal';
import { Button, FormControlLabel, Switch, TextField } from '@material-ui/core';
import CronPopupForm from './cron-popup-form';
import CronInput from './cron-input/CronInput';

describe('CronModal', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            cronPipeline: { pipelineId: 'pipelineId', cronExists: true },
            onClose: jest.fn(),
            projectId: 'projectId',
            cronState: {
                data: { schedule: '1 1 1 1 1', suspend: true },
                loading: false
            },
            createCronValue: jest.fn(() => Promise.resolve()),
            getCronValue: jest.fn(() => Promise.resolve()),
            updateCronValue: jest.fn(() => Promise.resolve()),
            refreshPipeline: jest.fn(() => Promise.resolve())
        };

        const wrapper = func(<CronModal {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(CronPopupForm).exists()).toBeTruthy();
    });

    it('should handle "onClose"', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(CronPopupForm).simulate('close');

        expect(props.onClose).toHaveBeenCalled();
    });

    it('should handle "close" btn', () => {
        const [wrapper, props] = init({}, true);

        const [_, closeBtn] = wrapper.find(Button).map(x => x);

        closeBtn.simulate('click');

        expect(props.onClose).toHaveBeenCalled();
    });

    it('should handle "saveCron" action when a cron exists', () => {
        const [wrapper, props] = init(
            {
                cronPipeline: { pipelineId: 'pipelineId', cronExists: true }
            },
            true
        );

        const [saveBtn, _] = wrapper.find(Button).map(x => x);

        saveBtn.simulate('click');

        expect(props.updateCronValue).toHaveBeenCalled();
        expect(props.onClose).toHaveBeenCalled();
        expect(props.createCronValue).not.toHaveBeenCalled();
    });

    it('should handle "saveCron" action when a cron does not exists', () => {
        const [wrapper, props] = init(
            {
                cronPipeline: { pipelineId: 'pipelineId', cronExists: false }
            },
            true
        );

        const [saveBtn, _] = wrapper.find(Button).map(x => x);

        saveBtn.simulate('click');

        expect(props.updateCronValue).not.toHaveBeenCalled();
        expect(props.onClose).toHaveBeenCalled();
        expect(props.createCronValue).toHaveBeenCalled();
    });

    it('should handle "pipelineId" change', () => {
        const [_, props] = init({}, true, mount);

        expect(props.getCronValue).toHaveBeenCalled();
    });

    it('should calls onChanged prop with checked', () => {
        const [wrapper] = init();
        wrapper
            .find(FormControlLabel)
            .prop('control')
            .props.onChange({
                target: { checked: true }
            });
        expect(
            wrapper.find(FormControlLabel).prop('control').props.checked
        ).toBeTruthy();
    });

    it('should handle "close" btn with mount', () => {
        const [wrapper, props] = init({}, true, mount);

        const [_, closeBtn] = wrapper.find(Button).map(x => x);

        closeBtn.simulate('click');

        expect(props.onClose).toHaveBeenCalled();
    });

    it('should handle "close" btn with mount', () => {
        const [wrapper] = init({ cronPipeline: {} }, true, mount);

        expect(wrapper.find(CronPopupForm).exists()).toBeTruthy();
    });

    it('should onChange cron with error', () => {
        const [wrapper, props] = init(
            {
                cronPipeline: { pipelineId: 'pipelineId', cronExists: false }
            },
            true
        );
        wrapper
            .find(CronInput)
            .dive()
            .find(TextField)
            .simulate('change', {
                target: { value: 'value_1' }
            });
        wrapper
            .find(FormControlLabel)
            .prop('control')
            .props.onChange({
                target: { checked: true }
            });
        const [saveBtn, _] = wrapper.find(Button).map(x => x);

        saveBtn.simulate('click');

        expect(props.updateCronValue).not.toHaveBeenCalled();
        expect(props.onClose).toHaveBeenCalled();
        expect(props.createCronValue).toHaveBeenCalled();
        expect(wrapper.find(CronPopupForm).exists()).toBeTruthy();
    });

    it('should onChange cron with error', () => {
        const [wrapper, props] = init(
            {
                cronPipeline: { pipelineId: 'pipelineId', cronExists: false }
            },
            true
        );
        wrapper
            .find(CronInput)
            .dive()
            .find(TextField)
            .simulate('change', {
                target: { value: 'value_1' }
            });
        wrapper
            .find(FormControlLabel)
            .prop('control')
            .props.onChange({
                target: { checked: true }
            });
        const [saveBtn, _] = wrapper.find(Button).map(x => x);

        saveBtn.simulate('click');

        expect(props.updateCronValue).not.toHaveBeenCalled();
        expect(props.onClose).toHaveBeenCalled();
        expect(props.createCronValue).toHaveBeenCalled();
        expect(wrapper.find(CronPopupForm).exists()).toBeTruthy();
    });
});
