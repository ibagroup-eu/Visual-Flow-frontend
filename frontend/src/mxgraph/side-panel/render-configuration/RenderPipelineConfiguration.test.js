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
import { mount, shallow } from 'enzyme';
import { CONTAINER, NOTIFICATION } from '../../constants';
import RenderPipelineConfiguration, {
    checkContainerFields,
    checkNotification
} from './RenderPipelineConfiguration';
import Configuration from '../configuration';
import {
    findParamByKey,
    validParamsContainer
} from '../../../components/helpers/PipelinesValidation';

jest.mock('../../../components/helpers/PipelinesValidation', () => ({
    findParamByKey: jest.fn(),
    validParamsContainer: jest.fn()
}));

describe('RenderPipelineConfiguration', () => {
    it('should render component matching operation', () => {
        const configuration = {
            operation: NOTIFICATION
        };

        const wrapper = shallow(
            <RenderPipelineConfiguration configuration={configuration} />
        );
        expect(wrapper.find(Configuration).exists()).toBeTruthy();
    });

    it('should update state', () => {
        const props = {
            setPanelDirty: jest.fn(),
            configuration: {
                operation: NOTIFICATION
            },
            graph: { getSelectionCell: jest.fn(), getIncomingEdges: jest.fn() }
        };

        const wrapper = mount(<RenderPipelineConfiguration {...props} />);

        wrapper.setProps({
            configuration: {
                operation: CONTAINER
            }
        });
        wrapper.update();
        expect(props.setPanelDirty).toHaveBeenCalled();
    });

    it('should not render when operation does not exist', () => {
        const configuration = {};
        const wrapper = shallow(
            <RenderPipelineConfiguration configuration={configuration} />
        );
        expect(wrapper.children().length).toBe(0);
    });
});

describe('checkNotification', () => {
    const params = {};
    const name = 'name';
    const message = 'message';

    it.each([
        { source: {}, expected: true },
        { source: { name }, expected: true },
        { source: { name, message }, expected: true }
    ])(
        'should return $expected when called with $source',
        ({ source, expected }) => {
            expect(checkNotification(params, source)).toBe(expected);
        }
    );

    it('should call findParamByKey', () => {
        const state = { name, message, addressees: 'addressees' };
        checkNotification(params, state);
        expect(findParamByKey).toHaveBeenCalledWith(params, [state.addressees]);
    });
});

describe('checkContainerFields', () => {
    const params = {};
    const fields = {
        name: 'name',
        image: 'image',
        requestsCpu: 'requestsCpu',
        requestsMemory: 'requestsMemory',
        limitsCpu: 'limitsCpu',
        limitsMemory: 'limitsMemory',
        imagePullPolicy: 'imagePullPolicy'
    };

    it.each([
        { source: {}, expected: true },
        {
            source: {
                ...fields,
                imagePullSecretType: 'NEW'
            },
            expected: true
        },
        { source: { ...fields, imagePullSecretType: 'PROVIDED' }, expected: true }
    ])(
        'should return $expected when called with $source',
        ({ source, expected }) => {
            expect(checkContainerFields(params, source)).toBe(expected);
        }
    );

    it('should call validParamsContainer', () => {
        const inputValues = {
            name: 'name',
            image: 'image',
            imagePullSecretType: 'imagePullSecretType',
            requestsCpu: 'requestsCpu',
            requestsMemory: 'requestsMemory',
            limitsCpu: 'limitsCpu',
            limitsMemory: 'limitsMemory',
            imagePullPolicy: 'imagePullPolicy'
        };
        checkContainerFields(params, inputValues);
        expect(validParamsContainer).toHaveBeenCalledWith(params, inputValues);
    });
});
