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

import { getNodeType, toObject } from './attr';

describe('utils/attr', () => {
    describe('toObject', () => {
        it.each([
            {
                attr: {
                    0: { nodeName: 'name', nodeValue: 'Test' },
                    1: { nodeName: 'operation', nodeValue: 'READ' }
                },
                exp: { name: 'Test', operation: 'READ' }
            },
            {
                attr: {
                    0: { nodeName: 'name', nodeValue: 'Test' },
                    1: { nodeName: 'operation', nodeValue: 'READ' },
                    2: { nodeName: 'name', nodeValue: 'Test_2' }
                },
                exp: { name: 'Test_2', operation: 'READ' }
            },
            {
                attr: {},
                exp: {}
            },
            {
                attr: undefined,
                exp: {}
            }
        ])('should convert $attr to $exp', ({ attr, exp }) => {
            expect(toObject(attr)).toEqual(exp);
        });
    });

    describe('getNodeType', () => {
        it.each([
            {
                node: {
                    value: {
                        attributes: {
                            operation: {
                                value: 'READ'
                            }
                        }
                    }
                },
                exp: 'READ'
            },
            {
                node: {
                    value: {
                        attributes: {
                            operation: {}
                        }
                    }
                },
                exp: ''
            },
            {
                attr: undefined,
                exp: ''
            }
        ])('should get $exp type from $node', ({ node, exp }) => {
            expect(getNodeType(node)).toEqual(exp);
        });
    });
});
