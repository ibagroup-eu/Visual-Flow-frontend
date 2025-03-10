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

import Pipelines from './Pipelines';
import PipelinesTable from './table';
import PageHeader from '../../components/page-header';
import { PageSkeleton } from '../../components/skeleton';

jest.mock('../../routes/withPagination', () => x => x);

describe('Pipelines', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        const data = [
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
                status: 'Draft',
                tags: ['tag1', 'tag2']
            },
            {
                cron: false,
                finishedAt: null,
                id: '09ce421f-e632-4b91-9437-a853bfdfdfde',
                jobsStatuses: null,
                lastModified: '2022-06-23 08:44:40 +0000',
                name: '2_X',
                progress: 0,
                runnable: true,
                startedAt: null,
                status: 'Draft',
                tags: []
            }
        ];
        props = {
            projectId: 'vsw-frontend',
            pipelines: { loading: false, data: { pipelines: data } },
            getPipelines: jest.fn(),
            setCurrentPage: jest.fn(),
            getJobs: jest.fn(),
            getParameters: jest.fn(),
            loadingExport: false,
            jobs: [],
            params: [],
            project: { demo: false, demoLimits: null }
        };

        wrapper = shallow(<Pipelines {...props} />);
    });

    it('should render without crashes', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render PipelinesTable', () => {
        expect(wrapper.find(PipelinesTable)).toBeDefined();
    });

    it('should render PageHeader', () => {
        expect(wrapper.find(PageHeader)).toBeDefined();
    });

    it('should render PageSkeleton', () => {
        wrapper.setProps({
            pipelines: { ...props.pipelines, loading: true }
        });
        expect(wrapper.find(PageSkeleton)).toHaveLength(1);
    });

    it('should calls onRefreshClick prop', () => {
        wrapper.find(PageHeader).prop('onRefreshClick')();
        expect(props.getPipelines).toBeCalledWith(props.projectId);
    });

    it('should calls onAddClick prop', () => {
        wrapper = shallow(<Pipelines {...props} />);
        wrapper.find(PageHeader).prop('onAddClick')();
    });

    it('should trigger use effect via projectId', () => {
        wrapper = mount(<Pipelines {...props} />);

        const projectId = 'newProjectId';
        wrapper.setProps({ projectId });

        expect(props.getPipelines).toHaveBeenCalledWith(projectId);
        expect(props.getJobs).toHaveBeenCalledWith(projectId);
        expect(props.getParameters).toHaveBeenCalledWith(projectId);
    });

    it('should calls useEffect without jobs', () => {
        wrapper = mount(
            <Pipelines {...props} pipelines={{ loading: false, data: {} }} />
        );
    });

    it('should calls useEffect without projectId', () => {
        wrapper = mount(<Pipelines {...props} projectId={null} />);
    });

    it('should calls resetTags prop', () => {
        wrapper = mount(<Pipelines {...props} />);
        wrapper.find(PageHeader).prop('resetTags')();
    });

    it('should calls onSearch prop', () => {
        wrapper = mount(<Pipelines {...props} />);
        wrapper.find(PageHeader).prop('onSearch')({ target: { value: '1' } });
        expect(props.setCurrentPage).toBeCalled();
    });

    it('should calls onCheckTags prop', () => {
        wrapper = mount(<Pipelines {...props} />);
        wrapper.find(PageHeader).prop('onCheckTags')({ field: true });
    });
});
