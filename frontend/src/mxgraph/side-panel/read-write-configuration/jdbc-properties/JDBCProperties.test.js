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
import JDBCProperties, {
    readingInParallelFields,
    writeFields
} from './JDBCProperties';
import ReadWriteTextFields from '../../../../components/rw-text-fields';
import { ParamsSwitchField } from '../../../sidebar/params/fields';
import NumberField from '../../../../components/number-field';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('JDBCProperties', () => {
    const init = (props = {}) => {
        const defaultProps = { ableToEdit: true };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        return shallow(<JDBCProperties {...defaultProps} {...props} />);
    };

    it('should render form in read mode', () => {
        const wrapper = init({ inputValues: { operation: READ } });
        const textFields = wrapper.find(ReadWriteTextFields);

        expect(textFields.length).toEqual(2);
        expect(textFields.at(0).prop('fields')).toEqual([
            { field: 'sessionInitStatement' }
        ]);
        expect(textFields.at(1).prop('fields')).toEqual([{ field: 'customSchema' }]);
        expect(wrapper.find(ParamsSwitchField).prop('value')).toEqual(undefined);
        expect(wrapper.find(NumberField).prop('name')).toEqual('fetchsize');
    });

    it('should render form in read mode with reading in parallel enabled', () => {
        const wrapper = init({
            inputValues: { operation: READ, readingInParallel: 'true' }
        });
        const textFields = wrapper.find(ReadWriteTextFields);
        const numberFields = wrapper.find(NumberField);

        expect(textFields.length).toEqual(3);
        expect(textFields.at(0).prop('fields')).toEqual([
            { field: 'sessionInitStatement' }
        ]);
        expect(textFields.at(1).prop('fields')).toEqual(readingInParallelFields);
        expect(textFields.at(2).prop('fields')).toEqual([{ field: 'customSchema' }]);
        expect(numberFields.length).toEqual(2);
        expect(numberFields.at(0).prop('name')).toEqual('numPartitions');
        expect(numberFields.at(1).prop('name')).toEqual('fetchsize');
    });

    it('should render form in write mode', () => {
        const wrapper = init({
            inputValues: { operation: WRITE }
        });
        const numberFields = wrapper.find(NumberField);

        expect(wrapper.find(ParamsSwitchField).length).toEqual(0);
        expect(numberFields.length).toEqual(2);
        expect(numberFields.at(0).prop('name')).toEqual('numPartitions');
        expect(numberFields.at(1).prop('name')).toEqual('batchsize');
        expect(wrapper.find(ReadWriteTextFields).prop('fields')).toEqual(
            writeFields
        );
    });
});
