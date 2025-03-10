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

import React from 'react';
import { shallow } from 'enzyme';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import FileFormatAvro from './FileFormatAvro';
import FileFormatCommonFields from '../file-format-common-fields';
import SchemaModal from '../../../../../components/schema-modal';
import UseSchema from '../../helpers/UseSchema';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('FileFormatAvro', () => {
    const init = (props = {}) => {
        const defaultProps = {
            inputValues: {
                authType: 'storageAccountKey'
            },
            ableToEdit: true
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        return shallow(<FileFormatAvro {...defaultProps} {...props} />);
    };

    it('should render without crashes', () => {
        const wrapper = init();

        expect(wrapper.find(SchemaModal).prop('values')).toEqual(null);
        expect(wrapper.find(UseSchema).length).toEqual(1);
        expect(wrapper.find(FileFormatCommonFields).length).toEqual(1);
        expect(wrapper.find(Button).length).toEqual(0);
    });

    it('should handle input change', () => {
        const handleInputChange = jest.fn();
        const event = { target: { value: 'true' } };
        const wrapper = init({ handleInputChange });

        wrapper.find(UseSchema).simulate('change', event);
        expect(handleInputChange).toHaveBeenCalledWith(event);
    });

    it('should open and close modal', () => {
        const wrapper = init({ inputValues: { useSchema: 'true' } });

        expect(wrapper.find(SchemaModal).prop('display')).toEqual(false);
        expect(wrapper.find(Button).text()).toEqual('main:button.UseSchema');

        wrapper.find(Button).simulate('click');
        expect(wrapper.find(SchemaModal).prop('display')).toEqual(true);

        wrapper.find(SchemaModal).simulate('close');
        expect(wrapper.find(SchemaModal).prop('display')).toEqual(false);
    });

    it('should render correct text inside of the button', () => {
        const wrapper = init({
            inputValues: { useSchema: 'true', avroSchema: 'test value' }
        });

        expect(wrapper.find(Button).text()).toEqual('main:button.EditSchema');
    });

    it('should render set undefined to SchemaModal', () => {
        const wrapper = init({
            inputValues: { useSchema: 'false', avroSchema: 'avroSchema' }
        });

        expect(wrapper.find(SchemaModal).prop('values')).toEqual(null);
    });
});
