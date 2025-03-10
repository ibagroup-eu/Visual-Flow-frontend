/*
 * Copyright (c) 2022 IBA Group, a.s. All rights reserved.
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
import RenderJobConfiguration from './RenderJobConfiguration';
import { EDGE, READ } from '../../constants';
import EdgeConfiguration from '../edge-configuration';
import Configuration from '../configuration';

describe('RenderJobConfiguration', () => {
    const graph = {
        getSelectionCell: jest.fn()
    };

    it('should render component matching operation', () => {
        const configuration = {
            operation: EDGE
        };

        const wrapper = shallow(
            <RenderJobConfiguration configuration={configuration} graph={graph} />
        );
        expect(wrapper.find(EdgeConfiguration).exists()).toBeTruthy();
    });

    it('should render READ component matching operation', () => {
        const configuration = {
            operation: READ
        };

        const wrapper = shallow(
            <RenderJobConfiguration configuration={configuration} graph={graph} />
        );
        const configComp = wrapper.find(Configuration);
        expect(configComp.exists()).toBeTruthy();
        expect(configComp.prop('configuration')).toMatchObject({
            operation: 'READ'
        });
    });

    it('should not render when operation does not exist', () => {
        const configuration = {};
        const wrapper = shallow(
            <RenderJobConfiguration configuration={configuration} graph={graph} />
        );
        expect(wrapper.children().length).toBe(0);
    });
});
