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

import { IconButton, TextField } from '@material-ui/core';
import { mount, shallow } from 'enzyme';
import React from 'react';
import ParametersTableRow from './ParametersTableRow';

describe('ParametersTableRow', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            editMode: true,
            parameter: { key: 'key', value: 'value', secret: true, id: 'id' },
            handleRemoveParameter: jest.fn(),
            handleChangeParameter: jest.fn(),
            confirmationWindow: jest.fn(),
            isErrorParameter: jest.fn(),
            parameters: [{ key: 'key', value: 'value', secret: true, id: 'id2' }]
        };

        wrapper = shallow(<ParametersTableRow {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls onClick prop', () => {
        wrapper.find(IconButton).simulate('click');
        expect(props.confirmationWindow).toBeCalled();
    });

    it('should calls onChange prop with KEY_LENGTH error', () => {
        wrapper.find(TextField).invoke('onChange')({ target: { value: '' } });
    });

    it('should calls onChange prop with KEY_SYMBOLS error', () => {
        wrapper.find(TextField).invoke('onChange')({ target: { value: '`-' } });
        expect(props.handleChangeParameter).toBeCalled();
    });

    it('should calls onChange prop with KEY_START_END error', () => {
        wrapper.find(TextField).invoke('onChange')({ target: { value: '__' } });
    });

    it('should calls onChange prop with error', () => {
        wrapper = mount(<ParametersTableRow {...props} />);
        wrapper
            .find(TextField)
            .at(0)
            .invoke('onChange')({ target: { value: '__' } });
        wrapper
            .find(TextField)
            .at(0)
            .invoke('onChange')({ target: { value: 'test' } });
    });

    it('should calls onChange prop for parameter value', () => {
        wrapper = mount(<ParametersTableRow {...props} />);
        wrapper.setProps({
            parameter: { key: 'key', value: 'value', secret: false, id: 'id1' }
        });
        wrapper
            .find(TextField)
            .at(1)
            .invoke('onChange')({ target: { value: '' } });
        wrapper
            .find(TextField)
            .at(1)
            .invoke('onChange')({ target: { value: 'test' } });
        expect(props.handleChangeParameter).toBeCalled();
    });
});
