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
import { READ, WRITE } from '../../../../constants';
import FileFormatCSV from '.';
import CsvHeader from '../../helpers/CsvHeader';
import Delimiter from '../../helpers/Delimiter';
import FileFormatCommonFields from '../file-format-common-fields';
import ReadWriteTextFields from '../../../../../components/rw-text-fields';
import { ParamsSwitchField } from '../../../../sidebar/params/fields';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('FileFormatCSV', () => {
    const init = (props = {}) => {
        const defaultProps = { ableToEdit: true };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(<FileFormatCSV {...defaultProps} {...props} />);

        return [wrapper, { ...defaultProps, ...props }];
    };

    it('should render form in read mode', () => {
        const [wrapper, props] = init({
            inputValues: {
                operation: READ,
                header: 'true',
                delimiter: ';'
            }
        });
        const textFields = wrapper.find(ReadWriteTextFields);

        expect(wrapper.find(CsvHeader).prop('value')).toEqual(true);
        expect(wrapper.find(Delimiter).prop('value')).toEqual(
            props.inputValues.delimiter
        );
        expect(wrapper.find(FileFormatCommonFields).length).toEqual(1);
        expect(textFields.length).toEqual(4);
        expect(textFields.at(0).prop('fields')).toEqual([
            { field: 'samplingRatio', defaultValue: '1.0' }
        ]);
        expect(textFields.at(1).prop('fields')).toEqual([{ field: 'quote' }]);
        expect(textFields.at(2).prop('fields')).toEqual([{ field: 'escape' }]);
        expect(textFields.at(3).prop('fields')).toEqual([
            { field: 'inferSchema' },
            { field: 'enforceSchema' }
        ]);
        expect(wrapper.find(ParamsSwitchField).prop('name')).toEqual(
            'fineTuneValues'
        );
    });

    it('should render form in read mode with fine tune values enabled', () => {
        const [wrapper] = init({
            inputValues: { operation: READ, fineTuneValues: 'true' }
        });
        const toggles = wrapper.find(ParamsSwitchField);
        const textFields = wrapper.find(ReadWriteTextFields);

        expect(wrapper.find(CsvHeader).prop('value')).toEqual(undefined);
        expect(wrapper.find(Delimiter).prop('value')).toEqual('');

        expect(toggles.length).toEqual(3);
        expect(toggles.at(0).prop('name')).toEqual('fineTuneValues');
        expect(toggles.at(1).prop('name')).toEqual('ignoreLeadingWhiteSpace');
        expect(toggles.at(2).prop('name')).toEqual('ignoreTrailingWhiteSpace');

        expect(textFields.length).toEqual(6);
        expect(textFields.at(4).prop('fields')).toEqual([{ field: 'nullValue' }]);
        expect(textFields.at(5).prop('fields')).toEqual([
            { field: 'nanValue', defaultValue: 'NaN' }
        ]);
    });

    it('should render form in write mode', () => {
        const [wrapper] = init({
            inputValues: { operation: WRITE }
        });
        const textFields = wrapper.find(ReadWriteTextFields);
        const toggles = wrapper.find(ParamsSwitchField);

        expect(textFields.length).toEqual(2);
        expect(textFields.at(0).prop('fields')).toEqual([{ field: 'quote' }]);
        expect(textFields.at(1).prop('fields')).toEqual([{ field: 'escape' }]);

        expect(toggles.length).toEqual(3);
        expect(toggles.at(0).prop('name')).toEqual('quoteAll');
        expect(toggles.at(1).prop('name')).toEqual('escapeQuotes');
        expect(toggles.at(2).prop('name')).toEqual('fineTuneValues');
    });

    it('should render form in write mode with fine tune values enabled', () => {
        const [wrapper] = init({
            inputValues: { operation: WRITE, fineTuneValues: 'true' }
        });
        const toggles = wrapper.find(ParamsSwitchField);
        const textFields = wrapper.find(ReadWriteTextFields);

        expect(textFields.length).toEqual(3);
        expect(textFields.at(2).prop('fields')).toEqual([{ field: 'nullValue' }]);

        expect(toggles.length).toEqual(5);
        expect(toggles.at(3).prop('name')).toEqual('ignoreLeadingWhiteSpace');
        expect(toggles.at(4).prop('name')).toEqual('ignoreTrailingWhiteSpace');
    });
});
