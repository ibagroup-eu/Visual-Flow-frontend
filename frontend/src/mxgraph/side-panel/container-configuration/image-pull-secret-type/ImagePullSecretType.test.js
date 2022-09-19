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
import { useTranslation } from 'react-i18next';
import { IconButton, TextField } from '@material-ui/core';
import ImagePullSecretType from './ImagePullSecretType';
import SelectField from '../../../../components/select-field';
import ReadTextFields from '../../../../components/rw-text-fields';
import { IMAGE_PULL_SECRET_TYPE } from '../../constants/container';

const stateProvided = {
    command: 'command',
    image: '#Image#',
    imagePullPolicy: 'IfNotPresent',
    imagePullSecretType: IMAGE_PULL_SECRET_TYPE.PROVIDED.value,
    limitsCpu: '1m',
    limitsMemory: '1M',
    name: 'Container',
    operation: 'CONTAINER',
    requestsCpu: '1m',
    requestsMemory: '1M'
};
const stateNew = {
    command: 'command',
    image: '#Image#',
    imagePullPolicy: 'IfNotPresent',
    imagePullSecretType: IMAGE_PULL_SECRET_TYPE.NEW.value,
    limitsCpu: '1m',
    limitsMemory: '1M',
    name: 'Container',
    operation: 'CONTAINER',
    requestsCpu: '1m',
    requestsMemory: '1M'
};
const target = {
    name: 'name',
    value: 'value'
};

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('ImagePullSecretType', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            ableToEdit: true,
            state: {
                command: 'command',
                image: '#Image#',
                imagePullPolicy: 'IfNotPresent',
                imagePullSecretType: IMAGE_PULL_SECRET_TYPE.NOT_APPLICABLE.value,
                limitsCpu: '1m',
                limitsMemory: '1M',
                name: 'Container',
                operation: 'CONTAINER',
                requestsCpu: '1m',
                requestsMemory: '1M'
            },
            onChange: jest.fn(),
            openModal: jest.fn(),
            required: true,
            checkParam: jest.fn()
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = shallow(<ImagePullSecretType {...defaultProps} />);
    });

    afterEach(() => useTranslation.mockClear());

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render SelectField with correct value', () => {
        expect(wrapper.find(SelectField)).toHaveLength(1);
        expect(wrapper.find(SelectField).prop('value')).toEqual(
            defaultProps.state.imagePullSecretType
        );
    });

    it('should render SelectField with empty value', () => {
        wrapper.setProps({
            state: {
                command: 'command',
                image: '#Image#',
                imagePullPolicy: 'IfNotPresent',
                limitsCpu: '1m',
                limitsMemory: '1M',
                name: 'Container',
                operation: 'CONTAINER',
                requestsCpu: '1m',
                requestsMemory: '1M'
            }
        });
        expect(wrapper.find(SelectField).prop('value')).toEqual('');
    });

    it('should call onChange prop by SelectField', () => {
        wrapper.find(SelectField).prop('handleInputChange')();
        expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('should call onChange prop by Username TextField with NEW value', () => {
        wrapper.setProps({
            state: stateNew
        });
        const [textField] = wrapper.find(TextField).map(field => field);
        textField.simulate('change', {
            target
        });
        expect(defaultProps.onChange).toHaveBeenCalledWith(
            target.name,
            target.value
        );
    });

    it('should call openModal prop by IconButton with NEW value', () => {
        wrapper = mount(<ImagePullSecretType {...defaultProps} />);
        wrapper.setProps({
            state: stateNew
        });
        const [_, iconButton] = wrapper.find(IconButton).map(button => button);
        iconButton.simulate('click');
        expect(defaultProps.openModal).toHaveBeenCalledWith('username');
    });

    it('should call onChange prop by ReadTextFields with NEW value', () => {
        wrapper.setProps({
            state: stateNew
        });
        wrapper.find(ReadTextFields).prop('handleInputChange')({ target });
        expect(defaultProps.onChange).toHaveBeenCalledWith(
            target.name,
            target.value
        );
    });

    it('should call onChange prop by Registry TextField with NEW value', () => {
        wrapper.setProps({
            state: stateNew
        });
        const [_, textField] = wrapper.find(TextField).map(field => field);
        textField.simulate('change', {
            target
        });
        expect(defaultProps.onChange).toHaveBeenCalledWith(
            target.name,
            target.value
        );
    });

    it('should call openModal prop by second IconButton with NEW value', () => {
        wrapper = mount(<ImagePullSecretType {...defaultProps} />);
        wrapper.setProps({
            state: stateNew
        });
        const [, , , , , , iconButton] = wrapper
            .find(IconButton)
            .map(button => button);
        iconButton.simulate('click');
        expect(defaultProps.openModal).toHaveBeenCalledWith('registry');
    });

    it('should call onChange prop by TextField with PROVIDED value', () => {
        wrapper.setProps({
            state: stateProvided
        });
        const [textField] = wrapper.find(TextField).map(field => field);
        textField.simulate('change', {
            target
        });
        expect(defaultProps.onChange).toHaveBeenCalledWith(
            target.name,
            target.value
        );
    });

    it('should call openModal prop by IconButton with PROVIDED value', () => {
        wrapper = mount(<ImagePullSecretType {...defaultProps} />);
        wrapper.setProps({
            state: stateProvided
        });
        const [_, iconButton] = wrapper.find(IconButton).map(button => button);
        iconButton.simulate('click');
        expect(defaultProps.openModal).toHaveBeenCalledWith('imagePullSecretName');
    });
});
