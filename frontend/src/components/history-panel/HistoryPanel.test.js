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

import { Drawer, List } from '@material-ui/core';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { PageSkeleton } from '../skeleton';
import LogsModal from '../../pages/logs-modal';
import HistoryListHeader from './history-list-header/HistoryListHeader';
import HistoryDaysRow from './history-days-row/HistoryDaysRow';
import HistoryPanel from './HistoryPanel';

describe('HistoryPanel', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            setPanelState: jest.fn(),
            display: true,
            data: {
                id: 'testId',
                name: 'testName',
                pipelineId: 'pipelineId',
                status: 'Draft'
            },
            loading: false,
            historyData: [
                {
                    status: 'Succeeded',
                    startedAt: '2022-08-08 21:05:55 +0000',
                    finishedAt: '2022-08-08 21:06:34 +0000',
                    startedBy: 'testbigbigemailwithname1-gomel-iba-by',
                    id: 'testId'
                },
                {
                    status: 'Succeeded',
                    startedAt: '2022-08-17 21:05:55 +0000',
                    finishedAt: '2022-08-17 21:06:34 +0000',
                    startedBy: 'testbigbigemailwithname1-gomel-iba-by',
                    id: 'testId'
                }
            ],
            projectId: 'id',
            getJobHistory: jest.fn(),
            getPipelineHistory: jest.fn(),
            onClose: jest.fn()
        };

        wrapper = shallow(<HistoryPanel {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls useEffect', () => {
        wrapper = mount(<HistoryPanel {...props} />);
        expect(props.getJobHistory).toHaveBeenCalledWith('id', 'testId');
    });

    it('should render history drawer component', () => {
        expect(wrapper.find(HistoryListHeader)).toHaveLength(1);
        expect(wrapper.find(List)).toHaveLength(1);
    });

    it('should render PageSkeleton component', () => {
        wrapper = shallow(<HistoryPanel {...props} loading />);
        expect(wrapper.find(PageSkeleton)).toHaveLength(1);
    });

    it('should not render history drawer', () => {
        wrapper = shallow(<HistoryPanel {...props} display={false} />);
        expect(wrapper.find(Drawer).prop('open')).toBe(false);
    });

    it('should calls useEffect with type !== job && !data.definition', () => {
        wrapper = mount(<HistoryPanel {...props} type="pipeline" />);
    });

    it('should calls useEffect with display = false', () => {
        wrapper = mount(<HistoryPanel {...props} display={false} />);
    });

    it('should calls useEffect with type !== job', () => {
        wrapper = mount(<HistoryPanel {...props} type="pipeline" />);
        expect(props.getPipelineHistory).toHaveBeenCalledWith('id', 'testId');
    });

    it('should not render without historyData', () => {
        wrapper = mount(<HistoryPanel {...props} historyData={null} />);
    });

    it('should not render history list and HistoryListHeader', () => {
        wrapper = mount(<HistoryPanel {...props} historyData={[]} />);
        expect(wrapper.find(HistoryListHeader)).toHaveLength(0);
        expect(wrapper.find(List)).toHaveLength(0);
    });

    it('should calls onClose prop', () => {
        wrapper.find(LogsModal).invoke('onClose')();
    });

    it('should calls onClose prop for Drawer component', () => {
        wrapper.find(Drawer).invoke('onClose')();
    });

    it('should calls logsHandler prop', () => {
        wrapper
            .find(HistoryDaysRow)
            .at(0)
            .invoke('logsHandler')({ logId: 'logId', jobId: 'jobId' });
        expect(wrapper.find(LogsModal).prop('jobId')).toBe('jobId');
        expect(wrapper.find(LogsModal).prop('logId')).toBe('logId');
    });

    it('should calls findName prop', () => {
        wrapper = mount(<HistoryPanel {...props} />);
        wrapper
            .find(HistoryDaysRow)
            .at(0)
            .invoke('findName')('testId');
    });

    it('should calls findName prop with data.definition', () => {
        wrapper = mount(
            <HistoryPanel
                {...props}
                data={{
                    ...props.data,
                    definition: {
                        graph: [{ value: { jobId: 'id', jobName: 'name' } }]
                    }
                }}
            />
        );
        wrapper
            .find(HistoryDaysRow)
            .at(0)
            .invoke('findName')('id');
    });
});
