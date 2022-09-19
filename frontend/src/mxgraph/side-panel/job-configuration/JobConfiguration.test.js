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
import { Box, TextField, Typography } from '@material-ui/core';
import { TextSkeleton } from '../../../components/skeleton';
import SaveCancelButtons from '../buttons/SaveCancelButtons';
import { useTranslation } from 'react-i18next';
import JobsModal from './jobs-modal';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('JobsModal', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            jobs: {
                loading: true,
                data: { jobs: [] }
            },
            configuration: {},
            ableToEdit: true,
            isDisabled: jest.fn(),
            saveCell: jest.fn(),
            setPanelDirty: jest.fn(),
            sidePanelIsOpen: true,
            graph: {}
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<JobConfiguration {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(Box).exists()).toBeTruthy();
        expect(wrapper.find(TextSkeleton).exists()).toBeTruthy();
    });

    it('should not render skeletons', () => {
        const [wrapper] = init({
            jobs: {
                loading: false,
                data: { jobs: [] }
            }
        });

        expect(wrapper.find(TextSkeleton).exists()).toBeFalsy();
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

    it('should handle input change', () => {
        const [wrapper] = init({
            jobs: {
                loading: false,
                data: { jobs: [] }
            }
        });

        expect(
            wrapper
                .find(TextField)
                .at(0)
                .prop('value')
        ).toBe('');

        wrapper
            .find(TextField)
            .at(0)
            .simulate('change', { target: { name: 'name', value: 'value' } });

        wrapper.update();

        expect(
            wrapper
                .find(TextField)
                .at(0)
                .prop('value')
        ).toBe('value');
    });

    it('should cancel changes', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(SaveCancelButtons).prop('cancelChanges')();

        expect(props.setPanelDirty).toHaveBeenCalledWith(false);
    });

    it('should render output paths', () => {
        const [wrapper] = init(
            {
                jobs: {
                    loading: false,
                    data: { jobs: [] }
                },
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
                jobs: {
                    loading: false,
                    data: { jobs: [] }
                },
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

    it('should call jobs modal onClose', () => {
        const [wrapper] = init({
            jobs: {
                loading: false,
                data: { jobs: [] }
            }
        });

        expect(wrapper.find(JobsModal).prop('display')).toBeFalsy();

        wrapper
            .find(TextField)
            .at(1)
            .prop('InputProps')
            .endAdornment.props.onClick();

        wrapper.update();

        expect(wrapper.find(JobsModal).prop('display')).toBeTruthy();

        wrapper.find(JobsModal).prop('onClose')();

        wrapper.update();

        expect(wrapper.find(JobsModal).prop('display')).toBeFalsy();
    });

    it('should handle path status changing', () => {
        const [wrapper, props] = init(
            {
                jobs: {
                    loading: false,
                    data: { jobs: [] }
                },
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

    it('should handle jobs modal set value flow', () => {
        const [wrapper] = init({
            jobs: {
                loading: false,
                data: { jobs: [] }
            }
        });

        expect(wrapper.find(JobsModal).prop('display')).toBeFalsy();

        wrapper
            .find(TextField)
            .at(1)
            .prop('InputProps')
            .endAdornment.props.onClick();

        wrapper.update();

        expect(wrapper.find(JobsModal).prop('display')).toBeTruthy();

        wrapper.find(JobsModal).prop('onSetValue')();

        wrapper.update();

        expect(wrapper.find(JobsModal).prop('display')).toBeFalsy();
    });
});
