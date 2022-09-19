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
import { TableCell, Chip, Typography } from '@material-ui/core';
import PipelineStatusCell from './PipelineStatusCell';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('PipelineStatusCell', () => {
    let wrapper;
    let props;
    useTranslation.mockImplementation(() => ({ t: x => x }));

    beforeEach(() => {
        props = {
            projectId: 'vsw-frontend',
            pipelineId: '09ce421f-e632-4b91-9437-a853bf72cda8',
            status: 'Draft'
        };

        wrapper = shallow(<PipelineStatusCell {...props} />);
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

    it('should render Chip', () => {
        expect(wrapper.find(Chip)).toBeDefined();
    });

    it('should text value to be "pipelines:Status"', () => {
        expect(
            wrapper
                .dive()
                .find(Typography)
                .text()
        ).toBe('pipelines:Status');
    });
});
