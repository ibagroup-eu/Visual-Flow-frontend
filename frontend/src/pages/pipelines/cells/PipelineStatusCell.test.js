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
import { TableCell, Chip, Typography } from '@material-ui/core';
import PipelineStatusCell from './PipelineStatusCell';
import { ERROR } from '../../../mxgraph/constants';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('PipelineStatusCell', () => {
    let wrapper;
    let defaultProps;
    useTranslation.mockImplementation(() => ({ t: x => x }));

    beforeEach(() => {
        defaultProps = {
            projectId: 'vsw-frontend',
            pipelineId: '09ce421f-e632-4b91-9437-a853bf72cda8',
            status: 'Draft'
        };

        wrapper = mount(<PipelineStatusCell {...defaultProps} />);
    });

    it('should render without crashes', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render TableCell', () => {
        expect(wrapper.find(TableCell).length).toBe(1);
    });

    it('should render Typography', () => {
        expect(wrapper.find(Typography).length).toBe(1);
    });

    it('should render Chip', () => {
        expect(wrapper.find(Chip).length).toBe(1);
    });

    it('should render Chip with status = ERROR', () => {
        const props = {
            ...defaultProps,
            status: 'ERROR',
            showRerun: false
        };
        wrapper = mount(<PipelineStatusCell {...props} />);

        expect(wrapper.find(Chip).length).toBe(1);
        expect(wrapper.find(Chip).prop('label')).toBe('pipelines:Error');
    });

    it('should render Chip', () => {
        const props = {
            ...defaultProps,
            status: ERROR,
            showRerun: true,
            retry: jest.fn()
        };
        wrapper = mount(<PipelineStatusCell {...props} />);

        expect(wrapper.find(Chip).length).toBe(1);
        expect(wrapper.find(Chip).prop('label')).toBe('Error');

        wrapper.find(Chip).prop('onClick')();
        expect(props.retry).toHaveBeenCalled();
    });

    it('should text value to be "pipelines:Status"', () => {
        expect(wrapper.find(Typography).text()).toBe('pipelines:Status');
    });
});
