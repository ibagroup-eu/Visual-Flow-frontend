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
import SubstringIndexParameter from './SubstringIndex';
import { TextField } from '@material-ui/core';

describe('SubstringIndexParameter', () => {
    const init = (props = {}, returnProps = false) => {
        const defaultProps = {
            ableToEdit: true,
            onChange: jest.fn(),
            state: {
                name: 'test',
                function: 'repeat'
            }
        };

        const wrapper = shallow(
            <SubstringIndexParameter {...defaultProps} {...props} />
        );
        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({});
        expect(wrapper.find(TextField).exists()).toBeTruthy();
    });

    it('should handle TextField onChange prop', () => {
        const [wrapper, props] = init({}, true);
        wrapper
            .find(TextField)
            .at(0)
            .simulate('change', { target: { name: 'test', value: 'test' } });
        expect(props.onChange).toHaveBeenCalledWith('option.delimiter', 'test');
        wrapper
            .find(TextField)
            .at(1)
            .simulate('change', { target: { name: 'test', value: 'test' } });
        expect(props.onChange).toHaveBeenCalledWith('option.count', 'test');
    });
});
