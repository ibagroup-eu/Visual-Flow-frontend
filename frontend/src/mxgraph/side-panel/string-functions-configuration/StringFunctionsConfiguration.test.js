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

import StringFunctionsConfiguration, {
    getFuncParameters
} from './StringFunctionsConfiguration';
import { TextField } from '@material-ui/core';
import {
    CONCAT_WS,
    FORMAT_NUMBER,
    DECODE,
    ENCODE,
    FORMAT_STRING,
    INSTR,
    LOCATE,
    RPAD,
    LPAD,
    TRIM,
    RTRIM,
    LTRIM,
    REGEXP_EXTRACT,
    REPEAT,
    SPLIT,
    SUBSTRING,
    SUBSTRING_INDEX
} from './constants';
import SelectField from '../../../components/select-field';

describe('StringFunctionConfiguration', () => {
    const operationType = [
        CONCAT_WS,
        FORMAT_NUMBER,
        DECODE,
        ENCODE,
        FORMAT_STRING,
        INSTR,
        LOCATE,
        RPAD,
        LPAD,
        TRIM,
        RTRIM,
        LTRIM,
        REGEXP_EXTRACT,
        REPEAT,
        SPLIT,
        SUBSTRING,
        SUBSTRING_INDEX
    ];

    const init = (props = {}, returnProps = false) => {
        const defaultProps = {
            state: {
                name: 'test',
                function: 'substring'
            },
            ableToEdit: true,
            onChange: jest.fn()
        };

        const wrapper = shallow(
            <StringFunctionsConfiguration {...defaultProps} {...props} />
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
            init({ state: { function: `${operation}` } });

            expect(getFuncParameters(operation)).toBeTruthy();
        });
    });

    it('should handle TextField onChange prop', () => {
        const [wrapper, props] = init({}, true);
        wrapper
            .find(TextField)
            .at(0)
            .simulate('change', { target: { name: 'test', value: 'test' } });
        expect(props.onChange).toHaveBeenCalledWith('option.sourceColumn', 'test');
        wrapper
            .find(TextField)
            .at(1)
            .simulate('change', { target: { name: 'test', value: 'test' } });
        expect(props.onChange).toHaveBeenCalledWith('option.targetColumn', 'test');
    });

    it('should throw error with unsupported operation', () => {
        expect(() => init({ state: { function: 'test', name: 'test' } })).toThrow();
    });
});
