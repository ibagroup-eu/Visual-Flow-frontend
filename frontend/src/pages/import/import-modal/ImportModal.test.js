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
import { shallow, mount } from 'enzyme';
import { Button, TablePagination, Checkbox, Grid } from '@material-ui/core';
import ImportModal from './ImportModal';
import PopupForm from '../../../components/popup-form';

describe('Import modal', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            display: true,
            title: 'modal',
            jobs: [
                { kind: 'ConfigMap', metadata: { name: 'job1' } },
                { kind: 'WorkflowTemplate', metadata: { name: 'job2' } },
                { kind: 'default', metadata: { name: 'job3' } }
            ],
            pipelines: [{ kind: 'WorkflowTemplate', metadata: { name: 'pipe1' } }],
            onClose: jest.fn(),
            importResources: jest.fn(),
            t: jest.fn(),
            existedList: [{ id: 'pipe1' }],
            confirmationWindow: jest.fn()
        };

        wrapper = shallow(<ImportModal {...defaultProps} />).dive();
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render PopupForm', () => {
        expect(wrapper.find(PopupForm).length).toBe(1);
    });

    it('should render TablePagination', () => {
        expect(wrapper.find(TablePagination).length).toBe(1);
    });

    it('should render 2 buttons', () => {
        expect(wrapper.find(Button).length).toBe(2);
    });

    it('should close modal', () => {
        wrapper.find(PopupForm).simulate('close');
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should close modal when clicking the cancel button', () => {
        const [_, cancelButton] = wrapper.find(Button).map(button => button);
        cancelButton.simulate('click');
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should close modal when clicking the import button', () => {
        const [importButton] = wrapper.find(Button).map(button => button);
        importButton.simulate('click');
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should call importResources prop', () => {
        const [importButton] = wrapper.find(Button).map(button => button);
        importButton.simulate('click');
        expect(defaultProps.importResources).toHaveBeenCalled();
    });

    it('should call setPage', () => {
        const useStateSpy = jest.spyOn(React, 'useState');
        wrapper.find(TablePagination).simulate('pageChange');
        expect(useStateSpy).toHaveBeenCalled();
    });

    it('should select and unselect all items', () => {
        const useStateSpy = jest.spyOn(React, 'useState');
        const [cb] = wrapper.find(Checkbox).map(cb => cb);

        cb.simulate('change', { target: { checked: true } });
        expect(useStateSpy).toHaveBeenCalled();

        cb.simulate('change', { target: { checked: false } });
        expect(useStateSpy).toHaveBeenCalledWith([]);
    });

    it('should call useEffect', () => {
        const useEffectSpy = jest.spyOn(React, 'useEffect');
        const newJobs = [{ kind: 'newJob', metadata: { name: 'newJob' } }];
        wrapper = mount(<ImportModal {...defaultProps} />);
        wrapper.setProps({ jobs: newJobs });
        expect(useEffectSpy).toHaveBeenCalled();
    });

    it('should call handleSelect', () => {
        const useStateSpy = jest.spyOn(React, 'useState');
        wrapper = mount(<ImportModal {...defaultProps} />);
        const [_, __, ___, grid] = wrapper.find(Grid).map(cb => cb);
        grid.simulate('click');
        expect(useStateSpy).toHaveBeenCalled();
    });

    it('should call handleSelect twice and undo selecting', () => {
        const useStateSpy = jest.spyOn(React, 'useState');
        wrapper = mount(<ImportModal {...defaultProps} />);
        const [_, __, ___, grid] = wrapper.find(Grid).map(cb => cb);
        grid.simulate('click');
        grid.simulate('click');
        expect(useStateSpy).toHaveBeenCalled();
    });

    it('should show confirmation window', () => {
        wrapper = mount(<ImportModal {...defaultProps} />);
        const [importButton] = wrapper.find(Button).map(button => button);
        importButton.simulate('click');
        expect(defaultProps.confirmationWindow).toHaveBeenCalled();
    });
});
