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

import { descendingComparator, getComparator, stableSort } from './sort';

describe('sort', () => {
    [
        ['job1', 'job2', 1],
        ['job1', null, -1],
        [null, 'job1', 1],
        ['job2', 'job1', -1],
        ['job1', 'job1', 0],
        [null, null, 0],
        [undefined, null, 0]
    ].forEach(([a, b, result]) =>
        it(`should return ${result} for when comparing ${a} to ${b} descending`, () => {
            const comparator = getComparator('desc', 'item');
            expect(comparator({ item: a }, { item: b })).toEqual(result);
        })
    );

    [
        ['job1', 'job2', -1],
        ['job1', null, 1],
        [null, 'job1', -1],
        ['job2', 'job1', 1],
        ['job1', 'job1', 0],
        [null, null, 0],
        [undefined, null, 0]
    ].forEach(([a, b, result]) =>
        it(`should return ${result} for when comparing ${a} to ${b} ascending`, () => {
            const comparator = getComparator('asc', 'item');
            expect(comparator({ item: a }, { item: b }) === result).toBeTruthy();
        })
    );

    it('should sort the array', () => {
        expect(stableSort([1, 2, 2, 3], descendingComparator)).toEqual([3, 2, 2, 1]);
    });
});
