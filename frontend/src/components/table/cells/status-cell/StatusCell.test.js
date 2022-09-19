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
import { TableCell, Typography } from '@material-ui/core';
import { StatusCell } from './StatusCell';
import Status from '../../../status';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('StatusCell', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            status: 'status',
            classes: {},
            hint: 'hint'
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<StatusCell {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({});

        expect(wrapper).toBeDefined();
        expect(wrapper.find(TableCell).exists()).toBeTruthy();
        expect(wrapper.find(Typography).exists()).toBeTruthy();
        expect(wrapper.find(Status).exists()).toBeTruthy();
    });

    it('should render hint', () => {
        const [wrapper, props] = init({}, true);

        expect(wrapper.find(Typography).text()).toBe(props.hint);
    });

    it('should render default hint', () => {
        const [wrapper, _] = init({ hint: undefined }, true);

        expect(wrapper.find(Typography).text()).toBe('jobs:Status');
    });
});
