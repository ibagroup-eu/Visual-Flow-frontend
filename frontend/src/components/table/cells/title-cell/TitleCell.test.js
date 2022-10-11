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
import { Checkbox, Grid, Tooltip, Typography } from '@material-ui/core';
import TimelineIcon from '@material-ui/icons/Timeline';
import { TitleCell } from './TitleCell';
import TableTimeData from '../../../table-time-data';

describe('TitleCell', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            classes: {},
            title: 'title',
            pipelineId: 'pipelineId',
            pipelines: [{ id: 'pipelineId', name: 'name' }],
            onCheckTags: jest.fn(),
            checkedTags: [['test', true]]
        };

        const wrapper = func(<TitleCell {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({});

        expect(wrapper).toBeDefined();
        expect(wrapper.find(Grid).length).toBe(4);
        expect(wrapper.find(Checkbox).exists()).toBeTruthy();
        expect(wrapper.find(TableTimeData).exists()).toBeTruthy();
    });

    it('should render an appropriate title', () => {
        const [wrapper, props] = init({}, true);

        expect(
            wrapper
                .find(Typography)
                .at(0)
                .text()
        ).toBe(props.title);
    });

    it('should render timeline icon', () => {
        const [wrapper] = init();

        expect(wrapper.find(TimelineIcon).exists()).toBeTruthy();

        const title = wrapper.find(Tooltip).prop('title');

        expect(title).toBe('name');
    });

    it('should render timeline icon with default title', () => {
        const [wrapper] = init({ pipelines: [] });

        expect(wrapper.find(TimelineIcon).exists()).toBeTruthy();

        const title = wrapper.find(Tooltip).prop('title');

        expect(title).toBe('');
    });

    it('should not render timeline icon', () => {
        const [wrapper] = init({ pipelineId: undefined });

        expect(wrapper.find(TimelineIcon).exists()).toBeFalsy();
    });
});
