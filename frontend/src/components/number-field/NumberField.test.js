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
import NumberField from './NumberField';
import { TextField } from '@material-ui/core';
import ClearButton from '../../mxgraph/side-panel/helpers/ClearButton';

describe('NumberField', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            handleInputChange: jest.fn(),
            value: 'value'
        };

        const wrapper = func(<NumberField {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(TextField).exists()).toBeTruthy();
        expect(wrapper.find(ClearButton).exists()).toBeTruthy();
    });

    it('should handle "handleInputChange"', () => {
        const [wrapper, props] = init({}, true);

        const target = { name: 'name', value: 'value' };

        wrapper.find(TextField).simulate('change', { target });

        expect(props.handleInputChange).toHaveBeenCalledWith({ target });
    });

    it('should use a default value', () => {
        const [_, props] = init(
            { value: undefined, name: 'name', defaultValue: 100500 },
            true,
            mount
        );

        expect(props.handleInputChange).toHaveBeenCalledWith({
            target: {
                name: 'name',
                value: 100500
            }
        });
    });
});
