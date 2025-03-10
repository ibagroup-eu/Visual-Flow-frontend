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

import { Parameters } from './Parameters';
import ParametersTableRow from './table';
import ParametersPanel from './panel';
import ParametersSearch from './search/ParametersSearch';
import PropertySelect from '../../../components/property-select';
import { PageSkeleton } from '../../../components/skeleton';

describe('Parameters', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            classes: {},
            projectId: 'projectId',
            loading: false,
            getParameters: jest.fn(),
            create: jest.fn(() => Promise.resolve()),
            update: jest.fn(() => Promise.resolve()),
            remove: jest.fn(),
            parameters: [
                {
                    id: 'key_1',
                    key: 'key_1',
                    value: 'value_1',
                    secret: false
                },
                {
                    id: 'key_2',
                    key: 'key_2',
                    value: 'value_2',
                    secret: true
                }
            ],
            editStatus: {},
            deleteStatus: {},
            saving: false,
            editable: true
        };

        const wrapper = func(<Parameters {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(ParametersTableRow).length).toBe(2);
        expect(wrapper.find(ParametersPanel).exists()).toBeTruthy();
    });

    it('should track editing & deleting states', () => {
        const [wrapper] = init({
            editStatus: { key_1: true },
            deleteStatus: { key_2: true }
        });

        const [first, second] = wrapper.find(ParametersTableRow).map(x => x);

        expect(first.prop('editing')).toBeTruthy();
        expect(first.prop('deleting')).toBeFalsy();

        expect(second.prop('deleting')).toBeTruthy();
        expect(second.prop('editing')).toBeFalsy();
    });

    it('should apply search', () => {
        const [wrapper] = init();

        wrapper.find(ParametersSearch).prop('onFilter')(['key_2', '']);

        wrapper.update();

        expect(wrapper.find(ParametersTableRow).prop('parameter').key).toBe('key_2');
    });

    it('should apply filter', () => {
        const [wrapper] = init();

        wrapper.find(ParametersSearch).prop('onFilter')(['', 'secureString']);

        wrapper.update();

        expect(wrapper.find(ParametersTableRow).prop('parameter').key).toBe('key_2');
    });

    it('should open panel for editing', () => {
        const [wrapper] = init();

        const param = {
            id: 'key_2',
            key: 'key_2',
            value: 'value_2',
            secret: true
        };

        wrapper
            .find(ParametersTableRow)
            .at(1)
            .prop('handleEdit')(param);

        wrapper.update();

        expect(wrapper.find(ParametersPanel).prop('data')).toEqual(param);
        expect(wrapper.find(ParametersPanel).prop('title')).toBe('Edit');
    });

    it('should open panel for creating', () => {
        const [wrapper] = init();

        wrapper.find(PropertySelect).prop('handleChange')({
            target: { value: 'secureString' }
        });

        wrapper.update();

        expect(wrapper.find(ParametersPanel).prop('data')).toEqual({ secret: true });
        expect(wrapper.find(ParametersPanel).prop('title')).toBe('Create');
    });

    it('should handle on remove', () => {
        const [wrapper, props] = init({}, true);

        const param = {
            id: 'key_2',
            key: 'key_2',
            value: 'value_2',
            secret: true
        };

        wrapper
            .find(ParametersTableRow)
            .at(1)
            .prop('handleRemove')(param);

        wrapper.update();

        expect(props.remove).toHaveBeenCalledWith(props.projectId, param);
    });

    it('should handle on create', () => {
        const [wrapper, props] = init({}, true);

        const param = {
            id: 'key_2',
            key: 'key_2',
            value: 'value_2',
            secret: true
        };

        wrapper.find(ParametersPanel).prop('save')(param);

        wrapper.update();

        expect(props.create).toHaveBeenCalledWith(props.projectId, param);
    });

    it('should handle on update', () => {
        const [wrapper, props] = init({}, true);

        const param = {
            id: 'key_2',
            key: 'key_2',
            value: 'value_2',
            secret: true
        };

        wrapper
            .find(ParametersTableRow)
            .at(1)
            .prop('handleEdit')(param);

        wrapper.find(ParametersPanel).prop('save')(param);

        wrapper.update();

        expect(props.update).toHaveBeenCalledWith(props.projectId, param);
    });

    it('should use effect', () => {
        const [_, props] = init({}, true, mount);

        expect(props.getParameters).toHaveBeenCalledWith(props.projectId);
    });

    it('should show loading', () => {
        const [wrapper] = init({ loading: true });

        expect(wrapper.find(PageSkeleton)).toBeDefined();
    });
});
