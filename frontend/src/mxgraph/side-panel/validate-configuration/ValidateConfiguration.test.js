/*
 *  Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import { Button, Switch } from '@material-ui/core';
import ValidateConfiguration from './ValidateConfiguration';
import ValidateModal from './validate-modal';

describe('ValidateConfiguration', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            state: {
                name: 'test'
            },
            onChange: jest.fn(),
            ableToEdit: true
        };

        wrapper = shallow(<ValidateConfiguration {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should call onChange prop', () => {
        wrapper = mount(<ValidateConfiguration {...props} />);
        wrapper.find(Switch).prop('onChange')({
            target: { name: 'isError', value: 'false' }
        });
        expect(props.onChange).toHaveBeenCalled();
    });

    it('should call onClose prop', () => {
        wrapper.find(ValidateModal).prop('onClose')();
        expect(wrapper.find(ValidateModal).prop('display')).toBe(false);
    });

    it('should call onClick prop', () => {
        wrapper.find(Button).prop('onClick')();
        expect(wrapper.find(ValidateModal).prop('display')).toBe(true);
    });

    it('should render component with validateConfig', () => {
        wrapper = shallow(
            <ValidateConfiguration
                {...props}
                state={{ ...props.state, validateConfig: 'test' }}
            />
        );
        expect(wrapper.find(Button).text()).toBe('main:button.EditValidation');
    });
});
