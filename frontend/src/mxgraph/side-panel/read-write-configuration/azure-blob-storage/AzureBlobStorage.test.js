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
import { shallow } from 'enzyme';
import { useTranslation } from 'react-i18next';
import { READ, WRITE } from '../../../constants';
import AzureBlobStorage from '.';
import ReadWriteTextFields from '../../../../components/rw-text-fields';
import SelectField from '../../../../components/select-field';
import FileFormatProperties from '../file-format-properties';
import WriteMode from '../helpers/WriteMode';
import AutocompleteParameter from '../../autocomplete-parameter';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('AzureBlobStorage', () => {
    const init = (props = {}) => {
        const defaultProps = {
            inputValues: {
                authType: 'storageAccountKey'
            },
            ableToEdit: true
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(<AzureBlobStorage {...defaultProps} {...props} />);

        return [wrapper, { ...defaultProps, ...props }];
    };

    it('should render form for the connections page', () => {
        const [wrapper, props] = init({ connectionPage: true });
        const textFields = wrapper.find(ReadWriteTextFields);
        const authType = wrapper.find(SelectField);

        expect(textFields.length).toEqual(2);
        expect(textFields.at(0).prop('fields')).toEqual([
            { field: 'storageAccount' }
        ]);
        expect(textFields.at(1).prop('fields')).toEqual([
            { field: 'storageAccountKey' }
        ]);

        expect(authType.length).toEqual(1);
        expect(authType.prop('name')).toEqual('authType');
        expect(authType.prop('value')).toEqual(props.inputValues.authType);
    });

    it('should render form in read mode', () => {
        const [wrapper] = init({
            inputValues: {
                authType: 'SASToken',
                operation: READ
            }
        });
        const textFields = wrapper.find(ReadWriteTextFields);

        expect(textFields.length).toEqual(3);
        expect(textFields.at(0).prop('fields')).toEqual([
            { field: 'storageAccount' }
        ]);
        expect(textFields.at(1).prop('fields')).toEqual([{ field: 'SASToken' }]);
        expect(textFields.at(2).prop('fields')).toEqual([
            { field: 'container' },
            { field: 'containerPath' }
        ]);

        expect(wrapper.find(FileFormatProperties).length).toEqual(1);
    });

    it('should render form in write mode', () => {
        const [wrapper] = init({
            inputValues: { operation: WRITE }
        });
        const textFields = wrapper.find(ReadWriteTextFields);

        expect(textFields.length).toEqual(2);
        expect(textFields.at(0).prop('fields')).toEqual([
            { field: 'storageAccount' }
        ]);
        expect(textFields.at(1).prop('fields')).toEqual([
            { field: 'container' },
            { field: 'containerPath' }
        ]);

        expect(wrapper.find(SelectField).prop('value')).toEqual('');
        expect(wrapper.find(WriteMode).length).toEqual(1);
        expect(wrapper.find(FileFormatProperties).length).toEqual(1);
        expect(wrapper.find(AutocompleteParameter).length).toEqual(1);
    });
});
