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
import Notifications from './Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}));

jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    useSnackbar: jest.fn()
}));

describe('Notifications', () => {
    afterEach(() => jest.clearAllMocks());

    const init = (
        props = {},
        returnProps = false,
        notifications = [],
        func = mount
    ) => {
        const defaultProps = {};

        const dispatch = jest.fn();
        const enqueueSnackbar = jest.fn();
        const closeSnackbar = jest.fn();

        useDispatch.mockImplementation(() => dispatch);
        useSnackbar.mockImplementation(() => ({ enqueueSnackbar, closeSnackbar }));
        useSelector.mockImplementation(_ => notifications);

        const wrapper = func(<Notifications {...defaultProps} {...props} />);

        return returnProps
            ? [
                  wrapper,
                  {
                      ...defaultProps,
                      ...props,
                      enqueueSnackbar,
                      closeSnackbar,
                      dispatch
                  }
              ]
            : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper).toBeDefined();
    });

    it('should render notifications', () => {
        const notifications = [{ key: 'key_1', message: 'message_1' }];

        const [_, props] = init({}, true, notifications);

        expect(props.enqueueSnackbar).toHaveBeenCalled();
    });

    it('should dismiss notifications', () => {
        const notifications = [
            { key: 'key_2', message: 'message_2', dismissed: true }
        ];

        const [_, props] = init({}, true, notifications);

        expect(props.closeSnackbar).toHaveBeenCalledWith('key_2');
    });

    it('should handle "onClose"', () => {
        const notifications = [
            { key: 'key_3', message: 'message_3', options: { onClose: jest.fn() } }
        ];

        const [_, props] = init({}, true, notifications);

        const { onClose } = props.enqueueSnackbar.mock.calls[0][1];

        onClose();

        expect(notifications[0].options.onClose).toHaveBeenCalled();
    });

    it('should handle "onExited"', () => {
        const notifications = [{ key: 'key_4', message: 'message_4' }];

        const [_, props] = init({}, true, notifications);

        const { onExited } = props.enqueueSnackbar.mock.calls[0][1];

        onExited();

        expect(props.dispatch).toHaveBeenCalled();
    });
});
