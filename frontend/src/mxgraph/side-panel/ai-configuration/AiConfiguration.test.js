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

import { Button, TextField } from '@material-ui/core';
import { shallow } from 'enzyme';
import React from 'react';
import AiConfiguration from './AiConfiguration';
import { ParamsSwitchField } from '../../sidebar/params/fields';
import PromptingModal from '../property-list/PromptingModal';

describe('AiConfiguration', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            state: {
                name: 'testname'
            },
            ableToEdit: true,
            onChange: jest.fn(),
            openModal: jest.fn()
        };

        wrapper = shallow(<AiConfiguration {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();

        expect(wrapper.find(TextField).length).toBe(3);
    });

    it('should render components with task = transcribe', () => {
        wrapper.setProps({
            state: { name: 'testname', endpoint: 'endpoint', task: 'transcribe' }
        });
        expect(wrapper.find(TextField).length).toBe(5);
        expect(
            wrapper
                .find(TextField)
                .at(0)
                .prop('value')
        ).toBe('endpoint');

        expect(wrapper.find(Button).length).toBe(0);
    });

    it('should render components with task = generateData', () => {
        wrapper.setProps({
            state: { name: 'testname', task: 'generateData' }
        });
        expect(wrapper.find(TextField).length).toBe(3);

        expect(wrapper.find(Button).length).toBe(1);

        wrapper.find(Button).prop('onClick')();
        expect(wrapper.find(PromptingModal).length).toBe(1);

        wrapper.find(PromptingModal).prop('onClose')();
        expect(wrapper.find(PromptingModal).length).toBe(0);
    });

    it('should render components with task = genericTask', () => {
        wrapper.setProps({
            state: {
                name: 'testname',
                task: 'genericTask'
            }
        });
        expect(wrapper.find(TextField).length).toBe(4);

        expect(wrapper.find(ParamsSwitchField).length).toBe(1);

        wrapper
            .find(ParamsSwitchField)
            .at(0)
            .prop('onChange')({
            target: { value: true }
        });

        expect(
            wrapper
                .find(ParamsSwitchField)
                .at(0)
                .prop('value')
        ).toBeTruthy();

        expect(wrapper.find(TextField).length).toBe(6);
    });

    it('should calls onChange prop', () => {
        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({
            target: { name: 'testname', value: 'test' }
        });
    });
});
