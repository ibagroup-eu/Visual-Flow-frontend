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

import JsonCodec from './JsonCodec';

describe('JsonCodec', () => {
    it('should encode', () => {
        const value = {
            key_1: 'value_1',
            key_2: 'value_2'
        };

        const encoded = new JsonCodec().encode(value);

        Object.entries(value).forEach(([k, v]) => {
            expect(encoded.getAttribute(k)).toBe(v);
        });
    });

    it('should decode', () => {
        const model = {
            cells: {
                key_1: {},
                key_2: {},
                key_3: {}
            },
            getCell: jest
                .fn()
                .mockReturnValueOnce({})
                .mockReturnValueOnce({ value: 'value_1', parent: 'parent_1' })
                .mockReturnValueOnce({ value: 'value_2', parent: 'parent_2' })
        };

        expect(new JsonCodec().decode(model)).toEqual([
            { value: 'value_1', parent: 'parent_1' },
            { value: 'value_2', parent: 'parent_2' }
        ]);
    });
});
