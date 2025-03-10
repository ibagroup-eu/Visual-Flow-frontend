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

import { shallow } from 'enzyme';
import React, { Component } from 'react';
import ConfigurationWrapper from './ConfigurationWrapper';
import SaveCancelButtons from '../../buttons/SaveCancelButtons';
import { isFunction } from 'lodash';

describe('ConfigurationWrapper', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            configuration: {},
            state: { name: 'test' },
            setState: jest
                .fn()
                .mockImplementation(fn => (isFunction(fn) ? fn(props.state) : null)),
            ableToEdit: true,
            isDisabled: jest.fn(),
            onSave: jest.fn(),
            setPanelDirty: jest.fn(),
            sidePanelIsOpen: true,
            graph: {
                getSelectionCell: jest.fn(() => ({ id: 0 })),
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
            render: Component
        };

        wrapper = shallow(<ConfigurationWrapper {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should change state', () => {
        wrapper.find(Component).prop('onStateChange')('key', 'value');
        expect(props.setState).toHaveBeenCalled();
    });

    it('should cancel changes', () => {
        wrapper.find(SaveCancelButtons).prop('cancelChanges')();
        expect(props.setPanelDirty).toHaveBeenCalledWith(false);
    });

    it('should save changes', () => {
        wrapper.find(SaveCancelButtons).prop('saveCell')();
        expect(props.onSave).toHaveBeenCalledWith({ name: 'test' });
    });
});
