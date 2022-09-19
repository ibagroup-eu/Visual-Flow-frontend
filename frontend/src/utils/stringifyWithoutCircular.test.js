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

import stringifyWithoutCircular, {
    getJsonModel,
    replacer
} from './stringifyWithoutCircular';

jest.mock('../mxgraph/sidebar/json-codec/JsonCodec', () =>
    jest.fn().mockImplementation(() => ({
        decode: jest.fn().mockImplementation(() => 'model')
    }))
);

describe('stringifyWithoutCircular', () => {
    it('should call getJsonModel', () => {
        expect(getJsonModel({ getModel: jest.fn() })).toEqual({ graph: 'model' });
    });

    describe('replacer', () => {
        it('should return only value id', () => {
            expect(replacer('parent', { id: 'id' })).toBe('id');
        });

        it('should return result', () => {
            const value = {
                localName: 'localName',
                attributes: {
                    key_1: {
                        nodeName: 'name_1',
                        nodeValue: 'value_1'
                    },
                    key_2: {
                        nodeName: 'name_2',
                        nodeValue: 'value_2'
                    }
                }
            };

            expect(replacer('value', value)).toEqual({
                name_1: 'value_1',
                name_2: 'value_2'
            });
        });

        it('should return default value', () => {
            expect(replacer('parent', null)).toBeNull();
        });
    });

    it('should handle stringifyWithoutCircular', () => {
        expect(stringifyWithoutCircular({ getModel: jest.fn() })).toEqual(
            JSON.stringify({ graph: 'model' }, replacer, 4)
        );
    });
});
