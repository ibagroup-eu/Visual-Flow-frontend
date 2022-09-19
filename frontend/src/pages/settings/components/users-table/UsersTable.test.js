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

import {
    Button,
    Checkbox,
    Select,
    TableBody,
    TablePagination
} from '@material-ui/core';
import { mount, shallow } from 'enzyme';
import React from 'react';
import UsersTable from './UsersTable';
import UsersTableToolbar from './UsersTableToolbar';
import UsersTableHeader from './UsersTableHeader';

describe('UsersTable', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            users: [
                { id: '1', username: 'name1', name: 'testname2' },
                { id: '2', username: 'name2', name: 'testname1' }
            ],
            roles: ['vf-admin', 'vf-editor', 'vf-operator'],
            onSubmit: jest.fn(),
            onCancel: jest.fn(),
            newUser: false,
            editMode: true,
            handleUpdateUsers: jest.fn(),
            confirmationWindow: jest.fn()
        };

        wrapper = shallow(<UsersTable {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render TableBody', () => {
        expect(wrapper.find(TableBody)).toHaveLength(1);
    });

    it('should calls onChange prop', () => {
        wrapper
            .find(Checkbox)
            .at(0)
            .invoke('onChange')();
    });

    it('should calls handleDelete prop', () => {
        wrapper.find(UsersTableToolbar).invoke('handleDelete')();
        expect(props.confirmationWindow).toBeCalled();
    });

    it('should calls onPageChange prop', () => {
        wrapper.find(TablePagination).invoke('onPageChange')({}, 1);
    });

    it('should calls onChange prop for Select component', () => {
        wrapper
            .find(Select)
            .at(0)
            .invoke('onChange')({ target: { value: '1' } });
        expect(props.handleUpdateUsers).toBeCalled();
    });

    it('should render UsersTableToolbar with newUser prop', () => {
        wrapper = mount(<UsersTable {...props} newUser />);
        expect(wrapper.find(UsersTableToolbar).prop('newUser')).toBe(true);
    });

    it('should calls handleChangeRole prop', () => {
        wrapper.find(UsersTableToolbar).invoke('handleChangeRole')('vf-editor');
        expect(props.handleUpdateUsers).toBeCalled();
    });

    it('should calls handleChangeRole prop with newUser', () => {
        wrapper = mount(<UsersTable {...props} newUser />);
        wrapper.find(UsersTableToolbar).invoke('handleChangeRole')('vf-editor');
        expect(wrapper.find(UsersTableToolbar).prop('role')).toBe('vf-editor');
    });

    it('should calls onClick prop for Add button', () => {
        wrapper = mount(<UsersTable {...props} newUser />);
        wrapper
            .find(Button)
            .at(0)
            .invoke('onClick')();
        expect(props.onSubmit).toBeCalled();
    });

    it('should calls onClick prop for Close button', () => {
        wrapper = mount(<UsersTable {...props} newUser />);
        wrapper
            .find(Button)
            .at(1)
            .invoke('onClick')();
        expect(props.onCancel).toBeCalled();
    });

    it('should calls onRequestSort prop', () => {
        wrapper.find(UsersTableHeader).invoke('onRequestSort')();
    });

    it('should calls onRequestSort prop with name sort', () => {
        wrapper.find(UsersTableHeader).invoke('onRequestSort')({}, 'name');
    });

    it('should calls onRequestSort prop with id sort', () => {
        wrapper.find(UsersTableHeader).invoke('onRequestSort')({}, 'id');
    });

    it('should calls onSelectAllClick prop', () => {
        wrapper.find(UsersTableHeader).invoke('onSelectAllClick')({
            target: { checked: false }
        });
    });

    it('should calls onSelectAllClick prop with checked', () => {
        wrapper.find(UsersTableHeader).invoke('onSelectAllClick')({
            target: { checked: true }
        });
    });

    it('should calls handleChangeRole prop with selected user', () => {
        wrapper.find(UsersTableHeader).invoke('onSelectAllClick')({
            target: { checked: true }
        });
        wrapper.find(UsersTableToolbar).invoke('handleChangeRole')('vf-editor');
        expect(props.handleUpdateUsers).toBeCalled();
    });

    it('should calls onChange prop with uncheck latest selected user', () => {
        wrapper.find(UsersTableHeader).invoke('onSelectAllClick')({
            target: { checked: true }
        });
        wrapper
            .find(Checkbox)
            .at(1)
            .invoke('onChange')();
    });

    it('should calls onChange prop with uncheck first selected user', () => {
        wrapper.find(UsersTableHeader).invoke('onSelectAllClick')({
            target: { checked: true }
        });
        wrapper
            .find(Checkbox)
            .at(0)
            .invoke('onChange')();
    });

    it('should calls onChange prop with uncheck second selected user', () => {
        const moreUsers = [
            { id: '1', username: 'name1', name: 'testname2' },
            { id: '2', username: 'name2', name: 'testname1' },
            { id: '3', username: 'name3', name: 'testname3' }
        ];
        wrapper = shallow(<UsersTable {...props} users={moreUsers} />);
        wrapper.find(UsersTableHeader).invoke('onSelectAllClick')({
            target: { checked: true }
        });
        wrapper
            .find(Checkbox)
            .at(1)
            .invoke('onChange')();
    });

    it('should calls onRowsPerPageChange prop', () => {
        wrapper.find(TablePagination).invoke('onRowsPerPageChange')({
            target: { value: '0' }
        });
    });
});
