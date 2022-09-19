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
import { useTranslation } from 'react-i18next';
import { Grid, Typography, TableCell } from '@material-ui/core';
import LinearProgressChart from '../../../components/chart/linear';
import PipelineUtilizationCell from './PipelineUtilizationCell';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('PipelineUtilizationCell', () => {
    let wrapper;
    let props;
    useTranslation.mockImplementation(() => ({ t: x => x }));

    beforeEach(() => {
        props = { status: 'Draft' };

        wrapper = shallow(<PipelineUtilizationCell {...props} />);
    });

    it('should render without crashes', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render TableCell', () => {
        expect(wrapper.find(TableCell)).toBeDefined();
    });

    it('should render Typography', () => {
        expect(wrapper.find(Typography)).toBeDefined();
    });

    it('should render LinearProgressChart', () => {
        expect(wrapper.find(LinearProgressChart)).toBeDefined();
    });

    it('should render Grid', () => {
        expect(wrapper.find(Grid)).toBeDefined();
    });

    it('Typography length should be 1', () => {
        expect(wrapper.dive().find(Typography).length).toBe(1);
    });

    it('Grid length should be 2', () => {
        expect(wrapper.dive().find(Grid).length).toBe(2);
    });

    it('should text value to be "pipelines:Progress"', () => {
        expect(
            wrapper
                .dive()
                .find(Typography)
                .text()
        ).toBe('pipelines:Progress');
    });
});
