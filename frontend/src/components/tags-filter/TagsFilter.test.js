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

import { ClickAwayListener, Popper } from '@material-ui/core';
import { mount, shallow } from 'enzyme';
import React from 'react';
import TagsButton from './tags-button/TagsButton';
import TagsFilter from './TagsFilter';

describe('TagsFilter', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            data: { test: true },
            onCheckTags: jest.fn(),
            resetTags: jest.fn(),
            checkedTags: [['test', true]]
        };

        wrapper = shallow(<TagsFilter {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls onOpen prop', () => {
        wrapper.find(TagsButton).prop('onOpen')({ currentTarget: {} });
    });

    it('should calls onClickAway prop', () => {
        wrapper.find(ClickAwayListener).prop('onClickAway')();
    });

    it('should calls onChange prop', () => {
        wrapper = mount(<TagsFilter {...props} />);
        wrapper.find(TagsButton).prop('onOpen')({ currentTarget: true });
        wrapper
            .find(Popper)
            .props()
            .children({ TransitionProps: {} })
            .props.children.props.children.at(0)
            .props.onChange({ target: { value: 'test' } });
    });

    it('should calls ref prop', () => {
        wrapper = mount(<TagsFilter {...props} />);
        wrapper.find(TagsButton).prop('onOpen')({ currentTarget: true });
        wrapper
            .find(Popper)
            .props()
            .children({ TransitionProps: {} })
            .props.children.props.children.at(1)
            .props.children.at(1)
            .ref({ scrollHeight: 100 });
    });
});
