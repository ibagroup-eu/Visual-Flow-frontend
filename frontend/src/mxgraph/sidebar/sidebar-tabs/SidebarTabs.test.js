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

import { mount, shallow } from 'enzyme';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { SidebarTabs } from './SidebarTabs';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

jest.mock('../palette/Palette.Styles', () =>
    jest.fn().mockImplementation(() => ({}))
);

describe('SidebarTabs', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            name: 'name',
            ableToEdit: true
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<SidebarTabs {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(AppBar).exists()).toBeTruthy();
        expect(wrapper.find(Tab).length).toBe(2);
    });

    it('should hide palette tab', () => {
        const [wrapper] = init({ ableToEdit: false });

        expect(wrapper.find(Tab).length).toBe(1);
    });

    it('should set value 0', () => {
        const [wrapper] = init({ ableToEdit: true }, false, mount);

        expect(wrapper.find(Tabs).prop('value')).toBe(0);
    });

    it('should set value 1', () => {
        const [wrapper] = init({ ableToEdit: true, name: undefined }, false, mount);

        expect(wrapper.find(Tabs).prop('value')).toBe(1);
    });

    it('should set new value', () => {
        const [wrapper] = init({ ableToEdit: true }, false, mount);

        wrapper.find(Tabs).prop('onChange')({}, 100500);

        wrapper.update();

        expect(wrapper.find(Tabs).prop('value')).toBe(100500);
    });
});
