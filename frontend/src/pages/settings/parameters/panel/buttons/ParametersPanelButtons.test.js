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
import { Button } from '@material-ui/core';

import { ParametersPanelButtons } from './ParametersPanelButtons';
import CircularProgress from '@material-ui/core/CircularProgress';

describe('ParametersPanelButtons', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            classes: {},
            save: jest.fn(),
            cancel: jest.fn(),
            saving: false,
            disabled: false
        };

        const wrapper = func(
            <ParametersPanelButtons {...defaultProps} {...props} />
        );

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(Button).length).toBe(2);
    });

    it('should show progress bar', () => {
        const [wrapper] = init({ saving: true });

        expect(wrapper.find(CircularProgress).exists()).toBeTruthy();
    });

    it('should handle save', () => {
        const [wrapper, props] = init({}, true);

        const [saveBtn] = wrapper.find(Button).map(x => x);

        saveBtn.simulate('click');

        expect(props.save).toHaveBeenCalled();
    });
});
