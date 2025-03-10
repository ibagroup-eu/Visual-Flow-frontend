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
import { times } from 'lodash';
import React from 'react';
import FormWrapper from '../../../components/form-wrapper';
import PropertySelect from '../../../components/property-select';
import { PageSkeleton } from '../../../components/skeleton';
import ConnectionsSearchAndSelect from '../../../mxgraph/side-panel/read-write-configuration/connections-modal/searchAndSelect/ConnectionsSearchAndSelect';
import ConnectionsPanel from './panel';
import ConnectionsTableRow from './table';
import Connections from './Connections';

describe('Connections', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            loading: true,
            getProject: jest.fn(),
            getParameters: jest.fn(),
            update: jest.fn(),
            getConnections: jest.fn(),
            create: jest.fn(),
            remove: jest.fn().mockImplementation(() => Promise.resolve()),
            ping: jest.fn(),
            connections: [
                {
                    key: 'name1',
                    value: {
                        connectionName: 'name1',
                        storage: 'storage'
                    }
                },
                {
                    key: 'name2',
                    value: {
                        connectionName: 'name2',
                        storage: 'stor'
                    }
                }
            ],
            editable: true
        };

        wrapper = shallow(<Connections {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render PageSkeleton', () => {
        expect(wrapper.find(PageSkeleton)).toHaveLength(1);
    });

    it('should render 4 Grid and FormWrapper', () => {
        wrapper.setProps({ loading: false });
        expect(wrapper.find(Grid)).toHaveLength(4);
        expect(wrapper.find(FormWrapper)).toHaveLength(1);
    });

    it('should render 6 ConnectionsTableRow and 2 Box', () => {
        const newProps = {
            connections: [],
            loading: false,
            projectId: 'newVswId'
        };
        times(8, num =>
            newProps.connections.push({
                key: `name${num}`,
                value: { connectionName: `name${num}`, storage: 'storage' }
            })
        );
        wrapper = shallow(<Connections {...props} {...newProps} />);
        expect(wrapper.find(ConnectionsTableRow)).toHaveLength(8);
        expect(wrapper.find(Box)).toHaveLength(2);
    });

    it('should calls useEffect with projectId', () => {
        wrapper = mount(<Connections {...props} />);
        wrapper.setProps({ projectId: 'newVswId' });
        expect(props.getParameters).toBeCalledWith('newVswId');
        expect(props.getConnections).toBeCalledWith('newVswId');
    });

    it('should render 1 ConnectionsTableRow', () => {
        const newProps = {
            loading: false
        };
        wrapper = shallow(<Connections {...props} {...newProps} />);
        wrapper.find(ConnectionsSearchAndSelect).invoke('setStorageSelection')(
            'storage'
        );
        expect(wrapper.find(ConnectionsTableRow)).toHaveLength(1);
    });

    it('should calls handleRemoveConnection with remove props', () => {
        const newProps = {
            loading: false,
            projectId: 'newVswId'
        };
        wrapper = shallow(<Connections {...props} {...newProps} />);
        wrapper
            .find(ConnectionsTableRow)
            .at(0)
            .invoke('handleRemoveConnection')('id1');
        expect(props.remove).toBeCalledWith('newVswId', 'id1');
    });

    it('should calls handleChange prop', () => {
        const newProps = {
            loading: false
        };
        wrapper = shallow(<Connections {...props} {...newProps} />);
        wrapper.find(PropertySelect).invoke('handleChange')({
            target: { value: 'storageTest' }
        });
    });

    it('should calls handleNewConnection with update props', () => {
        const newProps = {
            loading: false,
            projectId: 'newVswId'
        };
        wrapper = shallow(<Connections {...props} {...newProps} />);
        wrapper
            .find(ConnectionsTableRow)
            .at(0)
            .invoke('handleOpenConnection')({}, true);
        wrapper.find(ConnectionsPanel).invoke('handleNewConnection')({
            key: 'test',
            value: { connectionName: 'test' }
        });
        expect(props.update).toBeCalledWith('newVswId', {
            key: 'test',
            value: { connectionName: 'test' }
        });
    });

    it('should calls handleNewConnection with create props', () => {
        const newProps = {
            loading: false,
            projectId: 'newVswId'
        };
        wrapper = shallow(<Connections {...props} {...newProps} />);
        wrapper.find(ConnectionsPanel).invoke('handleNewConnection')({});
        expect(props.create).toBeCalledWith('newVswId', {});
    });

    it('should calls handleOpenConnection prop', () => {
        const newProps = {
            loading: false
        };
        wrapper = shallow(<Connections {...props} {...newProps} />);
        wrapper
            .find(ConnectionsTableRow)
            .at(0)
            .invoke('handleOpenConnection')({}, true);
    });

    it('should calls handleOpenConnection prop without edit mode', () => {
        const newProps = {
            loading: false
        };
        wrapper = shallow(<Connections {...props} {...newProps} />);
        wrapper
            .find(ConnectionsTableRow)
            .at(0)
            .invoke('handleOpenConnection')({}, false);
    });

    it('should calls handlePingConnection prop', () => {
        const newProps = {
            loading: false,
            projectId: 'newVswId'
        };
        wrapper = shallow(<Connections {...props} {...newProps} />);
        wrapper.find(ConnectionsPanel).invoke('handlePingConnection')('test');
        expect(props.ping).toBeCalledWith('newVswId', 'test');
    });

    it('should calls useEffect with setPanelState', () => {
        const newProps = {
            loading: false,
            projectId: 'newVswId'
        };
        wrapper = mount(<Connections {...props} {...newProps} />);
        wrapper.find(ConnectionsPanel).invoke('handleNewConnection')({
            key: 'name3',
            value: { connectionName: 'name3', storage: 'storage2' }
        });
        wrapper.setProps({
            connections: [
                {
                    key: 'name3',
                    value: { connectionName: 'name3', storage: 'storage2' }
                },
                ...props.connections
            ]
        });
    });
});
