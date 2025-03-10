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
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@material-ui/core';
import TableTimeData from './TableTimeData';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('TableTimeData', () => {
    useTranslation.mockImplementation(() => ({ t: x => x }));

    const defaultProps = {
        lastRun: 'N/A',
        lastFinished: 'N/A',
        lastEdit: 'N/A',
        formatDate: jest.fn,
        formatTooltip: jest.fn
    };

    const wrapper = shallow(<TableTimeData {...defaultProps} />);

    it('should render without crashes', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render Tooltip', () => {
        expect(wrapper.find(Tooltip)).toBeDefined();
    });

    it('should Tooltip length to be 3', () => {
        expect(wrapper.find(Tooltip).length).toBe(3);
    });

    it('The third text value to be "filters:lastEdit: Invalid date"', () => {
        expect(
            wrapper
                .find(Tooltip)
                .at(2)
                .text()
        ).toBe('filters:lastEdit: Invalid date');
    });

    it('The second Tooltip text value to be "filters:lastFinished: Invalid date"', () => {
        expect(
            wrapper
                .find(Tooltip)
                .at(1)
                .text()
        ).toBe('filters:lastFinished: Invalid date');
    });

    it('The first Tooltip text value to be "filters:lastRun: Invalid date"', () => {
        expect(
            wrapper
                .find(Tooltip)
                .at(0)
                .text()
        ).toBe('filters:lastRun: Invalid date');
    });

    it('The both Tooltip text value to be "filters:lastRun: filters:N/A"', () => {
        wrapper.setProps({ lastRun: null, lastFinished: null });
        expect(
            wrapper
                .find(Tooltip)
                .at(0)
                .text()
        ).toBe('filters:lastRun: filters:N/A');
        expect(
            wrapper
                .find(Tooltip)
                .at(1)
                .text()
        ).toBe('filters:lastFinished: filters:N/A');
    });
});
