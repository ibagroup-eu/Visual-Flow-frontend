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

import { mapStateToProps, ParamsEmailsField } from './ParamsEmailsField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { noop } from 'lodash';

describe('ParamsEmailsField', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            name: 'name',
            value: undefined,
            onChange: jest.fn(),
            currentUserEmail: 'Bruce@gmail.com',
            ableToEdit: true
        };

        const wrapper = func(<ParamsEmailsField {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(Autocomplete).exists()).toBeTruthy();
        expect(wrapper.find(Autocomplete).prop('disabled')).toBe(false);
    });

    it('should handle change', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(Autocomplete).prop('onChange')(null, ['joker@gmail.com']);

        expect(props.onChange).toHaveBeenCalledWith({
            target: { name: props.name, value: ['joker@gmail.com'] },
            persist: noop
        });
    });

    it('should support only view mode', () => {
        const [wrapper] = init({ ableToEdit: false });

        expect(wrapper.find(Autocomplete).prop('disabled')).toBe(true);
    });

    it('should set default email', () => {
        const [wrapper, props] = init({}, true);

        expect(wrapper.find(Autocomplete).prop('value')).toEqual([
            props.currentUserEmail
        ]);
    });

    it('should trigger value update', () => {
        const [_, props] = init({ value: [] }, true, mount);

        expect(props.onChange).toHaveBeenCalledWith({
            target: { name: props.name, value: ['Bruce@gmail.com'] },
            persist: noop
        });
    });

    it('should not trigger value update', () => {
        const [_, props] = init({ value: ['joker@gmail.com'] }, true, mount);

        expect(props.onChange).not.toHaveBeenCalled();
    });

    it('should render tags', () => {
        const [wrapper] = init();

        const emails = ['Bruce@gmail.com', 'joker@gmail.com'];

        const chips = wrapper.find(Autocomplete).prop('renderTags')(
            emails,
            jest.fn()
        );

        expect(chips.length).toBe(emails.length);
    });

    it('should render empty tags', () => {
        const [wrapper] = init();

        const emails = undefined;

        const chips = wrapper.find(Autocomplete).prop('renderTags')(
            emails,
            jest.fn()
        );

        expect(chips).toBeUndefined();
    });

    it('should render input', () => {
        const [wrapper] = init();

        const input = wrapper.find(Autocomplete).prop('renderInput')({
            param: 'param'
        });

        expect(shallow(input).prop('param')).toBe('param');
    });

    it('should set empty emails list', () => {
        const [wrapper] = init({ currentUserEmail: undefined });

        expect(wrapper.find(Autocomplete).prop('value')).toEqual([]);
    });

    it('should set default user emails', () => {
        const [wrapper] = init({ userEmails: undefined });

        expect(wrapper.find(Autocomplete).prop('options')).toEqual([]);
    });

    it('should return an appropriate state', () => {
        const state = {
            user: {
                profile: {
                    data: {
                        emails: [{ value: 'joker@gmail.ru' }]
                    }
                },
                users: {
                    loading: true,
                    data: [{ email: 'joker@gmail.ru' }, { email: 'bruce@gmail.ru' }]
                }
            }
        };

        expect(mapStateToProps(state)).toEqual({
            currentUserEmail: 'joker@gmail.ru',
            userEmails: ['joker@gmail.ru', 'bruce@gmail.ru'],
            loading: true
        });
    });
});
