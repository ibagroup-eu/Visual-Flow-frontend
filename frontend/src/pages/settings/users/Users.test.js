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

import { Button, Grid } from '@material-ui/core';
import { Router } from 'react-router';
import { mount, shallow } from 'enzyme';
import React from 'react';
import FormWrapper from '../../../components/form-wrapper';
import { PageSkeleton } from '../../../components/skeleton';
import { synthHistory } from '../../../redux';
import Users from './Users';
import PopupForm from '../../../components/popup-form';
import SearchInput from '../../../components/search-input';
import UsersTable from './table';

describe('Users', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            getUsers: jest.fn(),
            users: [
                { id: '123', username: 'name1', name: 'testname1' },
                { id: '234', username: 'name2', name: 'testname2' }
            ],
            loadingUsers: true,
            roles: ['vf-admin', 'vf-editor', 'vf-operator'],
            loading: false,
            getRoles: jest.fn(),
            getProjectUsers: jest.fn(),
            projectUsers: { grants: { name1: 'vf-editor' } },
            loadingProjectUsers: false,
            update: jest.fn(),
            confirmationWindow: jest.fn()
        };

        wrapper = shallow(<Users {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render PageSkeleton', () => {
        wrapper = shallow(<Users {...props} loading={true} />);
        expect(wrapper.find(PageSkeleton)).toHaveLength(1);
    });

    it('should render component without loading', () => {
        wrapper = shallow(<Users {...props} loadingUsers={false} />);
        expect(wrapper.find(Grid)).toHaveLength(4);
    });

    it('should calls setEditMode prop', () => {
        const changedProps = { loadingUsers: false, projectId: 'id' };
        wrapper = mount(
            <Router history={synthHistory}>
                <Users {...props} {...changedProps} />
            </Router>
        );
        wrapper.find(FormWrapper).invoke('setEditMode')();
    });

    it('should calls onCancel prop', () => {
        const changedProps = { loadingUsers: false, projectId: 'id' };
        wrapper = shallow(<Users {...props} {...changedProps} />);
        wrapper.find(FormWrapper).invoke('onCancel')();
        expect(props.confirmationWindow).toBeCalled();
    });

    it('should calls onCancel prop with confirmationWindow', () => {
        const changedProps = {
            loadingUsers: false,
            projectId: 'id'
        };
        wrapper = mount(
            <Router history={synthHistory}>
                <Users {...props} {...changedProps} />
            </Router>
        );
        wrapper.find(FormWrapper).invoke('setEditMode')();
        wrapper.find(FormWrapper).invoke('onCancel')();
    });

    it('should calls onSubmit prop', () => {
        const changedProps = { loadingUsers: false, projectId: 'id' };
        wrapper = shallow(<Users {...props} {...changedProps} />);
        wrapper.find(FormWrapper).invoke('onSubmit')();
    });

    it('should calls onClose prop', () => {
        const changedProps = { loadingUsers: false, projectId: 'id' };
        wrapper = shallow(<Users {...props} {...changedProps} />);
        wrapper.find(PopupForm).invoke('onClose')();
    });

    it('should calls onChange prop for SearchInput in PopupForm', () => {
        const changedProps = { loadingUsers: false, projectId: 'id' };
        wrapper = shallow(<Users {...props} {...changedProps} />);
        wrapper
            .find(PopupForm)
            .props()
            .children.at(0)
            .props.onChange({ target: { value: 'testname' } });
    });

    it('should calls onChange prop for SearchInput in FormWrapper', () => {
        const changedProps = { loadingUsers: false, projectId: 'id' };
        wrapper = shallow(<Users {...props} {...changedProps} />);
        wrapper
            .find(SearchInput)
            .at(1)
            .invoke('onChange')({ target: { value: 'name1' } });
    });

    it('should find name_2 data', () => {
        props = {
            ...props,
            users: [
                { id: '123', username: 'name1', name: 'testname_1' },
                { id: '234', username: 'name2', name: 'testname_2' }
            ]
        };

        wrapper = shallow(<Users {...props} />);
        wrapper
            .find(SearchInput)
            .at(0)
            .simulate('change', { target: { value: 'name_2' } });
        const [users] = wrapper
            .find(UsersTable)
            .at(0)
            .props().users;
        expect(users.id).toBe('234');
        expect(users.username).toBe('name2');
        expect(users.name).toBe('testname_2');
    });

    it('should not find users', () => {
        props = {
            ...props,
            users: [
                { id: '123', username: 'name1', name: 'testname_1' },
                { id: '234', username: 'name2', name: 'testname_2' }
            ]
        };

        wrapper = shallow(<Users {...props} />);
        wrapper
            .find(SearchInput)
            .at(0)
            .simulate('change', { target: { value: 'name2' } });
        const [users] = wrapper
            .find(UsersTable)
            .at(0)
            .props().users;
        expect(users).toBeUndefined();
    });

    it('should calls onClick prop', () => {
        const changedProps = { loadingUsers: false, projectId: 'id' };
        wrapper = shallow(<Users {...props} {...changedProps} />);
        wrapper.find(FormWrapper).invoke('setEditMode')();
        wrapper
            .find(Button)
            .at(0)
            .invoke('onClick')();
    });

    it('should calls onCancel prop for UsersTable in PopupForm', () => {
        const changedProps = { loadingUsers: false, projectId: 'id' };
        wrapper = shallow(<Users {...props} {...changedProps} />);

        wrapper
            .find(PopupForm)
            .props()
            .children.at(1)
            .props.onCancel();
    });

    it('should calls onSubmit prop for UsersTable in PopupForm', () => {
        const changedProps = { loadingUsers: false, projectId: 'id' };
        wrapper = mount(
            <Router history={synthHistory}>
                <Users {...props} {...changedProps} />
            </Router>
        );
        wrapper.find(FormWrapper).invoke('setEditMode')();
        wrapper
            .find(PopupForm)
            .props()
            .children.at(1)
            .props.onSubmit('vf-operator', '');

        wrapper
            .find(PopupForm)
            .props()
            .children.at(1)
            .props.onSubmit('vf-editor', 'name2');
    });
});
