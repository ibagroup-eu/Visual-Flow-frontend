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
import { mount, shallow } from 'enzyme';
import { useTranslation } from 'react-i18next';
import { TimerOffOutlined, TimerOutlined } from '@material-ui/icons';
import AutoRefreshButton from './AutoRefreshButton';
import { Tooltip } from '@material-ui/core';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('AutoRefreshButton', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            onRefresh: jest.fn(),
            isRunning: false
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<AutoRefreshButton {...defaultProps} {...props} />);
        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, false, mount);
        expect(wrapper).toBeDefined();
    });

    it('should render AutoRefresh on button', () => {
        const [wrapper] = init();
        expect(wrapper.find(TimerOutlined)).toBeDefined();
        expect(wrapper.find(Tooltip).prop('title')).toBe(
            'main:tooltip:AutoRefreshOn'
        );
    });

    it('should render AutoRefresh off button', () => {
        const [wrapper] = init(
            {
                isRunning: true
            },
            false,
            mount
        );

        expect(wrapper.find(TimerOffOutlined)).toBeDefined();
        expect(wrapper.find(Tooltip).prop('title')).toBe(
            'main:tooltip:AutoRefreshOff'
        );
    });
});
