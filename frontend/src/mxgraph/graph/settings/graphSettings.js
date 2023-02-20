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

/* eslint-disable no-param-reassign */

import { mxRubberband, mxConstants, mxGraph } from '../graph';
import { getDefaultEdgeStyle, getDefaultVertexStyle } from '../styles';
import MxExtVertexHandler from './mxExtVertexHandler';

// eslint-disable-next-line import/prefer-default-export
export const setGraphSettings = (graph, theme) => {
    graph.gridSize = 10;
    graph.setPanning(true);
    graph.setTooltips(true);
    graph.setConnectable(true);
    graph.setCellsEditable(true);
    graph.setEnabled(true);

    graph.setCellsResizable(false);

    // Enables HTML labels
    graph.setHtmlLabels(true);
    graph.centerZoom = true;
    // Autosize labels on insert where autosize=1
    graph.autoSizeCellsOnAdd = true;

    // Disable unconnected edges
    graph.setAllowDanglingEdges(false);
    graph.setDisconnectOnMove(false);

    // eslint-disable-next-line no-new
    new mxRubberband(graph);
    graph.getTooltipForCell = cell => cell.getAttribute('desc');

    mxConstants.VERTEX_SELECTION_DASHED = false;
    mxConstants.VERTEX_SELECTION_COLOR = theme.palette.secondary.border;
    mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;

    graph.getStylesheet().putDefaultVertexStyle(getDefaultVertexStyle(theme));

    graph.getStylesheet().putDefaultEdgeStyle(getDefaultEdgeStyle(theme));

    // eslint-disable-next-line func-names
    graph.createHandler = function(state, ...rest) {
        if (state != null && this.model.isVertex(state.cell)) {
            return new MxExtVertexHandler(state);
        }

        return mxGraph.prototype.createHandler.apply(this, [state, ...rest]);
    };
};
