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
    activateCell,
    deactivateCell,
    loadContent,
    setDatasetOnChangeConnection,
    setDatasetOnConnection,
    swapEdges
} from './tools';
import {
    CDC,
    EDGE,
    FAILED,
    JOB,
    JOIN,
    PIPELINE,
    READ,
    SUCCEEDED,
    WRITE
} from '../constants';

jest.mock('../sidebar/json-codec', () =>
    jest.fn().mockImplementation(() => ({
        encode: x => x
    }))
);

describe('tools', () => {
    describe('swapEdges', () => {
        it('should swap edges', () => {
            const currentCell = {
                id: 0,
                edges: [
                    {
                        source: {
                            id: 0
                        }
                    },
                    {
                        source: {
                            id: 1
                        },
                        parent: 'parent_1',
                        value: 'value_1',
                        target: 'target_1',
                        style: 'style_1'
                    },
                    {
                        source: {
                            id: 2
                        },
                        parent: 'parent_2',
                        value: 'value_2',
                        target: 'target_2',
                        style: 'style_2'
                    }
                ]
            };
            const getSelectionCell = () => currentCell;

            const removeCells = jest.fn();
            const insertEdge = jest.fn();

            const graph = {
                getSelectionCell,
                removeCells,
                insertEdge
            };

            swapEdges(graph);

            expect(removeCells.mock.calls).toEqual([
                [[currentCell.edges[1]]],
                [[currentCell.edges[2]]]
            ]);
            expect(insertEdge).toHaveBeenCalledTimes(2);

            expect(insertEdge.mock.calls).toEqual([
                ['parent_2', null, 'value_1', { id: 2 }, 'target_2', 'style_2'],
                ['parent_1', null, 'value_2', { id: 1 }, 'target_1', 'style_1']
            ]);
        });
    });

    describe('deactivateCell', () => {
        it('should deactivate the cell', () => {
            const state = {
                shape: {
                    node: {
                        style: {
                            filter: undefined
                        }
                    },
                    apply: jest.fn(),
                    redraw: jest.fn()
                }
            };

            const graph = {
                model: {
                    getCell: jest.fn(() => 'CELL')
                },
                view: {
                    getState: jest.fn(() => state)
                }
            };

            deactivateCell(graph, 'CURRENT_CELL');

            expect(graph.view.getState).toHaveBeenCalledWith('CELL');
            expect(graph.model.getCell).toHaveBeenCalledWith('CURRENT_CELL');

            expect(state.shape.node.style.filter).toBeNull();
            expect(state.shape.apply).toHaveBeenCalledWith(state);
            expect(state.shape.redraw).toHaveBeenCalled();
        });

        it('should not deactivate the cell', () => {
            const graph = {
                model: {
                    getCell: jest.fn(() => 'CELL')
                }
            };

            deactivateCell(graph, undefined);

            expect(graph.model.getCell).not.toHaveBeenCalled();
        });
    });

    describe('activateCell', () => {
        it('should deactivate the cell', () => {
            const state = {
                shape: {
                    node: {
                        style: {
                            filter: undefined
                        }
                    },
                    apply: jest.fn(),
                    redraw: jest.fn()
                }
            };

            const graph = {
                model: {
                    getCell: jest.fn(() => 'CELL')
                },
                view: {
                    getState: jest.fn(() => state)
                }
            };

            activateCell(graph, 'CURRENT_CELL');

            expect(graph.view.getState).toHaveBeenCalledWith('CELL');
            expect(graph.model.getCell).toHaveBeenCalledWith('CURRENT_CELL');

            expect(state.shape.node.style.filter).not.toBeNull();
            expect(state.shape.apply).toHaveBeenCalledWith(state);
            expect(state.shape.redraw).toHaveBeenCalled();
        });

        it('should not deactivate the cell', () => {
            const graph = {
                model: {
                    getCell: jest.fn(() => 'CELL')
                }
            };

            activateCell(graph, undefined);

            expect(graph.model.getCell).not.toHaveBeenCalled();
        });
    });

    describe('setDatasetOnConnection', () => {
        describe('should set dataset on connection', () => {
            it.each([{ act: JOIN }, { act: CDC }])(
                'should set connection for $act stage',
                ({ act }) => {
                    const graph = {
                        model: {
                            setValue: jest.fn()
                        }
                    };

                    const target = {};

                    setDatasetOnConnection(graph, target, act, {}, {});

                    expect(graph.model.setValue).toHaveBeenCalled();
                }
            );
        });

        it('should not set dataset on connection', () => {
            const graph = {
                model: {
                    setValue: jest.fn()
                }
            };

            const target = {};

            setDatasetOnConnection(graph, target, READ, {}, {});

            expect(graph.model.setValue).not.toHaveBeenCalled();
        });
    });

    describe('setDatasetOnChangeConnection', () => {
        describe('should handle on change connection', () => {
            it.each([{ act: JOIN }, { act: CDC }])(
                'should set connection for $act stage',
                ({ act }) => {
                    const graph = {
                        model: {
                            setValue: jest.fn()
                        }
                    };

                    const targetNode = {
                        edges: [
                            {
                                target: {
                                    id: 1
                                }
                            },
                            {
                                target: {
                                    id: 1
                                }
                            }
                        ]
                    };

                    const current = {
                        target: {
                            id: 0,
                            value: {
                                attributes: {
                                    text: {
                                        value: 'Right'
                                    }
                                }
                            }
                        }
                    };

                    setDatasetOnChangeConnection(graph, current, 1, targetNode, act);

                    expect(graph.model.setValue).toHaveBeenCalled();
                }
            );
        });

        it('should not handle on change connection', () => {
            const graph = {
                model: {
                    setValue: jest.fn()
                }
            };

            const current = {
                target: {
                    id: 0,
                    value: {
                        attributes: {
                            text: {
                                value: 'Right'
                            }
                        }
                    }
                }
            };

            setDatasetOnChangeConnection(graph, current, 1, {}, READ);

            expect(graph.model.setValue).not.toHaveBeenCalled();
        });
    });

    describe('loadContent', () => {
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
                }
            },
            mxgraph: {
                border: {
                    normal: 'theme.mxgraph.border.normal',
                    strong: 'theme.mxgraph.border.strong'
                }
            }
        };

        it('should load content for pipelines', () => {
            const beginUpdate = jest.fn();
            const endUpdate = jest.fn();

            const graph = {
                getDefaultParent: jest.fn(),
                getModel: jest.fn(() => ({
                    beginUpdate,
                    endUpdate
                })),
                removeCells: jest.fn(),
                getChildVertices: jest.fn(),
                insertVertex: jest.fn((_, id) => id),
                insertEdge: jest.fn()
            };

            const stages = {
                [READ]: { color: 'green' },
                [WRITE]: { color: 'red' }
            };

            const jobsStatuses = {
                0: SUCCEEDED,
                1: FAILED
            };

            const content = {
                graph: [
                    {},
                    {},
                    {
                        value: { getAttribute: () => READ },
                        id: 0,
                        geometry: {
                            x: 0,
                            y: 1,
                            width: 100,
                            height: 120
                        }
                    },
                    {
                        value: { getAttribute: () => WRITE },
                        id: 1,
                        geometry: {
                            x: 10,
                            y: 11,
                            width: 1100,
                            height: 1120
                        }
                    },
                    {
                        value: {
                            getAttribute: x => (x === 'operation' ? EDGE : 'false')
                        },
                        id: 2,
                        source: 0,
                        target: 1,
                        geometry: {
                            x: 10,
                            y: 11,
                            width: 1100,
                            height: 1120,
                            points: [
                                { x: 1, y: 1 },
                                { x: 2, y: 2 }
                            ]
                        }
                    },
                    {
                        value: {
                            getAttribute: x => (x === 'operation' ? EDGE : 'true')
                        },
                        id: 3,
                        source: 1,
                        target: 0,
                        geometry: {
                            x: 10,
                            y: 11,
                            width: 1100,
                            height: 1120,
                            points: [
                                { x: 1, y: 1 },
                                { x: 2, y: 2 }
                            ]
                        }
                    }
                ]
            };

            loadContent(content, graph, stages, theme, PIPELINE, jobsStatuses);

            expect(graph.getModel().beginUpdate).toHaveBeenCalled();
            expect(graph.getModel().endUpdate).toHaveBeenCalled();

            expect(graph.getDefaultParent).toHaveBeenCalled();
            expect(graph.removeCells).toHaveBeenCalled();
            expect(graph.getChildVertices).toHaveBeenCalled();

            expect(graph.insertVertex.mock.calls).toEqual([
                [
                    undefined,
                    0,
                    expect.any(Object),
                    0,
                    1,
                    100,
                    120,
                    'fillColor=green;strokeWidth=theme.mxgraph.border.strong;strokeColor=theme.palette.success.light;'
                ],
                [
                    undefined,
                    1,
                    expect.any(Object),
                    10,
                    11,
                    1100,
                    1120,
                    'fillColor=red;strokeWidth=theme.mxgraph.border.strong;strokeColor=theme.palette.error.light;'
                ]
            ]);

            expect(graph.insertEdge.mock.calls).toEqual([
                [
                    undefined,
                    2,
                    expect.any(Object),
                    0,
                    1,
                    'strokeColor=theme.palette.error.light;'
                ],
                [
                    undefined,
                    3,
                    expect.any(Object),
                    1,
                    0,
                    'strokeColor=theme.palette.success.light;'
                ]
            ]);
        });

        it('should load content for jobs', () => {
            const beginUpdate = jest.fn();
            const endUpdate = jest.fn();

            const graph = {
                getDefaultParent: jest.fn(),
                getModel: jest.fn(() => ({
                    beginUpdate,
                    endUpdate
                })),
                removeCells: jest.fn(),
                getChildVertices: jest.fn(),
                insertVertex: jest.fn((_, id) => id),
                insertEdge: jest.fn()
            };

            const stages = {
                [READ]: { color: 'green' },
                [WRITE]: { color: 'red' }
            };

            const content = {
                graph: [
                    {},
                    {},
                    {
                        value: { getAttribute: () => READ },
                        id: 0,
                        geometry: { x: 0, y: 1, width: 100, height: 120 }
                    },
                    {
                        value: { getAttribute: () => WRITE },
                        id: 1,
                        geometry: { x: 10, y: 11, width: 1100, height: 1120 }
                    },
                    {
                        value: {
                            getAttribute: x => (x === 'operation' ? EDGE : 'false')
                        },
                        id: 2,
                        source: 0,
                        target: 1,
                        geometry: {
                            x: 10,
                            y: 11,
                            width: 1100,
                            height: 1120,
                            points: [
                                { x: 1, y: 1 },
                                { x: 2, y: 2 }
                            ]
                        }
                    },
                    {
                        value: {
                            getAttribute: x => (x === 'operation' ? EDGE : 'true')
                        },
                        id: 3,
                        source: 1,
                        target: 0,
                        geometry: {
                            x: 10,
                            y: 11,
                            width: 1100,
                            height: 1120,
                            points: [
                                { x: 1, y: 1 },
                                { x: 2, y: 2 }
                            ]
                        }
                    }
                ]
            };

            loadContent(content, graph, stages, theme, JOB, {});

            expect(graph.getModel().beginUpdate).toHaveBeenCalled();
            expect(graph.getModel().endUpdate).toHaveBeenCalled();

            expect(graph.getDefaultParent).toHaveBeenCalled();
            expect(graph.removeCells).toHaveBeenCalled();
            expect(graph.getChildVertices).toHaveBeenCalled();

            expect(graph.insertVertex.mock.calls).toEqual([
                [
                    undefined,
                    0,
                    expect.any(Object),
                    0,
                    1,
                    100,
                    120,
                    'fillColor=green;'
                ],
                [
                    undefined,
                    1,
                    expect.any(Object),
                    10,
                    11,
                    1100,
                    1120,
                    'fillColor=red;'
                ]
            ]);

            expect(graph.insertEdge.mock.calls).toEqual([
                [
                    undefined,
                    2,
                    expect.any(Object),
                    0,
                    1,
                    'strokeColor=theme.palette.error.light;'
                ],
                [
                    undefined,
                    3,
                    expect.any(Object),
                    1,
                    0,
                    'strokeColor=theme.palette.success.light;'
                ]
            ]);
        });
    });
});
