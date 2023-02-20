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

import { mount, shallow } from 'enzyme';
import React from 'react';
import { getOutputPaths, JobConfiguration } from './JobConfiguration';
import { TextField, Typography } from '@material-ui/core';

import SaveCancelButtons from '../../buttons/SaveCancelButtons';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('JobConfiguration', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            state: { jobId: '1' },
            configuration: {},
            ableToEdit: true,
            isDisabled: jest.fn(),
            saveCell: jest.fn(),
            setPanelDirty: jest.fn(),
            graph: {}
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<JobConfiguration {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();
        expect(wrapper).toBeDefined();
    });

    it('should return transformed output edges', () => {
        const graph = {
            getSelectionCell: jest.fn(),
            getOutgoingEdges: () => [
                {
                    id: 'id_1',
                    value: {
                        attributes: {
                            successPath: {
                                value: 'value_1'
                            }
                        }
                    },
                    target: {
                        value: {
                            attributes: {
                                name: {
                                    value: 'target_value_1'
                                }
                            }
                        }
                    }
                }
            ]
        };

        expect(getOutputPaths(graph)).toEqual([
            { id: 'id_1', successPath: 'value_1', job: 'target_value_1' }
        ]);
    });

    it('should return empty output edges', () => {
        expect(
            getOutputPaths({
                getSelectionCell: jest.fn(),
                getOutgoingEdges: () => undefined
            })
        ).toEqual([]);

        expect(
            getOutputPaths({
                getSelectionCell: jest.fn(),
                getOutgoingEdges: () => null
            })
        ).toEqual([]);
    });

    it('should render output paths', () => {
        const [wrapper] = init(
            {
                graph: {
                    getSelectionCell: jest.fn(),
                    getOutgoingEdges: () => [
                        {
                            id: 'id_1',
                            value: {
                                attributes: {
                                    successPath: {
                                        value: 'value_1'
                                    }
                                }
                            },
                            target: {
                                value: {
                                    attributes: {
                                        name: {
                                            value: 'target_value_1'
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            false,
            mount
        );

        expect(wrapper.find(Typography).text()).toBe(
            'pipelineDesigner:jobConfiguration.OutputPaths'
        );
    });

    it('should save configuration', () => {
        const [wrapper, props] = init(
            {
                graph: {
                    getSelectionCell: jest.fn(),
                    getOutgoingEdges: jest
                        .fn()
                        .mockReturnValueOnce([
                            {
                                id: 'id_1',
                                value: {
                                    attributes: {
                                        successPath: {
                                            value: 'value_1'
                                        }
                                    }
                                },
                                target: {
                                    value: {
                                        attributes: {
                                            name: {
                                                value: 'target_value_1'
                                            }
                                        }
                                    }
                                }
                            }
                        ])
                        .mockReturnValueOnce([
                            {
                                id: 'id_1',
                                value: {
                                    attributes: {
                                        successPath: {
                                            value: 'value_2'
                                        }
                                    }
                                },
                                target: {
                                    value: {
                                        attributes: {
                                            name: {
                                                value: 'target_value_1'
                                            }
                                        }
                                    }
                                }
                            }
                        ]),
                    model: {
                        setValue: jest.fn()
                    },
                    setCellStyles: jest.fn()
                }
            },
            true,
            mount
        );

        wrapper.find(SaveCancelButtons).prop('saveCell')();

        expect(props.graph.model.setValue).toHaveBeenCalled();
        expect(props.graph.setCellStyles).toHaveBeenCalled();
    });

    it('should handle path status changing', () => {
        const [wrapper, props] = init(
            {
                graph: {
                    getSelectionCell: jest.fn(),
                    getOutgoingEdges: () => [
                        {
                            id: 'id_1',
                            value: {
                                attributes: {
                                    successPath: {
                                        value: 'value_1'
                                    }
                                }
                            },
                            target: {
                                value: {
                                    attributes: {
                                        name: {
                                            value: 'target_value_1'
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            true,
            mount
        );

        const field = wrapper.find(TextField).at(2);

        field.prop('onChange')({ target: { value: 'value_1' } });

        expect(props.setPanelDirty).toHaveBeenCalled();
    });
});
