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
import IconCard from './IconCard';
import Avatar from '@material-ui/core/Avatar';
import { CardHeader } from '@material-ui/core';

const MockIcon = () => 'MockIcon';

describe('IconCard', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            title: 'title',
            color: 'color',
            Icon: MockIcon,
            children: <div>children</div>,
            sizing: undefined,
            IconColor: 'color'
        };

        const wrapper = func(<IconCard {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper).toBeDefined();
    });

    it('should return "jobsAndPipelines" avatar', () => {
        const [wrapper] = init();

        const avatar = wrapper
            .find(CardHeader)
            .dive()
            .dive()
            .find(Avatar);

        expect(
            avatar.prop('className').includes('jobsAndPipelinesAvatar')
        ).toBeTruthy();
    });

    it('should return "utilization" avatar', () => {
        const [wrapper] = init({ sizing: 'sm' });

        const avatar = wrapper
            .find(CardHeader)
            .dive()
            .dive()
            .find(Avatar);

        expect(avatar.prop('className').includes('utilizationAvatar')).toBeTruthy();
    });
});
