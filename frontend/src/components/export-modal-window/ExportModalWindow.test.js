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
import { ExportModalWindow } from './ExportModalWindow';
import { Box, Button, TextField } from '@material-ui/core';
import PopupForm from '../popup-form';

describe('ExportModalWindow', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            onClose: jest.fn(),
            exportFromProject: jest.fn(),
            setExportName: jest.fn(),
            setDefault: jest.fn(),
            isPipelineModal: true,
            showModal: false,
            isFetching: false
        };

        const wrapper = func(<ExportModalWindow {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper).toBeDefined();
    });

    it('should handle "isFetching"', () => {
        global.URL.createObjectURL = jest.fn();

        const [_, props] = init({ isFetching: true }, true, mount);

        expect(props.onClose).toHaveBeenCalled();
        expect(props.setDefault).toHaveBeenCalled();
    });

    it('should handle "showModal"', () => {
        const [wrapper] = init(
            {
                showModal: true,
                isPipelineModal: false,
                display: true,
                selectedJobs: []
            },
            false,
            mount
        );

        expect(
            wrapper
                .find(PopupForm)
                .find(Box)
                .find(TextField)
                .prop('value')
        ).toBe('');
    });

    it('should handle "save"', () => {
        const [wrapper, props] = init({}, true);

        const [saveBtn, _] = wrapper.find(Button).map(x => x);

        saveBtn.simulate('click');

        expect(props.setExportName).toHaveBeenCalled();
        expect(props.exportFromProject).toHaveBeenCalled();
    });

    it('should handle "close"', () => {
        const [wrapper, props] = init({}, true);

        const [_, closeBtn] = wrapper.find(Button).map(x => x);

        closeBtn.simulate('click');

        expect(props.onClose).toHaveBeenCalled();
    });

    it('should handle "save" with selected pipelines', () => {
        const [wrapper, props] = init(
            {
                selectedPipelines: [{ id: 'someID' }, { id: 'someID2' }],
                showModal: true,
                isPipelineModal: true
            },
            true
        );

        const [saveBtn, _] = wrapper.find(Button).map(x => x);

        saveBtn.simulate('click');

        expect(props.setExportName).toHaveBeenCalled();
        expect(props.exportFromProject).toHaveBeenCalled();
    });

    it('should handle "save" with selected pipelines', () => {
        const [wrapper, props] = init(
            {
                selectedPipelines: [{ id: 'someID' }],
                showModal: true,
                display: true
            },
            true
        );

        wrapper
            .find(TextField)
            .simulate('change', { target: { name: 'export', value: 'test' } });

        expect(wrapper).toBeDefined();
    });

    it('should run useEffect', () => {
        const [wrapper, props] = init(
            {
                selectedPipelines: [{ id: 'someID' }, { id: 'someID2' }],
                tableData: [{ id: 'someID' }],
                showModal: true,
                isPipelineModal: true,
                display: true
            },
            true,
            mount
        );

        wrapper
            .find(TextField)
            .simulate('change', { target: { name: 'export', value: 'test' } });

        expect(wrapper).toBeDefined();
    });
});
