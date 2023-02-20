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
import { mount, shallow } from 'enzyme';
import SelectField from '../../../../components/select-field';
import AutocompleteParameter from '../../autocomplete-parameter';
import { IconButton, TextField, Tooltip } from '@material-ui/core';
import { PairsList } from '../../property-list';
import { useTranslation } from 'react-i18next';
import FillModeConfiguration from './FillModeConfiguration';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('FillModeConfiguration ', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            state: {
                mode: 'fill'
            },
            ableToEdit: true,
            onChange: jest.fn(),
            setState: jest.fn().mockImplementation(f => f({}))
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));
        const wrapper = func(<FillModeConfiguration {...defaultProps} {...props} />);
        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render component', () => {
        const [wrapper] = init({});
        expect(wrapper).toBeDefined();
    });

    it('should render custom parameters for all fillChoice', () => {
        const [wrapper] = init({
            state: {
                mode: 'fill',
                'option.fillValueType': 'custom',
                'option.fillChoice': 'all'
            }
        });
        expect(wrapper.find(TextField)).toHaveLength(1);
    });

    it('should render custom parameters for names fillChoice', () => {
        const [wrapper] = init({
            state: {
                mode: 'fill',
                'option.fillValueType': 'custom',
                'option.fillChoice': 'names'
            }
        });
        expect(wrapper.find(PairsList)).toBeTruthy();
    });

    it('should handle item change via text field', () => {
        const [wrapper, props] = init(
            {
                state: {
                    mode: 'fill',
                    'option.fillValueType': 'custom',
                    'option.fillChoice': 'all'
                }
            },
            true
        );

        wrapper
            .find(TextField)
            .at(0)
            .simulate('change', { target: { value: 'value' } });

        expect(props.onChange).toHaveBeenCalled();
    });

    it('should render aggregation parameters', () => {
        const [wrapper] = init({
            state: { mode: 'fill', 'option.fillValueType': 'agg' }
        });
        expect(wrapper.find(AutocompleteParameter)).toHaveLength(1);
        expect(wrapper.find(SelectField)).toHaveLength(2);
    });

    it('should add item for PairsList', () => {
        const [wrapper, props] = init(
            {
                state: {
                    mode: 'fill',
                    'option.fillValueType': 'custom',
                    'option.fillChoice': 'names',
                    'option.fillColumns': 'a,b',
                    'option.fillValues': 'value1,value2'
                }
            },
            true,
            mount
        );
        wrapper
            .find(Tooltip)
            .map(x => x)
            .filter(x => x.prop('title') === 'main:tooltip.Add')[0]
            .find(IconButton)
            .simulate('click');

        expect(props.setState).toHaveBeenCalled();
    });
});
