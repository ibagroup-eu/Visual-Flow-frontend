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
import { mount, shallow } from 'enzyme';
import Db2Storage from './Db2Storage';
import ReadWriteTextFields from '../../../../components/rw-text-fields';
import SelectField from '../../../../components/select-field';
import ParamsSwitchField from '../../../sidebar/params/fields/switch/ParamsSwitchField';
import { READ, WRITE } from '../../../constants';
import WriteMode from '../helpers/WriteMode';

describe('Db2 storage', () => {
    const init = (props = {}, func = shallow) => {
        const defaultProps = {
            inputValues: {
                format: 'format',
                operation: 'operation',
                writeMode: 'write mode',
                truncateMode: 'truncate mode',
                customSql: 'true',
                partitionBy: 'partition by',
                storage: 'storage'
            },
            handleInputChange: jest.fn(),
            openModal: jest.fn(),
            ableToEdit: true,
            connectionPage: true,
            connection: {}
        };

        const wrapper = func(<Db2Storage {...defaultProps} {...props} />);

        return [wrapper, { ...defaultProps, ...props }];
    };

    it('should render component', () => {
        const [wrapper] = init();
        expect(wrapper).toBeDefined();
    });

    it('should render ParamsSwitchField when operation is READ', () => {
        const [wrapper] = init({
            inputValues: {
                operation: READ
            }
        });
        expect(wrapper.find(ParamsSwitchField)).toHaveLength(1);
    });

    it('should render ReadWriteTextField when customSql is false', () => {
        const [wrapper] = init({
            inputValues: {
                customSql: 'false'
            }
        });
        expect(wrapper.find(ReadWriteTextFields)).toHaveLength(2);
    });

    it('should render correct components when operation is WRITE and writeMode is Overwrite', () => {
        const [wrapper] = init({
            inputValues: {
                operation: WRITE,
                writeMode: 'Overwrite'
            }
        });
        expect(wrapper.find(ReadWriteTextFields)).toHaveLength(3);
        expect(wrapper.find(WriteMode)).toHaveLength(1);
        expect(wrapper.find(SelectField)).toHaveLength(1);
    });

    it('should render ReadWriteTextField when connectionPage is false', () => {
        const [wrapper] = init({
            connectionPage: false
        });
        expect(wrapper.find(ReadWriteTextFields)).toHaveLength(4);
    });

    it('should set value of Select field to the empty string when it`s not set', () => {
        const [wrapper] = init({
            inputValues: {
                operation: WRITE,
                writeMode: 'Overwrite',
                format: 'format',
                customSql: 'true',
                partitionBy: 'partition by',
                storage: 'oracle'
            }
        });
        expect(wrapper.find(SelectField).prop('value')).toEqual('');
    });

    it('should render form with default compression', () => {
        const [wrapper] = init(
            {
                inputValues: {
                    operation: WRITE,
                    storage: 'mongodb',
                    truncateMode: 'Cascade',
                    writeMode: 'Overwrite'
                },
                handleInputChange: jest.fn()
            },
            mount
        );

        expect(
            wrapper
                .find(SelectField)
                .at(1)
                .prop('value')
        ).toEqual('');
    });

    it('should not render SelectField', () => {
        const [wrapper] = init({
            inputValues: {
                operation: READ,
                storage: 'mongodb',
                truncateMode: 'Cascade',
                writeMode: 'Overwrite',
                customSql: 'true'
            },
            handleInputChange: jest.fn()
        });

        expect(wrapper.find(ParamsSwitchField).prop('value')).toBeTruthy();
    });
});
