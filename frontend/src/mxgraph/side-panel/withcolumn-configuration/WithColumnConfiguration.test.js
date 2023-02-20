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

import WithColumnConfiguration, {
    getOperationComponent
} from './WithColumnConfiguration';
import { TextField } from '@material-ui/core';
import {
    ADD_CONSTANT,
    CHANGE_TYPE,
    DERIVE_COLUMN,
    RENAME_COLUMN,
    USE_CONDITIONS,
    USE_WINDOW_FUNCTION
} from '../../constants';
import SelectField from '../../../components/select-field';

describe('WithColumnConfiguration', () => {
    const operationType = [
        DERIVE_COLUMN,
        ADD_CONSTANT,
        CHANGE_TYPE,
        RENAME_COLUMN,
        USE_CONDITIONS,
        USE_WINDOW_FUNCTION
    ];

    const init = (props = {}, returnProps = false) => {
        const defaultProps = {
            state: {
                name: 'test',
                operationType: 'renameColumn',
                column: 'test'
            },
            ableToEdit: true,
            onChange: jest.fn(),
            setState: jest.fn()
        };

        const wrapper = shallow(
            <WithColumnConfiguration {...defaultProps} {...props} />
        );

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
        expect(wrapper.find(TextField).exists()).toBeTruthy();
    });

    operationType.forEach(operation => {
        it(`should render  ${operation} component `, () => {
            init({ state: { operationType: `${operation}` } });

            expect(getOperationComponent(operation)).toHaveLength(1);
        });
    });

    it('should throw error with unsupported operation', () => {
        expect(() =>
            init({ state: { operationType: 'test', name: 'test' } })
        ).toThrow();
    });
});
