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
import { isStageRunnable } from './isStageRunnable';
import { EDGE, INTERACTIVE_SUCCEEDED } from '../../constants';

describe('isStageRunnable', () => {
    const mockData = {
        definition: {
            graph: [
                {
                    id: '1',
                    value: { operation: EDGE },
                    source: 'source1',
                    target: 'target1'
                },
                {
                    id: '2',
                    value: { operation: EDGE },
                    source: 'source2',
                    target: 'target2'
                },
                {
                    id: '3',
                    value: { operation: EDGE },
                    source: 'source2',
                    target: 'stage1'
                }
            ]
        }
    };

    const mockJobStagesData = [
        { id: 'source1', status: INTERACTIVE_SUCCEEDED },
        { id: 'source2', status: INTERACTIVE_SUCCEEDED },
        { id: 'target1', status: 'failed' }
    ];

    it('should return true if the stage is the first stage (no predecessors)', () => {
        const result = isStageRunnable('source1', mockData, mockJobStagesData);
        expect(result).toBe(true);
    });

    it('should return true if all predecessors have succeeded', () => {
        const result = isStageRunnable('stage1', mockData, mockJobStagesData);
        expect(result).toBe(true);
    });

    it('should return true if any predecessor has not succeeded (design allows partial success)', () => {
        const result = isStageRunnable('target1', mockData, mockJobStagesData);
        expect(result).toBe(true);
    });

    it('should return true if graph definition is missing', () => {
        const result = isStageRunnable('target1', {}, mockJobStagesData);
        expect(result).toBe(true);
    });
});
