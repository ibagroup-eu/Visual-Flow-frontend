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

import { Grid, Slider, Typography } from '@material-ui/core';

import AdvancedAWSContent from './AdvancedAWSContent';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('AdvancedAWSContent', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            fields: [],
            state: {
                POLICY: 'restricted',
                NODES: 'nodes',
                AUTOSCALING_WORKERS: true,
                MIN_WORKERS: 5,
                MAX_WORKERS: 50,
                WORKERS: []
            },
            onChange: jest.fn(),
            ableToEdit: true
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<AdvancedAWSContent {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper, props] = init({}, true);

        expect(wrapper).toBeDefined();

        const text =
            'Advanced options On-demand/spot composition 5-50 Workers: 0-0 GB Memory, 0-0 Cores';

        expect(wrapper.find(Typography).length).toBe(2);
        expect(
            wrapper
                .find(Typography)
                .at(0)
                .text()
        ).toEqual(text);

        wrapper.find(Slider).prop('onChange')();
        expect(props.onChange).not.toHaveBeenCalled();
    });

    it('should render without crashes (AUTOSCALING_WORKERS = false)', () => {
        const [wrapper, props] = init(
            {
                state: {
                    POLICY: 'restricted',
                    NODES: 'nodes',
                    AUTOSCALING_WORKERS: false,
                    MIN_WORKERS: 5,
                    MAX_WORKERS: 50,
                    WORKERS: [],
                    ON_DEMAND_SPOT: false
                }
            },
            true
        );

        expect(wrapper).toBeDefined();

        const text =
            'Advanced options On-demand/spot composition  Workers: 0 GB Memory, 0 Cores';

        expect(wrapper.find(Typography).length).toBe(2);
        expect(
            wrapper
                .find(Typography)
                .at(0)
                .text()
        ).toEqual(text);

        expect(wrapper.find(Slider).length).toBe(1);
        wrapper.find(Slider).prop('onChange')(true, { target: {} });
        expect(props.onChange).toHaveBeenCalled();
    });

    it('should render only one typography', () => {
        const [wrapper] = init(
            {
                state: {
                    POLICY: 'unrestricted',
                    NODES: 'single',
                    AUTOSCALING_WORKERS: false,
                    MIN_WORKERS: 5,
                    MAX_WORKERS: 50,
                    WORKERS: [],
                    ON_DEMAND_SPOT: false
                }
            },
            true
        );

        expect(wrapper).toBeDefined();

        expect(wrapper.find(Typography).length).toBe(1);
        expect(
            wrapper
                .find(Typography)
                .at(0)
                .text()
        ).toEqual('jobDesigner:Cluster.modal.iamRole');
    });

    it('should render Grid', () => {
        const [wrapper] = init(
            {
                state: {
                    POLICY: 'unrestricted',
                    NODES: '',
                    AUTOSCALING_WORKERS: false,
                    MIN_WORKERS: 5,
                    MAX_WORKERS: 50,
                    WORKERS: [],
                    ON_DEMAND_SPOT: false
                }
            },
            true
        );

        expect(wrapper.find(Grid).length).toBe(3);
    });
});
