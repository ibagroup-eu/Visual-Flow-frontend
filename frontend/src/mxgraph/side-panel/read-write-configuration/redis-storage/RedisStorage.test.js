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
import { Divider } from '@material-ui/core';
import RedisStorage from './RedisStorage';
import ReadWriteTextFields from '../../../../components/rw-text-fields';
import SelectField from '../../../../components/select-field';
import NumberField from '../../../../components/number-field';
import { READ, WRITE } from '../../../constants';
import Ssl from '../helpers/Ssl';
import WriteMode from '../helpers/WriteMode';

describe('Redis storage', () => {
    let wrapper;
    const defaultProps = {
        inputValues: {
            format: 'format',
            operation: 'operation',
            writeMode: 'write mode',
            truncateMode: 'truncate mode',
            customSql: 'true',
            partitionBy: 'partition by',
            storage: 'storage',
            readMode: 'read mode'
        },
        handleInputChange: jest.fn(),
        openModal: jest.fn(),
        ableToEdit: true,
        connectionPage: true,
        connection: {}
    };

    beforeEach(() => {
        wrapper = shallow(<RedisStorage {...defaultProps} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render Ssl', () => {
        expect(wrapper.find(Ssl)).toHaveLength(1);
    });

    it('should render ReadWriteTextFields and SelectFIeld when connectionPage is false', () => {
        wrapper.setProps({
            connectionPage: false
        });
        expect(wrapper.find(ReadWriteTextFields)).toHaveLength(3);
        expect(wrapper.find(SelectField)).toHaveLength(1);
    });

    it('should render SelectFIeld when operation is READ', () => {
        wrapper.setProps({
            inputValues: {
                ...defaultProps.inputValues,
                operation: READ
            }
        });
        expect(wrapper.find(SelectField)).toHaveLength(1);
    });

    it('should render ReadWriteTextFields when readMode is pattern', () => {
        wrapper.setProps({
            inputValues: {
                ...defaultProps.inputValues,
                operation: READ,
                readMode: 'pattern'
            }
        });
        expect(wrapper.find(ReadWriteTextFields)).toHaveLength(3);
    });

    it('should render ReadWriteTextFields when operation is WRITE and readMode is key', () => {
        wrapper.setProps({
            inputValues: {
                ...defaultProps.inputValues,
                operation: WRITE,
                readMode: 'key'
            }
        });
        expect(wrapper.find(ReadWriteTextFields)).toHaveLength(3);
    });

    it('should render NumberField and WriteMode when operation is WRITE', () => {
        wrapper.setProps({
            inputValues: {
                ...defaultProps.inputValues,
                operation: WRITE
            }
        });
        expect(wrapper.find(NumberField)).toHaveLength(1);
        expect(wrapper.find(WriteMode)).toHaveLength(1);
    });
});
