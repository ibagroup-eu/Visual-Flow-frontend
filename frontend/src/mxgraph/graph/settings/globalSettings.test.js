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

jest.mock('../graph', () => ({
    mxEdgeHandler: {
        prototype: {
            snapToTerminals: undefined
        }
    },
    mxEvent: {
        isAltDown: x => x
    },
    mxGraphHandler: {
        prototype: {
            guidesEnabled: undefined
        }
    },
    mxGuide: {
        prototype: {
            isEnabledForEvent: undefined
        }
    },
    mxVertexHandler: {
        prototype: {
            createSelectionShape: jest.fn(() => ({
                isRounded: false
            }))
        }
    }
}));

import { setGlobalSettings } from './globalSettings';
import { mxEdgeHandler, mxGraphHandler, mxGuide, mxVertexHandler } from '../graph';

describe('globalSettings', () => {
    it('should set global settings', () => {
        const shape = { isRounded: false };
        mxVertexHandler.prototype.createSelectionShape.mockImplementation(
            () => shape
        );

        setGlobalSettings();

        expect(mxGraphHandler.prototype.guidesEnabled).toBeTruthy();
        expect(mxEdgeHandler.prototype.snapToTerminals).toBeTruthy();
        expect(mxGuide.prototype.isEnabledForEvent(true)).toBeFalsy();

        mxVertexHandler.prototype.createSelectionShape('bounds');

        expect(shape.isRounded).toBeTruthy();
    });
});
