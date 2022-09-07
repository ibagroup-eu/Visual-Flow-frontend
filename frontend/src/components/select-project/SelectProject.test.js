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
import { SelectProject } from './SelectProject';
import { Autocomplete } from '@material-ui/lab';

describe('SelectProject', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            projects: {
                projects: []
            },
            getProjects: jest.fn(0)
        };

        const wrapper = func(<SelectProject {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(Autocomplete).exists()).toBeTruthy();
    });

    it('should call "getProjects"', () => {
        const [_, props] = init({ projects: {} }, true, mount);

        expect(props.getProjects).toHaveBeenCalled();
    });
});
