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

import { Grid } from '@material-ui/core';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { PageSkeleton } from '../../../components/skeleton';
import Basic from './Basic';
import AddProjectForm from '../../../components/project-form';

describe('Basic', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            project: {},
            loading: true,
            getProject: jest.fn()
        };

        wrapper = shallow(<Basic {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render PageSkeleton', () => {
        expect(wrapper.find(PageSkeleton)).toHaveLength(1);
    });

    it('should render 4 Grid and AddProjectForm', () => {
        wrapper.setProps({ loading: false });
        expect(wrapper.find(Grid)).toHaveLength(4);
        expect(wrapper.find(AddProjectForm)).toHaveLength(1);
    });

    it('should calls useEffect with projectId', () => {
        wrapper = mount(<Basic {...props} />);
        wrapper.setProps({ projectId: 'newVswId' });
        expect(props.getProject).toBeCalledWith('newVswId');
    });
});
