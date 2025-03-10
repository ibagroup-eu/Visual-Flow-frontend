/* eslint-disable complexity */
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { get, has, isEmpty, isEqual, isNil, noop, set } from 'lodash';
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
    setZoomValue,
    setStageCopy,
    setInteractiveMode,
    getInteractiveJobSession,
    interactiveSessionEvent,
    clearInteractiveData
} from '../redux/actions/mxGraphActions';
import styles from './GraphDesigner.Styles';
import DesignerToolbar from './toolbar/designer-toolbar';
import SidePanel from './side-panel';
import Sidebar from './sidebar';
import renderStage from './stages/renderStage';
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
    EDGE,
    INTERACTIVE_SUCCEEDED,
    JOB,
    JOIN,
    PENDING,
    PIPELINE,
    RUN_EVENT,
    RUNNING,
    SUSPENDED,
    WAIT
} from './constants';
import LogsModal from '../pages/logs-modal';
import { jobStagesByType } from './jobStages';
import { pipelinesStagesByType } from './pipelinesStages';
import {
    addStyles,
    findJobInstance,
    getNodeType,
    toObject,
    isStageRunnable
} from './graph/utils';
import {
    activateCell,
    deactivateCell,
    loadContent,
    mxCellState,
    mxClient,
    mxConnectionConstraint,
    mxConstraintHandler,
    mxEdgeHandler,
    mxEvent,
    mxGraph,
    mxPoint,
    mxUtils,
    setDatasetOnChangeConnection,
    setDatasetOnConnection,
    setGlobalSettings,
    setGraphSettings,
    setLayoutSetting,
    swapEdges
} from './graph';
import { setDefaultPopupMenuStyle } from './graph/styles';
import InteractiveModeModal from '../components/inreractive-mode/Modal';
import PopoverWithMessage from '../components/inreractive-mode/PopoverWithMessage';

export class GraphDesigner extends Component {
    constructor(props) {
        super(props);

        const { theme, type } = this.props;
        this.refGraph = React.createRef();

        this.state = {
            graph: {},
            jobId: '',
            jobName: '',
            nodeId: '',
            undoManagerConfig: {},
            stages:
                type === JOB ? jobStagesByType(theme) : pipelinesStagesByType(theme),
            status: '',
            openMetadataModal: false,
            operation: '',
            openPopper: false,
            popoverType: '',
            popoverText: '',
            anchorEl: null,
            stageName: '',
            outputData: {},
            inputData: []
        };

        this.createPopupMenu = this.popupMenu.bind(this);
    }

    componentDidMount() {
        const {
            data,
            type,
            getJobSession,
            runId,
            toggleInteractiveMode
        } = this.props;
        const currentPath = history.location.pathname.split('/');
        const currentProject = currentPath.slice(-2, -1)[0];
        const currentJob = currentPath.slice(-1)[0];

        toggleInteractiveMode(false);

        if (type === JOB && runId) {
            getJobSession(currentProject, currentJob, runId);
        }
        this.loadGraph(data?.definition);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentDidUpdate(prevProps) {
        const { data, theme, type, interactiveMode, jobStagesData } = this.props;
        const { graph, stages } = this.state;

        if (
            !isEqual(data?.definition, prevProps.data?.definition) ||
            !isEqual(data?.jobsStatuses, prevProps.data?.jobsStatuses) ||
            interactiveMode !== prevProps.interactiveMode ||
            !isEqual(jobStagesData, prevProps.jobStagesData)
        ) {
            loadContent(
                data?.definition,
                graph,
                stages,
                theme,
                type,
                data?.jobsStatuses,
                interactiveMode,
                jobStagesData
            );
        }

        this.updateGraph(graph);
    }

    componentWillUnmount() {
        const { graph } = this.state;
        document.removeEventListener('keydown', this.handleKeyDown);
        if (graph.popupMenuHandler) {
            graph.popupMenuHandler.destroy();
        }
    }

    updateGraph = graph => {
        const {
            type,
            jobStatus,
            pipelineStatus,
            sidePanelIsOpen,
            currentCell,
            interactiveMode
        } = this.props;
        if (graph) {
            const status = type === JOB ? jobStatus : pipelineStatus;
            const that = this;
            if (!interactiveMode && [PENDING, RUNNING, SUSPENDED].includes(status)) {
                graph.setEnabled(false);
                // eslint-disable-next-line no-param-reassign
                graph.popupMenuHandler.factoryMethod = noop;
            } else {
                graph.setEnabled(true);
                // eslint-disable-next-line no-param-reassign
                graph.popupMenuHandler.factoryMethod = (menu, cell, event) =>
                    that.createPopupMenu(graph, menu, cell, event);
            }
            if (sidePanelIsOpen) {
                activateCell(graph, currentCell);
            } else {
                deactivateCell(graph, currentCell);
            }
        }
    };

    setUndoManagerConfig = configuration => {
        this.setState({ undoManagerConfig: configuration });
    };

    pasteCopyHandler = (event, graph) => {
        const { stages } = this.state;
        const { stageCopy, theme } = this.props;

        const valuesCopy = toObject(stageCopy.data.value.attributes);
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
            stageCopy.data.target,
            stageLabels(valuesCopy),
            newPoint.x,
            newPoint.y,
            stageCopy.data.geometry.width,
            stageCopy.data.geometry.height,
            addStyles({
                fillColor: stages[valuesCopy.operation].color,
                strokeColor: theme.palette.other.border
            })
        );
    };

    popupMenu = (graph, menu, cell, event) => {
        const {
            data,
            sidePanelIsOpen,
            setDirtyGraph,
            setPanel,
            projectId,
            type,
            setCell,
            classes,
            copyStage,
            stageCopy,
            t
        } = this.props;

        const items = [
            {
                name: t('jobDesigner:stagePopupMenu.deleteConnection'),
                visible: cell && cell.edge,
                onClick: () => {
                    graph.removeCells([cell]);
                    setDirtyGraph(true);
                    mxEvent.consume(event);
                }
            },
            {
                name: `Open "${get(cell, 'value.attributes.jobName.nodeValue')}"`,
                visible:
                    cell &&
                    !cell.edge &&
                    type === PIPELINE &&
                    cell.value.attributes.jobId,
                onClick: () => {
                    history.push(
                        `/jobs/${projectId}/${get(
                            cell,
                            'value.attributes.jobId.nodeValue'
                        )}`
                    );
                }
            },
            {
                name: t('jobDesigner:stagePopupMenu.editStage'),
                visible:
                    cell && !cell.edge && cell.getAttribute('operation') !== WAIT,
                onClick: () => {
                    setCell(cell.id);
                    setPanel(true);
                }
            },
            {
                name: t('jobDesigner:stagePopupMenu.copyStage'),
                visible: cell && !cell.edge,
                onClick: () => {
                    copyStage({
                        data: cell,
                        project: this.getCurrentProject(),
                        type
                    });
                }
            },
            {
                name: t('jobDesigner:stagePopupMenu.deleteStage'),
                visible: cell && !cell.edge,
                onClick: () => {
                    sidePanelIsOpen && setPanel(false);
                    setCell('');
                    graph.removeCells([cell]);
                    mxEvent.consume(event);
                    setDirtyGraph(true);
                }
            },
            {
                name: t('jobDesigner:stagePopupMenu.pasteStage'),
                visible:
                    !cell &&
                    stageCopy !== null &&
                    stageCopy.project === this.getCurrentProject() &&
                    stageCopy.type === type,
                onClick: () => {
                    this.pasteCopyHandler(event, graph);
                    setDirtyGraph(true);
                }
            }
        ];

        items
            .filter(
                ({ visible }) =>
                    visible &&
                    (!has(data, 'editable') || this.graphIsDisabled(data.editable))
            )
            .forEach(({ name, onClick }) =>
                menu.addItem(name, null, onClick, null, null, null, null, true)
            );

        setDefaultPopupMenuStyle(menu, classes);
    };

    handleKeyDown = event => {
        const { data, sidePanelIsOpen, setDirtyGraph, setCell } = this.props;
        const { graph } = this.state;

        if (event.keyCode === 46 && !sidePanelIsOpen && graph.getSelectionCell()) {
            if (!has(data, 'editable') || this.graphIsDisabled(data.editable)) {
                setCell('');
                graph.popupMenuHandler.hideMenu();
                graph.removeCells(graph.getSelectionCells());
                setDirtyGraph(true);
            }
        }
    };

    // Listeners
    onEditingStartedListener = (sender, event) => {
        const { currentCell, sidePanelIsOpen, setPanel, setCell } = this.props;
        const { graph } = this.state;

        const cell = event.getProperty('cell');
        if (cell?.vertex && cell.getAttribute('operation') !== WAIT) {
            if (sidePanelIsOpen && currentCell !== graph.getSelectionCell().id) {
                deactivateCell(graph, currentCell);
            }
            setCell(graph.getSelectionCell().id);
            setPanel(true);
        }
        graph.cellEditor.stopEditing(true);
    };

    onMoveCellsListener = (sender, event) => {
        const { setDirtyGraph } = this.props;
        setDirtyGraph(true);
        const { graph } = this.state;

        if (event.getProperty('clone')) {
            event
                .getProperty('cells')
                .filter(({ edge }) => edge)
                .forEach(edge => {
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
    };

    getInputSchemas = (cell, jobStagesData) => {
        const cellEdges = cell.edges.map(edge => edge.id);

        if (cellEdges.length < 2) {
            return undefined;
        }

        const inputIds = cell.parent.children
            .filter(
                c => c.edge && cellEdges.includes(c.id) && c.source.id !== cell.id
            )
            .map(el => ({ id: el.source.id, name: el.source.getAttribute('name') }));

        return jobStagesData
            .filter(el => inputIds.map(ids => ids.id).includes(el.id))
            .map(el => ({
                ...el,
                name: inputIds.find(ids => ids.id === el.id)?.name
            }));
    };

    onClickListener = (sender, event) => {
        const {
            jobs,
            data,
            setLogs,
            jobStagesData,
            sendInteractiveEvent,
            runId
        } = this.props;
        const currentPath = history.location.pathname.split('/');
        const currentProject = currentPath.slice(-2, -1)[0];
        const currentJob = currentPath.slice(-1)[0];

        const cell = event.getProperty('cell');

        if (cell != null) {
            const mouseEvent = event.getProperty('event');

            const nodeName = get(mouseEvent, 'target.nodeName', '');
            const nodeId =
                nodeName === 'svg'
                    ? get(mouseEvent, 'target.id', '')
                    : get(mouseEvent, 'target.parentElement.id', '');

            const operation = cell.getAttribute('operation');
            const jobName = cell.getAttribute('jobName');

            if (operation === JOB && cell.getAttribute('jobId') === nodeId) {
                const jobId = get(findJobInstance(data.id, nodeId, jobs), 'id');
                const status = get(data, ['jobsStatuses', cell.id]);
                this.setState({
                    jobId: jobId || nodeId,
                    nodeId: '',
                    jobName,
                    status
                });
                setLogs(true);
            }

            if (operation === CONTAINER && cell.getAttribute('name') === nodeId) {
                this.setState({ nodeId: cell.id });
                setLogs(true);
            }

            const stageData = this.getInteractiveModeStage(jobStagesData, cell.id);

            if (typeof nodeId === 'string' && nodeId.startsWith('view-metadata')) {
                const input = this.getInputSchemas(cell, jobStagesData);

                this.setState({
                    openMetadataModal: true,
                    operation,
                    stageName: cell.getAttribute('name'),
                    outputData: stageData,
                    inputData: input
                });
            }

            const rowCount = stageData?.rowCount
                ? new Intl.NumberFormat('de-DE').format(stageData?.rowCount)
                : 'No row count available';
            const errorMessage = stageData?.statusMessage || 'Unknown Error';
            const isEligibleToRun = isStageRunnable(cell.id, data, jobStagesData);

            if (typeof nodeId === 'string' && nodeId.startsWith('error')) {
                this.setState(prevState => ({
                    openPopper: !prevState.openPopper,
                    popoverType: 'error',
                    popoverText: errorMessage
                }));

                const anc = document.getElementById(nodeId);
                this.setState({ anchorEl: anc });
            }

            if (typeof nodeId === 'string' && nodeId.startsWith('rowCount')) {
                this.setState(prevState => ({
                    openPopper: !prevState.openPopper,
                    popoverType: 'message',
                    popoverText: `Row count: ${rowCount}`
                }));

                const anc = document.getElementById(nodeId);
                this.setState({ anchorEl: anc });
            }

            if (
                typeof nodeId === 'string' &&
                nodeId.startsWith('run-stage') &&
                isEligibleToRun
            ) {
                const stageId = nodeId.split('run-stage-')[1];
                sendInteractiveEvent(currentProject, currentJob, runId, {
                    session: runId,
                    command: RUN_EVENT,
                    id: [stageId]
                });
            }
        }
    };

    getInteractiveModeStage = (stages, id) => stages?.find(stage => stage.id === id);

    onConvertValueToStringListener = cell => {
        const {
            theme,
            data,
            jobs,
            type,
            t,
            params,
            pipelines,
            interactiveMode,
            jobStagesData
        } = this.props;

        if (
            !mxUtils.isNode(cell.value) ||
            cell.value.nodeName.toLowerCase() !== 'taskobject'
        ) {
            return null;
        }

        const value = toObject(cell.value.attributes);

        const operation = cell.getAttribute('operation');

        if ([JOB, CONTAINER].includes(operation)) {
            const status = get(data, ['jobsStatuses', cell.id]);
            if (status && status !== PENDING) {
                set(value, 'showLogs', true);
            }
        }

        const stageData = this.getInteractiveModeStage(jobStagesData, cell.id);
        const isRunEnabled = isStageRunnable(cell.id, data, jobStagesData);

        if (stageData) {
            set(value, 'rowCount', stageData.rowCount);
            set(value, 'status', stageData.status);
            set(value, 'statusMessage', stageData.statusMessage);
            set(
                value,
                'isMetadataEnabled',
                stageData.status === INTERACTIVE_SUCCEEDED
            );
        }

        set(value, 'isRunEnabled', isRunEnabled);
        set(value, 'interactiveMode', interactiveMode);
        set(value, 'id', cell.id);

        return ReactDOMServer.renderToString(
            renderStage(value, t, type, jobs, params, pipelines, theme)
        );
    };

    // main setting
    setGraphSetting = () => {
        const { theme } = this.props;

        const { graph } = this.state;

        setGraphSettings(graph, theme);

        graph.convertValueToString = this.onConvertValueToStringListener;

        graph.addListener(mxEvent.EDITING_STARTED, this.onEditingStartedListener);

        graph.addListener(mxEvent.MOVE_CELLS, this.onMoveCellsListener);

        graph.addListener(mxEvent.CLICK, this.onClickListener);
    };

    setLabel = (targetNodeType, labelCDC, labelJOIN) =>
        targetNodeType === CDC ? labelCDC : labelJOIN;

    selectionChange = () => {
        const { graph } = this.state;
        const { t } = this.props;
        const current = graph.getSelectionCell();

        if (!get(current, 'edge', false)) {
            return;
        }

        const targetId = current.target.id;
        const targetNode = graph.model.cells[targetId];

        const targetNodeType = getNodeType(targetNode);

        const inputEdges = targetNode?.edges?.filter(
            edge => edge.target?.id === targetId
        );

        const currentSuccessPath = graph.model
            .getValue(inputEdges[0])
            .getAttribute('successPath');

        graph.addListener(mxEvent.CELL_CONNECTED, () => {
            setDatasetOnChangeConnection(
                graph,
                current,
                targetId,
                targetNode,
                targetNodeType
            );
        });

        if (targetNodeType === CDC || targetNodeType === JOIN) {
            const inputLabel = graph.model
                .getValue(inputEdges[0])
                .getAttribute('text');

            const labelExists = inputLabel === 'Right' || inputLabel === 'Before';

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

            setDatasetOnConnection(
                graph,
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
    };

    settingConnection = () => {
        const { graph, stages } = this.state;
        const { setDirtyGraph } = this.props;

        mxConstraintHandler.prototype.intersects = (
            icon,
            point,
            source,
            existingEdge
        ) => !source || existingEdge || mxUtils.intersects(icon.bounds, point);

        if (isNil(graph.connectionHandler.connectImage)) {
            graph.connectionHandler.isConnectableCell = () => false;
            mxEdgeHandler.prototype.isConnectableCell = cell =>
                graph.connectionHandler.isConnectableCell(cell);
        }

        graph.getAllConnectionConstraints = function getConnections(
            terminal,
            source
        ) {
            const { cell } = terminal;

            const targetNodeType = getNodeType(cell);
            const terminalGraph = get(terminal, 'view.graph', '');
            const targetOutgoingEdges = terminalGraph.getOutgoingEdges(cell);
            const targetIncomingEdges = terminalGraph.getIncomingEdges(cell);

            const targetValid = get(stages[targetNodeType], 'validation', '');

            if (
                (targetOutgoingEdges.length >= targetValid.maxOutgoingConnections &&
                    source) ||
                (targetIncomingEdges.length >= targetValid.maxIncomingConnections &&
                    !source)
            ) {
                return null;
            }

            if (this.model.isVertex(cell)) {
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

        graph.connectionHandler.createEdgeState = function createEdge() {
            const edge = graph.createEdge(
                null,
                null,
                obj,
                null,
                null,
                addStyles({
                    edgeStyle: 'orthogonalEdgeStyle'
                })
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
        const { stages } = this.state;
        const {
            theme,
            type,
            data,
            setDirtyGraph,
            interactiveMode,
            jobStagesData
        } = this.props;

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
                setLayoutSetting(graph);
                setGlobalSettings();
                this.setGraphSetting();
                this.settingConnection();
                content &&
                    loadContent(
                        content,
                        graph,
                        stages,
                        theme,
                        type,
                        data?.jobsStatuses,
                        interactiveMode,
                        jobStagesData
                    );
                this.updateGraph(graph);
            });

            // Disables the built-in context menu
            mxEvent.disableContextMenu(container);

            // Trigger event after selection
            graph
                .getSelectionModel()
                .addListener(mxEvent.CHANGE, this.selectionChange);

            graph.addListener(mxEvent.CELL_CONNECTED, this.selectionChange);
            graph.getModel().addListener(mxEvent.CHANGE, (model, event) => {
                const { properties } = event;
                const geometryChanged = properties?.changes.some(change => {
                    return (
                        model.isEdge(change.cell) &&
                        change.constructor.name === 'mxGeometryChange'
                    );
                });
                if (geometryChanged) {
                    setDirtyGraph(true);
                }
            });
        }
    };

    zoom = val => {
        const { graph } = this.state;
        const { zoomTo } = this.props;

        const roundedValue = +val.toFixed(1);
        if (roundedValue > 1.5 || roundedValue < 0.2) {
            return;
        }
        graph.zoomTo(roundedValue);
        zoomTo(roundedValue);
    };

    graphIsDisabled = value => {
        const {
            jobStatus,
            pipelineStatus,
            type,
            data,
            interactiveMode
        } = this.props;

        const status = type === JOB ? jobStatus : pipelineStatus;

        if (isEmpty(data.definition)) {
            return true; // new job, parameters are active
        }

        return !interactiveMode && [SUSPENDED, PENDING, RUNNING].includes(status)
            ? false
            : value;
    };

    getCurrentProject = () => {
        const currentPath = history?.location?.pathname?.split('/');
        return currentPath ? currentPath.slice(-2, -1)[0] : '';
    };

    closePopoverHandler = () => {
        this.setState({ anchorEl: null });
        this.setState({ openPopper: false });
    };

    render() {
        const {
            classes,
            data,
            // param,
            type,
            zoomVal,
            panning,
            showLogsModal,
            sidePanelIsOpen,
            setPanel,
            setDirtyGraph,
            setLogs,
            setCell,
            interactiveMode,
            toggleInteractiveMode
        } = this.props;
        const {
            graph,
            jobId,
            nodeId,
            undoManagerConfig,
            status,
            jobName,
            openMetadataModal,
            operation,
            openPopper,
            popoverType,
            popoverText,
            anchorEl,
            stageName,
            outputData,
            inputData
        } = this.state;

        const currentPath = history.location.pathname.split('/');
        const currentJob = type === PIPELINE ? jobId : currentPath.slice(-1)[0];
        const currentJobName = type === PIPELINE ? jobName : undefined;

        return (
            <div className={classes.root}>
                <PopoverWithMessage
                    open={openPopper}
                    onClose={() => this.setState({ openPopper: false })}
                    anchorEl={anchorEl}
                    type={popoverType}
                    text={popoverText}
                />
                <InteractiveModeModal
                    open={openMetadataModal}
                    onClose={() => this.setState({ openMetadataModal: false })}
                    stageName={stageName}
                    operation={operation}
                    inputData={inputData}
                    outputData={outputData}
                />
                <LogsModal
                    display={showLogsModal}
                    projectId={this.getCurrentProject()}
                    pipelineId={data.id}
                    nodeId={nodeId}
                    jobId={currentJob}
                    jobName={currentJobName}
                    onClose={() => setLogs(false)}
                    status={status}
                />
                <Sidebar
                    graph={graph}
                    name={data?.name}
                    // ableToEdit={this.graphIsDisabled(param)}
                    ableToEdit={this.graphIsDisabled(data.editable)}
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
                                interactiveMode={interactiveMode}
                                toggleInteractiveMode={toggleInteractiveMode}
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
                            swapEdges={() => swapEdges(graph)}
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
    zoomTo: PropTypes.func,
    classes: PropTypes.object,
    data: PropTypes.object,
    jobStatus: PropTypes.string,
    projectId: PropTypes.string,
    pipelineStatus: PropTypes.string,
    t: PropTypes.func,
    // param: PropTypes.bool,
    sidePanelIsOpen: PropTypes.bool,
    type: PropTypes.string,
    zoomVal: PropTypes.number,
    panning: PropTypes.bool,
    showLogsModal: PropTypes.bool,
    jobs: PropTypes.array,
    pipelines: PropTypes.array,
    params: PropTypes.array,
    theme: PropTypes.object,
    copyStage: PropTypes.func,
    stageCopy: PropTypes.object,
    interactiveMode: PropTypes.bool,
    toggleInteractiveMode: PropTypes.func,
    getJobSession: PropTypes.func,
    runId: PropTypes.string,
    jobStagesData: PropTypes.array,
    sendInteractiveEvent: PropTypes.func,
    deleteInteractiveData: PropTypes.func
};

const mapStateToProps = state => ({
    sidePanelIsOpen: state.mxGraph.sidePanelIsOpen,
    currentCell: state.mxGraph.currentCell,
    data: state.mxGraph.data,
    jobStatus: state.jobStatus.status,
    pipelineStatus: state.pipelineStatus.status,
    // param: state.pages.settingsParameters.editable,
    zoomVal: state.mxGraph.zoomValue,
    jobs: state.pages.jobs.data.jobs,
    pipelines: state.pages.pipelines.data.pipelines,
    panning: state.mxGraph.panning,
    showLogsModal: state.mxGraph.showLogsModal,
    params: state.pages.settingsParameters.params,
    stageCopy: state.mxGraph.stageCopy,
    interactiveMode: state.mxGraph.interactive.interactiveMode,
    jobStagesData: state.mxGraph.interactive.data,
    runId: state.pages.jobs.runId
});

const mapDispatchToProps = {
    setLogs: setLogsModal,
    setDirtyGraph: setGraphDirty,
    setPanel: setSidePanel,
    setCell: setCurrentCell,
    zoomTo: setZoomValue,
    copyStage: setStageCopy,
    toggleInteractiveMode: setInteractiveMode,
    getJobSession: getInteractiveJobSession,
    sendInteractiveEvent: interactiveSessionEvent,
    deleteInteractiveData: clearInteractiveData
};

export default compose(
    withTheme,
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(GraphDesigner);
