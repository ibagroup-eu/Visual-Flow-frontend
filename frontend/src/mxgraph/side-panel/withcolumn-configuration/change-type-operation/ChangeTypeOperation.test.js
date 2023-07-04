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
import ChangeTypeOperation from './index';
import SelectField from '../../../../components/select-field';
import { TextField } from '@material-ui/core';
import { isValidPrecision, isValidScale } from './ChangeTypeOperation';

describe('ChangeTypeOperation', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            state: {
                'option.columnType': 'boolean'
            },
            ableToEdit: true,
            handleInputChange: jest.fn()
        };

        const wrapper = func(<ChangeTypeOperation {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render component', () => {
        const [wrapper] = init({}, true);
        expect(wrapper).toBeDefined();
    });

    it('should render select field', () => {
        const [wrapper] = init({}, true);
        expect(wrapper.find(SelectField)).toHaveLength(1);
    });

    it('should render precision and scale fields ', () => {
        const [wrapper] = init({ state: { 'option.columnType': 'decimal' } }, true);
        expect(wrapper.find(TextField)).toHaveLength(2);
    });

    it('should call handle column type change ', () => {
        const [wrapper, props] = init({}, true);
        const target = {
            target: { name: 'option.columnType', value: 'date' }
        };
        wrapper.find(SelectField).prop('handleInputChange')(target);
        expect(props.handleInputChange).toHaveBeenCalledWith(target);
    });

    it('should handle precision change ', () => {
        const [wrapper, props] = init(
            { state: { 'option.columnType': 'decimal' } },
            true
        );

        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({
            target: { name: 'precision', value: '5' }
        });
        expect(props.handleInputChange).toHaveBeenCalledWith({
            target: { name: 'option.columnType', value: 'decimal(5,0)' }
        });
    });

    it('should handle scale change ', () => {
        const [wrapper, props] = init(
            { state: { 'option.columnType': 'decimal' } },
            true
        );

        wrapper
            .find(TextField)
            .at(1)
            .prop('onChange')({
            target: { name: 'scale', value: '2' }
        });
        expect(props.handleInputChange).toHaveBeenCalledWith({
            target: { name: 'option.columnType', value: 'decimal(10,2)' }
        });
    });

    describe('isValidPrecision', () => {
        it.each([
            { value: '5', expected: null },
            { value: '', expected: ['main:validation.notBlank'] },
            {
                value: '5.2',
                expected: ['main:validation.withColumnValidation.integer']
            },
            {
                value: '40',
                expected: [
                    'main:validation.withColumnValidation.range',
                    { min: 1, max: 38 }
                ]
            },
            {
                value: '0',
                expected: [
                    'main:validation.withColumnValidation.range',
                    { min: 1, max: 38 }
                ]
            }
        ])(
            'should return $expected when called with $value',
            ({ value, expected }) => {
                expect(isValidPrecision(value)).toStrictEqual(expected);
            }
        );
    });

    describe('isValidScale', () => {
        it.each([
            { value: '4', expected: null },
            { value: '', expected: ['main:validation.notBlank'] },
            {
                value: '7.1',
                expected: ['main:validation.withColumnValidation.integer']
            },
            {
                value: '38',
                expected: [
                    'main:validation.withColumnValidation.range',
                    { min: 0, max: 37 }
                ]
            },
            {
                value: '0',
                expected: null
            }
        ])(
            'should return $expected when called with $value',
            ({ value, expected }) => {
                expect(isValidScale(value)).toStrictEqual(expected);
            }
        );
    });
});
