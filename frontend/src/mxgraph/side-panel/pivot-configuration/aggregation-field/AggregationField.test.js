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
import { TextField } from '@material-ui/core';
import AggregationField from './AggregationField';

describe('AggregationField', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            ableToEdit: true,
            value: '(test)',
            onChange: jest.fn(),
            name: 'testName',
            label: 'testLabel',
            required: true
        };

        wrapper = shallow(<AggregationField {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls onChange for first TextField', () => {
        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({
            target: { name: props.name, value: 'testValue' }
        });
        expect(props.onChange).toBeCalledWith(props.name, 'testValue(test)');
    });

    it('should calls onChange for second TextField', () => {
        wrapper
            .find(TextField)
            .at(1)
            .prop('onChange')({
            target: { name: props.name, value: 'testName' }
        });
        expect(props.onChange).toBeCalledWith(props.name, '(testName)');
    });

    it('should render without value', () => {
        wrapper = shallow(<AggregationField {...props} value="" />);
        expect(
            wrapper
                .find(TextField)
                .at(1)
                .prop('value')
        ).toBe('');
    });
});
