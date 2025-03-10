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
import { set } from 'lodash';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { JobsToolbar } from './JobsToolbar';
import EditDesignerButtons from '../edit-designer-buttons';
import RunStopButtons from '../run-stop-buttons';
import DebugRunButtons from '../debug-run-buttons';
import Status from '../../../components/status';
import HistoryPanel from '../../../components/history-panel/HistoryPanel';
import InteractiveModeToggle from '../interactive-mode-toggle';
import { RUN_ALL_EVENT, RUN_FAILED_EVENT } from '../../constants';
import history from '../../../utils/history';

jest.mock('../../../unitConfig', () => ({
    JOB: { HISTORY: true },
    PIPELINE: { HISTORY: true }
}));

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('JobsToolbar', () => {
    const init = (props = {}, pathname = '/jobs/project/jobId') => {
        const defaultProps = {
            graph: {},
            reversible: {},
            data: {
                definition: {},
                editable: true,
                finishedAt: null,
                lastModified: '',
                name: 'Job',
                params: {},
                runnable: true,
                startedAt: null,
                status: 'some value 1'
            },
            run: jest.fn(() => Promise.resolve()),
            stop: jest.fn(),
            runAndRefresh: jest.fn(),
            stopAndRefresh: jest.fn(),
            getStatus: jest.fn(),
            getActualJob: jest.fn(),
            storeStatus: { loading: false, status: 'some value 2', id: 'jobId' },
            update: jest.fn(),
            setSidePanel: jest.fn(),
            sidePanelIsOpen: true,
            setDirty: jest.fn(),
            setShowModal: jest.fn(),
            dirty: true,
            undoButtonsDisabling: { undo: true, redo: true },
            jobStagesData: [
                { id: '1', status: 'failed' },
                { id: '2', status: 'succeeded' }
            ],
            sendInteractiveEvent: jest.fn(),
            interactiveMode: false,
            toggleInteractiveMode: jest.fn()
        };

        set(history, 'location.pathname', pathname);

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(<JobsToolbar {...defaultProps} {...props} />);

        return [wrapper, { ...defaultProps, ...props }];
    };

    afterEach(() => useTranslation.mockClear());

    it('should render component', () => {
        const [wrapper] = init();

        expect(wrapper).toBeDefined();
        expect(wrapper.find(EditDesignerButtons)).toHaveLength(1);
        expect(wrapper.find(RunStopButtons)).toHaveLength(1);
    });

    it('should render DebugRunButtons in interactive mode', () => {
        const [wrapper] = init({ interactiveMode: true });

        expect(wrapper.find(DebugRunButtons)).toHaveLength(1);
        expect(wrapper.find(RunStopButtons)).toHaveLength(0);
    });

    it('should call updateJobHandler when save button is clicked', () => {
        const [wrapper, props] = init();
        const saveButton = wrapper.find(IconButton).at(0);
        saveButton.simulate('click');

        expect(props.update).toHaveBeenCalledTimes(1);
    });

    it('should call setShowModal when logs button is clicked', () => {
        const [wrapper, props] = init();
        const logsButton = wrapper.find(IconButton).at(1);
        logsButton.simulate('click');

        expect(props.setShowModal).toHaveBeenCalledTimes(1);
    });

    it('should call runAll on Run All button click', () => {
        const [wrapper, props] = init({ interactiveMode: true });
        wrapper.find(DebugRunButtons).prop('onRunAll')();

        expect(props.sendInteractiveEvent).toHaveBeenCalledWith(
            'project',
            'jobId',
            undefined,
            { session: undefined, command: RUN_ALL_EVENT, id: [] }
        );
    });

    it('should call handleDebug on Debug button click', () => {
        const [wrapper, props] = init({ interactiveMode: true });
        wrapper.find(DebugRunButtons).prop('onDebug')();

        expect(props.sendInteractiveEvent).toHaveBeenCalledWith(
            'project',
            'jobId',
            undefined,
            { session: undefined, command: RUN_FAILED_EVENT, id: ['1'] }
        );
    });

    it('should display correct status when current job matches id', () => {
        const [wrapper, props] = init();
        expect(wrapper.find(Status).prop('value')).toBe(props.storeStatus.status);
    });

    it('should display correct status when current job does not match id', () => {
        const [wrapper, props] = init({}, '/jobs/project/anotherJob');
        expect(wrapper.find(Status).prop('value')).toBe(props.data.status);
    });

    it('should render skeleton while loading', () => {
        const [wrapper] = init({ storeStatus: { loading: true } });
        expect(wrapper.find(Skeleton)).toHaveLength(1);
    });

    it('should not render IconButton when enableViewMode returns false', () => {
        const [wrapper] = init({ storeStatus: { status: 'pending' } });
        expect(wrapper.find(IconButton)).toHaveLength(3);
    });

    it('should call toggleInteractiveMode when InteractiveModeToggle is clicked', () => {
        const [wrapper, props] = init();
        wrapper.find(InteractiveModeToggle).prop('toggleInteractiveMode')();

        expect(props.toggleInteractiveMode).toHaveBeenCalledTimes(1);
    });

    it('should call onClose prop for HistoryPanel', () => {
        const [wrapper, props] = init();
        wrapper.find(HistoryPanel).prop('onClose')();

        expect(props.getStatus).not.toHaveBeenCalled();
    });
});
