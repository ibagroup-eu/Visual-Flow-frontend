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

import {
    duplicates,
    insert,
    mapSortUnique,
    remove,
    sortUnique,
    swap,
    update
} from './array';

describe('array', () => {
    describe('should insert an element correctly', () => {
        const testCases = [
            [[0, 2], 0, 1, [0, 1, 2]],
            [[], 0, 1, [1]],
            [[0], 0, 1, [0, 1]],
            [[0, 1], 1, 2, [0, 1, 2]]
        ];

        testCases.forEach(([arr, index, newItem, result]) =>
            it(`should return '[${result}]' for arr: '[${arr}]', index: '${index}', newItem: '${newItem}'`, () =>
                expect(insert(arr, index, newItem)).toEqual(result))
        );
    });

    describe('should remove an element correctly', () => {
        const testCases = [
            [[0], 0, []],
            [[0, 1], 1, [0]],
            [[0, 1], 0, [1]],
            [[], 0, []]
        ];

        testCases.forEach(([arr, index, result]) =>
            it(`should return '[${result}]' for arr: '[${arr}]', index: '${index}'`, () =>
                expect(remove(arr, index)).toEqual(result))
        );
    });

    describe('should update an element correctly', () => {
        const testCases = [
            [[0, 0], 1, 1, [0, 1]],
            [[0], 0, -1, [-1]],
            [[], 0, 0, [0]]
        ];

        testCases.forEach(([arr, index, newItem, result]) =>
            it(`should return '[${result}]' for arr: '[${arr}]', index: '${index}', newItem: '${newItem}'`, () =>
                expect(update(arr, index, newItem)).toEqual(result))
        );
    });

    describe('should swap elements correctly', () => {
        const testCases = [
            [[0, 1], 0, 1, [1, 0]],
            [[0, 1, 2], 0, 2, [2, 1, 0]]
        ];
        testCases.forEach(([arr, indexOne, indexTwo, result]) =>
            it(`should return '[${result}]' for arr: '[${arr}]', indexOne: '${indexOne}', indexTwo: '${indexTwo}'`, () =>
                expect(swap(arr, indexOne, indexTwo)).toEqual(result))
        );
    });

    describe('should find duplicates correctly', () => {
        const testCases = [
            [[0, 1, 2, 3, 1, 1], x => x, [4, 5]],
            [[0, 1, 2, 3, 3, 3], x => x, [4, 5]],
            [[0], x => x, []],
            [[0, 1, 2, 3], x => x, []],
            [[0, 0], x => x, [1]],
            [[], x => x, []]
        ];

        testCases.forEach(([arr, getHash, result]) =>
            it(`should return '[${result}]' for arr: '[${arr}]'`, () =>
                expect([...duplicates(arr, getHash)]).toEqual(result))
        );
    });

    describe('should return sorted array with unique elements', () => {
        const testCases = [
            [
                [0, 1, 2, 3, 1, 1],
                [0, 1, 2, 3]
            ],
            [
                [5, 13, 9, 10, 3],
                [3, 5, 9, 10, 13]
            ],
            [[0], [0]],
            [
                [3, 7, 1, 7, 7, 9],
                [1, 3, 7, 9]
            ],
            [[], []],
            [
                ['job_id_2', 'job_id_1'],
                ['job_id_1', 'job_id_2']
            ]
        ];

        testCases.forEach(([arr, result]) =>
            it(`should return '[${result}]' for arr: '[${arr}]'`, () =>
                expect([...sortUnique(arr)]).toEqual(result))
        );
    });

    describe('should apply function to the arrays sorted unique elements', () => {
        const testCases = [
            [[0, 1, 2, 3], el => el * 2, [0, 2, 4, 6]],
            [
                [
                    { key1: 'val1', spec_key: 'val2', key3: 'val3' },
                    { spec_key: 'val1', key2: 'val2' },
                    { key1: 'val1', key2: 'val2', spec_key: 'val3' }
                ],
                el => el.spec_key,
                ['val1', 'val2', 'val3']
            ],
            [[3, 7, 1, 7, 7, 9], el => el - 5, [-4, -2, 2, 4]],
            [[], el => el / 3, []]
        ];

        testCases.forEach(([arr, fn, result]) =>
            it(`should return '[${result}]' for arr: '[${arr}]' and func '${fn}'`, () =>
                expect([...mapSortUnique(arr, fn)]).toEqual(result))
        );
    });
});
