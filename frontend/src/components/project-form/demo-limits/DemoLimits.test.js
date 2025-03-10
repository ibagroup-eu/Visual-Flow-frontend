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

import { FormControlLabel } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import DemoLimits from './DemoLimits';
import LimitsField from '../limits';
import { READ } from '../../../mxgraph/constants';

describe('DemoLimits', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            card: {
                demoLimits: {
                    sourcesToShow: {
                        READ: ['AWS', 'ELASTIC', 'CASSANDRA'],
                        WRITE: ['AWS', 'ELASTIC', 'CASSANDRA']
                    },
                    jobsNumAllowed: 1,
                    pipelinesNumAllowed: 1,
                    expirationDate: '2023-10-10',
                    editable: true
                },
                editable: true,
                demo: true
            },
            handleChangeLimits: jest.fn(),
            setCardState: jest
                .fn()
                .mockImplementation(callback => callback(defaultProps.card)),
            setDirty: jest.fn()
        };

        const wrapper = func(<DemoLimits {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();
        expect(wrapper.find(LimitsField).exists()).toBeTruthy();
    });

    it('should render without crashes', () => {
        const [wrapper] = init({ project: {} });
        expect(wrapper.find(LimitsField).exists()).toBeTruthy();
    });

    it('should calls handleChangeDemoLimits function', () => {
        const [wrapper, _] = init();
        wrapper
            .find(LimitsField)
            .at(0)
            .prop('handleChangeLimits')({
            target: { id: 'jobsNumAllowed', value: 1 },
            persist: jest.fn()
        });
        expect(
            wrapper
                .find(LimitsField)
                .at(0)
                .prop('card').jobsNumAllowed
        ).toEqual(1);
    });

    it('should calls handleChangeAutocomplete function READ', () => {
        const [wrapper, _] = init();
        wrapper
            .find(Autocomplete)
            .at(0)
            .prop('onChange')(
            {
                target: { id: 'jobsNumAllowed', value: 1 },
                persist: jest.fn()
            },
            ['AWS S3'],
            READ
        );
        wrapper.update();
        expect(
            wrapper
                .find(Autocomplete)
                .at(0)
                .prop('value').length
        ).toEqual(3);
    });

    it('should calls handleChangeAutocomplete function WRITE', () => {
        const [wrapper, _] = init();
        wrapper
            .find(Autocomplete)
            .at(0)
            .prop('onChange')(
            {
                target: { id: 'jobsNumAllowed', value: 1 },
                persist: jest.fn()
            },
            ['AWS S3'],
            READ
        );
        wrapper.update();
        expect(
            wrapper
                .find(Autocomplete)
                .at(0)
                .prop('value').length
        ).toEqual(3);
    });

    it('should calls onChanged prop with checked', () => {
        const [wrapper] = init();
        wrapper
            .find(FormControlLabel)
            .prop('control')
            .props.onChange({
                target: { id: 'demo', checked: true },
                persist: jest.fn()
            });
        expect(
            wrapper.find(FormControlLabel).prop('control').props.checked
        ).toBeTruthy();
    });
});
