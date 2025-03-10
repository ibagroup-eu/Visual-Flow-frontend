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

import { Typography } from '@material-ui/core';

import AWSFirstTabPanel from './AWSFirstTabPanel';
import SelectField from '../../select-field';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

describe('AdvancedAWSContent', () => {
    const init = (
        props = {},
        returnProps = false,
        zones = ['us-east-1d'],
        func = mount
    ) => {
        const defaultProps = {
            fields: [],
            state: {
                AVAILABILITY_ZONE: 'value',
                MAX_SPOT_PRICE: 1000,
                AUTOSCALING_STORAGE: false,
                EBS_VOLUME_TYPE: 'type',
                VOLUMES: 3,
                DB_SIZE: 2000
            },
            errors: {
                MAX_SPOT_PRICE: 20
            },
            onChange: jest.fn(),
            onError: jest.fn(),
            ableToEdit: true
        };

        useSelector.mockImplementation(_ => zones);

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<AWSFirstTabPanel {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);

        expect(wrapper).toBeDefined();

        expect(wrapper.find(SelectField).length).toBe(2);
        expect(wrapper.find(Typography).length).toBe(1);
        expect(
            wrapper
                .find(Typography)
                .text()
                .includes('ebsSsdHdd')
        ).toBeTruthy();
    });

    it('should render without crashes', () => {
        const [wrapper] = init(
            {
                state: {
                    AVAILABILITY_ZONE: 'value',
                    MAX_SPOT_PRICE: 1000,
                    AUTOSCALING_STORAGE: false,
                    EBS_VOLUME_TYPE: 'none',
                    VOLUMES: 3,
                    DB_SIZE: 2000
                }
            },
            true
        );

        expect(wrapper).toBeDefined();

        expect(wrapper.find(SelectField).length).toBe(2);
        expect(
            wrapper
                .find(Typography)
                .text()
                .includes('ebsNone')
        ).toBeTruthy();
    });
});
