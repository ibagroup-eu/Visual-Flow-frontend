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
import { getFieldNames, Params } from './Params';
import { Button } from '@material-ui/core';
import FieldFactory from './FieldFactory';

describe('Params', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            store: {
                fields: {
                    EXECUTOR_INSTANCES: 100500,
                    EXECUTOR_MEMORY: 100500,
                    UP_TO: 30,
                    INTERVALS: 30
                },
                data: {
                    params: {
                        DRIVER_REQUEST_CORES: 100500,
                        EXECUTOR_INSTANCES: 100500,
                        UP_TO: 30,
                        INTERVALS: 30
                    },
                    name: 'name'
                }
            },
            ableToEdit: true,
            paramsIsDirty: true,
            setDirty: jest.fn(),
            save: jest.fn(),
            confirmationWindow: jest.fn()
        };

        const wrapper = func(<Params {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper, props] = init({}, true);

        expect(wrapper.find(FieldFactory).prop('fields')).toBe(props.store.fields);
    });

    it('should hide action button if do not have access', () => {
        const [wrapper] = init({ ableToEdit: false });

        expect(wrapper.find(Button).length).toBe(0);
    });

    it('should handle change', () => {
        const [wrapper, props] = init({}, true, mount);
        const fieldFactory = wrapper.find(FieldFactory);

        let event = {
            target: {
                name: 'INTERVALS',
                value: 300
            },
            persist: jest.fn()
        };
        fieldFactory.prop('onChange')(event);
        fieldFactory.prop('onError')(event);

        event = {
            target: {
                name: 'UP_TO',
                value: 300
            },
            persist: jest.fn()
        };
        fieldFactory.prop('onChange')(event);
        fieldFactory.prop('onError')(event);

        expect(props.setDirty).toHaveBeenCalled();
    });

    it('should save', () => {
        const [wrapper, props] = init({}, true);

        wrapper
            .find(Button)
            .at(0)
            .simulate('click');

        expect(props.save).toHaveBeenCalled();
    });

    it('should show a confirmation window', () => {
        const [wrapper, props] = init({ paramsIsDirty: true }, true);

        wrapper
            .find(Button)
            .at(1)
            .simulate('click');

        expect(props.confirmationWindow).toHaveBeenCalled();
        expect(props.setDirty).not.toHaveBeenCalled();

        const callback = props.confirmationWindow.mock.calls[0][0].callback;

        callback();

        expect(props.setDirty).toHaveBeenCalled();
    });

    it('should set dirty', () => {
        const [wrapper, props] = init({ paramsIsDirty: false }, true);

        wrapper
            .find(Button)
            .at(1)
            .simulate('click');

        expect(props.setDirty).toHaveBeenCalled();
    });

    it('should return field names', () => {
        expect(getFieldNames({})).toEqual([]);

        expect(
            getFieldNames({
                name: {},
                age: {},
                notificationsPanel: {
                    type: 'section',
                    fields: {
                        state: {}
                    }
                },
                networksPanel: {
                    type: 'section',
                    fields: {
                        network: {}
                    }
                }
            })
        ).toEqual(['name', 'age', 'state', 'network']);
    });

    it('should return field names with deep structure', () => {
        expect(getFieldNames({})).toEqual([]);

        expect(
            getFieldNames({
                resourcesPanel: {
                    type: 'section',
                    fields: {
                        cores: {},
                        memory: {}
                    }
                },
                name: {},
                age: {},
                notificationsPanel: {
                    type: 'section',
                    fields: {
                        state: {},
                        turnOn: {}
                    }
                },
                networksPanel: {
                    type: 'section',
                    fields: {
                        network: {},
                        ping: {}
                    }
                }
            })
        ).toEqual([
            'cores',
            'memory',
            'name',
            'age',
            'state',
            'turnOn',
            'network',
            'ping'
        ]);
    });

    it('should return field names with simple structure', () => {
        expect(getFieldNames({})).toEqual([]);

        expect(
            getFieldNames({
                NAME: {
                    label: 'jobs:params.Name',
                    type: 'text'
                },

                DRIVER_REQUEST_CORES: {
                    label: 'jobs:params.driverRequestCores',
                    type: 'number',
                    inputProps: { step: 0.1, min: 0 }
                },

                DRIVER_CORES: {
                    label: 'jobs:params.driverCores',
                    type: 'number',
                    inputProps: { step: 1, min: 0 }
                },

                DRIVER_MEMORY: {
                    label: 'jobs:params.driverMemory',
                    type: 'number',
                    inputProps: { step: 1, min: 0 },
                    adornment: 'GB'
                },

                EXECUTOR_REQUEST_CORES: {
                    label: 'jobs:params.executorRequestCores',
                    type: 'number',
                    inputProps: { step: 0.1, min: 0 }
                },

                EXECUTOR_CORES: {
                    label: 'jobs:params.executorCores',
                    type: 'number',
                    inputProps: { step: 1, min: 0 }
                },

                EXECUTOR_MEMORY: {
                    label: 'jobs:params.executorMemory',
                    type: 'number',
                    inputProps: { step: 1, min: 0 },
                    adornment: 'GB'
                },

                EXECUTOR_INSTANCES: {
                    label: 'jobs:params.executorInstances',
                    type: 'number',
                    inputProps: { step: 1, min: 0 }
                },

                SHUFFLE_PARTITIONS: {
                    label: 'jobs:params.shufflePartitions',
                    type: 'number',
                    inputProps: { step: 1, min: 0 }
                }
            })
        ).toEqual([
            'NAME',
            'DRIVER_REQUEST_CORES',
            'DRIVER_CORES',
            'DRIVER_MEMORY',
            'EXECUTOR_REQUEST_CORES',
            'EXECUTOR_CORES',
            'EXECUTOR_MEMORY',
            'EXECUTOR_INSTANCES',
            'SHUFFLE_PARTITIONS'
        ]);
    });
});
