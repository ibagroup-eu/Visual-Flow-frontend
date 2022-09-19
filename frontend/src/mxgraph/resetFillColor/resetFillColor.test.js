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

import { resetFillColor } from './resetFillColor';

describe('resetFillColor', () => {
    it('should reset color', () => {
        const graph = {
            model: {
                cells: {
                    id_1: {
                        vertex: true
                    },
                    id_2: {
                        vertex: false
                    },
                    id_3: {
                        vertex: true
                    }
                }
            },
            setCellStyles: jest.fn()
        };

        const data = {
            definition: {
                graph: [
                    {
                        id: 'id_1',
                        style:
                            'fillColor=#E9F5FE;rounded=1;strokeColor=#000000;arcSize=7'
                    },
                    {
                        id: 'id_2',
                        style:
                            'fillColor=#E9F5FD;rounded=1;strokeColor=#000000;arcSize=7'
                    },
                    {
                        id: 'id_3',
                        style:
                            'fillColor=#E9F5FA;rounded=1;strokeColor=#000000;arcSize=7'
                    }
                ]
            }
        };

        resetFillColor(graph, data);

        expect(graph.setCellStyles.mock.calls).toEqual([
            [
                'fillColor',
                '#E9F5FE',
                [
                    {
                        vertex: true
                    }
                ]
            ],
            [
                'fillColor',
                '#E9F5FA',
                [
                    {
                        vertex: true
                    }
                ]
            ]
        ]);
    });
});
