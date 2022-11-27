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

import { shallow } from 'enzyme';
import { MuiThemeProvider } from '@material-ui/core';
import renderStage from './renderStage';
import {
    CACHE,
    CDC,
    CONTAINER,
    EDGE,
    FILTER,
    GROUP,
    JOB,
    JOIN,
    NOTIFICATION,
    READ,
    REMOVE_DUPLICATES,
    SLICE,
    SORT,
    TRANSFORM,
    UNION,
    VALIDATE,
    WRITE
} from '../constants';

describe('should render the stage', () => {
    it.each([
        READ,
        WRITE,
        UNION,
        GROUP,
        REMOVE_DUPLICATES,
        JOIN,
        SLICE,
        CDC,
        EDGE,
        TRANSFORM,
        FILTER,
        CACHE,
        SORT,
        JOB,
        NOTIFICATION,
        CONTAINER,
        VALIDATE
    ])('should render "%s" stage', operation => {
        const columns = 'col_1,col_2';
        const stage = {
            operation,
            columns,
            name: 'name',
            groupingColumns: columns,
            keyColumns: columns
        };

        const wrapper = shallow(renderStage(stage, jest.fn(), '', [], []));

        expect(wrapper).toBeDefined();
    });

    it('should return default stage', () => {
        const stage = {
            operation: 'UNDEFINED',
            name: 'name'
        };

        const wrapper = shallow(renderStage(stage));

        const parent = wrapper.find(MuiThemeProvider);
        expect(parent.children()).toHaveLength(0);
    });
});
