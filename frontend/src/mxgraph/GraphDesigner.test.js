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

import React from 'react';
import { shallow } from 'enzyme';
import { useTranslation } from 'react-i18next';

import { GraphDesigner } from './GraphDesigner';

import {
    CDC,
    CONTAINER,
    DRAFT,
    EDGE,
    JOB,
    JOIN,
    PENDING,
    PIPELINE,
    READ,
    RUNNING,
    SUCCEEDED
} from './constants';
import {
    RenderJobConfiguration,
    RenderPipelineConfiguration
} from './side-panel/render-configuration';
import LogsModal from '../pages/logs-modal';
import {
    deactivateCell,
    mxEvent,
    swapEdges,
    mxUtils,
    setGraphSettings,
    setDatasetOnChangeConnection,
    mxConstraintHandler,
    mxEdgeHandler
} from './graph';
import SidePanel from './side-panel';
import stageLabels from './stageLabels';
import { omit } from 'lodash';
import history from '../utils/history';
import ReactDOMServer from 'react-dom/server';
import renderStage from './stages/renderStage';

jest.mock('./stages/renderStage', () => jest.fn());

jest.mock('react-dom/server', () => ({
    ...jest.requireActual('react-dom/server'),
    renderToString: jest.fn()
}));

jest.mock('../utils/history', () => ({
    push: jest.fn(),
    listen: jest.fn(),
    location: {
        pathname: '/'
    }
}));

jest.mock('./stageLabels', () => jest.fn(x => x));

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

jest.mock('./graph', () => ({
    swapEdges: jest.fn(),
    mxCellState: jest.fn().mockImplementation(x => x),
    mxConnectionConstraint: jest.fn().mockImplementation(x => x),
    mxPoint: jest.fn().mockImplementation(x => x),
    mxUtils: {
        isNode: jest.fn(),
        intersects: jest.fn()
    },
    mxEdgeHandler: {
        prototype: {
            snapToTerminals: undefined,
            isConnectableCell: undefined
        }
    },
    mxEvent: {
        isAltDown: x => x,
        disableContextMenu: jest.fn(),
        consume: jest.fn(),
        CELL_CONNECTED: 'CELL_CONNECTED'
    },
    mxGraphHandler: {
        prototype: {
            guidesEnabled: undefined
        }
    },
    mxConstraintHandler: {
        prototype: {
            intersects: undefined
        }
    },
    mxGuide: {
        prototype: {
            isEnabledForEvent: undefined
        }
    },
    mxClient: {
        isBrowserSupported: () => true
    },
    mxGraph: jest.fn().mockImplementation(() => ({
        popupMenuHandler: {
            factoryMethod: undefined
        },
        convertValueToString: undefined,
        addListener: jest.fn(),
        connectionHandler: {
            connectImage: undefined,
            isConnectableCell: undefined
        },
        getSelectionModel: jest.fn().mockImplementation(() => ({
            addListener: jest.fn()
        })),
        zoomTo: jest.fn()
    })),
    deactivateCell: jest.fn(),
    activateCell: jest.fn(),
    setLayoutSetting: jest.fn(),
    setGlobalSettings: jest.fn(),
    loadContent: jest.fn(),
    setGraphSettings: jest.fn(),
    setDatasetOnConnection: jest.fn(),
    setDatasetOnChangeConnection: jest.fn()
}));

describe('GraphDesigner', () => {
    const theme = {
        palette: {
            primary: {
                main: '#546E7A',
                light: '#607D8B',
                dark: '#455A64',
                background: 'rgba(245, 249, 244, 0.8)',
                border: '#8799FA'
            },
            info: {
                main: '#3F51B5',
                light: '#F3EAFF',
                background: '#E8F0FF',
                text: '#64B5F6'
            },
            secondary: {
                main: '#17D9C2',
                light: '#D8FFF9',
                border: '#B3FF9E',
                dark: '#16B19F'
            },
            warning: {
                main: '#FF9800',
                light: '#FFBB8A',
                background: '#FFF5E3'
            },
            success: {
                main: '#4CAF50',
                light: '#81C784',
                background: '#F0FFED'
            },
            error: {
                main: '#F44336',
                light: '#E57373'
            },
            other: {
                border: 'rgba(0, 0, 0, 0.23)',
                skipped: '#BDBDBD'
            },
            text: {
                primary: 'rgba(0, 0, 0, 0.87)'
            },
            action: {
                active: 'rgba(0, 0, 0, 0.54)'
            }
        },
        MuiDrawer: {
            width: 240
        },
        mxgraph: {
            border: {
                strong: 4,
                normal: 1
            }
        }
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            theme,
            classes: {},
            data: { id: '6ca1c341-88eb-4ebc-b5a6-90ed3493f09a' },
            setDirtyGraph: jest.fn(),
            setCell: jest.fn(),
            setPanel: jest.fn(),
            setLogs: jest.fn(),
            t: x => x
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<GraphDesigner {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper).toBeDefined();
    });

    it('should render job configuration', () => {
        const [wrapper] = init({ type: JOB });

        expect(wrapper.find(RenderJobConfiguration).exists()).toBeTruthy();
        expect(wrapper.find(RenderPipelineConfiguration).exists()).toBeFalsy();
    });

    it('should render pipelines configuration', () => {
        const [wrapper] = init({ type: PIPELINE });

        expect(wrapper.find(RenderPipelineConfiguration).exists()).toBeTruthy();
        expect(wrapper.find(RenderJobConfiguration).exists()).toBeFalsy();
    });

    it('should close logs modal', () => {
        const [wrapper, props] = init({ setLogs: jest.fn() }, true);

        wrapper.find(LogsModal).prop('onClose')();

        expect(props.setLogs).toHaveBeenCalledWith(false);
    });

    it('should swap edges', () => {
        const [wrapper] = init({ type: JOB });

        wrapper.find(RenderJobConfiguration).prop('swapEdges')();

        expect(swapEdges).toHaveBeenCalled();
    });

    it('should set undo manager config', () => {
        const [wrapper] = init();

        expect(wrapper.find(SidePanel).prop('undoManagerConfig')).toEqual({});

        wrapper.find(SidePanel).prop('setUndoManagerConfig')();

        wrapper.update();

        expect(wrapper.find(SidePanel).prop('undoManagerConfig')).toBeUndefined();
    });

    describe('pasteCopyHandler', () => {
        it.each([{ stage: JOIN }, { stage: CDC }])(
            'should remove attrs for "$stage" stage',
            ({ stage }) => {
                const [wrapper] = init();

                const graph = {
                    insertVertex: jest.fn(),
                    getPointForEvent: jest.fn(() => ({
                        x: 0,
                        y: 1
                    })),
                    getDefaultParent: jest.fn(() => 'defaultParent')
                };

                const attributes = {
                    0: { nodeName: 'name', nodeValue: 'Test' },
                    1: { nodeName: 'operation', nodeValue: stage },
                    2: { nodeName: 'leftDataset', nodeValue: 'leftDataset' },
                    3: { nodeName: 'rightDataset', nodeValue: 'rightDataset' },
                    4: { nodeName: 'newDataset', nodeValue: 'newDataset' },
                    5: { nodeName: 'oldDataset', nodeValue: 'oldDataset' }
                };

                const valuesCopy = {
                    name: 'Test',
                    operation: stage,
                    leftDataset: 'leftDataset',
                    rightDataset: 'rightDataset',
                    newDataset: 'newDataset',
                    oldDataset: 'oldDataset'
                };

                wrapper.setState({
                    stageCopy: {
                        value: {
                            attributes
                        },
                        geometry: {
                            width: 0,
                            height: 1
                        },
                        target: 'target'
                    },
                    stages: {
                        [stage]: {
                            color: 'green'
                        }
                    }
                });

                wrapper.update();

                const pasteCopyHandler = wrapper.instance().pasteCopyHandler;

                pasteCopyHandler({}, graph);

                expect(graph.insertVertex).toHaveBeenCalledWith(
                    'defaultParent',
                    'target',
                    stage === JOIN
                        ? omit(valuesCopy, ['leftDataset', 'rightDataset'])
                        : omit(valuesCopy, ['newDataset', 'oldDataset']),
                    0,
                    1,
                    0,
                    1,
                    'fillColor=green;strokeColor=rgba(0, 0, 0, 0.23);'
                );

                expect(stageLabels).toHaveBeenCalled();
            }
        );
    });

    describe('popupMenu', () => {
        it('should return the popup menu for arrows', () => {
            const [wrapper] = init({ type: PIPELINE });

            const cell = {
                value: {
                    attributes: {
                        jobName: {
                            nodeValue: 'MY_JOB'
                        },
                        jobId: 'myJobId'
                    }
                },
                edge: true,
                getAttribute: () => READ
            };

            const menu = { addItem: jest.fn() };

            wrapper.instance().popupMenu({}, menu, cell, {});

            expect(menu.addItem.mock.calls).toEqual([
                ['Delete connection', null, expect.any(Function)]
            ]);
        });
        it('should return the popup menu for pipelines', () => {
            const [wrapper] = init({ type: PIPELINE });

            const cell = {
                value: {
                    attributes: {
                        jobName: {
                            nodeValue: 'MY_JOB'
                        },
                        jobId: 'myJobId'
                    }
                },
                edge: false,
                getAttribute: () => READ
            };

            const menu = { addItem: jest.fn() };

            wrapper.instance().popupMenu({}, menu, cell, {});

            expect(menu.addItem.mock.calls).toEqual([
                ['Open "MY_JOB"', null, expect.any(Function)],
                ['Edit child node', null, expect.any(Function)],
                ['Copy child node', null, expect.any(Function)],
                ['Delete child node', null, expect.any(Function)]
            ]);
        });

        it('should return the popup menu for jobs', () => {
            const [wrapper] = init({ type: JOB });

            const cell = {
                value: {},
                edge: false,
                getAttribute: () => READ
            };

            const menu = { addItem: jest.fn() };

            wrapper.instance().popupMenu({}, menu, cell, {});

            expect(menu.addItem.mock.calls).toEqual([
                ['Edit child node', null, expect.any(Function)],
                ['Copy child node', null, expect.any(Function)],
                ['Delete child node', null, expect.any(Function)]
            ]);
        });

        it('should show "Paste child node" option', () => {
            const [wrapper] = init({ type: JOB });

            const menu = { addItem: jest.fn() };

            wrapper.setState({ stageCopy: {} });

            wrapper.update();

            wrapper.instance().popupMenu({}, menu, undefined, {});

            expect(menu.addItem.mock.calls).toEqual([
                ['Paste child node', null, expect.any(Function)]
            ]);
        });

        it('should handle "Delete connection"', () => {
            const [wrapper, props] = init({ type: JOB }, true);

            const menu = { addItem: jest.fn() };
            const graph = { removeCells: jest.fn() };
            const cell = {
                value: {},
                edge: true,
                getAttribute: () => READ
            };

            wrapper.instance().popupMenu(graph, menu, cell, {});

            const [, , onClick] = menu.addItem.mock.calls[0];

            onClick();

            expect(graph.removeCells).toHaveBeenCalledWith([cell]);
            expect(props.setDirtyGraph).toHaveBeenCalledWith(true);
            expect(mxEvent.consume).toHaveBeenCalledWith({});
        });

        it('should handle "Open"', () => {
            const [wrapper] = init({ type: PIPELINE });

            const menu = { addItem: jest.fn() };
            const graph = { removeCells: jest.fn() };
            const cell = {
                value: {
                    attributes: {
                        jobName: {
                            nodeValue: 'MY_JOB'
                        },
                        jobId: 'myJobId'
                    }
                },
                edge: false,
                getAttribute: () => READ
            };

            wrapper.instance().popupMenu(graph, menu, cell, {});

            const [, , onClick] = menu.addItem.mock.calls[0];

            onClick();

            expect(history.push).toHaveBeenCalled();
        });

        it('should handle "Edit child node"', () => {
            const [wrapper, props] = init({ type: JOB }, true);

            const menu = { addItem: jest.fn() };
            const graph = { removeCells: jest.fn() };
            const cell = {
                id: 0,
                value: {},
                edge: false,
                getAttribute: () => READ
            };

            wrapper.instance().popupMenu(graph, menu, cell, {});

            const [, , onClick] = menu.addItem.mock.calls[0];

            onClick();

            expect(props.setCell).toHaveBeenCalledWith(0);
            expect(props.setPanel).toHaveBeenCalledWith(true);
        });

        it('should handle "Copy child node"', () => {
            const [wrapper] = init({ type: JOB });

            const menu = { addItem: jest.fn() };
            const graph = { removeCells: jest.fn() };
            const cell = {
                id: 0,
                value: {},
                edge: false,
                getAttribute: () => READ
            };

            wrapper.instance().popupMenu(graph, menu, cell, {});

            const [, , onClick] = menu.addItem.mock.calls[1];

            onClick();

            wrapper.update();

            expect(wrapper.state().stageCopy).toEqual(cell);
        });

        it('should handle "Delete child node"', () => {
            const [wrapper, props] = init(
                { type: JOB, sidePanelIsOpen: true },
                true
            );

            const menu = { addItem: jest.fn() };
            const graph = { removeCells: jest.fn() };
            const cell = {
                id: 0,
                value: {},
                edge: false,
                getAttribute: () => READ
            };

            wrapper.instance().popupMenu(graph, menu, cell, {});

            const [, , onClick] = menu.addItem.mock.calls[2];

            onClick();

            expect(props.setPanel).toHaveBeenCalledWith(false);
            expect(props.setCell).toHaveBeenCalled();
            expect(graph.removeCells).toHaveBeenCalledWith([cell]);
            expect(mxEvent.consume).toHaveBeenCalledWith({});
            expect(props.setDirtyGraph).toHaveBeenCalledWith(true);
        });

        it('Paste child node"', () => {
            const [wrapper, props] = init({ type: JOB }, true);

            const menu = { addItem: jest.fn() };

            wrapper.setState({ stageCopy: { value: { attributes: {} } } });

            wrapper.update();

            const instance = wrapper.instance();
            const pasteCopyHandler = jest.fn();

            instance.pasteCopyHandler = pasteCopyHandler;

            instance.popupMenu({}, menu, undefined, {});

            const [, , onClick] = menu.addItem.mock.calls[0];

            onClick();

            expect(props.setDirtyGraph).toHaveBeenCalledWith(true);
            expect(pasteCopyHandler).toHaveBeenCalled();
        });
    });

    describe('handleKeyDown', () => {
        it('should handle 46 hotkey', () => {
            const [wrapper, props] = init(
                { data: {}, sidePanelIsOpen: false },
                true
            );

            const event = {
                keyCode: 46
            };

            const graph = {
                getSelectionCell: jest.fn(() => 'CELL'),
                getSelectionCells: jest.fn(() => 'CURRENT_NODES'),
                popupMenuHandler: {
                    hideMenu: jest.fn()
                },
                removeCells: jest.fn()
            };

            wrapper.setState({ graph });

            wrapper.update();

            wrapper.instance().handleKeyDown(event);

            expect(graph.popupMenuHandler.hideMenu).toHaveBeenCalled();
            expect(graph.removeCells).toHaveBeenCalledWith('CURRENT_NODES');
            expect(props.setDirtyGraph).toHaveBeenCalledWith(true);
            expect(props.setCell).toHaveBeenCalledWith('');
        });
    });

    describe('onEditingStartedListener', () => {
        it('should call EDITING_STARTED event', () => {
            const [wrapper, props] = init(
                { data: {}, sidePanelIsOpen: true, currentCell: 'CURRENT_CELL' },
                true
            );

            const cell = {
                vertex: {},
                getAttribute: jest.fn(() => READ)
            };

            const event = {
                getProperty: jest.fn(() => cell)
            };

            const graph = {
                getSelectionCell: jest.fn(() => ({ id: 0 })),
                cellEditor: {
                    stopEditing: jest.fn()
                }
            };

            wrapper.setState({ graph });

            wrapper.update();

            deactivateCell.mockClear();

            wrapper.instance().onEditingStartedListener('', event);

            expect(deactivateCell).toHaveBeenCalledWith(graph, 'CURRENT_CELL');
            expect(props.setCell).toHaveBeenCalledWith(0);
            expect(props.setPanel).toHaveBeenCalledWith(true);
            expect(graph.cellEditor.stopEditing).toHaveBeenCalledWith(true);
        });

        it('should call EDITING_STARTED event without deactivating the cell', () => {
            const [wrapper, props] = init(
                { data: {}, sidePanelIsOpen: false, currentCell: 'CURRENT_CELL' },
                true
            );

            const cell = {
                vertex: {},
                getAttribute: jest.fn(() => READ)
            };

            const event = {
                getProperty: jest.fn(() => cell)
            };

            const graph = {
                getSelectionCell: jest.fn(() => ({ id: 0 })),
                cellEditor: {
                    stopEditing: jest.fn()
                }
            };

            wrapper.setState({ graph });

            wrapper.update();

            deactivateCell.mockClear();

            wrapper.instance().onEditingStartedListener('', event);

            expect(deactivateCell).not.toHaveBeenCalled();
            expect(props.setCell).toHaveBeenCalledWith(0);
            expect(props.setPanel).toHaveBeenCalledWith(true);
        });
    });

    describe('onMoveCellsListener', () => {
        it('should move cells', () => {
            const [wrapper] = init();

            const edges = [
                {
                    id: 0,
                    edge: {},
                    parent: 'parent_0',
                    value: 'value_0',
                    source: 'source_0',
                    target: 'target_0',
                    style: 'style_0'
                },
                { id: 1 },
                {
                    id: 2,
                    edge: {},
                    parent: 'parent_2',
                    value: 'value_2',
                    source: 'source_2',
                    target: 'target_2',
                    style: 'style_2'
                }
            ];

            const event = {
                getProperty: jest.fn(() => edges)
            };

            const graph = {
                removeCells: jest.fn(),
                insertEdge: jest.fn()
            };

            wrapper.setState({ graph });

            wrapper.update();

            wrapper.instance().onMoveCellsListener('', event);

            expect(graph.removeCells.mock.calls).toEqual([
                [[edges[0]]],
                [[edges[2]]]
            ]);

            expect(graph.insertEdge.mock.calls).toEqual([
                ['parent_0', null, 'value_0', 'source_0', 'target_0', 'style_0'],
                ['parent_2', null, 'value_2', 'source_2', 'target_2', 'style_2']
            ]);
        });

        it('should not move cells', () => {
            const [wrapper] = init();

            const event = {
                getProperty: jest.fn(() => undefined)
            };

            const graph = {
                removeCells: jest.fn(),
                insertEdge: jest.fn()
            };

            wrapper.setState({ graph });

            wrapper.update();

            wrapper.instance().onMoveCellsListener('', event);

            expect(graph.removeCells).not.toHaveBeenCalled();
            expect(graph.insertEdge).not.toHaveBeenCalled();
        });
    });

    describe('onClickListener', () => {
        it('should set nodeId for jobs', () => {
            const [wrapper, props] = init({ data: { id: 0 }, jobs: [] }, true);

            const attrs = {
                operation: JOB,
                jobId: 0
            };

            const mouseEvent = {
                target: {
                    id: 0,
                    nodeName: 'svg'
                }
            };

            const cell = {
                getAttribute: attr => attrs[attr]
            };

            const event = {
                getProperty: name => (name === 'cell' ? cell : mouseEvent)
            };

            wrapper.instance().onClickListener('', event);

            expect(wrapper.state().jobId).toBe(0);
            expect(wrapper.state().nodeId).toBe('');
            expect(props.setLogs).toHaveBeenCalledWith(true);
        });

        it('should set nodeId for containers', () => {
            const [wrapper, props] = init({ data: { id: 0 }, jobs: [] }, true);

            const attrs = {
                operation: CONTAINER,
                name: 'NODE_ID'
            };

            const mouseEvent = {
                target: {
                    id: 'NODE_ID',
                    nodeName: 'svg'
                }
            };

            const cell = {
                id: 'CELL_ID',
                getAttribute: attr => attrs[attr]
            };

            const event = {
                getProperty: name => (name === 'cell' ? cell : mouseEvent)
            };

            wrapper.instance().onClickListener('', event);

            expect(wrapper.state().nodeId).toBe('CELL_ID');
            expect(props.setLogs).toHaveBeenCalledWith(true);
        });
    });

    describe('onConvertValueToStringListener', () => {
        it('should not render at all', () => {
            const [wrapper] = init();

            mxUtils.isNode.mockImplementation(() => false);

            const cell = {
                value: {
                    nodeName: 'taskobject'
                }
            };

            expect(
                wrapper.instance().onConvertValueToStringListener(cell)
            ).toBeNull();

            expect(ReactDOMServer.renderToString).not.toHaveBeenCalled();
        });

        it('should render a job stage', () => {
            const [wrapper, props] = init(
                {
                    data: { id: 0 },
                    jobs: [
                        {
                            id: 0,
                            pipelineInstances: [{ pipelineId: 0, status: SUCCEEDED }]
                        }
                    ],
                    t: 't',
                    type: 'type',
                    params: [],
                    pipelines: []
                },
                true
            );

            mxUtils.isNode.mockImplementation(() => true);

            const attrs = {
                operation: JOB,
                jobId: 0
            };

            const cell = {
                value: {
                    nodeName: 'taskobject',
                    attributes: {}
                },
                getAttribute: attr => attrs[attr]
            };

            wrapper.instance().onConvertValueToStringListener(cell);

            expect(ReactDOMServer.renderToString).toHaveBeenCalled();
            expect(renderStage).toHaveBeenCalledWith(
                { status: SUCCEEDED },
                't',
                'type',
                props.jobs,
                [],
                [],
                props.theme
            );
        });

        it('should render a job stage and remove draft status', () => {
            const [wrapper, props] = init(
                {
                    data: { id: 0, status: DRAFT },
                    jobs: [
                        {
                            id: 0,
                            pipelineInstances: [{ pipelineId: 0, status: SUCCEEDED }]
                        }
                    ],
                    t: 't',
                    type: 'type',
                    params: [],
                    pipelines: []
                },
                true
            );

            mxUtils.isNode.mockImplementation(() => true);

            const attrs = {
                operation: JOB,
                jobId: 0
            };

            const cell = {
                value: {
                    nodeName: 'taskobject',
                    attributes: {}
                },
                getAttribute: attr => attrs[attr]
            };

            wrapper.instance().onConvertValueToStringListener(cell);

            expect(ReactDOMServer.renderToString).toHaveBeenCalled();
            expect(renderStage).toHaveBeenCalledWith(
                {},
                't',
                'type',
                props.jobs,
                [],
                [],
                props.theme
            );
        });

        it('should render a container stage', () => {
            const [wrapper, props] = init(
                {
                    data: {
                        id: 0,
                        status: DRAFT,
                        jobsStatuses: { 100500: RUNNING }
                    },
                    jobs: [
                        {
                            id: 0,
                            pipelineInstances: [{ pipelineId: 0, status: SUCCEEDED }]
                        }
                    ],
                    t: 't',
                    type: 'type',
                    params: [],
                    pipelines: []
                },
                true
            );

            mxUtils.isNode.mockImplementation(() => true);

            const attrs = {
                operation: CONTAINER,
                jobId: 0
            };

            const cell = {
                id: 100500,
                value: {
                    nodeName: 'taskobject',
                    attributes: {}
                },
                getAttribute: attr => attrs[attr]
            };

            wrapper.instance().onConvertValueToStringListener(cell);

            expect(ReactDOMServer.renderToString).toHaveBeenCalled();
            expect(renderStage).toHaveBeenCalledWith(
                { status: RUNNING },
                't',
                'type',
                props.jobs,
                [],
                [],
                props.theme
            );
        });
    });

    describe('setGraphSetting', () => {
        it('should set graph settings', () => {
            const [wrapper, props] = init({}, true);

            const graph = {
                popupMenuHandler: {
                    factoryMethod: jest.fn()
                },
                convertValueToString: undefined,
                addListener: jest.fn()
            };

            const instance = wrapper.instance();

            instance.setState({ graph });

            wrapper.update();

            instance.setGraphSetting();

            expect(setGraphSettings).toHaveBeenCalledWith(graph, props.theme);
            expect(graph.convertValueToString).not.toBeUndefined();
            expect(graph.addListener).toHaveBeenCalledTimes(3);
        });
    });

    describe('setLabel', () => {
        it('should set label', () => {
            const [wrapper] = init();

            expect(wrapper.instance().setLabel(CDC, 'CDC', 'JOIN')).toBe('CDC');
            expect(wrapper.instance().setLabel(JOIN, 'CDC', 'JOIN')).toBe('JOIN');
        });
    });

    describe('selectionChange', () => {
        it('should handle selection change for READ', () => {
            const [wrapper] = init({});

            const currentCell = {
                edge: true,
                target: {
                    id: 0
                },
                source: {
                    id: 0
                }
            };

            const attrs = {
                successPath: 'currentSuccessPath',
                text: 'text'
            };

            const getAttribute = attr => attrs[attr];

            const graph = {
                addListener: jest.fn(),
                getSelectionCell: jest.fn(() => currentCell),
                model: {
                    cells: {
                        0: {
                            value: {
                                attributes: {
                                    operation: {
                                        value: READ
                                    }
                                }
                            },
                            edges: [
                                {
                                    target: { id: 0 }
                                },
                                {
                                    target: { id: 1 }
                                },
                                {
                                    target: { id: 0 }
                                }
                            ]
                        }
                    },
                    getValue: jest.fn(() => ({
                        getAttribute
                    })),
                    setValue: jest.fn()
                }
            };

            const instance = wrapper.instance();

            instance.setState({ graph });

            wrapper.update();

            instance.selectionChange();

            expect(graph.model.setValue).toHaveBeenCalled();
            expect(graph.addListener).toHaveBeenCalledWith(
                'CELL_CONNECTED',
                expect.any(Function)
            );
            expect(stageLabels).toHaveBeenCalledWith({
                operation: EDGE,
                successPath: 'currentSuccessPath',
                text: ''
            });
        });

        it('should not handle selection change', () => {
            const [wrapper] = init({});

            const graph = {
                addListener: jest.fn(),
                getSelectionCell: jest.fn(() => ({
                    edge: false
                }))
            };

            const instance = wrapper.instance();

            instance.setState({ graph });

            wrapper.update();

            instance.selectionChange();

            expect(graph.addListener).not.toHaveBeenCalled();
        });

        it('should handle selection change for CDC / JOIN', () => {
            const [wrapper] = init({});

            const currentCell = {
                edge: true,
                target: {
                    id: 0
                },
                source: {
                    id: 0
                }
            };

            const attrs = {
                successPath: 'currentSuccessPath',
                text: 'Right'
            };

            const getAttribute = attr => attrs[attr];

            const graph = {
                addListener: jest.fn(),
                getSelectionCell: jest.fn(() => currentCell),
                model: {
                    cells: {
                        0: {
                            value: {
                                attributes: {
                                    operation: {
                                        value: CDC
                                    }
                                }
                            },
                            edges: [
                                {
                                    id: 0,
                                    target: { id: 0 }
                                },
                                {
                                    id: 1,
                                    target: { id: 1 }
                                },
                                {
                                    id: 2,
                                    target: { id: 0 }
                                }
                            ]
                        }
                    },
                    getValue: jest.fn(() => ({
                        getAttribute
                    })),
                    setValue: jest.fn()
                }
            };

            const instance = wrapper.instance();

            instance.setState({ graph });

            wrapper.update();

            instance.selectionChange();

            expect(graph.model.setValue.mock.calls).toEqual([
                [
                    {
                        id: 2,
                        target: { id: 0 }
                    },
                    {
                        operation: 'EDGE',
                        successPath: 'currentSuccessPath',
                        text: 'jobDesigner:CDCConfiguration.After'
                    }
                ],
                [
                    {
                        id: 0,
                        target: { id: 0 }
                    },
                    {
                        operation: 'EDGE',
                        successPath: 'currentSuccessPath',
                        text: 'jobDesigner:CDCConfiguration.Before'
                    }
                ]
            ]);
        });

        it('should handle mxEvent.CELL_CONNECTED callback', () => {
            const [wrapper] = init();

            const currentCell = {
                edge: true,
                target: {
                    id: 0
                },
                source: {
                    id: 1
                }
            };

            const targetNode = {
                value: {
                    attributes: {
                        operation: {
                            value: READ
                        }
                    }
                },
                edges: [
                    {
                        id: 0,
                        target: { id: 0 }
                    },
                    {
                        id: 1,
                        target: { id: 1 }
                    },
                    {
                        id: 2,
                        target: { id: 0 }
                    }
                ]
            };

            const attrs = {
                successPath: 'currentSuccessPath',
                text: 'Right'
            };

            const getAttribute = attr => attrs[attr];

            const graph = {
                addListener: jest.fn(),
                getSelectionCell: jest.fn(() => currentCell),
                model: {
                    cells: {
                        0: targetNode
                    },
                    getValue: jest.fn(() => ({
                        getAttribute
                    })),
                    setValue: jest.fn()
                }
            };

            const instance = wrapper.instance();

            instance.setState({ graph });

            wrapper.update();

            instance.selectionChange();

            const [_, callback] = graph.addListener.mock.calls[0];

            callback();

            expect(setDatasetOnChangeConnection).toHaveBeenCalledWith(
                graph,
                currentCell,
                0,
                targetNode,
                READ
            );
        });
    });

    describe('settingConnection', () => {
        it('should set connection', () => {
            const [wrapper] = init();

            const graph = {
                connectionHandler: {
                    connectImage: undefined
                }
            };

            const instance = wrapper.instance();

            instance.setState({ graph });

            wrapper.update();

            instance.settingConnection();

            expect(mxConstraintHandler.prototype.intersects).not.toBeUndefined();
            expect(mxEdgeHandler.prototype.isConnectableCell).not.toBeUndefined();
        });

        it('should set getAllConnectionConstraints callback', () => {
            const [wrapper] = init();

            const stages = {
                READ: {
                    validation: {
                        maxOutgoingConnections: 3,
                        maxIncomingConnections: 3
                    }
                }
            };

            const graph = {
                connectionHandler: {
                    connectImage: undefined
                },
                getAllConnectionConstraints: undefined,
                model: {
                    isVertex: () => true
                }
            };

            const instance = wrapper.instance();

            instance.setState({ graph, stages });

            wrapper.update();

            instance.settingConnection();

            const terminal = {
                cell: {
                    value: {
                        attributes: {
                            operation: {
                                value: READ
                            }
                        }
                    }
                },
                view: {
                    graph: {
                        getOutgoingEdges: () => [{}, {}],
                        getIncomingEdges: () => [{}, {}]
                    }
                }
            };

            expect(graph.getAllConnectionConstraints(terminal, {}).length).toBe(12);
        });

        it('should not set getAllConnectionConstraints callback', () => {
            const [wrapper] = init();

            const stages = {
                READ: {
                    validation: {
                        maxOutgoingConnections: 1,
                        maxIncomingConnections: 1
                    }
                }
            };

            const graph = {
                connectionHandler: {
                    connectImage: undefined
                },
                getAllConnectionConstraints: undefined
            };

            const instance = wrapper.instance();

            instance.setState({ graph, stages });

            wrapper.update();

            instance.settingConnection();

            const terminal = {
                cell: {
                    value: {
                        attributes: {
                            operation: {
                                value: READ
                            }
                        }
                    }
                },
                view: {
                    graph: {
                        getOutgoingEdges: () => [{}, {}],
                        getIncomingEdges: () => [{}, {}]
                    }
                }
            };

            expect(graph.getAllConnectionConstraints(terminal, {})).toBeNull();
        });

        it('should set createEdgeState callback', () => {
            const [wrapper, props] = init({}, true);

            const graph = {
                connectionHandler: {
                    connectImage: undefined,
                    createEdgeState: undefined,
                    graph: { view: 'VIEW', getCellStyle: jest.fn() }
                },
                getAllConnectionConstraints: undefined,
                createEdge: jest.fn(() => 'EDGE'),
                addListener: jest.fn()
            };

            const instance = wrapper.instance();

            instance.setState({ graph, stages: {} });

            wrapper.update();

            instance.settingConnection();

            graph.connectionHandler.createEdgeState();

            expect(graph.createEdge).toHaveBeenCalled();
            expect(graph.addListener).toHaveBeenCalled();

            const [_, callback] = graph.addListener.mock.calls[0];

            callback();

            expect(props.setDirtyGraph).toHaveBeenCalledWith(true);
            expect(graph.connectionHandler.graph.getCellStyle).toHaveBeenCalledWith(
                'EDGE'
            );
        });
    });

    describe('zoom', () => {
        it('should zoom in / out', () => {
            const zoomTo = jest.fn();
            const graphZoomTo = jest.fn();

            const [wrapper, props] = init({ zoomTo }, true);

            const instance = wrapper.instance();

            instance.setState({ graph: { zoomTo: graphZoomTo } });

            wrapper.update();

            instance.zoom(1.5);

            expect(props.zoomTo).toHaveBeenCalledWith(1.5);
            expect(graphZoomTo).toHaveBeenCalledWith(1.5);
        });

        it('should not zoom in / out', () => {
            const zoomTo = jest.fn();
            const graphZoomTo = jest.fn();

            const [wrapper, props] = init({ zoomTo }, true);

            const instance = wrapper.instance();

            instance.setState({ graph: { zoomTo: graphZoomTo } });

            wrapper.update();

            instance.zoom(1.6);

            expect(props.zoomTo).not.toHaveBeenCalled();
            expect(graphZoomTo).not.toHaveBeenCalled();
        });
    });

    describe('graphIsDisabled', () => {
        it.each([
            {
                props: {
                    jobStatus: PENDING,
                    pipelineStatus: PENDING,
                    type: JOB,
                    data: {
                        definition: { id: 0 }
                    }
                },
                value: false,
                exp: false
            },
            {
                props: {
                    jobStatus: PENDING,
                    pipelineStatus: PENDING,
                    type: JOB,
                    data: {
                        definition: {}
                    }
                },
                value: false,
                exp: true
            },
            {
                props: {
                    jobStatus: PENDING,
                    pipelineStatus: DRAFT,
                    type: PIPELINE,
                    data: {
                        definition: { id: 0 }
                    }
                },
                value: true,
                exp: true
            }
        ])('should return $exp', ({ props, value, exp }) => {
            const [wrapper] = init(props, true);

            expect(wrapper.instance().graphIsDisabled(value)).toBe(exp);
        });
    });
});
