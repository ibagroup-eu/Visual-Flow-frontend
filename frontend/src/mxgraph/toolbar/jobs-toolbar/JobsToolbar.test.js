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
import Status from '../../../components/status';
import { PENDING } from '../../constants';
import history from '../../../utils/history';
import HistoryPanel from '../../../components/history-panel/HistoryPanel';

jest.mock('../../../unitConfig', () => ({
    JOB: { HISTORY: true },
    PIPELINE: { HISTORY: true }
}));

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('Jobs toolbar', () => {
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
            getStatus: jest.fn(),
            getActualJob: jest.fn(),
            storeStatus: { loading: false, status: 'some value 2', id: 'jobId' },
            update: jest.fn(),
            setSidePanel: jest.fn(),
            sidePanelIsOpen: true,
            setDirty: jest.fn(),
            setShowModal: jest.fn(),
            dirty: true,
            undoButtonsDisabling: { undo: true, redo: true }
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

    it('should render skeleton while loading', () => {
        const [wrapper] = init({
            storeStatus: { loading: true }
        });

        expect(wrapper.find(Skeleton)).toHaveLength(1);
    });

    it('should call update action', () => {
        const [wrapper, props] = init();
        const [button] = wrapper.find(IconButton).map(b => b);
        button.simulate('click');

        expect(props.update).toHaveBeenCalled();
    });

    it('should call run action', () => {
        const [wrapper, props] = init();
        wrapper.find(RunStopButtons).prop('run')();

        expect(props.run).toHaveBeenCalledTimes(1);
    });

    it('should call stop action', () => {
        const [wrapper, props] = init();
        wrapper.find(RunStopButtons).prop('stop')();

        expect(props.stop).toHaveBeenCalledTimes(1);
    });

    it('should call setShowModal prop', () => {
        const [wrapper, props] = init();
        const [, button] = wrapper.find(IconButton).map(b => b);
        button.simulate('click');

        expect(props.setShowModal).toHaveBeenCalledTimes(1);
    });

    it('should call getStatus action', () => {
        const [wrapper, props] = init();
        wrapper.find(EditDesignerButtons).prop('refresh')();

        expect(props.getStatus).toHaveBeenCalledTimes(1);
    });

    it('should correctly set changesNotSaved', () => {
        const [wrapper] = init();
        expect(wrapper.find(RunStopButtons).prop('changesNotSaved')).toEqual(true);

        wrapper.setProps({
            sidePanelIsDirty: false
        });
        expect(wrapper.find(RunStopButtons).prop('changesNotSaved')).toEqual(true);

        wrapper.setProps({
            sidePanelIsDirty: false,
            dirty: false
        });
        expect(wrapper.find(RunStopButtons).prop('changesNotSaved')).toEqual(false);
    });

    it('should produce correct stats value when currentJob is equal to id', () => {
        const [wrapper, props] = init();

        expect(wrapper.find(Status).prop('value')).toEqual(props.storeStatus.status);
    });

    it('should produce correct stats value when currentJob is not equal to id', () => {
        const [wrapper, props] = init({}, '/jobs/project/anotherJob');

        expect(wrapper.find(Status).prop('value')).toEqual(props.data.status);
    });

    it('should not render IconButton when enableViewMode returns false', () => {
        const [wrapper] = init({
            storeStatus: { status: PENDING }
        });

        expect(wrapper.find(IconButton)).toHaveLength(2);
    });

    it('should call onClose prop', () => {
        const [wrapper] = init();
        wrapper.find(HistoryPanel).prop('onClose')();
    });
});
