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

import { mount, shallow } from 'enzyme';
import React from 'react';
import PopupForm from '../../../../components/popup-form';
import { PageSkeleton } from '../../../../components/skeleton';
import ModalConfirmButtons from './confirmButtons/ModalConfirmButtons';
import ConnectionsModal from './ConnectionsModal';
import ConnectionsSearchAndSelect from './searchAndSelect/ConnectionsSearchAndSelect';
import ConnectionsModalTableRow from './tableRow/ConnectionsModalTableRow';

describe('ConnectionsModal', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            ableToEdit: true,
            onClose: jest.fn(),
            onSetValue: jest.fn(),
            connections: [],
            parameters: { params: [] },
            loading: false,
            currentValue: ''
        };

        wrapper = shallow(<ConnectionsModal {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render PageSkeleton', () => {
        wrapper.setProps({ loading: true });
        expect(wrapper.find(PageSkeleton)).toHaveLength(1);
    });

    it('should calls useEffect hook with setProjectConnections', () => {
        const addProps = {
            display: true,
            connections: [
                { key: 'name', value: { connectionName: 'name', storage: 'db2' } }
            ]
        };
        wrapper = mount(<ConnectionsModal {...props} {...addProps} />);
        expect(wrapper.find(ConnectionsModalTableRow)).toHaveLength(1);
    });

    it('should calls useEffect hook with setSelectedValue, setSearchValue, setStorageSelection', () => {
        const addProps = {
            display: true,
            connections: [
                { key: 'name', value: { connectionName: 'name', storage: 'db2' } }
            ],
            currentValue: 'test'
        };
        wrapper = mount(<ConnectionsModal {...props} {...addProps} />);
        expect(wrapper.find(PopupForm).prop('display')).toBe(true);
        expect(wrapper.find(ConnectionsModalTableRow).prop('selectedValue')).toBe(
            'test'
        );
    });

    it('should calls onSetValue with currentValue', () => {
        const addProps = {
            display: true
        };
        wrapper = mount(<ConnectionsModal {...props} {...addProps} />);
        wrapper.find(ModalConfirmButtons).prop('onSetValue')('test');
        expect(props.onSetValue).toBeCalledWith('test');
    });

    it('should calls setStorageSelection with storageSelection = storage', () => {
        const addProps = {
            display: true,
            connections: [
                { key: 'name', value: { connectionName: 'name', storage: 'db2' } },
                { key: 'name2', value: { connectionName: 'name', storage: 'db2' } },
                { key: 'name3', value: { connectionName: 'name', storage: 's3' } }
            ]
        };
        wrapper = mount(<ConnectionsModal {...props} {...addProps} />);
        wrapper.find(ConnectionsSearchAndSelect).invoke('setStorageSelection')(
            'db2'
        );
        expect(wrapper.find(ConnectionsModalTableRow)).toHaveLength(2);
    });
});
