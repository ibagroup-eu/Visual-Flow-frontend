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

import { mount } from 'enzyme';
import React from 'react';
import FieldFactory from './FieldFactory';
import { ParamsChipsField, ParamsSwitchField, ParamsTextField } from './fields';
import TabsSection from './TabsSection';
import Section from './Section';

describe('FieldFactory', () => {
    const init = (props = {}, returnProps = false, func = mount) => {
        const defaultProps = {
            fields: {
                NAME: {
                    label: 'Name',
                    type: 'text',
                    required: true,
                    validate: jest.fn()
                },
                NOTIFICATION_PANEL: {
                    label: 'NotificationsPanel',
                    type: 'tabs',
                    needs: ['NAME'],
                    fields: {
                        SLACK_TAB: {
                            label: 'Slack',
                            type: 'tab',
                            fields: {
                                'SLACK.NOTIFY_FAILURE': {
                                    label: 'NotifyFailure',
                                    type: 'switch'
                                }
                            }
                        }
                    }
                },
                TAGS: {
                    label: 'Tags',
                    type: 'chips',
                    hint: 'TagsHint'
                }
            },
            ableToEdit: true,
            onChange: jest.fn(),
            parentRef: {},
            state: {
                EMAIL: {
                    NOTIFY_FAILURE: false,
                    NOTIFY_SUCCESS: true,
                    RECIPIENTS: []
                },
                NAME: 'name',
                SLACK: {
                    CHANNELS: [],
                    NOTIFY_FAILURE: false,
                    NOTIFY_SUCCESS: true,
                    RECIPIENTS: []
                },
                TAGS: []
            }
        };

        const wrapper = func(<FieldFactory {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);

        expect(wrapper.find(ParamsTextField).length).toBe(1);
        expect(wrapper.find(ParamsSwitchField).length).toBe(1);
        expect(wrapper.find(ParamsChipsField).length).toBe(1);
        expect(wrapper.find(TabsSection).exists()).toBeTruthy();
    });

    it('should run getSection func', () => {
        const [wrapper] = init(
            {
                fields: {
                    RESOURCES_PANEL: {
                        label: 'ResourcesPanel',
                        type: 'section',
                        fields: {
                            DRIVER_REQUEST_CORES: {
                                label: 'driverRequestCores',
                                type: 'number'
                            }
                        }
                    }
                }
            },
            true
        );

        expect(wrapper.find(Section).exists()).toBeTruthy();
    });
});
