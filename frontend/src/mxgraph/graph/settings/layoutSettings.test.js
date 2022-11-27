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

import { setLayoutSetting } from './layoutSettings';

jest.mock('../graph', () => ({
    mxCompactTreeLayout: jest.fn().mockImplementation((x, y) => ({
        parallelEdgeSpacing: undefined,
        useBoundingBox: undefined,
        edgeRouting: undefined,
        levelDistance: undefined,
        nodeDistance: undefined,
        isVertexMovable: undefined
    }))
}));

jest.mock('../styles', () => ({
    getDefaultEdgeStyle: jest.fn(),
    getDefaultVertexStyle: jest.fn()
}));

import { mxCompactTreeLayout } from '../graph';

describe('layoutSettings', () => {
    it('should layout settings', () => {
        const graph = {};

        const layout = setLayoutSetting(graph);

        expect(mxCompactTreeLayout).toHaveBeenCalledWith(graph, false);

        expect(layout.useBoundingBox).toBeFalsy();
        expect(layout.edgeRouting).toBeFalsy();
        expect(layout.parallelEdgeSpacing).toBe(10);
        expect(layout.levelDistance).toBe(60);
        expect(layout.nodeDistance).toBe(16);

        expect(layout.isVertexMovable()).toBeTruthy();
    });
});
