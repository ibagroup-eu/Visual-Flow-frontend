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
import { READ, WRITE } from '../../../../constants';
import FileFormatCommonFields from '.';
import { ParamsSwitchField } from '../../../../sidebar/params/fields';
import ReadWriteTextFields from '../../../../../components/rw-text-fields';
import DateTimeField from '../../../../../components/date-time-field';
import SelectField from '../../../../../components/select-field';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

const compressionItems = [
    { value: 'bzip2', label: 'bzip2' },
    { value: 'gzip', label: 'gzip' }
];

describe('FileFormatCommonFields', () => {
    const init = (props = {}, func = shallow) => {
        const defaultProps = {
            compressionItems,
            inputValues: {},
            ableToEdit: true
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(
            <FileFormatCommonFields {...defaultProps} {...props} />
        );

        return [wrapper, { ...defaultProps, ...props }];
    };

    it('should render form in read mode', () => {
        const [wrapper] = init({ inputValues: { operation: READ } });
        const param = wrapper.find(ParamsSwitchField);

        expect(param.prop('name')).toEqual('fileSelection');
        expect(param.prop('value')).toEqual(undefined);
    });

    it('should render form in read mode with file selection enabled', () => {
        const [wrapper] = init({
            inputValues: { operation: READ, fileSelection: 'true' }
        });
        const timestampFields = wrapper.find(DateTimeField);

        expect(wrapper.find(ParamsSwitchField).prop('value')).toEqual(true);
        expect(wrapper.find(ReadWriteTextFields).prop('fields')).toEqual([
            { field: 'pathGlobFilter' },
            { field: 'recursiveFileLookup' }
        ]);
        expect(timestampFields.length).toEqual(2);
        expect(timestampFields.at(0).prop('name')).toEqual('modifiedBefore');
        expect(timestampFields.at(1).prop('name')).toEqual('modifiedAfter');
    });

    it('should render form in write mode', () => {
        const [wrapper] = init({ inputValues: { operation: WRITE } });
        const param = wrapper.find(ParamsSwitchField);

        expect(param.prop('name')).toEqual('useCompression');
        expect(param.prop('value')).toEqual(undefined);
    });

    it('should render form in write mode with compression enabled', () => {
        const [wrapper] = init({
            inputValues: { operation: WRITE, useCompression: 'true' }
        });

        expect(wrapper.find(SelectField).prop('value')).toEqual('');
    });

    it('should render form with compression selected', () => {
        const compression = 'gzip';
        const [wrapper] = init({
            inputValues: {
                operation: WRITE,
                useCompression: 'true',
                compression
            }
        });

        expect(wrapper.find(SelectField).prop('value')).toEqual(compression);
    });

    it('should render form with default compression', () => {
        const defaultCompression = '';
        const [wrapper] = init(
            {
                inputValues: {
                    operation: WRITE,
                    format: true,
                    compression: 'gzip',
                    useCompression: 'true'
                },
                compressionItems: [{ value: 'value' }],
                handleInputChange: jest.fn(),
                defaultCompression
            },
            mount
        );

        expect(wrapper.find(SelectField).prop('value')).toEqual(defaultCompression);
    });

    it('should not render SelectField', () => {
        const defaultCompression = '';
        const [wrapper] = init(
            {
                inputValues: {
                    operation: READ,
                    format: true,
                    compression: 'gzip',
                    useCompression: 'true'
                },
                compressionItems: [{ value: 'value' }],
                handleInputChange: jest.fn(),
                defaultCompression
            },
            mount
        );

        expect(wrapper.find(SelectField).exists()).toBeFalsy();
    });
});
