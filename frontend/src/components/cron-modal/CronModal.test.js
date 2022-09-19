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
import PopupForm from '../popup-form';
import { PageSkeleton } from '../skeleton';
import { Button } from '@material-ui/core';
import CronInput from './cron-input';

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

        expect(wrapper.find(PopupForm).exists()).toBeTruthy();
        expect(wrapper.find(PageSkeleton).exists()).toBeFalsy();
    });

    it('should handle "onClose"', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(PopupForm).simulate('close');

        expect(props.onClose).toHaveBeenCalled();
    });

    it('should show skeleton', () => {
        const [wrapper] = init({
            cronState: {
                data: {},
                loading: true
            }
        });

        expect(wrapper.find(PageSkeleton).exists()).toBeTruthy();
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

    it('should handle "cronChange" with incorrect value', () => {
        const [wrapper] = init();

        const target = { value: '*' };

        wrapper.find(CronInput).prop('cronChange')({ target });

        wrapper.update();

        expect(wrapper.find(CronInput).prop('cronValue')).toEqual({
            errorMessage: 'Expected 5 values, but got 1.',
            value: '*'
        });
    });

    it('should handle "cronChange" with correct value', () => {
        const [wrapper] = init();

        const target = { value: '0 * * * *' };

        wrapper.find(CronInput).prop('cronChange')({ target });

        wrapper.update();

        expect(wrapper.find(CronInput).prop('cronValue')).toEqual({
            errorMessage: '',
            value: '0 * * * *'
        });
    });

    it('should handle "pipelineId" change', () => {
        const [_, props] = init({}, true, mount);

        expect(props.getCronValue).toHaveBeenCalled();
    });
});
