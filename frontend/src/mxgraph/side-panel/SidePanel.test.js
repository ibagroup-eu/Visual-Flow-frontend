/*
 * Copyright (c) 2022 IBA Group, a.s. All rights reserved.
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
import React from 'react';
import { mount, shallow } from 'enzyme';
import { cleanUpConfiguration, SidePanel } from './SidePanel';
import { IconButton } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import StageModal from '../../components/stage-modals/stage';

describe('SidePanel', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            theme: {
                palette: { success: { light: '0000' } }
            },
            t: jest.fn(),
            confirmationWindow: jest.fn(),
            setCurrentCell: jest.fn(),
            classes: {},
            setSidePanel: jest.fn(),
            undoManagerConfig: { cell: { id: 1 } },
            setDirty: jest.fn(),
            setPanelDirty: jest.fn(),
            graph: {
                resizeCell: jest.fn(),
                setCellStyles: jest.fn(),
                model: {
                    getCell: jest.fn().mockReturnValue({ geometry: { x: 1, y: 1 } }),
                    setValue: jest.fn()
                },
                getModel: jest.fn().mockReturnValue({
                    cells: [
                        {
                            value: {
                                attributes: {
                                    attr1: {
                                        nodeName: 'value1',
                                        nodeValue: 'v2'
                                    }
                                }
                            }
                        }
                    ]
                })
            },
            data: {
                definition: { graph: {} }
            }
        };

        const wrapper = func(<SidePanel {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();
        expect(wrapper).toBeDefined();
    });

    it('storageValueHandler should update state', () => {
        const [wrapper] = init();
        const instance = wrapper.instance();
        const currentState = 'updated_value';

        wrapper.setState({ storageValue: 'value' });
        instance.storageValueHandler(currentState);
        expect(instance.state.storageValue).toEqual(currentState);
    });

    it('storageValueHandler should update state else branch', () => {
        const [wrapper] = init();
        const instance = wrapper.instance();
        const currentState = 'updated_value';

        wrapper.setState({ storageValue: 'value' });
        instance.storageValueHandler(currentState);
        expect(instance.state.storageValue).toEqual(currentState);
    });

    describe('saveCell', () => {
        const [wrapper, props] = init({}, true);
        const instance = wrapper.instance();

        it('should save cell configuration', () => {
            const configuration = {};
            jest.spyOn(instance, 'graphChanged').mockReturnValue(true);

            instance.saveCell(configuration);
            expect(props.graph.resizeCell).toHaveBeenCalled();
            expect(props.setDirty).toHaveBeenCalledWith(true);
            expect(props.setPanelDirty).toHaveBeenCalledWith(false);
            expect(props.setSidePanel).toHaveBeenCalledWith(false);
        });

        it('should set cell styles', () => {
            const configuration = { operation: 'EDGE' };

            instance.saveCell(configuration);
            expect(props.graph.setCellStyles).toHaveBeenCalled();
        });
    });

    it('should render confirmation window', () => {
        const [wrapper, props] = init({}, true);
        wrapper.setProps({ sidePanelIsDirty: true });
        wrapper.find(IconButton).simulate('click');

        expect(props.confirmationWindow).toHaveBeenCalled();
    });

    it('should close SidePanel', () => {
        const [wrapper, props] = init({}, true);
        wrapper.find(IconButton).simulate('click');

        expect(props.setSidePanel).toHaveBeenCalledWith(false);
    });

    it('should render info stage modal', () => {
        const [wrapper] = init();
        const instance = wrapper.instance();

        wrapper.find(InfoOutlinedIcon).simulate('click');
        expect(instance.state.showModal).toEqual(true);
    });

    it('should close info stage modal', () => {
        const [wrapper] = init();
        const instance = wrapper.instance();
        wrapper.find(StageModal).simulate('close');
        expect(instance.state.showModal).toEqual(false);
    });

    it('componentWillUnmount should be called on unmount', () => {
        const [wrapper, props] = init({}, true, mount);
        wrapper.unmount();
        expect(props.setSidePanel).toHaveBeenCalledWith(false);
        expect(props.setCurrentCell).toHaveBeenCalledWith('');
    });

    it('graphChanged should return true when data is changed', () => {
        const [wrapper] = init();
        const instance = wrapper.instance();
        expect(instance.graphChanged()).toBeTruthy();
    });

    describe('cleanUpConfiguration ', () => {
        it('cleanUpConfiguration should return correct configuration', () => {
            const fields = { field1: 'value1', field2: 'value2' };
            const schema = [{ field: 'field1', conditions: [{ field2: 'test' }] }];
            expect(cleanUpConfiguration(fields, schema)).toEqual({
                field2: 'value2'
            });
        });
    });
});
