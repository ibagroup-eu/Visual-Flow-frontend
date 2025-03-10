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
import { Collapse, ListItemText, MenuItem } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { MenuBarItem } from './MenuBarItem';
import ItemIcon from './ItemIcon';

const FakeIcon = () => <div>FakeIcon</div>;

describe('MenuBarItem', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            item: {
                link: 'link',
                items: [{ name: 1 }, { name: 2 }],
                Icon: FakeIcon,
                name: 'name'
            },
            menuOpen: true,
            onClick: jest.fn()
        };

        const wrapper = func(<MenuBarItem {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(MenuItem).exists()).toBeTruthy();
        expect(wrapper.find(ItemIcon).exists()).toBeTruthy();
        expect(wrapper.find(ListItemText).exists()).toBeTruthy();
        expect(wrapper.find(Collapse).exists()).toBeTruthy();
        expect(wrapper.find(MenuBarItem).length).toBe(2);
    });

    it('should not render menu bar items', () => {
        const [wrapper] = init({ menuOpen: false });

        expect(wrapper.find(Collapse).exists()).toBeFalsy();
        expect(wrapper.find(MenuBarItem).length).toBe(0);
    });

    it('should render ExpandMore icon', () => {
        const [wrapper] = init();

        expect(wrapper.find(ExpandMore).exists()).toBeTruthy();
    });

    it('should call onClick props', () => {
        const [wrapper, props] = init({ menuOpen: false }, true);
        wrapper.find(MenuItem).simulate('click');

        expect(props.onClick).toHaveBeenCalled();
    });

    it('should call onClick props', () => {
        const [wrapper, props] = init({ menuOpen: true }, true);
        wrapper.find(MenuItem).simulate('click');

        expect(props.onClick).toHaveBeenCalled();
    });
});
