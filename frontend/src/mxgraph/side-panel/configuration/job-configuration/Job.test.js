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
import { Box, TextField } from '@material-ui/core';
import { TextSkeleton } from '../../../../components/skeleton';

import { useTranslation } from 'react-i18next';
import SingleSelectModal from '../modal';
import Job from './Job';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('Job', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            loading: true,
            data: [{ id: 'id_1', name: 'name' }],
            ableToEdit: true,
            state: {},
            onStateChange: jest.fn(),
            outputPaths: [
                { id: 'id_1', successPath: 'value_1', job: 'target_value_1' },
                { id: 'id_2', successPath: 'value_2', job: 'target_value_2' }
            ],
            onChangeOutputPaths: jest.fn(),
            duplicatedName: true
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<Job {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(Box).exists()).toBeTruthy();
        expect(wrapper.find(TextSkeleton).exists()).toBeTruthy();
    });

    it('should not render skeletons', () => {
        const [wrapper] = init({
            loading: false
        });

        expect(wrapper.find(TextSkeleton).exists()).toBeFalsy();
    });

    it('should call jobs modal onClose', () => {
        const [wrapper] = init({
            loading: false
        });

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

    it('should handle jobs modal set value flow', () => {
        const [wrapper] = init({
            loading: false
        });

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
        const [wrapper, props] = init(
            {
                loading: false
            },
            true
        );
        const field = wrapper.find(TextField).at(0);
        expect(field.prop('value')).toBe('');

        field.simulate('change', { target: { name: 'name', value: 'value' } });
        expect(props.onStateChange).toHaveBeenCalledWith('name', 'value');
    });
});
