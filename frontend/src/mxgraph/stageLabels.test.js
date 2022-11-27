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

import stageLabels from './stageLabels';

describe('stageLabels', () => {
    const data = { operation: 'EDGE', successPath: 'true', text: '' };
    const object = stageLabels(data);

    it('should return TaskObject element', () => {
        expect(object.localName).toBe('TaskObject');
    });

    it('should return "operation" property with value "EDGE"', () => {
        expect(object.getAttribute('operation')).toBe('EDGE');
    });

    it('should return "successPath" property with value "true"', () => {
        expect(object.getAttribute('successPath')).toBe('true');
    });

    it('should return "text" property without value', () => {
        expect(object.getAttribute('text')).toBe('');
    });
});
