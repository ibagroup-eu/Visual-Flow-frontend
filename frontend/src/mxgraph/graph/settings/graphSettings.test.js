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
    mxRubberband: jest.fn().mockImplementation(x => x),
    mxConstants: {
        VERTEX_SELECTION_DASHED: undefined,
        VERTEX_SELECTION_COLOR: undefined,
        VERTEX_SELECTION_STROKEWIDTH: undefined
    }
}));

jest.mock('../styles', () => ({
    getDefaultEdgeStyle: jest.fn(),
    getDefaultVertexStyle: jest.fn()
}));

const mockCreateSelectionShape = jest.fn();
const MockVertexHandler = { createSelectionShape: mockCreateSelectionShape };
jest.mock('./mxExtVertexHandler', () => {
    return jest.fn().mockImplementation(() => {
        return MockVertexHandler;
    });
});

import { setGraphSettings } from './graphSettings';
import { getDefaultEdgeStyle, getDefaultVertexStyle } from '../styles';
import { mxConstants, mxRubberband } from '../graph';

describe('graphSettings', () => {
    it('should set graph settings', () => {
        const theme = {
            palette: {
                secondary: {
                    border: 'theme.palette.secondary.border'
                }
            }
        };

        const putDefaultVertexStyle = jest.fn();
        const putDefaultEdgeStyle = jest.fn();

        const graph = {
            gridSize: undefined,
            centerZoom: undefined,
            autoSizeCellsOnAdd: undefined,
            getTooltipForCell: undefined,

            setPanning: jest.fn(),
            setTooltips: jest.fn(),
            setConnectable: jest.fn(),
            setCellsEditable: jest.fn(),
            setEnabled: jest.fn(),
            setCellsResizable: jest.fn(),
            setHtmlLabels: jest.fn(),
            setAllowDanglingEdges: jest.fn(),
            setDisconnectOnMove: jest.fn(),
            model: { isVertex: jest.fn().mockReturnValue(true) },
            getStylesheet: () => ({
                putDefaultVertexStyle,
                putDefaultEdgeStyle
            })
        };

        setGraphSettings(graph, theme);

        expect(mxConstants.VERTEX_SELECTION_DASHED).toBeFalsy();
        expect(mxConstants.VERTEX_SELECTION_COLOR).toBe(
            'theme.palette.secondary.border'
        );
        expect(mxConstants.VERTEX_SELECTION_STROKEWIDTH).toBe(2);

        expect(mxRubberband).toHaveBeenCalledWith(graph);
        expect(getDefaultEdgeStyle).toHaveBeenCalledWith(theme);
        expect(getDefaultVertexStyle).toHaveBeenCalledWith(theme);

        expect(graph.gridSize).toBe(10);
        expect(graph.centerZoom).toBeTruthy();
        expect(graph.autoSizeCellsOnAdd).toBeTruthy();

        expect(graph.setPanning).toHaveBeenCalledWith(true);
        expect(graph.setTooltips).toHaveBeenCalledWith(true);
        expect(graph.setConnectable).toHaveBeenCalledWith(true);
        expect(graph.setCellsEditable).toHaveBeenCalledWith(true);
        expect(graph.setEnabled).toHaveBeenCalledWith(true);
        expect(graph.setCellsResizable).toHaveBeenCalledWith(false);
        expect(graph.setHtmlLabels).toHaveBeenCalledWith(true);
        expect(graph.setAllowDanglingEdges).toHaveBeenCalledWith(false);
        expect(graph.setDisconnectOnMove).toHaveBeenCalledWith(false);

        const cell = { getAttribute: jest.fn() };
        graph.getTooltipForCell(cell);

        expect(cell.getAttribute).toHaveBeenCalledWith('desc');

        expect(putDefaultVertexStyle).toHaveBeenCalled();
        expect(putDefaultEdgeStyle).toHaveBeenCalled();

        const v = graph.createHandler({});
        expect(v).toBe(MockVertexHandler);
    });
});
