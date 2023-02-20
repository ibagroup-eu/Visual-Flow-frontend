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

import { Select, Toolbar } from '@material-ui/core';
import { shallow } from 'enzyme';
import React from 'react';
import UsersTableToolbar from './UsersTableToolbar';

describe('UsersTableToolbar', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            numSelected: 1,
            roles: ['vf-admin', 'vf-editor', 'vf-operator'],
            handleChangeRole: jest.fn(),
            role: 'vf - editor',
            handleDelete: jest.fn(),
            newUser: false
        };

        wrapper = shallow(<UsersTableToolbar {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render Toolbar', () => {
        expect(wrapper.find(Toolbar)).toHaveLength(1);
    });

    it('should render component without loading', () => {
        wrapper.find(Select).invoke('onChange')({ target: { value: 'test' } });
        expect(props.handleChangeRole).toBeCalledWith('test');
    });
});
