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
import {
    READ,
    WRITE,
    UNION,
    GROUP,
    REMOVE_DUPLICATES,
    JOIN,
    CDC,
    TRANSFORM,
    FILTER,
    JOB,
    NOTIFICATION,
    PIPELINE,
    CONTAINER,
    CACHE,
    SORT,
    SLICE
} from '../../constants';
import stageIcon from './stageIcon';

describe('stageIcon', () => {
    it('should return a correct stage icon', () => {
        const MAPPING = {
            [READ]: 'object',
            [WRITE]: 'object',
            [GROUP]: 'object',
            [REMOVE_DUPLICATES]: 'img',
            [FILTER]: 'img',
            [TRANSFORM]: 'img',
            [JOIN]: 'img',
            [CDC]: 'img',
            [UNION]: 'img',
            [JOB]: 'object',
            [PIPELINE]: 'object',
            [NOTIFICATION]: 'object',
            [CONTAINER]: 'object',
            [CACHE]: 'object',
            [SORT]: 'object',
            [SLICE]: 'object'
        };

        Object.entries(MAPPING).forEach(([k, v]) => {
            const icon = stageIcon(k);

            expect(icon.type.toString().includes(v)).toBeTruthy();
        });

        expect(stageIcon(undefined)).toEqual(<></>);
    });
});
