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
import { mount, shallow } from 'enzyme';
import { Radio } from '@material-ui/core';
import SingleSelectModalRow from './SingleSelectModalRow';

describe('SingleSelectModalRow', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            ableToEdit: true,
            paramKey: 'testKey',
            value: 'testValue',
            secret: false,
            selectedValue: 'testkey',
            setSelectedValue: jest.fn(),
            defaultSelected: false
        };

        wrapper = shallow(<SingleSelectModalRow {...props} />);
    });

    it('should render component', () => {
        wrapper = mount(<SingleSelectModalRow {...props} />);
        expect(wrapper).toBeDefined();
    });

    it('should calls useEffect', () => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
        wrapper = mount(<SingleSelectModalRow {...props} defaultSelected />);
    });

    it('should calls onChange prop for Radio', () => {
        wrapper.find(Radio).prop('onChange')({ target: { value: 'test' } });
    });
});
