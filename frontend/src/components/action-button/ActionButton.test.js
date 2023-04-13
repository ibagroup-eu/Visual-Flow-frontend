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

import { shallow } from 'enzyme';
import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ActionButton } from './ActionButton';

describe('ActionButton', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            title: 'title',
            classes: {},
            disabled: false,
            loading: false,
            Icon: { type: { render: { displayName: 'DeleteIcon' } } },
            onClick: jest.fn()
        };

        const wrapper = func(<ActionButton {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(Tooltip).exists()).toBeTruthy();
    });

    it('should disable a button', () => {
        const [wrapper] = init({ disabled: true });

        expect(wrapper.find(IconButton).prop('disabled')).toBeTruthy();
    });

    it('should be clickable', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(IconButton).simulate('click');

        expect(props.onClick).toHaveBeenCalled();
    });

    it('should render a progress bar', () => {
        const [wrapper] = init({ loading: true });

        expect(wrapper.find(IconButton).prop('disabled')).toBeTruthy();
        expect(wrapper.find(CircularProgress).exists()).toBeTruthy();
    });
});
