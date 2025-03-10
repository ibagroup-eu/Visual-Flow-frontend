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
import FileFormat from './FileFormat';

describe('FileFormat', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            value: 'test',
            onChange: jest.fn(),
            disabled: false,
            required: true
        };

        wrapper = shallow(<FileFormat {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('menuItems should be in alphabetical order', () => {
        const menuItems = wrapper.find('SelectField').prop('menuItems');
        expect(
            menuItems.every((el, i) => i === 0 || el.label >= menuItems[i - 1].label)
        ).toBe(true);
    });
});
