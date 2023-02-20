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

import MxExtVertexHandler from './mxExtVertexHandler';
import { mxVertexHandler } from '../graph';

describe('MxExtVertexHandler', () => {
    const state = {
        view: { graph: { addListener: jest.fn() } },
        shape: {
            strokewidth: 1,
            scale: 2
        }
    };
    let mxExtVertexHandler;

    beforeEach(() => {
        jest.spyOn(mxVertexHandler.prototype, 'init').mockReturnThis();
        mxExtVertexHandler = new MxExtVertexHandler(state);
    });

    it('should redraw shape', () => {
        mxExtVertexHandler.selectionBorder = {};
        jest.spyOn(mxVertexHandler.prototype, 'redraw').mockReturnThis();

        const spyGetSelectionStrokeWidth = jest
            .spyOn(mxExtVertexHandler, 'getSelectionStrokeWidth')
            .mockReturnValue(2);

        mxExtVertexHandler.redraw();
        expect(spyGetSelectionStrokeWidth).toHaveBeenCalled();
        expect(mxExtVertexHandler.selectionBorder.strokewidth).toEqual(2);
    });

    it('should return selection shape', () => {
        jest.spyOn(
            mxVertexHandler.prototype,
            'createSelectionShape'
        ).mockReturnValue({});

        const shape = mxExtVertexHandler.createSelectionShape();

        expect(shape.isRounded).toBeTruthy();
    });

    it('should return correct SelectionStrokeWidth', () => {
        jest.spyOn(
            mxVertexHandler.prototype,
            'getSelectionStrokeWidth'
        ).mockReturnValue(2);

        const result = mxExtVertexHandler.getSelectionStrokeWidth();

        expect(result).toEqual(4);
    });

    it('SelectionStrokeWidth should use default values when no shape in state', () => {
        jest.spyOn(
            mxVertexHandler.prototype,
            'getSelectionStrokeWidth'
        ).mockReturnValue(2);

        const state = {
            view: { graph: { addListener: jest.fn() } }
        };
        mxExtVertexHandler = new MxExtVertexHandler(state);
        const result = mxExtVertexHandler.getSelectionStrokeWidth();

        expect(result).toEqual(2);
    });
});
