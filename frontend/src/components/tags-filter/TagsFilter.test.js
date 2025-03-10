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

import { Button, ClickAwayListener, Popper } from '@material-ui/core';
import { mount, shallow } from 'enzyme';
import React from 'react';
import TagsButton from './tags-button/TagsButton';
import TagsFilter from './TagsFilter';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('TagsFilter', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            data: { test: true, test2: false },
            onCheckTags: jest.fn(),
            resetTags: jest.fn(),
            checkedTags: { test: true }
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = shallow(<TagsFilter {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls useEffect', () => {
        wrapper = mount(<TagsFilter {...props} />);
    });

    it('should calls onOpen prop', () => {
        wrapper.find(TagsButton).prop('onOpen')({ currentTarget: {} });
    });

    it('should calls onClickAway prop', () => {
        wrapper.find(ClickAwayListener).prop('onClickAway')();
    });

    it('should set null to anchorEl', () => {
        wrapper.find(TagsButton).prop('onOpen')({ currentTarget: 'someValue' });
        wrapper.find(TagsButton).prop('onOpen')({});
    });

    it('should calls onChange prop for SearchInput', () => {
        wrapper
            .find(Popper)
            .props()
            .children({ TransitionProps: {} })
            .props.children.props.children.props.children.props.children.at(0)
            .props.onChange({ target: { value: 'test' } });
    });

    it('should render filteredTags', () => {
        wrapper = mount(<TagsFilter {...props} />);
        wrapper.find(TagsButton).prop('onOpen')({ currentTarget: {} });
        wrapper
            .find(Popper)
            .props()
            .children({ TransitionProps: {} })
            .props.children.props.children.props.children.props.children.at(0)
            .props.onChange({ target: { value: '2' } });
    });

    it('should render filteredTags without classes.filteredTags', () => {
        wrapper = mount(<TagsFilter {...props} />);
        wrapper.find(TagsButton).prop('onOpen')({ currentTarget: {} });
        wrapper
            .find(Popper)
            .props()
            .children({ TransitionProps: {} })
            .props.children.props.children.props.children.props.children.at(0)
            .props.onChange({ target: { value: 't' } });
    });

    it('should calls ref prop for collapse', () => {
        wrapper = mount(<TagsFilter {...props} />);
        wrapper.find(TagsButton).prop('onOpen')({ currentTarget: {} });
        wrapper
            .find(Popper)
            .props()
            .children({ TransitionProps: {} })
            .props.children.props.children.props.children.props.children.at(1)
            .props.children.at(1)
            .ref({ scrollHeight: 100 });
    });

    it('should set null to anchorEl', () => {
        wrapper = mount(<TagsFilter {...props} />);
        wrapper.find(TagsButton).prop('onOpen')({ currentTarget: {} });
        wrapper
            .find(Popper)
            .props()
            .children({ TransitionProps: {} })
            .props.children.props.children.props.children.props.children.at(1)
            .props.children.at(1)
            .ref({ scrollHeight: 100 });
    });
});
