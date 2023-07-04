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
import { Button } from '@material-ui/core';
import { fromState, HEADER_KEY_VALIDATIONS, toState } from "./ApiStorage";
import PropertyListModal from '../../property-list/PropertyListModal';
import { useTranslation } from 'react-i18next';
import ApiStorage from './ApiStorage';
import { MESSAGES } from "../../../../pages/settings/parameters/validation/useParamValidation";

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('API storage', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            inputValues: {
                operation: 'operation',
                storage: 'api'
            },
            handleInputChange: jest.fn(),
            openModal: jest.fn(),
            ableToEdit: true,
            setState: jest.fn(),
            connection: {}
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));
        const wrapper = func(<ApiStorage {...defaultProps} {...props} />);
        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render component', () => {
        const [wrapper] = init({});
        expect(wrapper).toBeDefined();
    });

    it('should call onClick prop', () => {
        const [wrapper] = init({});
        wrapper
            .find(Button)
            .at(0)
            .prop('onClick')();
        expect(wrapper.find(PropertyListModal).prop('open')).toBe(true);
    });

    it('should call handleSave', () => {
        const [wrapper, props] = init({}, true);
        wrapper
            .find(Button)
            .at(0)
            .prop('onClick')();
        wrapper.find(PropertyListModal).prop('onSave')([
            ['parameter1', 'value1'],
            ['parameter2', 'value2']
        ]);
        expect(props.setState).toHaveBeenCalled();
        expect(wrapper.find(PropertyListModal).exists()).toBeFalsy();
    });

    it('fromState should convert data', () => {
        const params = 'par1:val1;par2:val2';

        expect(fromState(params)).toEqual([
            ['par1', 'val1'],
            ['par2', 'val2']
        ]);
    });

    it('toState should convert data', () => {
        const params = [['par1', 'val1']];

        expect(toState(params)).toEqual('par1:val1');
    });

    describe('HEADER_KEY_VALIDATIONS', () => {
        it('VALUE_EMPTY', () => {
            expect(HEADER_KEY_VALIDATIONS[MESSAGES.VALUE_EMPTY]('')).toBe(true);
            expect(HEADER_KEY_VALIDATIONS[MESSAGES.VALUE_EMPTY](' ')).toBe(true);
            expect(HEADER_KEY_VALIDATIONS[MESSAGES.VALUE_EMPTY]('a')).toBe(false);
        });
        it('KEY_DUPLICATION', () => {
            expect(
                HEADER_KEY_VALIDATIONS[MESSAGES.KEY_DUPLICATION]('a', [
                    ['a', 'b'],
                    ['a', 'c']
                ])
            ).toBe(true);
            expect(
                HEADER_KEY_VALIDATIONS[MESSAGES.KEY_DUPLICATION]('a', [
                    ['b', 'c'],
                    ['d', 'e']
                ])
            ).toBe(false);
        });
    });
});
