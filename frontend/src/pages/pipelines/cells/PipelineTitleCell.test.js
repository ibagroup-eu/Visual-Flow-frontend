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
import { Grid, Typography, Checkbox, TableCell } from '@material-ui/core';
import PipelineTitleCell from './PipelineTitleCell';

describe('PipelineTitleCell', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            title: '11111111',
            lastRun: '2022-07-07 13:25:39 +0000',
            lastFinished: '2022-07-07 13:26:10 +0000',
            lastEdit: '2022-06-23 08:44:40 +0000',
            checked: 'false',
            projectId: 'vsw-frontend',
            pipelineId: '09ce421f-e632-4b91-9437-a853bf72cda8',
            status: 'Draft',
            tags: [],
            onCheckTags: jest.fn(),
            resetTags: jest.fn(),
            checkedTags: [['test', true]]
        };

        wrapper = shallow(<PipelineTitleCell {...props} />);
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

    it('should render Checkbox', () => {
        expect(wrapper.find(Checkbox)).toBeDefined();
    });

    it('should render Grid', () => {
        expect(wrapper.find(Grid)).toBeDefined();
    });

    it('Typography length should be 2', () => {
        expect(wrapper.dive().find(Typography).length).toBe(2);
    });

    it('Checkbox length should be 2', () => {
        expect(wrapper.dive().find(Checkbox).length).toBe(1);
    });
});
