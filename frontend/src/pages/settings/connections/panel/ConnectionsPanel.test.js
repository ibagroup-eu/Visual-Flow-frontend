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

import { Drawer, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { mount, shallow } from 'enzyme';
import React from 'react';
import AwsStorage from '../../../../mxgraph/side-panel/read-write-configuration/aws-storage';
import ParametersModal from '../../../../mxgraph/side-panel/read-write-configuration/parameters-modal';
import ConnectionsPanelButtons from './buttons';
import ConnectionsPanel from './ConnectionsPanel';

describe('ConnectionsPanel', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            panelIsOpen: true,
            setPanelState: jest.fn(),
            newConnection: { value: { storage: 's3' } },
            viewMode: false,
            confirmationWindow: jest.fn(),
            handleNewConnection: jest.fn(),
            handlePingConnection: jest.fn(),
            selectConnections: [{ value: 's3' }]
        };

        wrapper = shallow(<ConnectionsPanel {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls useEffect', () => {
        wrapper = mount(<ConnectionsPanel {...props} />);
    });

    it('should calls useEffect without newConnection', () => {
        wrapper = mount(<ConnectionsPanel {...props} newConnection={null} />);
    });

    it('should calls openModal prop', () => {
        wrapper.find(AwsStorage).invoke('openModal')('endpoint');
    });

    it('should calls handleInputChange prop', () => {
        wrapper.find(AwsStorage).invoke('handleInputChange')({
            persist: jest.fn(),
            target: { name: 'endpoint', value: 'test' }
        });
    });

    it('should calls onClose prop', () => {
        wrapper.find(ParametersModal).invoke('onClose')();
    });

    it('should calls onSetValue prop', () => {
        wrapper.find(AwsStorage).invoke('openModal')('endpoint');
        wrapper.find(ParametersModal).invoke('onSetValue')('newValue');
    });

    it('should calls onChange prop', () => {
        wrapper.find(Autocomplete).invoke('onChange')({}, 'db2');
    });

    it('should calls saveConnection prop with handleNewConnection', () => {
        wrapper = shallow(<ConnectionsPanel {...props} panelTitle="Edit" />);
        wrapper.find(ConnectionsPanelButtons).invoke('saveConnection')();
        expect(props.handleNewConnection).toBeCalledWith(props.newConnection);
    });

    it('should calls saveConnection prop with handleNewConnection', () => {
        wrapper.find(ConnectionsPanelButtons).invoke('saveConnection')();
        expect(props.handleNewConnection).toBeCalledWith(props.newConnection);
    });

    it('should calls saveIsDisabled prop without anonymousAccess', () => {
        const newProps = {
            newConnection: { value: { connectionsName: 'test', storage: 's3' } }
        };
        wrapper = shallow(<ConnectionsPanel {...props} {...newProps} />);
        expect(wrapper.find(ConnectionsPanelButtons).prop('saveIsDisabled')).toBe(
            true
        );
    });

    it('should calls saveIsDisabled prop without storage', () => {
        const newProps = {
            newConnection: { value: { connectionsName: 'test' } }
        };
        wrapper = shallow(<ConnectionsPanel {...props} {...newProps} />);
        expect(wrapper.find(ConnectionsPanelButtons).prop('saveIsDisabled')).toBe(
            true
        );
    });

    it('should calls saveIsDisabled prop with equal newConnection and connectionState', () => {
        const newProps = {
            newConnection: { value: { connectionsName: 'test', storage: 'db2' } }
        };
        wrapper = shallow(<ConnectionsPanel {...props} {...newProps} />);
        expect(wrapper.find(ConnectionsPanelButtons).prop('saveIsDisabled')).toBe(
            true
        );
    });

    it('should calls saveIsDisabled prop with not equal newConnection and connectionState', () => {
        const newProps = {
            newConnection: {
                key: 'test',
                value: {
                    connectionName: 'test',
                    storage: 's3',
                    anonymousAccess: 'true'
                }
            },
            viewMode: true
        };
        wrapper = shallow(<ConnectionsPanel {...props} {...newProps} />);
        wrapper.find(AwsStorage).invoke('handleInputChange')({
            persist: jest.fn(),
            target: { name: 'endpoint', value: 'test' }
        });
        expect(wrapper.find(ConnectionsPanelButtons).prop('saveIsDisabled')).toBe(
            true
        );
    });

    it('should calls confirmCancel prop with setPanelState', () => {
        wrapper.find(ConnectionsPanelButtons).invoke('confirmCancel')();
        expect(props.setPanelState).toBeCalledWith(false);
    });

    it('should calls confirmCancel prop with confirmationWindow', () => {
        const newProps = {
            newConnection: {
                value: {
                    connectionName: 'test',
                    storage: 's3',
                    anonymousAccess: 'true'
                }
            },
            viewMode: true
        };
        wrapper = shallow(<ConnectionsPanel {...props} {...newProps} />);
        wrapper.find(AwsStorage).invoke('handleInputChange')({
            persist: jest.fn(),
            target: { name: 'endpoint', value: 'test' }
        });
        wrapper.find(ConnectionsPanelButtons).invoke('confirmCancel')();
        expect(props.confirmationWindow).toBeCalled();
    });

    it('should calls pingConnection prop', () => {
        wrapper.find(ConnectionsPanelButtons).invoke('pingConnection')();
        expect(props.handlePingConnection).toBeCalledWith(props.newConnection);
    });

    it('should calls component with !panelIsOpen', () => {
        wrapper = shallow(<ConnectionsPanel {...props} panelIsOpen={false} />);
        expect(wrapper.find(Drawer).prop('open')).toBe(false);
    });

    it('should calls error prop for name with not allowed symbols', () => {
        wrapper = mount(
            <ConnectionsPanel
                {...props}
                newConnection={{
                    key: 'name',
                    value: { connectionName: '&', storage: 's3' }
                }}
            />
        );
        expect(
            wrapper
                .find(TextField)
                .at(0)
                .prop('error')
        ).toBe(true);
    });

    it('should calls error prop for name with nameDuplication', () => {
        wrapper = mount(
            <ConnectionsPanel
                {...props}
                newConnection={{
                    key: 'name',
                    value: { connectionName: 'name1', storage: 's3' }
                }}
                connections={[{ key: 'name1', value: { connectionName: 'name1' } }]}
            />
        );
        expect(
            wrapper
                .find(TextField)
                .at(0)
                .prop('error')
        ).toBe(true);
    });

    it('should calls error prop for name with name length > 50', () => {
        wrapper = mount(
            <ConnectionsPanel
                {...props}
                newConnection={{
                    key: 'name',
                    value: {
                        connectionName:
                            'aaaaaaaaaaaaaaaaaaaaaaaa' +
                            'aaaaaaaaaaaaaaaaaaaaaaaa' +
                            'aaaaaaaaaaaaaaaaaaaaaaaa',
                        storage: 's3'
                    }
                }}
            />
        );
        expect(
            wrapper
                .find(TextField)
                .at(0)
                .prop('error')
        ).toBe(true);
    });
});
