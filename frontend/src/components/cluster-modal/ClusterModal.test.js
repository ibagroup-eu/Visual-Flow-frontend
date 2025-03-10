/*
 *  Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import React from 'react';
import { mount } from 'enzyme';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Button } from '@material-ui/core';

import PopupForm from '../popup-form';
import ClusterModal from './ClusterModal';
import { AWS, AZURE, GCP } from '../../mxgraph/constants';
import {
    ParamsSwitchField,
    ParamsTextField
} from '../../mxgraph/sidebar/params/fields';
import AdvancedAWSContent from './advancedOptions/AdvancedAWSContent';
import SelectField from '../select-field';
import Tabs from './advancedOptions/Tabs';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

describe('ClusterModal', () => {
    const init = (props = {}, returnProps = false, cloud = AZURE, func = mount) => {
        const defaultProps = {
            state: {
                POLICY: 'unrestricted',
                AUTOSCALING_WORKERS: true,
                DESTINATION: 'dbfs',
                LOG_PATH: 'dbfs:/',
                NODES: [],
                SPOT_INSTANCE: 'spot-instaance',
                GOOGLE_SERVICE_ACCOUNT: 'google'
            },
            fields: {
                NODES: {
                    radios: []
                }
            },
            onChange: jest.fn(),
            display: true,
            onClose: jest.fn(),
            ableToEdit: true,
            setState: jest.fn()
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));

        useSelector.mockImplementation(selector => {
            const sel = selector.toString();

            if (sel.includes('node_types')) {
                return [
                    {
                        node_type_id: '1',
                        description: 'description',
                        nodeType: 'nodeType'
                    }
                ];
            }
            if (sel.includes('policies')) {
                return [{ policy_id: '2', name: 'name' }];
            }
            if (sel.includes('versions')) {
                return [{ key: 'key', name: 'name' }];
            }
            if (sel.includes('zones')) {
                return ['zone1', 'zone2'];
            }
            return cloud;
        });

        const wrapper = func(<ClusterModal {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(PopupForm).exists()).toBeTruthy();
        expect(wrapper.find(Button).length).toBe(2);

        expect(wrapper.find(ParamsSwitchField).length).toBe(3);
        expect(
            wrapper
                .find(ParamsSwitchField)
                .at(1)
                .prop('value')
        ).toBe('spot-instaance');
    });

    it('should handle "onClose"', () => {
        const [wrapper, props] = init({}, true);

        const [_, closeBtn] = wrapper.find(Button).map(x => x);

        closeBtn.simulate('click');

        expect(props.onClose).toHaveBeenCalled();
    });

    it('should handle Save button', async () => {
        const [wrapper, props] = init({}, true);

        const seveButton = wrapper.find(Button).at(0);
        expect(seveButton.text().includes('Save')).toBeTruthy();
        seveButton.prop('onClick')();
        expect(await props.onClose).toHaveBeenCalled();
    });

    it('should render ParamsTextField for GCP', () => {
        const [wrapper] = init({}, true, GCP);

        expect(wrapper.find(ParamsTextField).length).toBe(4);
        expect(
            wrapper
                .find(ParamsTextField)
                .at(3)
                .prop('name')
        ).toBe('GOOGLE_SERVICE_ACCOUNT');
    });

    it('should render SelectField for NODE_TYPE', () => {
        const [wrapper, props] = init(
            {
                state: {
                    POLICY: 'unrestricted',
                    AUTOSCALING_WORKERS: true,
                    DESTINATION: 'dbfs',
                    LOG_PATH: 'dbfs:/',
                    NODES: 'single',
                    SPOT_INSTANCE: 'spot-instaance',
                    GOOGLE_SERVICE_ACCOUNT: 'google'
                }
            },
            true
        );

        const nodeType = wrapper.find(SelectField);
        expect(nodeType.length).toBe(4);
        expect(nodeType.at(3).prop('name')).toBe('NODE_TYPE');

        const tabs = wrapper.find(Tabs);
        expect(tabs.length).toBe(1);
        tabs.prop('onSaveScripts')();
        expect(props.onChange).toHaveBeenCalled();
    });

    it('should render AdvancedAWSContent', () => {
        const [wrapper] = init(
            {
                state: {
                    POLICY: 'stricted',
                    AUTOSCALING_WORKERS: false,
                    DESTINATION: 'dbfs',
                    LOG_PATH: 'dbfs:/',
                    NODES: 'none',
                    SPOT_INSTANCE: 'spot-instaance',
                    GOOGLE_SERVICE_ACCOUNT: 'google'
                }
            },
            true,
            AWS
        );

        expect(wrapper.find(AdvancedAWSContent).length).toBe(1);

        expect(wrapper.find(ParamsTextField).length).toBe(2);
        expect(
            wrapper
                .find(ParamsTextField)
                .at(1)
                .prop('name')
        ).toBe('WORKERS');
    });
});
