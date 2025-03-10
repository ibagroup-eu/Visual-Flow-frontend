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
import AppBar from '@material-ui/core/AppBar';
import { Button, IconButton, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { set } from 'lodash';
import { SidebarHeader } from './SidebarHeader';

import history from '../../../utils/history';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

jest.mock('../../../utils/history', () => ({
    push: jest.fn(),
    listen: jest.fn()
}));

describe('SidebarHeader', () => {
    beforeEach(() => {
        history.push.mockClear();
        history.listen.mockClear();
    });

    const init = (
        props = {},
        returnProps = false,
        pathname = '0/Designer',
        func = shallow
    ) => {
        const defaultProps = {
            data: {
                name: 'data.name'
            },
            dirty: true,
            ableToEdit: false,
            confirmationWindow: jest.fn(),
            createNewJob: jest.fn(),
            updateCurrentJob: jest.fn(),
            createNewPipeline: jest.fn(),
            updateCurrentPipeline: jest.fn(),
            setDirty: jest.fn(),
            setPanelDirty: jest.fn(),
            resetJobStatus: jest.fn(),
            resetPipelineStatus: jest.fn()
        };

        set(history, 'location.pathname', pathname);

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<SidebarHeader {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(AppBar).exists()).toBeTruthy();
        expect(wrapper.find(Button).length).toBe(1);
    });

    it('should hide all buttons', () => {
        const [wrapper] = init({ dirty: false });

        expect(wrapper.find(Button).length).toBe(0);
    });

    it('should show save button', () => {
        const [wrapper] = init({ dirty: true, ableToEdit: true });

        expect(wrapper.find(Button).length).toBe(2);
    });

    it('should show a confirmation window', () => {
        const [wrapper, props] = init({ dirty: true, ableToEdit: true }, true);

        wrapper
            .find(Button)
            .at(1)
            .simulate('click');

        expect(props.confirmationWindow).toHaveBeenCalled();

        const { callback } = props.confirmationWindow.mock.calls[0][0];

        callback();

        expect(props.setDirty).toHaveBeenCalledWith(false);
        expect(props.setPanelDirty).toHaveBeenCalledWith(false);
        expect(props.resetJobStatus).toHaveBeenCalled();
    });

    it('should show "enterJobName" validation message', () => {
        const [wrapper] = init({ data: {} }, false);

        expect(wrapper.find(Typography).text()).toBe('main:enterJobName');
    });

    it('should show "unsavedChanges.sidePanelIsDirty" validation message', () => {
        const [wrapper] = init({ sidePanelIsDirty: true }, false);

        expect(wrapper.find(Typography).text()).toBe(
            'main:unsavedChanges.sidePanelIsDirty'
        );
    });

    it('should show "unsavedChanges.paramsIsDirty" validation message', () => {
        const [wrapper] = init({ paramsIsDirty: true }, false);

        expect(wrapper.find(Typography).text()).toBe(
            'main:unsavedChanges.paramsIsDirty'
        );
    });

    it('should show "unsavedChanges" validation message', () => {
        const [wrapper] = init({ dirty: true }, false);

        expect(wrapper.find(Typography).text()).toBe(
            'main:unsavedChanges.DesignerGraphIsDirty'
        );
    });

    it('should show confirmation window when click on the logo and there are changes', () => {
        const [wrapper, props] = init({ dirty: true }, true);

        wrapper.find(IconButton).simulate('click');

        expect(props.confirmationWindow).toHaveBeenCalledTimes(1);
    });

    it('should go to last page when click on the logo and there are no changes', () => {
        const [wrapper, props] = init({ dirty: false }, true);

        wrapper.find(IconButton).simulate('click');

        expect(props.setDirty).toHaveBeenCalledWith(false);
        expect(props.setPanelDirty).toHaveBeenCalledWith(false);
        expect(props.resetJobStatus).toHaveBeenCalled();
    });

    it('should update current job', () => {
        const [wrapper, props] = init({ ableToEdit: true }, true, '0/jobs/2/job');

        wrapper
            .find(Button)
            .at(0)
            .simulate('click');

        expect(props.updateCurrentJob).toHaveBeenCalled();
    });

    it('should create a new job', () => {
        const [wrapper, props] = init({ ableToEdit: true }, true, '0/jobs/2');

        wrapper
            .find(Button)
            .at(0)
            .simulate('click');

        expect(props.createNewJob).toHaveBeenCalled();
    });

    it('should update current pipeline', () => {
        const [wrapper, props] = init(
            { ableToEdit: true },
            true,
            '0/pipelines/2/pipeline'
        );

        wrapper
            .find(Button)
            .at(0)
            .simulate('click');

        expect(props.updateCurrentPipeline).toHaveBeenCalled();
    });

    it('should create a new pipeline', () => {
        const [wrapper, props] = init({ ableToEdit: true }, true, '0/pipelines/2');

        wrapper
            .find(Button)
            .at(0)
            .simulate('click');

        expect(props.createNewPipeline).toHaveBeenCalled();
    });
});
