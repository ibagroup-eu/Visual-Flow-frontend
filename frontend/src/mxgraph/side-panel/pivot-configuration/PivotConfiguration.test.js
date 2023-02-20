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
import PivotConfiguration from './PivotConfiguration';
import { PIVOT } from '../../constants';
import AutocompleteParameter from '../autocomplete-parameter/AutocompleteParameter';

describe('PivotConfiguration', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            state: { name: 'test', operation: PIVOT, operationType: 'pivot' },
            eableToEdit: true,
            onChange: jest.fn()
        };

        wrapper = shallow(<PivotConfiguration {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls AutocompleteParameter for option.groupBy and option.pivotColumn', () => {
        wrapper
            .find(AutocompleteParameter)
            .at(0)
            .prop('handleInputChange')({
            target: { name: 'test', value: 'testValue' }
        });
        expect(props.onChange).toBeCalledWith('test', 'testValue');
        wrapper
            .find(AutocompleteParameter)
            .at(1)
            .prop('handleInputChange')({
            target: { name: 'test2', value: 'testValue2' }
        });
        expect(props.onChange).toBeCalledWith('test2', 'testValue2');
    });

    it('should render component with unpivot', () => {
        wrapper = shallow(
            <PivotConfiguration
                {...props}
                state={{ ...props.state, operationType: 'unpivot' }}
            />
        );
        expect(wrapper.find(AutocompleteParameter)).toHaveLength(3);
    });
});
