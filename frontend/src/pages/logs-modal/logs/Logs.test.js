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
import { mount, shallow } from 'enzyme';

import { Logs } from './Logs';
import LogsList from '../logs-list';
import LogsPageHeader from '../../../components/logs-page-header';
import { DATABRICKS } from '../../../mxgraph/constants';
import history from '../../../utils/history';

jest.mock('../../../utils/history', () => ({
    ...jest.requireActual('history'),
    listen: jest.fn(),
    location: {
        search: ''
    }
}));

describe('Logs', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        const data = [
            {
                timestamp: '2022-06-07 13:41:06,179',
                level: 'WARN',
                message:
                    'org.apache.hadoop.util.NativeCodeLoader - Unable t…rm... using builtin-java classes where applicable'
            },
            {
                timestamp: '2022-06-07 13:41:08,773',
                level: 'INFO',
                message:
                    'org.apache.spark.internal.Logging - Running Spark version 3.1.1'
            }
        ];
        props = {
            projId: 'vsw-frontend',
            jobId: 'fcf5055a-e138-4e65-a2f1-581580c79dd9',
            modal: false,
            pipelineId: undefined,
            nodeId: '2',
            logs: { data, loading: false },
            jobStatus: { id: 'fcf5055a-e138-4e65-a2f1-581580c79dd9' },
            jobsStatuses: { 2: 'Succeeded' }
        };

        wrapper = shallow(<Logs {...props} />);

        jest.clearAllMocks();
        history.location.search = '';
    });

    it('should render without crashes', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render LogsList', () => {
        expect(wrapper.find(LogsList)).toBeDefined();
        expect(wrapper.find(LogsList).prop('isRunning')).toBe(false);
    });

    it('should render LogsPageHeader', () => {
        expect(wrapper.find(LogsPageHeader)).toBeDefined();
    });

    it('should return default link', () => {
        const mockSearch = '?backTo=jobsTable';
        Object.defineProperty(history.location, 'search', {
            value: mockSearch,
            writable: true
        });

        expect(wrapper.find(LogsPageHeader).prop('arrowLink')).toBe(
            '/pipelines/vsw-frontend/null'
        );
    });

    it('should call "getContainerLogs" & "getJobLogs" & "getJobHistoryLogs" functions', () => {
        const defaultProps = {
            projId: 'projId',
            modal: true,
            pipelineId: 'pipelineId',
            nodeId: 'nodeId',
            logs: { data: [], loading: true },
            getContainerLogs: jest.fn(),
            getJobLogs: jest.fn(),
            getJobStatus: jest.fn(),
            getJobHistoryLogs: jest.fn(),
            getJob: jest.fn(),
            jobStatus: { id: 'fcf5055a-e138-4e65-a2f1-581580c79dd8' },
            status: 'RUNNING'
        };

        const mountedWrapper = mount(<Logs {...defaultProps} />);

        expect(mountedWrapper.find(LogsList).prop('isRunning')).toBe(false);

        // getContainerLogs should be called
        mountedWrapper.setProps({ nodeId: 'newNodeId' });

        expect(defaultProps.getContainerLogs).toHaveBeenCalledWith(
            defaultProps.projId,
            defaultProps.pipelineId,
            'newNodeId'
        );

        // getJobLogs should be called
        mountedWrapper.setProps({ nodeId: undefined, jobId: 'newJobId' });

        expect(defaultProps.getJobLogs).toHaveBeenCalledWith(
            defaultProps.projId,
            'newJobId'
        );

        // getJobHistoryLogs should be called
        mountedWrapper.setProps({ nodeId: 'newNodeId', logId: 'logId' });

        expect(defaultProps.getJobHistoryLogs).toHaveBeenCalledWith(
            defaultProps.projId,
            'newJobId',
            'logId'
        );
    });
    it('should call "getContainerLogs" for global version', () => {
        const defaultProps = {
            projId: 'projId',
            jobId: 'newJobId',
            jobName: 'newJobName',
            modal: true,
            logs: { data: [], loading: true },
            getContainerLogs: jest.fn(),
            getJobLogs: jest.fn(),
            getDatabricksJobLogs: jest.fn(),
            getJobStatus: jest.fn(),
            getJobHistoryLogs: jest.fn(),
            getJob: jest.fn(),
            jobStatus: { id: 'fcf5055a-e138-4e65-a2f1-581580c79dd8' }
        };

        const mountedWrapper = mount(<Logs {...defaultProps} />);

        mountedWrapper.setProps({
            jobId: 'newJobId'
        });

        expect(defaultProps.getJobLogs).toHaveBeenCalledWith(
            defaultProps.projId,
            defaultProps.jobId
        );
    });

    it('should call "getContainerLogs" & "getDatabricksJobLogs" & "getJobHistoryLogs" functions', () => {
        Object.defineProperty(window, 'PLATFORM', {
            value: DATABRICKS
        });
        const defaultProps = {
            projId: 'projId',
            modal: true,
            pipelineId: 'pipelineId',
            nodeId: 'nodeId',
            logs: { data: [], loading: true },
            getContainerLogs: jest.fn(),
            getJobLogs: jest.fn(),
            getDatabricksJobLogs: jest.fn(),
            getJobStatus: jest.fn(),
            getJobHistoryLogs: jest.fn(),
            getJob: jest.fn(),
            jobStatus: { id: 'fcf5055a-e138-4e65-a2f1-581580c79dd8' }
        };

        const mountedWrapper = mount(<Logs {...defaultProps} />);

        // getContainerLogs should be called
        mountedWrapper.setProps({ nodeId: 'newNodeId' });

        expect(defaultProps.getContainerLogs).toHaveBeenCalledWith(
            defaultProps.projId,
            defaultProps.pipelineId,
            'newNodeId'
        );

        // getJobLogs should be called
        mountedWrapper.setProps({
            nodeId: undefined,
            jobId: 'newJobId',
            jobName: 'jobName'
        });

        expect(defaultProps.getDatabricksJobLogs).toHaveBeenCalledWith(
            defaultProps.projId,
            defaultProps.pipelineId,
            'jobName'
        );

        // getJobHistoryLogs should be called
        mountedWrapper.setProps({ nodeId: 'newNodeId', logId: 'logId' });

        expect(defaultProps.getJobHistoryLogs).toHaveBeenCalledWith(
            defaultProps.projId,
            'newJobId',
            'logId'
        );
    });
});
