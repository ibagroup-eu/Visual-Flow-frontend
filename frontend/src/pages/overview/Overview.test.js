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
import connectedOverview, { Overview } from './Overview';
import configureMockStore from 'redux-mock-store';
import { Skeleton } from '@material-ui/lab';

describe('Overview', () => {
    const defaultProps = {
        projectId: 'projectId',
        overview: { data: {}, loading: false },
        getResourceUtilization: jest.fn(),
        setStatusPiplines: jest.fn(),
        setStatusJobs: jest.fn(),
        setCurrentPage: jest.fn()
    };

    const init = (props = {}) => shallow(<Overview {...defaultProps} {...props} />);

    it('should render without crash', () => {
        expect(init()).toBeDefined();
    });

    it('should call "getResourceUtilization"', () => {
        const wrapper = mount(<Overview {...defaultProps} />);

        const projectId = 'newProjectId';

        wrapper.setProps({ projectId });

        expect(defaultProps.getResourceUtilization).toBeCalledWith(projectId);
    });

    it('should show loading', () => {
        const wrapper = mount(<Overview {...defaultProps} />);

        const overview = { data: {}, loading: true };

        wrapper.setProps({ overview });

        expect(wrapper.find(Skeleton)).toBeDefined();
    });
});
