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
import StageModal from './StageModal';
import {
    CACHE,
    CDC,
    CONTAINER,
    DATETIME,
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
    STRING,
    VALIDATE,
    WRITE,
    PIPELINE,
    WAIT,
    WITH_COLUMN,
    PIVOT,
    HANDLE_NULL,
    AI_TEXT_TASK
} from '../../../mxgraph/constants';

describe('StageModal', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {};

        const wrapper = func(<StageModal {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const stages = [
            READ,
            WRITE,
            FILTER,
            GROUP,
            REMOVE_DUPLICATES,
            JOIN,
            CDC,
            UNION,
            STRING,
            TRANSFORM,
            JOB,
            NOTIFICATION,
            CONTAINER,
            CACHE,
            SORT,
            SLICE,
            WITH_COLUMN,
            VALIDATE,
            DATETIME,
            PIPELINE,
            WAIT,
            PIVOT,
            HANDLE_NULL,
            AI_TEXT_TASK
        ];

        stages.forEach(stageName => {
            const wrapper = init({ stageName });

            expect(wrapper).toBeDefined();
        });
    });
});
