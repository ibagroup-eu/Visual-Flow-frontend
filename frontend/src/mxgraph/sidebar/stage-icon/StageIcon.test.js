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

import React from 'react';
import { shallow } from 'enzyme';
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
    PIPELINE,
    PIVOT,
    READ,
    REMOVE_DUPLICATES,
    SLICE,
    SORT,
    TRANSFORM,
    UNION,
    VALIDATE,
    WAIT,
    WITH_COLUMN,
    WRITE,
    AI_TEXT_TASK
} from '../../constants';
import StageIcon from './StageIcon';

describe('StageIcon', () => {
    it.each([
        { key: READ, value: 'Memo(ForwardRef(DescriptionOutlinedIcon))' },
        { key: WRITE, value: 'Memo(ForwardRef(CreateIcon))' },
        { key: GROUP, value: 'Memo(ForwardRef(DynamicFeedIcon))' },
        { key: REMOVE_DUPLICATES, value: 'RemoveDuplicates' },
        { key: FILTER, value: 'Filter' },
        { key: TRANSFORM, value: 'Transform' },
        { key: JOIN, value: 'Join' },
        { key: CDC, value: 'ChangeDataCapture' },
        { key: UNION, value: 'Union' },
        //{ key: AI_TEXT_TASK, value: 'AI Text Task' },
        { key: JOB, value: 'Memo(ForwardRef(TransformOutlinedIcon))' },
        { key: PIPELINE, value: 'Memo(ForwardRef(TimelineOutlinedIcon))' },
        { key: NOTIFICATION, value: 'Memo(ForwardRef(MailOutlinedIcon))' },
        { key: CONTAINER, value: 'Memo(ForwardRef(InboxOutlinedIcon))' },
        { key: CACHE, value: 'Memo(ForwardRef(StorageOutlinedIcon))' },
        { key: SORT, value: 'Memo(ForwardRef(SortOutlinedIcon))' },
        { key: SLICE, value: 'Memo(ForwardRef(DeleteSweepIcon))' },
        { key: VALIDATE, value: 'Memo(ForwardRef(CheckCircleOutlinedIcon))' },
        { key: WITH_COLUMN, value: 'Memo(ForwardRef(ViewWeekIcon))' },
        { key: DATETIME, value: 'Memo(ForwardRef(ScheduleOutlinedIcon))' },
        { key: PIVOT, value: 'Memo(ForwardRef(CachedOutlinedIcon))' },
        { key: WAIT, value: 'Memo(ForwardRef(ScheduleOutlinedIcon))' },
        { key: 'dummy', value: 'Fragment' }
    ])('should return $value for $key icon', ({ key, value }) => {
        const icon = shallow(<StageIcon stageName={key} />);
        expect(icon.find(value)).toHaveLength(1);
    });
});
