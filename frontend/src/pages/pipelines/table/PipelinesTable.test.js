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
import { Grid } from '@material-ui/core';

import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import EventIcon from '@material-ui/icons/Event';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import PaletteOutlinedIcon from '@material-ui/icons/PaletteOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

import PipelinesTable from './PipelinesTable';
import PipelineTitleCell from '../cells/PipelineTitleCell';
import DividerCell from '../../../components/table/cells/divider-cell';
import PipelineStatusCell from '../cells/PipelineStatusCell';
import PipelineUtilizationCell from '../cells/PipelineUtilizationCell';
import ActionsCell from '../../../components/table/cells/action-cell';
import EnhancedTable from '../../../components/table/enhanced-table';
import DropdownFilter from '../../../components/table/dropdown-filter';
import ExportModalWindow from '../../../components/export-modal-window';
import { DRAFT, RUNNING } from '../../../mxgraph/constants';
import history from '../../../utils/history';
import { runWithValidation } from '../../../components/helpers/JobsPipelinesTable';
import HistoryPanel from '../../../components/history-panel/HistoryPanel';

jest.mock('../../../unitConfig', () => ({
    JOB: { HISTORY: true },
    PIPELINE: { HISTORY: true }
}));

jest.mock('../../../components/helpers/JobsPipelinesTable', () => ({
    runWithValidation: jest.fn(),
    joinDataNames: jest.fn()
}));

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

jest.mock('../../../utils/history', () => ({
    push: jest.fn(),
    listen: jest.fn()
}));

jest.mock('../../../routes/withPagination', () => x => x);

describe('PipelinesTable', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            ableToEdit: true,
            projectId: 'vsw-frontend',
            data: [
                {
                    cron: false,
                    finishedAt: null,
                    id: '09ce421f-e632-4b91-9437-a853bf72cda8',
                    jobsStatuses: null,
                    lastModified: '2022-06-23 08:44:40 +0000',
                    name: '1_M',
                    progress: 0,
                    runnable: true,
                    startedAt: null,
                    status: 'Draft'
                }
            ],
            remove: jest.fn(),
            confirmationWindow: jest.fn(),
            run: jest.fn(),
            stop: jest.fn(),
            copy: jest.fn(),
            lastRun: '',
            setLastRun: jest.fn(),
            setStatus: jest.fn(),
            setCurrentPage: jest.fn(),
            currentPage: 0,
            rowsPerPage: 5,
            jobs: {
                finishedAt: null,
                id: '00e10f35-4cda-43e7-8bef-070b91701ea9',
                lastModified: '2022-03-23 08:42:19 +0000',
                name: 'testTesttest',
                pipelineId: null,
                length: 0,
                runnable: true,
                startedAt: null,
                status: 'Draft',
                usage: null
            },
            params: [
                {
                    key: 'NewParam',
                    secret: true,
                    value: 'K!6Y>FQhz?K-^<<.'
                },
                {
                    key: 'db2',
                    secret: false,
                    value: 'test'
                }
            ],
            status: '',
            onCheckTags: jest.fn(),
            resetTags: jest.fn(),
            checkedTags: [['test', true]],
            getPipeline: jest.fn(),
            pipelineData: { definition: { graph: [] } }
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));
        runWithValidation.mockImplementation(() => jest.fn());

        wrapper = shallow(<PipelinesTable {...props} />);
    });

    it('should render without crashes', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render Grid', () => {
        expect(wrapper.find(Grid)).toBeDefined();
    });

    it('should render PipelineTitleCell', () => {
        expect(wrapper.find(PipelineTitleCell)).toBeDefined();
    });

    it('should render PipelineStatusCell', () => {
        expect(wrapper.find(PipelineStatusCell)).toBeDefined();
    });

    it('should render PipelineUtilizationCell', () => {
        expect(wrapper.find(PipelineUtilizationCell)).toBeDefined();
    });

    it('should render ActionCell', () => {
        expect(wrapper.find(ActionsCell)).toBeDefined();
    });

    it('should render DividerCell', () => {
        expect(wrapper.find(DividerCell)).toBeDefined();
    });

    it('should render EnhancedTable', () => {
        expect(wrapper.find(EnhancedTable)).toBeDefined();
    });

    it('should render DropdownFilter', () => {
        expect(wrapper.find(DropdownFilter)).toBeDefined();
    });

    it('should render EventIcon', () => {
        expect(wrapper.find(EventIcon)).toBeDefined();
    });

    it('should render CalendarTodayIcon', () => {
        expect(wrapper.find(CalendarTodayIcon)).toBeDefined();
    });

    it('should render PlayArrowOutlinedIcon', () => {
        expect(wrapper.find(PlayArrowOutlinedIcon)).toBeDefined();
    });

    it('should render PaletteOutlinedIcon', () => {
        expect(wrapper.find(PaletteOutlinedIcon)).toBeDefined();
    });

    it('should render DeleteOutlinedIcon', () => {
        expect(wrapper.find(DeleteOutlinedIcon)).toBeDefined();
    });

    it('should render FileCopyOutlinedIcon', () => {
        expect(wrapper.find(FileCopyOutlinedIcon)).toBeDefined();
    });

    it('should render ExportModalWindow', () => {
        expect(wrapper.find(ExportModalWindow)).toBeDefined();
    });

    it('should render EnhancedTable correct filter prop', () => {
        expect(
            wrapper.find(EnhancedTable).prop('filter').props.children
        ).toHaveLength(3);
    });

    it('should calls onClose prop in ExportModalWindow component', () => {
        wrapper
            .find(EnhancedTable)
            .prop('filter')
            .props.children.at(0)
            .props.onClose();
    });

    it('should calls onChange prop in first DropdownFilter component', () => {
        wrapper
            .find(EnhancedTable)
            .prop('filter')
            .props.children.at(1)
            .props.children.props.onChange({ target: { value: 'test' } });
        expect(props.setStatus).toBeCalledWith('test');
        expect(props.setCurrentPage).toBeCalledWith(0);
    });

    it('should calls onChange prop in second DropdownFilter component', () => {
        wrapper
            .find(EnhancedTable)
            .prop('filter')
            .props.children.at(2)
            .props.children.props.onChange({ target: { value: 'test' } });
        expect(props.setLastRun).toBeCalledWith('test');
        expect(props.setCurrentPage).toBeCalledWith(0);
    });

    it('should calls onClick for all actions in getGlobalActions', () => {
        wrapper
            .find(EnhancedTable)
            .prop('actions')
            .forEach(action => action.onClick(['testid']));
        expect(props.confirmationWindow).toBeCalled();
    });

    it('should render children', () => {
        const childrenFunc = wrapper.find(EnhancedTable).prop('children');

        const children = childrenFunc({
            item: {},
            checked: false,
            onClick: jest.fn()
        });

        expect(children.props.children.length).toBe(7);
    });

    it('should return correct actions with Play button', () => {
        const childrenFunc = wrapper.find(EnhancedTable).prop('children');

        const { children } = childrenFunc({
            item: { status: DRAFT },
            checked: false,
            onClick: jest.fn()
        }).props;

        const { actions } = children[children.length - 1].props;

        expect(actions.map(x => x.title)).toEqual([
            'pipelines:tooltip.Scheduling',
            'pipelines:tooltip.Play',
            'pipelines:tooltip.pipelineDesigner',
            'pipelines:tooltip.Copy',
            'pipelines:tooltip.History',
            'pipelines:tooltip.Remove'
        ]);

        const play = actions[1].onClick;

        play();

        expect(runWithValidation).toHaveBeenCalled();
    });

    it('should return correct actions with Stop button', () => {
        const childrenFunc = wrapper.find(EnhancedTable).prop('children');

        const { children } = childrenFunc({
            item: { status: RUNNING },
            checked: false,
            onClick: jest.fn()
        }).props;

        const { actions } = children[children.length - 1].props;

        expect(actions.map(x => x.title)).toEqual([
            'pipelines:tooltip.Scheduling',
            'pipelines:tooltip.Stop',
            'pipelines:tooltip.pipelineDesigner',
            'pipelines:tooltip.Copy',
            'pipelines:tooltip.History',
            'pipelines:tooltip.Remove'
        ]);

        const [, stop, designer, copy, , remove] = actions.map(x => x.onClick);

        stop();

        expect(props.stop).toHaveBeenCalled();

        designer();

        expect(history.push).toHaveBeenCalled();

        copy();

        expect(props.copy).toHaveBeenCalled();

        remove();

        expect(props.confirmationWindow).toHaveBeenCalled();
    });

    it('should call onClose prop', () => {
        wrapper.find(HistoryPanel).prop('onClose')();
    });
});
