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
import { mount, shallow } from 'enzyme';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import Tabs from './Tabs';
import { AWS, AZURE, GCP } from '../../../mxgraph/constants';
import { ParamsTextField } from '../../../mxgraph/sidebar/params/fields';
import AWSFirstTabPanel from './AWSFirstTabPanel';
import GCPFirstTabPanel from './GCPFirstTabPanel';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

describe('Tabs', () => {
    const init = (
        props = {},
        returnProps = false,
        cloud = AZURE,
        zones = ['us-east-1d'],
        func = mount
    ) => {
        const defaultProps = {
            fields: [],
            state: {
                POLICY: 'unrestricted',
                DESTINATION: 's3',
                LOG_PATH: 'bla://'
            },
            onChange: jest.fn(),
            onError: jest.fn(),
            setState: jest.fn(),
            setIsValidScriptsSchema: jest.fn(),
            onSaveScripts: jest.fn(),
            scriptsSchema: {
                current: {
                    fields: {}
                }
            },
            ableToEdit: true
        };

        useSelector.mockImplementation(selector => {
            if (selector.toString().includes('zones')) {
                return ['zone1', 'zone2'];
            }
            return cloud;
        });

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<Tabs {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);

        expect(wrapper).toBeDefined();

        expect(wrapper.find(TabList).length).toBe(1);

        wrapper.find(TabList).prop('onChange')({}, '1');
        expect(wrapper.find(TabContext).prop('value')).toEqual('2');

        const tPanel = shallow(
            wrapper
                .find(TabPanel)
                .at(2)
                .prop('children')
        );
        expect(tPanel.find(ParamsTextField).length).toBe(1);
        expect(tPanel.find(ParamsTextField).prop('placeholder')).toBe('s3://');
        expect(
            tPanel
                .find(ParamsTextField)
                .prop('error')
                .includes('sThreeError')
        ).toBeTruthy();
    });

    it('should render ParamsTextField with correct attributes', () => {
        const [wrapper] = init(
            {
                state: {
                    POLICY: 'unrestricted',
                    DESTINATION: 'dbfs',
                    LOG_PATH: 'bla://'
                }
            },
            true,
            GCP
        );

        const tPanel = shallow(
            wrapper
                .find(TabPanel)
                .at(2)
                .prop('children')
        );
        expect(tPanel.find(ParamsTextField).length).toBe(1);
        expect(tPanel.find(ParamsTextField).prop('placeholder')).toBe(
            'dbfs:/cluster-logs'
        );
        expect(
            tPanel
                .find(ParamsTextField)
                .prop('error')
                .includes('dbfsError')
        ).toBeTruthy();

        expect(wrapper.find(GCPFirstTabPanel).length).toBe(1);
    });

    it('should render ParamsTextField with correct attributes 2', () => {
        const [wrapper] = init(
            {
                state: {
                    POLICY: 'unrestricted',
                    DESTINATION: 's4',
                    LOG_PATH: 'bla://'
                }
            },
            true,
            AWS
        );

        const tPanel = shallow(
            wrapper
                .find(TabPanel)
                .at(2)
                .prop('children')
        );
        expect(tPanel.find(ParamsTextField).length).toBe(1);
        expect(tPanel.find(ParamsTextField).prop('placeholder')).toBe(
            'dbfs:/cluster-logs'
        );
        expect(tPanel.find(ParamsTextField).prop('error')).not.toBeDefined();

        expect(wrapper.find(AWSFirstTabPanel).length).toBe(1);
    });
});
