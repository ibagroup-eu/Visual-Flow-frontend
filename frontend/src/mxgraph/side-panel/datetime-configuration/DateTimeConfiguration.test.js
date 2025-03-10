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

import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { DATETIME } from '../../constants';
import DateTimeConfiguration from './DateTimeConfiguration';

jest.mock('../schemas', () => ({
    DATETIME: [
        {},
        {
            field: 'option.dayOfWeek'
        },
        {
            field: 'roundOff',
            conditions: [
                {
                    function: 'months_between'
                }
            ]
        },
        {
            field: 'sourceColumn',
            conditions: [
                {
                    function: 'next_day'
                }
            ]
        }
    ]
}));

describe('DateTimeConfiguration', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            state: {
                name: 'testname',
                operation: DATETIME,
                function: 'next_day'
            },
            ableToEdit: true,
            onChange: jest.fn()
        };

        wrapper = shallow(<DateTimeConfiguration {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render component without operationType', () => {
        wrapper = mount(
            <DateTimeConfiguration {...props} state={{ name: 'testname' }} />
        );
        expect(wrapper.find(Autocomplete).prop('value')).toBe(null);
    });

    it('should calls onChange prop for Autocomplete', () => {
        wrapper.find(Autocomplete).prop('onChange')({}, 'newValue');
        expect(props.onChange).toBeCalledWith('function', 'newValue');
    });

    it('should calls onChange prop for TextField', () => {
        wrapper = mount(
            <DateTimeConfiguration
                {...props}
                state={{ ...props.state, function: 'months_between' }}
            />
        );
        wrapper
            .find(TextField)
            .at(1)
            .prop('onChange')({
            target: { name: 'testName', value: 'testValue' }
        });
        expect(
            wrapper
                .find(TextField)
                .at(1)
                .prop('option.dayOfWeek')
        ).toEqual();
        expect(props.onChange).toBeCalledWith('testName', 'testValue');
    });

    it('should calls PopperComponent prop for Autocomplete', () => {
        wrapper.find(Autocomplete).prop('PopperComponent')();
    });
});
