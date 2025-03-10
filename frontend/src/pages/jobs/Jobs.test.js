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

import { Box, Grid } from '@material-ui/core';
import { mount, shallow } from 'enzyme';
import React from 'react';
import PageHeader from '../../components/page-header';
import { PageSkeleton } from '../../components/skeleton';
import Jobs from './Jobs';

jest.mock('../../routes/withPagination', () => x => x);

describe('Jobs', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            jobs: {
                loading: false,
                data: {
                    jobs: [
                        { name: 'field', tags: ['tag1'] },
                        { name: 'field2', tags: ['tag2'] }
                    ]
                }
            },
            pipelines: { data: { pipelines: [] } },
            getJobs: jest.fn(),
            getPipelines: jest.fn(),
            setCurrentPage: jest.fn(),
            setSearchField: jest.fn(),
            searchField: 'field',
            loadingExport: false,
            project: { demo: false, demoLimits: null }
        };

        // withPagination.mockImplementation(x => x);

        wrapper = shallow(<Jobs {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render PageSkeleton', () => {
        wrapper.setProps({
            jobs: { ...props.jobs, loading: true }
        });
        expect(wrapper.find(PageSkeleton)).toHaveLength(1);
    });

    it('should render Box with 3 Grid, PageHeader', () => {
        expect(wrapper.find(Box)).toHaveLength(1);
        expect(wrapper.find(Grid)).toHaveLength(3);
        expect(wrapper.find(PageHeader)).toHaveLength(1);
    });

    it('should calls onSearch prop', () => {
        wrapper.find(PageHeader).prop('onSearch')({ target: { value: 'test' } });
        expect(props.setSearchField).toBeCalledWith('test');
    });

    it('should calls onRefreshClick prop', () => {
        wrapper.find(PageHeader).prop('onRefreshClick')();
        expect(props.getJobs).toBeCalledWith(props.projectId);
    });

    it('should calls onAddClick prop', () => {
        wrapper.find(PageHeader).prop('onAddClick')();
    });

    it('should calls useEffect hook with setCurrentPage', () => {
        wrapper = mount(<Jobs {...props} />);
        expect(props.setCurrentPage).toBeCalledWith(0);
    });

    it('should calls getJobs and getPipelines if have projectId', () => {
        const projectId = 'id';
        wrapper = mount(<Jobs {...props} />);
        wrapper.setProps({ projectId });
        expect(props.getJobs).toBeCalledWith(projectId);
        expect(props.getPipelines).toBeCalledWith(projectId);
    });

    it('should calls useEffect without jobs', () => {
        wrapper = mount(<Jobs {...props} jobs={{ loading: false, data: {} }} />);
    });

    it('should calls resetTags prop', () => {
        wrapper = mount(<Jobs {...props} />);
        wrapper.find(PageHeader).prop('resetTags')();
    });

    it('should calls onCheckTags prop', () => {
        wrapper = mount(<Jobs {...props} />);
        wrapper.find(PageHeader).prop('onCheckTags')({ tag1: true });
    });
});
