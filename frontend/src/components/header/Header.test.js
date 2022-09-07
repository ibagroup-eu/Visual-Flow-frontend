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
import { Header } from './Header';
import { useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import { Drawer, IconButton } from '@material-ui/core';
import MenuBar from '../menu';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

describe('Header', () => {
    const init = (
        props = {},
        returnProps = false,
        func = shallow,
        useSelectorResult = undefined
    ) => {
        const defaultProps = {
            classes: {}
        };

        useSelector.mockImplementation(_ => useSelectorResult);

        const wrapper = func(<Header {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, false);

        expect(wrapper.find(AppBar).exists()).toBeTruthy();
        expect(wrapper.find(Drawer).exists()).toBeFalsy();
    });

    it('should render menu', () => {
        const [wrapper] = init({}, false, shallow, 'id');

        expect(wrapper.find(Drawer).exists()).toBeTruthy();
    });

    it('should handle "handleItemClick"', () => {
        const [wrapper] = init({}, false, shallow, 'id');

        expect(wrapper.find(MenuBar).prop('open')).toBe(true);

        wrapper
            .find(Drawer)
            .find(IconButton)
            .simulate('click');

        wrapper.update();

        expect(wrapper.find(MenuBar).prop('open')).toBe(false);

        wrapper.find(MenuBar).prop('onItemClick')({});

        wrapper.update();

        expect(wrapper.find(MenuBar).prop('open')).toBe(true);
    });
});
