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

import { DialogActions } from '@material-ui/core';
import { shallow } from 'enzyme';
import React from 'react';
import { Prompt } from 'react-router';
import { Users } from './users/Users';

describe('useUnsavedChangesWarning', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            loading: false,
            users: [],
            projectUsers: {}
        };

        wrapper = shallow(<Users {...props} />);
    });

    it('should calls message prop with return false and calls showModal function', () => {
        expect(wrapper.find(Prompt).invoke('message')({ pathname: '/' })).toBe(
            false
        );
    });

    it('should calls message prop with return true', () => {
        wrapper.find(Prompt).invoke('message')({ pathname: '/' });
        wrapper
            .find(DialogActions)
            .props()
            .children.at(1)
            .props.onClick();
        expect(wrapper.find(Prompt).invoke('message')({ pathname: '/' })).toBe(true);
    });

    it('should calls onClick prop with calls closeModal function', () => {
        wrapper.find(Prompt).invoke('message')({ pathname: '/' });
        wrapper
            .find(DialogActions)
            .props()
            .children.at(1)
            .props.onClick();
    });
});
