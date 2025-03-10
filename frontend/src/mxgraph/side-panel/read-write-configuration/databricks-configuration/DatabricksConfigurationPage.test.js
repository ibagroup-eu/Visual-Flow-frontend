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
import DatabricksConfigurationPage from './DatabricksConfigurationPage';
import { WRITE } from '../../../constants';
import WriteMode from '../helpers/WriteMode';
import FileFormatProperties from '../file-format-properties';

describe('Databricks configuration page', () => {
    let wrapper;
    const defaultProps = {
        inputValues: {
            format: 'csv',
            operation: 'operation',
            writeMode: 'write mode',
            objectType: 'volume',
            header: 'header',
            delimiter: 'delimeter',
            useSchema: 'true'
        },
        handleInputChange: jest.fn(),
        openModal: jest.fn(),
        ableToEdit: true,
        connection: {}
    };
    const props = {};

    beforeEach(() => {
        wrapper = shallow(
            <DatabricksConfigurationPage {...defaultProps} {...props} />
        );
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render WriteMode', () => {
        wrapper.setProps({
            inputValues: {
                ...defaultProps.inputValues,
                operation: WRITE
            }
        });
        expect(wrapper.find(WriteMode)).toHaveLength(1);
    });

    it('should render empty FileFormat', () => {
        wrapper.setProps({
            inputValues: {
                objectType: 'volume'
            }
        });
        expect(wrapper.find(FileFormatProperties)).toHaveLength(1);
    });
});
