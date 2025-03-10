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
import { shallow } from 'enzyme';

import { TextField } from '@material-ui/core';

import Authentication from './Authentication';
import PasswordInput from '../../password-input';

describe('Authentication', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            card: {
                authentication: {
                    token: 'token',
                    clientId: 'clientId',
                    secret: 'secret',
                    authenticationType: 'OAUTH'
                },
                editable: true
            },
            handleChangeLimits: jest.fn(),
            setCardState: jest
                .fn()
                .mockImplementation(callback => callback(defaultProps.card)),
            setDirty: jest.fn()
        };

        const wrapper = func(<Authentication {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper, props] = init({}, true);
        expect(wrapper.find(TextField).exists()).toBeTruthy();

        const event = { target: { value: 'value', id: 'authenticationType' } };
        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')(event);
        expect(props.setCardState).toHaveBeenCalled();
    });

    it('should render components for PAT', () => {
        const [wrapper] = init(
            {
                card: {
                    authentication: {
                        token: 't',
                        clientId: 'clientId',
                        secret: 'secret',
                        authenticationType: 'PAT'
                    },
                    editable: true
                },
                project: {}
            },
            true
        );

        expect(wrapper.find(PasswordInput).exists()).toBeTruthy();
        expect(wrapper.find(PasswordInput).prop('helperText')).toEqual(
            'main:validation.3to40chars'
        );
        expect(wrapper.find(PasswordInput).prop('disabled')).toBeTruthy();
    });

    it('should render without crashes', () => {
        const [wrapper] = init({ project: {} });
        expect(wrapper.find(TextField).exists()).toBeTruthy();
    });
});
