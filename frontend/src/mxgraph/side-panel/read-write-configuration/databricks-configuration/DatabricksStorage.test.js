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
import DatabricksStorage from './DatabricksStorage';
import DatabricksConfigurationPage from './DatabricksConfigurationPage';

describe('Databricks storage', () => {
    const init = (props = {}, func = shallow) => {
        const defaultProps = {
            inputValues: {},
            handleInputChange: jest.fn(),
            openModal: jest.fn(),
            ableToEdit: true,
            connectionPage: true,
            connection: true
        };

        const wrapper = func(<DatabricksStorage {...defaultProps} {...props} />);

        return [wrapper, { ...defaultProps, ...props }];
    };

    it('should render component', () => {
        const [wrapper] = init();
        expect(wrapper).toBeDefined();
    });

    it('should render component 2', () => {
        const [wrapper] = init({
            inputValues: {},
            handleInputChange: jest.fn(),
            openModal: jest.fn(),
            ableToEdit: true,
            connectionPage: false,
            connection: true
        });
        expect(wrapper).toBeDefined();
    });
});
