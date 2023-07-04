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

import { get, set, isEmpty, isEqual, isNil, omit } from 'lodash';

import { addStyles, toObject } from './utils';
import {
    CDC,
    EDGE,
    JOIN,
    OLD_STAGE_WIDTH,
    PIPELINE,
    STAGE_WIDTH,
    WAIT
} from '../constants';
import stageLabels from '../stageLabels';
import JsonCodec from '../sidebar/json-codec';
import { getBorderColor, getWaitBorderColor } from './styles';

export const swapEdges = graph => {
    const currentCell = graph.getSelectionCell();

    const inputEdges = currentCell?.edges?.filter(
        edge => edge.source.id !== currentCell.id
    );

    if (inputEdges && inputEdges.length === 2) {
        const [first, second] = inputEdges;

        graph.removeCells([first]);
        graph.removeCells([second]);

        graph.insertEdge(
            second.parent,
            null,
            first.value,
            second.source,
            second.target,
            second.style
        );
        graph.insertEdge(
            first.parent,
            null,
            second.value,
            first.source,
            first.target,
            first.style
        );
    }
};

export const deactivateCell = (graph, currentCell) => {
    if (!isEmpty(currentCell)) {
        const cell = graph.model.getCell(currentCell);

        const state = graph.view.getState(cell);

        if (state) {
            state.shape.node.style.filter = null;
            state.shape.apply(state);
            state.shape.redraw();
        }
    }
};

export const activateCell = (graph, currentCell) => {
    if (!isEmpty(currentCell)) {
        const cell = graph.model.getCell(currentCell);

        const state = graph.view.getState(cell);

        state.shape.node.style.filter =
            'drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.2)) drop-shadow(0px 10px 14px rgba(0, 0, 0, 0.14)) drop-shadow(0px 4px 18px rgba(0, 0, 0, 0.12))';
        state.shape.apply(state);
        state.shape.redraw();
    }
};

export const setDatasetOnConnection = (
    graph,
    target,
    type,
    firstEdge,
    secondEdge
) => {
    const targetValues = toObject(target?.value?.attributes);

    const values = {
        [JOIN]: {
            operation: JOIN,
            joinType: get(target, 'value.attributes.joinType.value', ''),
            leftColumns: get(target, 'value.attributes.leftColumns.value', ''),
            rightColumns: get(target, 'value.attributes.rightColumns.value', ''),
            name: get(target, 'value.attributes.name.value', ''),
            leftDataset: firstEdge?.source?.id || '',
            rightDataset: secondEdge?.source?.id || ''
        },
        [CDC]: {
            operation: CDC,
            mode: get(target, 'value.attributes.mode.value', ''),
            keyColumns: get(target, 'value.attributes.keyColumns.value', ''),
            name: get(target, 'value.attributes.name.value', ''),
            newDataset: firstEdge?.source?.id || '',
            oldDataset: secondEdge?.source?.id || ''
        }
    };

    const newValues = values[type];

    if (!isNil(newValues) && !isEqual(newValues, targetValues)) {
        graph.model.setValue(target, stageLabels(newValues));
    }
};

export const setDatasetOnChangeConnection = (
    graph,
    { target: { id } = {} },
    targetId,
    targetNode,
    targetNodeType
) => {
    if (id !== targetId && (targetNodeType === CDC || targetNodeType === JOIN)) {
        const inputNewEdges = targetNode?.edges?.filter(
            edge => edge.target?.id === targetId
        );

        const textLabel = get(inputNewEdges[0], 'value.attributes.text.value', '');
        const labelExists = textLabel === 'Right' || textLabel === 'Before';

        const firstEdge = Number(labelExists);
        const secondEdge = Number(!labelExists);

        setDatasetOnConnection(
            graph,
            targetNode,
            targetNodeType,
            inputNewEdges[firstEdge],
            inputNewEdges[secondEdge]
        );
    }
};

export const loadContent = (content, graph, stages, theme, type, jobsStatuses) => {
    const jsonEncoder = new JsonCodec();
    const parent = graph.getDefaultParent();

    graph.getModel().beginUpdate(); // Adds cells to the model in a single step

    try {
        // clear graph before render saved content
        graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));

        const vertices = get(content, 'graph', [])
            .filter(({ value }) => value)
            .reduce((acc, node) => {
                const xmlNode = jsonEncoder.encode(node.value);
                const operation = xmlNode.getAttribute('operation');

                if (operation !== EDGE) {
                    const style = {
                        fillColor: stages[operation]?.color,
                        strokeWidth: theme.mxgraph.border.strong,
                        strokeColor:
                            operation !== WAIT
                                ? getBorderColor(get(jobsStatuses, node.id), theme)
                                : getWaitBorderColor(node, jobsStatuses, theme)
                    };

                    acc[node.id] = graph.insertVertex(
                        parent,
                        node.id,
                        xmlNode,
                        node.geometry.x,
                        node.geometry.y,
                        node.geometry.width === OLD_STAGE_WIDTH
                            ? STAGE_WIDTH
                            : node.geometry.width,
                        node.geometry.height,
                        addStyles(
                            type === PIPELINE
                                ? style
                                : omit(style, ['strokeWidth', 'strokeColor'])
                        )
                    );
                }

                return acc;
            }, {});

        get(content, 'graph', [])
            .filter(({ value }) => value)
            .forEach(node => {
                const xmlNode = jsonEncoder.encode(node.value);
                const { points } = node.geometry;
                if (xmlNode.getAttribute('operation') === EDGE) {
                    const edgeColor =
                        xmlNode.getAttribute('successPath') === 'false'
                            ? theme.palette.error.light
                            : theme.palette.success.light;

                    const edge = graph.insertEdge(
                        parent,
                        node.id,
                        xmlNode,
                        vertices[node.source],
                        vertices[node.target],
                        addStyles({ strokeColor: edgeColor }, node.style)
                    );

                    set(edge, 'geometry.points', points);
                }
            });
    } finally {
        graph.getModel().endUpdate(); // Updates the display
    }
};
