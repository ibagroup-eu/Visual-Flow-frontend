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
import { mount, shallow } from 'enzyme';
import { Chip, ClickAwayListener } from '@material-ui/core';
import TagsList from './TagsList';

describe('Tags list', () => {
    let wrapper;
    const defaultProps = {
        tags: ['1', '2', '3', '4', '5'],
        limit: 3,
        checkedTags: { 1: true },
        onCheckTags: jest.fn()
    };

    beforeEach(() => {
        wrapper = shallow(<TagsList {...defaultProps} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls onOpen prop', () => {
        wrapper = mount(<TagsList {...defaultProps} />);
        wrapper
            .find(Chip)
            .at(3)
            .prop('onClick')({ currentTarget: {} });
    });

    it('should calls onClickAway prop', () => {
        wrapper.find(ClickAwayListener).prop('onClickAway')();
    });
});
