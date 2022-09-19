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
import { Chip, Menu, MenuItem, Tooltip } from '@material-ui/core';
import TagsList from './TagsList';

describe('Tags list', () => {
    let wrapper;
    const defaultProps = {
        tags: ['1', '2', '3', '4', '5'],
        limit: 3
    };

    beforeEach(() => {
        wrapper = shallow(<TagsList {...defaultProps} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render menu correctly for 5 tags', () => {
        expect(wrapper.find(Menu)).toHaveLength(1);
        expect(wrapper.find(MenuItem)).toHaveLength(2);
    });

    it('should render chips for every tag and extra chip', () => {
        expect(wrapper.find(Chip)).toHaveLength(6);

        const [, , , extraChip] = wrapper.find(Chip).map(chip => chip);
        expect(extraChip.prop('label')).toEqual('+2');
    });

    it('should open menu', () => {
        const [, , , extraChip] = wrapper.find(Chip).map(chip => chip);
        extraChip.simulate('click', { target: {} });
        expect(wrapper.find(Menu).prop('open')).toEqual(true);
    });

    it('should close menu', () => {
        const [, , , extraChip] = wrapper.find(Chip).map(chip => chip);
        extraChip.simulate('click', { target: {} });

        wrapper.find(Menu).simulate('close');
        expect(wrapper.find(Menu).prop('open')).toEqual(false);
    });

    it('should render Tooltip and truncate long tags', () => {
        wrapper.setProps({ tags: ['very_long_tag', '2', '3', '4', '5'] });

        expect(wrapper.find(Tooltip)).toHaveLength(3);

        const [chip] = wrapper.find(Chip).map(chip => chip);
        expect(chip.prop('label')).toEqual('very_l...');
    });
});
