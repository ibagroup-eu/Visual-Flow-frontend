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

import {
    getBorderColor,
    getDefaultEdgeStyle,
    getDefaultVertexStyle,
    getWaitBorderColor
} from './styles';
import { mxConstants, mxEdgeStyle, mxPerimeter } from './graph';
import {
    ERROR,
    FAILED,
    PENDING,
    RUNNING,
    SKIPPED,
    SUCCEEDED,
    TERMINATED
} from '../constants';

describe('styles', () => {
    const theme = {
        palette: {
            other: {
                border: 'theme.palette.other.border',
                skipped: 'theme.palette.other.skipped'
            },
            success: {
                light: 'theme.palette.success.light'
            },
            error: {
                light: 'theme.palette.error.light'
            },
            info: {
                text: 'theme.palette.info.text'
            },
            secondary: {
                border: 'theme.palette.secondary.border'
            }
        },
        mxgraph: {
            border: {
                normal: 'theme.mxgraph.border.normal'
            }
        }
    };

    it('should return default vertex style', () => {
        expect(getDefaultVertexStyle(theme)).toEqual({
            [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_RECTANGLE,
            [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter,
            [mxConstants.STYLE_VERTICAL_ALIGN]: mxConstants.ALIGN_MIDDLE,
            [mxConstants.STYLE_ALIGN]: mxConstants.ALIGN_CENTER,
            [mxConstants.STYLE_STROKECOLOR]: theme.palette.other.border,
            [mxConstants.STYLE_STROKEWIDTH]: theme.mxgraph.border.normal,
            [mxConstants.STYLE_ROUNDED]: 1
        });
    });

    it('should return default edge style', () => {
        expect(getDefaultEdgeStyle(theme)).toEqual({
            [mxConstants.STYLE_STROKECOLOR]: theme.palette.success.light,
            [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_CONNECTOR,
            [mxConstants.STYLE_ALIGN]: mxConstants.ALIGN_CENTER,
            [mxConstants.STYLE_VERTICAL_ALIGN]: mxConstants.ALIGN_MIDDLE,
            [mxConstants.STYLE_EDGE]: mxEdgeStyle.ElbowConnector,
            [mxConstants.STYLE_ENDARROW]: mxConstants.ARROW_CLASSIC,
            [mxConstants.STYLE_ROUNDED]: 1
        });
    });

    describe('getBorderColor', () => {
        const COLORS = {
            [SUCCEEDED]: theme.palette.success.light,
            [FAILED]: theme.palette.error.light,
            [RUNNING]: theme.palette.info.text,
            [PENDING]: theme.palette.info.text,
            [TERMINATED]: theme.palette.error.light,
            [SKIPPED]: theme.palette.other.skipped,
            [ERROR]: theme.palette.error.light
        };

        it.each(Object.entries(COLORS).map(([k, v]) => ({ act: k, exp: v })))(
            'should return "$exp" for "$act" status',
            ({ act, exp }) => {
                expect(getBorderColor(act, theme)).toBe(exp);
            }
        );
    });

    describe('getWaitBorderColor', () => {
        const tests = [
            {
                node: {
                    id: 0,
                    edges: [
                        { target: 0, source: 1 },
                        { target: 0, source: 2 }
                    ]
                },
                statuses: { 1: SUCCEEDED, 2: SUCCEEDED },
                exp: theme.palette.success.light
            },
            {
                node: {
                    id: 0,
                    edges: [
                        { target: 0, source: 1 },
                        { target: 0, source: 2 }
                    ]
                },
                statuses: {},
                exp: undefined
            },
            {
                node: {
                    id: 0,
                    edges: [
                        { target: 0, source: 1 },
                        { target: 3, source: 2 }
                    ]
                },
                statuses: { 1: SUCCEEDED, 2: SUCCEEDED },
                exp: theme.palette.success.light
            },
            {
                node: {
                    id: 0,
                    edges: [
                        { target: 0, source: 1 },
                        { target: 0, source: 2 }
                    ]
                },
                statuses: { 1: SUCCEEDED, 2: PENDING },
                exp: undefined
            },
            {
                node: {
                    id: 0
                },
                statuses: {},
                exp: undefined
            },
            {
                node: {
                    id: 0,
                    edges: [
                        { target: 0, source: 1 },
                        { target: 3, source: 2 }
                    ]
                },
                statuses: { 1: ERROR, 2: SUCCEEDED },
                exp: undefined
            },
            {
                node: {
                    id: 0,
                    edges: [
                        { target: 0, source: 1 },
                        { target: 3, source: 2 }
                    ]
                },
                statuses: { 1: ERROR, 2: SUCCEEDED },
                exp: undefined
            }
        ];

        it.each(tests)('should return "$exp"', ({ node, statuses, exp }) => {
            expect(getWaitBorderColor(node, statuses, theme)).toBe(exp);
        });
    });
});
