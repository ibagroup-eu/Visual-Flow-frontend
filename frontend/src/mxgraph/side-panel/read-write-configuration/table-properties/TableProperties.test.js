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
import TableProperties from '.';
import { ParamsSwitchField } from '../../../sidebar/params/fields';
import DateTimeField from '../../../../components/date-time-field';
import NumberField from '../../../../components/number-field';
import ReadWriteTextFields from '../../../../components/rw-text-fields';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('TableProperties', () => {
    const init = (props = {}) => {
        const defaultProps = { ableToEdit: true };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        return shallow(<TableProperties {...defaultProps} {...props} />);
    };

    it('should render form in read mode', () => {
        const wrapper = init({ inputValues: { operation: READ } });

        expect(wrapper.find(ParamsSwitchField).prop('name')).toEqual('mergeSchema');
        expect(wrapper.find(ParamsSwitchField).prop('value')).toEqual(undefined);
        expect(wrapper.find(DateTimeField).prop('name')).toEqual('timestampAsOf');
        expect(wrapper.find(NumberField).prop('name')).toEqual('versionAsOf');
    });

    it('should render form in read mode with merge schema enabled', () => {
        const wrapper = init({
            inputValues: { operation: READ, mergeSchema: 'true' }
        });

        expect(wrapper.find(ParamsSwitchField).prop('name')).toEqual('mergeSchema');
        expect(wrapper.find(ParamsSwitchField).prop('value')).toEqual(true);
    });

    it('should render form in write mode', () => {
        const wrapper = init({ inputValues: { operation: WRITE } });

        expect(wrapper.find(ParamsSwitchField).prop('name')).toEqual(
            'overwriteSchema'
        );
        expect(wrapper.find(ParamsSwitchField).prop('value')).toEqual(undefined);
        expect(wrapper.find(ReadWriteTextFields).prop('fields')).toEqual([
            { field: 'replaceWhere' }
        ]);
        expect(wrapper.find(NumberField).prop('name')).toEqual('maxRecordsPerFile');
    });

    it('should render form in write mode with overwrite schema enabled', () => {
        const wrapper = init({
            inputValues: { operation: WRITE, overwriteSchema: 'true' }
        });

        expect(wrapper.find(ParamsSwitchField).prop('name')).toEqual(
            'overwriteSchema'
        );
        expect(wrapper.find(ParamsSwitchField).prop('value')).toEqual(true);
    });
});
