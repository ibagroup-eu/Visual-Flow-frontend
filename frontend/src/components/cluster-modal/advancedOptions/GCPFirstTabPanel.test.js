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
import { mount } from 'enzyme';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GCPFirstTabPanel from './GCPFirstTabPanel';
import SelectField from '../../select-field';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

describe('GCPFirstTabPanel', () => {
    const init = (
        props = {},
        returnProps = false,
        zones = ['us-east-1d'],
        func = mount
    ) => {
        const defaultProps = {
            fields: [],
            state: {
                POLICY: 'unrestricted',
                AVAILABILITY_ZONE: 'zone',
                LOCAL_SSDS: 'local'
            },
            onChange: jest.fn(),
            ableToEdit: true
        };

        useSelector.mockImplementation(_ => zones);

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<GCPFirstTabPanel {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);

        expect(wrapper).toBeDefined();

        expect(wrapper.find(SelectField).length).toBe(2);
        expect(
            wrapper
                .find(SelectField)
                .at(0)
                .prop('value')
        ).toBe('zone');
        expect(
            wrapper
                .find(SelectField)
                .at(1)
                .prop('value')
        ).toBe('local');
    });
});
