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

import Autocomplete from '@material-ui/lab/Autocomplete';
import { mount, shallow } from 'enzyme';
import React from 'react';
import AwsStorage from '../../../../mxgraph/side-panel/read-write-configuration/aws-storage';
import ParametersModal from '../../../../mxgraph/side-panel/read-write-configuration/parameters-modal';
import ConnectionsPanelButtons from '../connections-panel-buttons.js/ConnectionsPanelButtons';
import ConnectionsPanel from './ConnectionsPanel';

describe('ConnectionsPanel', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            panelIsOpen: true,
            setPanelState: jest.fn(),
            newConnection: { storage: 's3' },
            viewMode: false,
            confirmationWindow: jest.fn(),
            handleNewConnection: jest.fn(),
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

    it('should calls saveConnection prop with handleNewConnection and setPanelState', () => {
        wrapper.find(ConnectionsPanelButtons).invoke('saveConnection')();
        expect(props.handleNewConnection).toBeCalledWith(props.newConnection);
        expect(props.setPanelState).toBeCalledWith(false);
    });

    it('should calls saveIsDisabled prop without anonymousAccess', () => {
        const newProps = {
            newConnection: { storage: 's3', connectionName: 'test' }
        };
        wrapper = shallow(<ConnectionsPanel {...props} {...newProps} />);
        expect(wrapper.find(ConnectionsPanelButtons).prop('saveIsDisabled')).toBe(
            true
        );
    });

    it('should calls saveIsDisabled prop without storage', () => {
        const newProps = {
            newConnection: { connectionName: 'test' }
        };
        wrapper = shallow(<ConnectionsPanel {...props} {...newProps} />);
        expect(wrapper.find(ConnectionsPanelButtons).prop('saveIsDisabled')).toBe(
            true
        );
    });

    it('should calls saveIsDisabled prop with equal newConnection and connectionState', () => {
        const newProps = {
            newConnection: { connectionName: 'test', storage: 'db2' }
        };
        wrapper = shallow(<ConnectionsPanel {...props} {...newProps} />);
        expect(wrapper.find(ConnectionsPanelButtons).prop('saveIsDisabled')).toBe(
            true
        );
    });

    it('should calls saveIsDisabled prop with not equal newConnection and connectionState', () => {
        const newProps = {
            newConnection: {
                connectionName: 'test',
                storage: 's3',
                anonymousAccess: 'true'
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
                connectionName: 'test',
                storage: 's3',
                anonymousAccess: 'true'
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
});
