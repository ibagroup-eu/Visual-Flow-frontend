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

import UseWindowFunctionOperation, {
    getParameterComponent
} from './UseWindowFunctionOperation';
import PropertyList from '../../property-list';
import { AVG, COUNT, LAG, LEAD, MAX, MIN, NTILE, SUM } from '../../../constants';
import SelectField from '../../../../components/select-field';
import AutocompleteParameter from '../../autocomplete-parameter/AutocompleteParameter';

describe('UseWindowFunctionOperation', () => {
    const windowFunctions = [COUNT, SUM, AVG, MIN, MAX, NTILE, LAG, LEAD];

    const init = (props = {}, returnProps = false) => {
        const defaultProps = {
            state: {
                'option.windowFunction': 'rank',
                'option.partitionBy': 'test',
                'option.orderBy': 'column'
            },
            ableToEdit: true,
            handleInputChange: jest.fn(),
            setState: jest.fn()
        };

        const wrapper = shallow(
            <UseWindowFunctionOperation {...defaultProps} {...props} />
        );

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render parameters', () => {
        const [wrapper] = init({}, true);
        expect(wrapper.find(PropertyList).exists()).toBeTruthy();
        expect(wrapper.find(AutocompleteParameter).exists()).toBeTruthy();
    });

    it(' SelectField should use windowFunction class', () => {
        const [wrapper] = init({}, true);
        const { className } = wrapper.find(SelectField).props();
        expect(className.lastIndexOf('makeStyles-windowFunction')).toBe(0);
    });

    windowFunctions.forEach(windowFunction => {
        it(`should render additional parameters for ${windowFunction} function `, () => {
            init({ state: { 'option.windowFunction': `${windowFunction}` } });

            expect(getParameterComponent(windowFunction)).toHaveLength(1);
        });
    });

    it('should throw error with unsupported parameter', () => {
        expect(() => init({ state: { 'option.windowFunction': 'test' } })).toThrow();
    });

    it('should calls handleInputChange prop for Comp ', () => {
        const [wrapper, props] = init(undefined, true);
        wrapper.find(PropertyList).prop('onChange')([1, 2, 3]);
        expect(props.handleInputChange).toHaveBeenCalled();
    });

    it('should calls setState prop ', () => {
        const [wrapper] = init();
        wrapper.find(SelectField).prop('handleInputChange')({
            target: { name: 'option.windowFunction', value: 'min' }
        });
    });
});
