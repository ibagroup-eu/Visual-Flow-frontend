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

import { set } from 'lodash';

export const insert = (arr, index, newItem) => [
    ...arr.slice(0, index + 1),
    newItem,
    ...arr.slice(index + 1)
];

export const remove = (arr, index) => arr.filter((_, i) => i !== index);

export const update = (arr, index, newItem) => set([...arr], index, newItem);

export const swap = (arr, indexOne, indexTwo) => {
    const updated = [...arr];

    [updated[indexOne], updated[indexTwo]] = [updated[indexTwo], updated[indexOne]];

    return updated;
};

export const duplicates = (arr, getHash) => {
    const hashes = {};
    const duplicated = new Set();

    arr.forEach((field, index) => {
        const hash = getHash(field);

        if (hash in hashes) {
            duplicated.add(index);
        } else {
            hashes[hash] = index;
        }
    });

    return duplicated;
};

export const sortUnique = array =>
    array
        .sort((x, y) => (x < y ? -1 : 1))
        .filter((curr, i, arr) => arr.indexOf(curr) === i);

export const mapSortUnique = (arr, fn) => sortUnique(arr.map(fn));
