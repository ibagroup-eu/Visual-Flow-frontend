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
import React from 'react';
import { TextField } from '@material-ui/core';
import { TextSkeleton } from '../../../../components/skeleton';

import { useTranslation } from 'react-i18next';
import SingleSelectModal from '../modal';
import Pipeline from './Pipeline';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('Pipeline', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            loading: false,
            data: [],
            ableToEdit: true,
            state: {},
            onStateChange: jest.fn()
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<Pipeline {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render component', () => {
        const [wrapper] = init();
        expect(wrapper).toBeDefined();
    });

    it('should render skeletons', () => {
        const [wrapper] = init({
            loading: true
        });

        expect(wrapper.find(TextSkeleton).exists()).toBeTruthy();
    });

    it('should call pipeline modal onClose', () => {
        const [wrapper] = init();

        expect(wrapper.find(SingleSelectModal).prop('display')).toBeFalsy();

        wrapper
            .find(TextField)
            .at(1)
            .prop('InputProps')
            .endAdornment.props.onClick();

        wrapper.update();

        expect(wrapper.find(SingleSelectModal).prop('display')).toBeTruthy();

        wrapper.find(SingleSelectModal).prop('onClose')();

        wrapper.update();

        expect(wrapper.find(SingleSelectModal).prop('display')).toBeFalsy();
    });

    it('should handle pipeline modal set value flow', () => {
        const [wrapper] = init();

        expect(wrapper.find(SingleSelectModal).prop('display')).toBeFalsy();

        wrapper
            .find(TextField)
            .at(1)
            .prop('InputProps')
            .endAdornment.props.onClick();

        wrapper.update();

        expect(wrapper.find(SingleSelectModal).prop('display')).toBeTruthy();

        wrapper.find(SingleSelectModal).prop('onSetValue')();

        wrapper.update();

        expect(wrapper.find(SingleSelectModal).prop('display')).toBeFalsy();
    });

    it('should handle input change', () => {
        const [wrapper, props] = init({}, true);
        const field = wrapper.find(TextField).at(0);
        expect(field.prop('value')).toBe('');

        field.simulate('change', { target: { name: 'name', value: 'value' } });
        expect(props.onStateChange).toHaveBeenCalledWith('name', 'value');
    });
});