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

/*
TODO: list of todo items:
1. Structure
    * make separate page for Transformation and place the Graph component into it:
        - page has to content all save-load functionality and pass proper methods into Graph as props
        - page is connected to store, graph is not connected to store
    *
2. Styles
    * use CSS Modules
    * adapt style of nodes to carbon-like
    * adapt style of right-click menu to carbon-like (or remove the menu)
    * replace tooltip with description by corresponding carbon component
    * when user drags new node it has to look like (or close to) the final node
    *
3. Validation
    * curricular graph is not allowed
    * 'input' stages (read data) have to have only output connections
    * 'output' stages (write data) have to have only input connections
    * other stages have to have at least one input connection and at least one output connection
    * display wrong stages in red
    *
4. Functionality
    * add proper stages into the palette
    * add object with stage details into node attributes
    * add editing for every stage type (modal window)
    * do not allow overlay nodes
    * rework toolbar:
        - add/remove some actions
        - maybe better to convert them into icon-buttons
        - maybe move some of their functions on the mouse and/or keyboard
          (f.e. scrolling mouse wheel or pressing +/- on keyboard => zooming)
    * convert to the json that is understandable by Gateway
    * remove XML from component
    * when graph model is changed component has to call a callback to pass new model to parent page
    *
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import mxgraph from 'mxgraph';
import { forEach, get, has, isEmpty, isEqual, set } from 'lodash';
import './common.css';
import { compose } from 'redux';
import { withStyles } from '@material-ui/styles';
import ReactDOMServer from 'react-dom/server';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import { withTheme } from '@material-ui/core';

import {
    setCurrentCell,
    setGraphDirty,
    setLogsModal,
    setSidePanel,
    setZoomValue
} from '../redux/actions/mxGraphActions';
import styles from './GraphDesigner.Styles';
import DesignerToolbar from './toolbar/designer-toolbar';
import SidePanel from './side-panel';
import Sidebar from './sidebar';
import renderStage from './stages/renderStage';
import JsonCodec from './sidebar/json-codec';
import stageLabels from './stageLabels';

import history from '../utils/history';
import JobsToolbar from './toolbar/jobs-toolbar';
import {
    RenderJobConfiguration,
    RenderPipelineConfiguration
} from './side-panel/render-configuration';
import PipelinesToolbar from './toolbar/pipelines-toolbar';
import {
    CDC,
    CONTAINER,
    DRAFT,
    EDGE,
    ERROR,
    FAILED,
    JOB,
    JOIN,
    PENDING,
    PIPELINE,
    RUNNING,
    SKIPPED,
    SUCCEEDED,
    TERMINATED
} from './constants';
import LogsModal from '../pages/logs-modal';
import { jobStagesByType } from './jobStages';
import { pipelinesStagesByType } from './pipelinesStages';
import { addStyles } from '../utils/mxgraph';

const {
    mxGraph,
    mxConstants,
    mxEdgeStyle,
    mxGraphHandler,
    mxGuide,
    mxEdgeHandler,
    mxRubberband,
    mxClient,
    mxUtils,
    mxEvent,
    mxConstraintHandler,
    mxConnectionConstraint,
    mxCellState,
    mxPoint,
    mxPerimeter,
    mxCompactTreeLayout
} = mxgraph();

class GraphDesigner extends Component {
    constructor(props) {
        super(props);
        const { theme } = this.props;
        this.refGraph = React.createRef();

        this.state = {
            graph: {},
            jobId: '',
            nodeId: '',
            undoManagerConfig: {},
            stageCopy: null
        };

        this.createPopupMenu = this.popupMenu.bind(this);
        this.jobStages = jobStagesByType(theme);
        this.pipelineStages = pipelinesStagesByType(theme);
    }

    componentDidMount() {
        const { data } = this.props;
        this.loadGraph(data?.definition);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentDidUpdate(prevProps) {
        const { data, sidePanelIsOpen } = this.props;
        const { graph } = this.state;

        this.hasBeenConfigured(graph);
        this.changeBorder();

        if (!isEqual(data?.definition, prevProps.data?.definition)) {
            this.loadContent(data?.definition, graph);
        }
        if (graph) {
            if (sidePanelIsOpen) {
                this.activateCell(graph);
            } else {
                this.deactivateCell(graph);
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    setUndoManagerConfig = configuration => {
        this.setState({ undoManagerConfig: configuration });
    };

    pasteCopyHandler = (event, graph) => {
        const { stageCopy } = this.state;
        const { theme } = this.props;

        const currentPath = history.location.pathname.split('/')[1];
        const stagesByType =
            currentPath === 'jobs' ? this.jobStages : this.pipelineStages;
        const valuesCopy = Object.entries(stageCopy.value.attributes).reduce(
            (acc, attrKey) => ({
                ...acc,
                [attrKey[1].nodeName]: attrKey[1].nodeValue
            }),
            {}
        );
        const newPoint = graph.getPointForEvent(event);
        if (valuesCopy.operation === JOIN) {
            delete valuesCopy.leftDataset;
            delete valuesCopy.rightDataset;
        } else if (valuesCopy.operation === CDC) {
            delete valuesCopy.newDataset;
            delete valuesCopy.oldDataset;
        }
        graph.insertVertex(
            graph.getDefaultParent(),
            stageCopy.target,
            stageLabels(valuesCopy),
            newPoint.x,
            newPoint.y,
            stageCopy.geometry.width,
            stageCopy.geometry.height,
            `fillColor=${
                stagesByType[valuesCopy.operation].color
            };rounded=1;strokeColor=${theme.palette.other.border};arcSize=7`
        );
    };

    popupMenu = (graph, menu, cell, event) => {
        const {
            data,
            sidePanelIsOpen,
            setDirtyGraph,
            setPanel,
            projectId
        } = this.props;
        const { stageCopy } = this.state;
        if (
            cell &&
            (!has(data, 'editable') || this.graphIsDisabled(data.editable))
        ) {
            if (cell.edge) {
                menu.addItem('Delete connection', null, () => {
                    graph.removeCells([cell]);
                    setDirtyGraph(true);
                    mxEvent.consume(event);
                });
            } else {
                history.location.pathname.includes('pipelines') &&
                    cell.value.attributes.jobId &&
                    menu.addItem(
                        `Open "${cell.value.attributes.jobName.nodeValue}" `,
                        null,
                        () => {
                            history.push(
                                `/jobs/${projectId}/${cell.value.attributes.jobId.nodeValue}`
                            );
                        }
                    );
                menu.addItem('Edit child node', null, () => {
                    this.props.setCell(cell.id);
                    setPanel(true);
                });
                menu.addItem('Copy child node', null, () => {
                    this.setState({ stageCopy: cell });
                });
                menu.addItem('Delete child node', null, () => {
                    sidePanelIsOpen && setPanel(false);
                    this.props.setCell('');
                    graph.removeCells([cell]);
                    mxEvent.consume(event);
                    setDirtyGraph(true);
                });
            }
        } else if (
            stageCopy !== null &&
            (!has(data, 'editable') || this.graphIsDisabled(data.editable))
        ) {
            menu.addItem('Paste child node', null, () => {
                this.pasteCopyHandler(event, graph);
                setDirtyGraph(true);
            });
        }
    };

    handleKeyDown = event => {
        const { data, sidePanelIsOpen, setDirtyGraph } = this.props;
        const { graph } = this.state;
        if (event.keyCode === 46 && !sidePanelIsOpen && graph.getSelectionCell()) {
            if (!has(data, 'editable') || this.graphIsDisabled(data.editable)) {
                const currentNodes = graph.getSelectionCells();
                this.props.setCell('');
                graph.popupMenuHandler.hideMenu();
                graph.removeCells(currentNodes);
                setDirtyGraph(true);
            }
        }
    };

    loadGlobalSetting = () => {
        // Enable alignment lines to help locate
        mxGraphHandler.prototype.guidesEnabled = true;
        // Alt disables guides
        mxGuide.prototype.isEnabledForEvent = event => !mxEvent.isAltDown(event);
        // Specifies if waypoints should snap to the routing centers of terminals
        mxEdgeHandler.prototype.snapToTerminals = true;
    };

    // main setting
    setGraphSetting = () => {
        const {
            theme,
            data,
            jobs,
            type,
            t,
            setPanel,
            params,
            pipelines
        } = this.props;
        const { graph } = this.state;
        const that = this;
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

        const vertexStyle = [];
        vertexStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
        vertexStyle[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        vertexStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        vertexStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        vertexStyle[mxConstants.STYLE_FILLCOLOR] = '#C3D9FF';
        vertexStyle[mxConstants.STYLE_STROKECOLOR] = '#6482B9';
        vertexStyle[mxConstants.STYLE_FONTCOLOR] = '#000000';
        vertexStyle[mxConstants.HANDLE_FILLCOLOR] = '#80c6ee';
        vertexStyle[mxConstants.STYLE_STROKEWIDTH] = theme.mxgraph.border.normal;

        graph.getStylesheet().putDefaultVertexStyle(vertexStyle);

        const edgeStyle = [];
        edgeStyle[mxConstants.STYLE_STROKECOLOR] = theme.palette.success.light;
        edgeStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
        edgeStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        edgeStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        edgeStyle[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
        edgeStyle[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
        edgeStyle[mxConstants.STYLE_FONTSIZE] = '10';

        graph.getStylesheet().putDefaultEdgeStyle(edgeStyle);

        graph.popupMenuHandler.factoryMethod = (menu, cell, event) =>
            that.createPopupMenu(graph, menu, cell, event);
        graph.convertValueToString = cell => {
            if (
                mxUtils.isNode(cell.value) &&
                cell.value.nodeName.toLowerCase() === 'taskobject'
            ) {
                const results = {};
                Object.keys(cell.value.attributes).forEach(attrKey => {
                    const attribute = cell.value.attributes[attrKey];
                    results[attribute.nodeName] = attribute.nodeValue;
                });
                const operation = cell.getAttribute('operation');
                if (operation === JOB) {
                    const job = jobs.find(
                        item => item.id === cell.getAttribute('jobId')
                    );
                    const jobInstance = job?.pipelineInstances?.find(
                        item => item.pipelineId === data.id
                    );
                    if (jobInstance) {
                        data.status === DRAFT
                            ? delete results.status
                            : (results.status = jobInstance.status);
                    }
                }
                if (operation === CONTAINER) {
                    if (data?.jobsStatuses && data?.jobsStatuses[cell.id]) {
                        results.status = data?.jobsStatuses[cell.id];
                    }
                }
                // Returns a DOM for the label
                return ReactDOMServer.renderToString(
                    renderStage(results, t, type, jobs, params, pipelines, theme)
                );
            }

            return null;
        };

        graph.addListener(mxEvent.EDITING_STARTED, (sender, event) => {
            const { currentCell, sidePanelIsOpen } = this.props;
            const cell = event.getProperty('cell');
            if (cell?.vertex) {
                if (sidePanelIsOpen && currentCell !== graph.getSelectionCell().id) {
                    this.deactivateCell(graph);
                }
                this.props.setCell(graph.getSelectionCell().id);
                setPanel(true);
            }
            graph.cellEditor.stopEditing(true);
        });

        graph.addListener(mxEvent.MOVE_CELLS, (sender, event) => {
            if (event.getProperty('clone')) {
                const clonedEdges = event
                    .getProperty('cells')
                    .filter(cell => cell.edge);
                forEach(clonedEdges, edge => {
                    graph.removeCells([edge]);
                    graph.insertEdge(
                        edge.parent,
                        null,
                        edge.value,
                        edge.source,
                        edge.target,
                        edge.style
                    );
                });
            }
        });

        graph.addListener(mxEvent.CLICK, (sender, event) => {
            const cell = event.getProperty('cell');
            if (cell != null) {
                const mouseEvent = event.getProperty('event');
                const nodeName = get(mouseEvent, 'target.nodeName', '');
                const nodeId =
                    nodeName === 'svg'
                        ? get(mouseEvent, 'target.id', '')
                        : get(mouseEvent, 'target.parentElement.id', '');
                const operation = cell.getAttribute('operation');
                if (operation === JOB && cell.getAttribute('jobId') === nodeId) {
                    const job = jobs.find(item => item.id === nodeId);
                    const jobId = job.pipelineInstances?.find(
                        item => item.pipelineId === data.id
                    )?.id;
                    this.setState({ jobId: jobId || nodeId, nodeId: '' });
                    this.props.setLogs(true);
                }
                if (
                    operation === CONTAINER &&
                    cell.getAttribute('name') === nodeId
                ) {
                    this.setState({ nodeId: cell.id });
                    this.props.setLogs(true);
                }
            }
        });
    };

    // settings for "Automatic layout" toolbar
    setLayoutSetting = () => {
        const { graph } = this.state;
        const layout = new mxCompactTreeLayout(graph, false);
        layout.parallelEdgeSpacing = 10;
        layout.useBoundingBox = false;
        layout.edgeRouting = false;
        layout.levelDistance = 60;
        layout.nodeDistance = 16;
        layout.parallelEdgeSpacing = 10;
        layout.isVertexMovable = () => true;
    };

    setLabel = (targetNodeType, labelCDC, labelJOIN) =>
        targetNodeType === CDC ? labelCDC : labelJOIN;

    selectionChange = () => {
        const { graph } = this.state;
        const { t } = this.props;
        const current = graph.getSelectionCell();

        if (get(current, 'edge', false)) {
            const targetId = current.target.id;
            const sourceId = current.source.id;
            const targetNode = graph.model.cells[targetId];
            const targetNodeType = get(
                targetNode,
                'value.attributes.operation.value',
                ''
            );
            const inputEdges = targetNode?.edges?.filter(
                edge => edge.target?.id === targetId
            );
            const currentSuccessPath = graph.model
                .getValue(inputEdges[0])
                .getAttribute('successPath');
            graph.addListener(mxEvent.CELL_CONNECTED, () => {
                if (
                    current.target?.id !== targetId ||
                    current.source?.id !== sourceId
                ) {
                    this.props.setDirtyGraph(true);
                }
                this.setDatasetOnChangeConnection(
                    current,
                    targetId,
                    targetNode,
                    targetNodeType
                );
            });
            // NEED REFACTOR
            if (targetNodeType === CDC || targetNodeType === JOIN) {
                const inputLabel = graph.model
                    .getValue(inputEdges[0])
                    .getAttribute('text');
                const labelExists =
                    inputLabel === 'Right' || inputLabel === 'Before';
                const firstEdge = Number(labelExists);
                const secondEdge = Number(!labelExists);
                graph.model.setValue(
                    inputEdges[firstEdge],
                    stageLabels({
                        operation: EDGE,
                        successPath: currentSuccessPath || 'true',
                        text: this.setLabel(
                            targetNodeType,
                            t('jobDesigner:CDCConfiguration.After'),
                            t('jobDesigner:joinConfiguration.Left')
                        )
                    })
                );

                graph.model.setValue(
                    inputEdges[secondEdge],
                    stageLabels({
                        operation: EDGE,
                        successPath: currentSuccessPath || 'true',
                        text: this.setLabel(
                            targetNodeType,
                            t('jobDesigner:CDCConfiguration.Before'),
                            t('jobDesigner:joinConfiguration.Right')
                        )
                    })
                );

                this.setDatasetOnConnection(
                    targetNode,
                    targetNodeType,
                    inputEdges[firstEdge],
                    inputEdges[secondEdge]
                );
            } else {
                graph.model.setValue(
                    inputEdges[0],
                    stageLabels({
                        operation: EDGE,
                        successPath: currentSuccessPath || 'true',
                        text: ''
                    })
                );
            }
        }
    };

    setDatasetOnConnection = (target, type, firstEdge, secondEdge) => {
        const { graph } = this.state;

        const targetValues = Object.entries(target.value.attributes).reduce(
            (acc, attrKey) => ({
                ...acc,
                [attrKey[1].nodeName]: attrKey[1].nodeValue
            }),
            {}
        );

        if (type === JOIN) {
            const newJoinValues = {
                operation: JOIN,
                joinType: get(target, 'value.attributes.joinType.value', ''),
                columns: get(target, 'value.attributes.columns.value', ''),
                name: get(target, 'value.attributes.name.value', ''),
                leftDataset: firstEdge?.source?.id || '',
                rightDataset: secondEdge?.source?.id || ''
            };

            if (!isEqual(newJoinValues, targetValues)) {
                graph.model.setValue(target, stageLabels(newJoinValues));
            }
        }
        if (type === CDC) {
            const newCDCValues = {
                operation: CDC,
                mode: get(target, 'value.attributes.mode.value', ''),
                keyColumns: get(target, 'value.attributes.keyColumns.value', ''),
                name: get(target, 'value.attributes.name.value', ''),
                newDataset: firstEdge?.source?.id || '',
                oldDataset: secondEdge?.source?.id || ''
            };

            if (!isEqual(newCDCValues, targetValues)) {
                graph.model.setValue(target, stageLabels(newCDCValues));
            }
        }
    };

    setDatasetOnChangeConnection = (
        current,
        targetId,
        targetNode,
        targetNodeType
    ) => {
        if (
            current.target?.id !== targetId &&
            (targetNodeType === CDC || targetNodeType === JOIN)
        ) {
            const inputNewEdges = targetNode?.edges?.filter(
                edge => edge.target?.id === targetId
            );
            const textLabel = get(
                inputNewEdges[0],
                'value.attributes.text.value',
                null
            );
            const labelExists = textLabel === 'Right' || textLabel === 'Before';
            const firstEdge = Number(labelExists);
            const secondEdge = Number(!labelExists);
            this.setDatasetOnConnection(
                targetNode,
                targetNodeType,
                inputNewEdges[firstEdge],
                inputNewEdges[secondEdge]
            );
        }
    };

    // connecting between vertices
    settingConnection = () => {
        const { graph } = this.state;
        const { setDirtyGraph } = this.props;
        mxConstraintHandler.prototype.intersects = (
            icon,
            point,
            source,
            existingEdge
        ) => !source || existingEdge || mxUtils.intersects(icon.bounds, point);

        if (graph.connectionHandler.connectImage === null) {
            graph.connectionHandler.isConnectableCell = () => false;
            mxEdgeHandler.prototype.isConnectableCell = cell =>
                graph.connectionHandler.isConnectableCell(cell);
        }

        // eslint-disable-next-line prefer-destructuring
        const jobStages = this.jobStages;

        graph.getAllConnectionConstraints = function getConnections(
            terminal,
            source
        ) {
            const targetNodeType = get(
                terminal,
                'cell.value.attributes.operation.value',
                ''
            );
            const terminalGraph = get(terminal, 'view.graph', '');
            const targetOutgoingEdges = terminalGraph.getOutgoingEdges(
                terminal.cell
            );
            const targetIncomingEdges = terminalGraph.getIncomingEdges(
                terminal.cell
            );

            const targetValid = get(jobStages[targetNodeType], 'validation', '');

            if (
                (targetOutgoingEdges.length >= targetValid.maxOutgoingConnections &&
                    source) ||
                (targetIncomingEdges.length >= targetValid.maxIncomingConnections &&
                    !source)
            ) {
                return null;
            }

            if (this.model.isVertex(terminal.cell)) {
                return [
                    new mxConnectionConstraint(new mxPoint(0.25, 0), true),
                    new mxConnectionConstraint(new mxPoint(0.5, 0), true),
                    new mxConnectionConstraint(new mxPoint(0.75, 0), true),

                    new mxConnectionConstraint(new mxPoint(0, 0.25), true),
                    new mxConnectionConstraint(new mxPoint(0, 0.5), true),
                    new mxConnectionConstraint(new mxPoint(0, 0.75), true),

                    new mxConnectionConstraint(new mxPoint(1, 0.25), true),
                    new mxConnectionConstraint(new mxPoint(1, 0.5), true),
                    new mxConnectionConstraint(new mxPoint(1, 0.75), true),

                    new mxConnectionConstraint(new mxPoint(0.25, 1), true),
                    new mxConnectionConstraint(new mxPoint(0.5, 1), true),
                    new mxConnectionConstraint(new mxPoint(0.75, 1), true)
                ];
            }
            return null;
        };

        const obj = stageLabels({
            operation: EDGE,
            successPath: 'true',
            text: ''
        });
        // Connect preview
        graph.connectionHandler.createEdgeState = function createEdge() {
            const edge = graph.createEdge(
                null,
                null,
                obj,
                null,
                null,
                'edgeStyle=orthogonalEdgeStyle'
            );
            graph.addListener(mxEvent.CELL_CONNECTED, () => {
                setDirtyGraph(true);
            });
            return new mxCellState(
                this.graph.view,
                edge,
                this.graph.getCellStyle(edge)
            );
        };
    };

    loadGraph = content => {
        // eslint-disable-next-line react/no-find-dom-node
        const container = ReactDOM.findDOMNode(this.refGraph.current);
        // Checks if the browser is supported
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        } else {
            const graph = new mxGraph(container);
            this.setState({ graph }, () => {
                // layout
                const layout = new mxCompactTreeLayout(graph, false);
                this.setLayoutSetting(layout);
                this.loadGlobalSetting();
                this.setGraphSetting();
                this.settingConnection();
                content && this.loadContent(content, graph);
            });
            // Disables the built-in context menu
            mxEvent.disableContextMenu(container);
            // Trigger event after selection
            graph
                .getSelectionModel()
                .addListener(mxEvent.CHANGE, this.selectionChange);
            graph.addListener(mxEvent.CELL_CONNECTED, this.selectionChange);
        }
    };

    loadContent = (content, graph) => {
        const jsonEncoder = new JsonCodec();
        const vertices = {};
        const parent = graph.getDefaultParent();
        graph.getModel().beginUpdate(); // Adds cells to the model in a single step
        try {
            // clear graph before render saved content
            graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));

            content?.graph?.forEach(node => {
                if (node.value) {
                    const xmlNode = jsonEncoder.encode(node.value);
                    if (xmlNode.getAttribute('operation') !== EDGE) {
                        vertices[node.id] = graph.insertVertex(
                            parent,
                            node.id,
                            xmlNode,
                            node.geometry.x,
                            node.geometry.y,
                            node.geometry.width,
                            node.geometry.height,
                            node.style
                        );
                    }
                }
            });

            content?.graph?.forEach(node => {
                if (node.value) {
                    const xmlNode = jsonEncoder.encode(node.value);
                    if (xmlNode.getAttribute('operation') === EDGE) {
                        graph.insertEdge(
                            parent,
                            node.id,
                            xmlNode,
                            vertices[node.source],
                            vertices[node.target],
                            node.style
                        );
                    }
                }
            });
        } finally {
            graph.getModel().endUpdate(); // Updates the display
        }
    };

    swapEdges = () => {
        const { graph } = this.state;
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

    zoom = val => {
        const { graph } = this.state;

        const roundedValue = +val.toFixed(1);
        if (roundedValue > 1.5 || roundedValue < 0.2) {
            return;
        }
        graph.zoomTo(roundedValue);
        this.props.setZoomValue(roundedValue);
    };

    changeColor = val => {
        let color;
        if (val === SUCCEEDED) {
            color = '#81c784';
        } else if (val === FAILED) {
            color = '#E57373';
        } else if (val === RUNNING || val === PENDING) {
            color = '#64b5f6';
        } else if (val === TERMINATED) {
            color = '#E57373';
        } else if (val === SKIPPED) {
            color = '#bdbdbd';
        } else if (val === ERROR) {
            color = '#E57373';
        }
        return color;
    };

    hasBeenConfigured = graph => {
        const { currentCell, theme, type } = this.props;

        if (!isEmpty(currentCell) && type === PIPELINE) {
            const cell = graph.model.getCell(currentCell);

            if (get(cell, 'value.attributes.length', 0) > 1) {
                const state = graph.view.getState(cell);

                set(state.style, 'strokeWidth', theme.mxgraph.border.strong);

                state.shape.apply(state);
                state.shape.redraw();
            }
        }
    };

    changeBorder = () => {
        const { data, type, pipelineStatus, theme } = this.props;

        if (data?.definition?.graph) {
            data.definition.graph.forEach(stage => {
                if (!stage.edge) {
                    // eslint-disable-next-line no-param-reassign
                    stage.style = addStyles(
                        {
                            strokeColor: theme.palette.other.border,
                            strokeWidth:
                                type === PIPELINE
                                    ? theme.mxgraph.border.strong
                                    : theme.mxgraph.border.normal
                        },
                        stage.style
                    );
                }
            });
            if (type === PIPELINE && data?.jobsStatuses) {
                // eslint-disable-next-line no-restricted-syntax
                for (const key of Object.keys(data?.jobsStatuses)) {
                    const currentStage = data?.definition.graph.find(
                        item => item.id === key
                    );
                    const currentStageStatus = data?.jobsStatuses[key];

                    currentStage.style = addStyles(
                        {
                            strokeColor: this.changeColor(
                                currentStageStatus || pipelineStatus
                            )
                        },
                        currentStage.style
                    );
                }
            }
        }
    };

    graphIsDisabled = value => {
        const { jobStatus, pipelineStatus, type, data } = this.props;
        const status = type === JOB ? jobStatus : pipelineStatus;
        if (isEmpty(data.definition)) {
            return true; // new job, parameters are active
        }
        return status === PENDING || status === RUNNING ? false : value;
    };

    activateCell = graph => {
        const { currentCell } = this.props;
        if (!isEmpty(currentCell)) {
            const cell = graph.model.getCell(currentCell);

            const state = graph.view.getState(cell);

            state.shape.node.style.filter =
                'drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.2)) drop-shadow(0px 10px 14px rgba(0, 0, 0, 0.14)) drop-shadow(0px 4px 18px rgba(0, 0, 0, 0.12))';
            state.shape.apply(state);
            state.shape.redraw();
        }
    };

    deactivateCell = graph => {
        const { currentCell } = this.props;

        if (!isEmpty(currentCell)) {
            const cell = graph.model.getCell(currentCell);

            const state = graph.view.getState(cell);

            state.shape.node.style.filter = null;
            state.shape.apply(state);
            state.shape.redraw();
        }
    };

    render() {
        const {
            classes,
            data,
            param,
            type,
            zoomVal,
            panning,
            showLogsModal,
            sidePanelIsOpen,
            setPanel,
            setDirtyGraph,
            setLogs,
            setCell
        } = this.props;
        const { graph, jobId, nodeId, undoManagerConfig } = this.state;
        const currentPath = history.location.pathname.split('/');
        const currentProject = currentPath.slice(-2, -1)[0];
        const currentJob = type === PIPELINE ? jobId : currentPath.slice(-1)[0];
        return (
            <div className={classes.root}>
                <LogsModal
                    display={showLogsModal}
                    projectId={currentProject}
                    pipelineId={data.id}
                    nodeId={nodeId}
                    jobId={currentJob}
                    onClose={() => setLogs(false)}
                />
                <Sidebar
                    graph={graph}
                    name={data?.name}
                    ableToEdit={this.graphIsDisabled(param)}
                />
                <div className={classes.content}>
                    <DesignerToolbar
                        zoom={this.zoom}
                        graph={graph}
                        data={data}
                        setDirty={setDirtyGraph}
                        setUndoManagerConfig={this.setUndoManagerConfig}
                    >
                        {type === JOB && (
                            <JobsToolbar
                                setShowModal={setLogs}
                                setSidePanel={setPanel}
                                sidePanelIsOpen={sidePanelIsOpen}
                            />
                        )}
                        {type === PIPELINE && (
                            <PipelinesToolbar
                                setSidePanel={setPanel}
                                sidePanelIsOpen={sidePanelIsOpen}
                                setCurrentCell={setCell}
                            />
                        )}
                    </DesignerToolbar>
                    <div
                        onWheel={e => {
                            if (e.deltaY < 0) {
                                this.zoom(zoomVal + 0.1);
                            } else {
                                this.zoom(zoomVal - 0.1);
                            }
                        }}
                        id="refGraph"
                        className={classNames(
                            classes.container,
                            panning && classes.panTool
                        )}
                        ref={this.refGraph}
                    />
                </div>
                <SidePanel
                    graph={graph}
                    type={type}
                    setUndoManagerConfig={this.setUndoManagerConfig}
                    undoManagerConfig={undoManagerConfig}
                >
                    {type === JOB && (
                        <RenderJobConfiguration
                            ableToEdit={
                                !has(data, 'editable') ||
                                this.graphIsDisabled(data.editable)
                            }
                            swapEdges={this.swapEdges}
                        />
                    )}
                    {type === PIPELINE && (
                        <RenderPipelineConfiguration
                            ableToEdit={
                                !has(data, 'editable') ||
                                this.graphIsDisabled(data.editable)
                            }
                        />
                    )}
                </SidePanel>
            </div>
        );
    }
}

GraphDesigner.propTypes = {
    setLogs: PropTypes.func,
    setDirtyGraph: PropTypes.func,
    setPanel: PropTypes.func,
    currentCell: PropTypes.string,
    setCell: PropTypes.func,
    setZoomValue: PropTypes.func,
    classes: PropTypes.object,
    data: PropTypes.object,
    jobStatus: PropTypes.string,
    projectId: PropTypes.string,
    pipelineStatus: PropTypes.string,
    t: PropTypes.func,
    param: PropTypes.bool,
    sidePanelIsOpen: PropTypes.bool,
    type: PropTypes.string,
    zoomVal: PropTypes.number,
    panning: PropTypes.bool,
    showLogsModal: PropTypes.bool,
    jobs: PropTypes.array,
    pipelines: PropTypes.array,
    params: PropTypes.array,
    theme: PropTypes.object
};

const mapStateToProps = state => ({
    sidePanelIsOpen: state.mxGraph.sidePanelIsOpen,
    currentCell: state.mxGraph.currentCell,
    data: state.mxGraph.data,
    jobStatus: state.jobStatus.status,
    pipelineStatus: state.pipelineStatus.status,
    param: state.pages.settingsParameters.data?.editable,
    zoomVal: state.mxGraph.zoomValue,
    jobs: state.pages.jobs.data.jobs,
    pipelines: state.pages.pipelines.data.pipelines,
    panning: state.mxGraph.panning,
    showLogsModal: state.mxGraph.showLogsModal,
    params: state.pages.settingsParameters.data.params
});

const mapDispatchToProps = {
    setLogs: setLogsModal,
    setDirtyGraph: setGraphDirty,
    setPanel: setSidePanel,
    setCell: setCurrentCell,
    setZoomValue
};

export default compose(
    withTheme,
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(GraphDesigner);
