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
import PipelinesToolbar from './PipelinesToolbar';
import EditDesignerButtons from '../edit-designer-buttons';
import Status from '../../../components/status';
import { PENDING } from '../../constants';
import history from '../../../utils/history';
import HistoryPanel from '../../../components/history-panel/HistoryPanel';
import ControlButtons from '../control-buttons';

jest.mock('../../../unitConfig', () => ({
    JOB: { HISTORY: true },
    PIPELINE: { HISTORY: true }
}));

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('Pipelines toolbar', () => {
    const init = (props = {}, pathname = '/piplines/project/piplineId') => {
        const defaultProps = {
            graph: {},
            reversible: {},
            data: {
                definition: {
                    graph: [{ value: { operation: 'JOB', jobId: '123' } }]
                },
                editable: true,
                finishedAt: null,
                lastModified: '',
                name: 'Pipline',
                params: {},
                runnable: true,
                startedAt: null,
                status: 'some value'
            },
            run: jest.fn(() => Promise.resolve()),
            stop: jest.fn(() => Promise.resolve()),
            suspend: jest.fn(() => Promise.resolve()),
            resume: jest.fn(() => Promise.resolve()),
            create: jest.fn(),
            getActualJobs: jest.fn(),
            getActualPipeline: jest.fn(),
            confirmationWindow: jest.fn(),
            pipelineStatus: {
                loading: false,
                status: 'some value 2',
                id: 'piplineId'
            },
            update: jest.fn(),
            jobs: [],
            params: ['test'],
            setCurrentCell: jest.fn(),
            setSidePanel: jest.fn(),
            sidePanelIsOpen: true,
            setDirty: jest.fn(),
            dirty: true,
            undoButtonsDisabling: { undo: true, redo: true }
        };

        set(history, 'location.pathname', pathname);

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(<PipelinesToolbar {...defaultProps} {...props} />);

        return [wrapper, { ...defaultProps, ...props }];
    };

    afterEach(() => useTranslation.mockClear());

    it('should render component', () => {
        const [wrapper] = init();

        expect(wrapper).toBeDefined();

        expect(wrapper.find(EditDesignerButtons)).toHaveLength(1);
        expect(wrapper.find(ControlButtons)).toHaveLength(1);
    });

    it('enableViewMode func should return with false ', () => {
        const [wrapper] = init({
            data: {
                status: PENDING,
                editable: false
            }
        });
        expect(wrapper.find(EditDesignerButtons).prop('editable')).toEqual(false);
    });

    it('should correctly set changesNotSaved ', () => {
        const [wrapper] = init();
        expect(wrapper.find(ControlButtons).prop('changesNotSaved')).toEqual(true);

        wrapper.setProps({
            sidePanelIsDirty: false
        });
        expect(wrapper.find(ControlButtons).prop('changesNotSaved')).toEqual(true);

        wrapper.setProps({
            sidePanelIsDirty: false,
            dirty: false
        });
        expect(wrapper.find(ControlButtons).prop('changesNotSaved')).toEqual(true);
    });

    it('should call update prop', () => {
        const [wrapper, props] = init();
        const button = wrapper.find(IconButton).at(0);
        button.simulate('click');
        expect(props.update).toHaveBeenCalled();
    });

    it('should call create prop', () => {
        const [wrapper, props] = init({}, '');
        const button = wrapper.find(IconButton).at(0);
        button.simulate('click');
        expect(props.create).toHaveBeenCalled();
    });

    it('should call history prop', () => {
        const [wrapper] = init();
        const button = wrapper.find(IconButton).at(1);
        button.simulate('click');
    });

    it('should call run prop', () => {
        const [wrapper, props] = init({ jobs: [{ id: '123', runnable: true }] }, '');
        wrapper.find(ControlButtons).prop('run')();
        expect(props.run).toHaveBeenCalled();
    });

    it('should call stop prop', () => {
        const [wrapper, props] = init({}, '');
        wrapper.find(ControlButtons).prop('stop')();
        expect(props.stop).toHaveBeenCalled();
    });

    it('should call suspend prop', () => {
        const [wrapper, props] = init({}, '');
        wrapper.find(ControlButtons).prop('suspend')();
        expect(props.suspend).toHaveBeenCalled();
    });

    it('should call resume prop', () => {
        const [wrapper, props] = init({}, '');
        wrapper.find(ControlButtons).prop('resume')();
        expect(props.resume).toHaveBeenCalled();
    });

    it('should call getActualJobs prop', () => {
        const [wrapper, props] = init({}, '');
        wrapper.find(EditDesignerButtons).prop('refresh')();
        expect(props.getActualJobs).toHaveBeenCalled();
    });

    it('should call onClose prop', () => {
        const [wrapper] = init();
        wrapper.find(HistoryPanel).prop('onClose')();
    });

    it('should call confirmationWindow prop', () => {
        const [wrapper, props] = init(
            { jobs: [{ id: '123', runnable: false }] },
            ''
        );
        wrapper.find(ControlButtons).prop('run')();
        expect(props.confirmationWindow).toHaveBeenCalled();
    });
});
