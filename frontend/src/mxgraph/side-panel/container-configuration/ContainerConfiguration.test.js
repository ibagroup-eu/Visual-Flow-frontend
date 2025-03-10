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
import { Checkbox, IconButton, TextField } from '@material-ui/core';
import ContainerConfiguration from './ContainerConfiguration';
import ImagePullSecretType from './image-pull-secret-type';
import ClearButton from '../helpers/ClearButton';
import CustomTextField from '../../../components/custom-text-field';
import SelectField from '../../../components/select-field';

const target = {
    name: 'name',
    value: 'value'
};

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('Container configuration', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            state: {
                command: 'command',
                image: '#Image#',
                imagePullPolicy: 'IfNotPresent',
                imagePullSecretType: 'NOT_APPLICABLE',
                limitsCpu: '1m',
                limitsMemory: '1M',
                name: 'Container',
                operation: 'CONTAINER',
                requestsCpu: '1m',
                requestsMemory: '1M'
            },
            ableToEdit: true,
            onChange: jest.fn(),
            openModal: jest.fn(),
            params: [
                { key: 'Image', value: 'value', secret: true },
                { key: 'Image1', value: 'value1', secret: false }
            ]
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = shallow(<ContainerConfiguration {...defaultProps} />);
    });

    afterEach(() => useTranslation.mockClear());

    it('should rener component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render SelectField', () => {
        expect(wrapper.find(SelectField)).toHaveLength(1);
    });

    it('should render ClearButton', () => {
        expect(wrapper.find(ClearButton)).toHaveLength(1);
    });

    it('should render CustomTextField', () => {
        expect(wrapper.find(CustomTextField)).toHaveLength(4);
    });

    it('should render ImagePullSecretType', () => {
        expect(wrapper.find(ImagePullSecretType)).toHaveLength(1);
    });

    it('should call onChange by first TextField', () => {
        const [textField] = wrapper.find(TextField).map(field => field);
        textField.simulate('change', { target });
        expect(defaultProps.onChange).toHaveBeenCalledWith(
            target.name,
            target.value
        );
    });

    it('should call onChange by ClearButton', () => {
        wrapper.find(ClearButton).prop('handleInputChange')('image', '');
        expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('should call onChange by SelectField', () => {
        wrapper.find(SelectField).prop('handleInputChange')('image', '');
        expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('should call onChange by CustomTextField', () => {
        const [field] = wrapper.find(CustomTextField).map(f => f);
        field.simulate('change', { target });
        expect(defaultProps.onChange).toHaveBeenCalledWith(
            target.name,
            target.value
        );
    });

    it('should call onChange by Checkbox', () => {
        wrapper = mount(<ContainerConfiguration {...defaultProps} />);

        wrapper.find(Checkbox).prop('onChange')({ target: { checked: true } });

        expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('should call onChange by ImagePullSecretType', () => {
        wrapper.find(ImagePullSecretType).simulate('change');
        expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('should call onChange by second TextField', () => {
        const [_, textField] = wrapper.find(TextField).map(field => field);
        textField.simulate('change', { target });
        expect(defaultProps.onChange).toHaveBeenCalledWith(
            target.name,
            target.value
        );
    });

    it('should call openModal by IconButton', () => {
        wrapper = mount(<ContainerConfiguration {...defaultProps} />);
        const [button] = wrapper.find(IconButton).map(b => b);
        button.simulate('click');
        expect(defaultProps.openModal).toHaveBeenCalledWith('image');
    });

    it('should call openModal by ImagePullSecretType', () => {
        wrapper.find(ImagePullSecretType).prop('openModal')();
        expect(defaultProps.openModal).toHaveBeenCalled();
    });

    it('should fill with empty values TextFields', () => {
        defaultProps = {
            ...defaultProps,
            state: {
                ...defaultProps.state,
                command: undefined,
                requestsMemory: undefined
            }
        };
        wrapper = mount(<ContainerConfiguration {...defaultProps} />);
        const [button] = wrapper.find(IconButton).map(b => b);
        button.simulate('click');
        expect(defaultProps.openModal).toHaveBeenCalledWith('image');
    });
});
