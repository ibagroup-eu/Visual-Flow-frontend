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

import { mount } from 'enzyme';
import React from 'react';
import { Box, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Configuration from './Configuration';
import SaveCancelButtons from '../buttons/SaveCancelButtons';
import ParametersModal from '../read-write-configuration/parameters-modal';
import { CDC, JOIN } from '../../constants';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

const FakeComponent = props => <fake {...props} />;

describe('Configuration', () => {
    const init = (props = {}, returnProps = false, func = mount) => {
        const defaultProps = {
            configuration: {},
            state: {},
            setState: jest.fn(),
            ableToEdit: true,
            isDisabled: jest.fn(),
            saveCell: jest.fn(),
            setPanelDirty: jest.fn(),
            swapEdges: jest.fn(),
            selectedStorage: jest.fn(),
            sidePanelIsOpen: true,
            graph: { getSelectionCell: jest.fn(), getIncomingEdges: jest.fn() },
            Component: FakeComponent,
            connections: []
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<Configuration {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, true, mount);
        expect(wrapper.find(Box).exists()).toBeTruthy();
        expect(wrapper.find(TextField).exists()).toBeTruthy();
    });

    it('selectedStorage func should run', () => {
        const [, props] = init(
            {
                state: {
                    operation: 'READ' || 'WRITE',
                    storage: 'test',
                    connectionName: 'test'
                }
            },
            true,
            mount
        );

        expect(props.selectedStorage).toHaveBeenCalledWith('test');
    });

    it('should set connection with key = connectionName', () => {
        init(
            {
                state: {
                    operation: 'READ' || 'WRITE',
                    storage: 'test',
                    connectionName: 'test'
                },
                connections: [{ key: test }]
            },
            true,
            mount
        );
    });

    it('should set connection with connectionName = null', () => {
        const [, props] = init(
            {
                state: {
                    operation: 'READ' || 'WRITE',
                    storage: 'test',
                    connectionName: null
                },
                connections: [{ key: test }]
            },
            true,
            mount
        );

        expect(props.setState).toHaveBeenCalled();
    });

    it('selectedStorage func should run', () => {
        const [, props] = init(
            {
                state: {
                    operation: 'DATETIME',
                    operationType: 'current_date'
                }
            },
            true,
            mount
        );

        expect(props.selectedStorage).toHaveBeenCalledWith('current_date');
    });

    it('cancelChanges func should run', () => {
        const [wrapper, props] = init({}, true, mount);

        wrapper.find(SaveCancelButtons).prop('cancelChanges')();

        expect(props.setPanelDirty).toHaveBeenCalledWith(false);
    });

    it('handleSaveCell func should run', () => {
        const [wrapper] = init(
            {
                state: {
                    operation: 'CDC'
                }
            },
            true,
            mount
        );

        wrapper.find(SaveCancelButtons).prop('saveCell')();

        wrapper.setProps({
            state: {
                operation: 'JOIN'
            }
        });

        wrapper.update();

        wrapper.find(SaveCancelButtons).prop('saveCell')();

        wrapper.setProps({
            state: {
                operation: 'test'
            }
        });

        wrapper.update();

        wrapper.find(SaveCancelButtons).prop('saveCell')();
    });

    it('should handle onChange', () => {
        const [wrapper, props] = init({ state: { name: '' } }, true);

        expect(wrapper.find(TextField).prop('value')).toBe('');

        wrapper.find(ParametersModal).prop('onChange')('name', 'value_1');

        expect(props.setState).toHaveBeenCalled();
    });

    it('should close / open a modal', () => {
        const [wrapper] = init();

        expect(wrapper.find(ParametersModal).prop('display')).toBeFalsy();

        wrapper.find(FakeComponent).prop('openModal')();

        wrapper.update();

        expect(wrapper.find(ParametersModal).prop('display')).toBeTruthy();

        wrapper.find(ParametersModal).prop('onClose')();

        wrapper.update();

        expect(wrapper.find(ParametersModal).prop('display')).toBeFalsy();
    });

    it('should handle onSetValue', () => {
        const [wrapper, props] = init({ configuration: {} }, true);

        expect(wrapper.find(FakeComponent).prop('state')).toEqual({});

        wrapper.find(ParametersModal).prop('onSetValue')('value');

        expect(props.setState).toHaveBeenCalled();
    });

    it('should handle change for the text field', () => {
        const [wrapper, props] = init(
            {
                configuration: {},
                state: { name: 'test', value: 'test' }
            },
            true
        );

        expect(wrapper.find(FakeComponent).prop('state')).toEqual({
            name: 'test',
            value: 'test'
        });

        wrapper.find(TextField).prop('onChange')({
            target: { name: 'key_1', value: 'value_1' }
        });

        expect(props.setState).toHaveBeenCalled();
    });

    it('should handle swap for the CDC stage', () => {
        const [wrapper, props] = init(
            {
                state: {
                    operation: CDC,
                    newDataset: 'newDataset',
                    oldDataset: 'oldDataset'
                }
            },
            true
        );

        wrapper.find(FakeComponent).prop('handleSwap')();

        expect(props.setState).toHaveBeenCalled();

        expect(props.swapEdges).toHaveBeenCalled();
    });

    it('should handle swap for the JOIN stage', () => {
        const [wrapper, props] = init(
            {
                state: {
                    operation: JOIN,
                    leftDataset: 'leftDataset',
                    rightDataset: 'rightDataset'
                }
            },
            true
        );

        wrapper.find(FakeComponent).prop('handleSwap')();

        expect(props.setState).toHaveBeenCalled();

        expect(props.swapEdges).toHaveBeenCalled();
    });
});
