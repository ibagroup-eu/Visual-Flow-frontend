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
import { ConfirmationWindow } from './ConfirmationWindow';
import { useTranslation } from 'react-i18next';
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@material-ui/core';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('ConfirmationWindow', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            modals: {},
            toggle: jest.fn(),
            id: 'id'
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<ConfirmationWindow {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    afterEach(() => useTranslation.mockClear());

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper).toBeDefined();
        expect(wrapper.find(DialogTitle).text()).toBe('main:confirm.title');
        expect(wrapper.find(DialogContent).text()).toBe('main:confirm.body');

        const [cancel, ok] = wrapper
            .find(DialogActions)
            .find(Button)
            .map(x => x);

        expect(cancel.text()).toBe('main:confirm.No');
        expect(ok.text()).toBe('main:confirm.Yes');
    });

    it('should handle submit"', () => {
        const callback = jest.fn();

        const [wrapper, props] = init({ modals: { id: { callback } } }, true);

        const [_, ok] = wrapper
            .find(DialogActions)
            .find(Button)
            .map(x => x);

        ok.simulate('click');

        expect(callback).toHaveBeenCalled();
        expect(props.toggle).toHaveBeenCalledWith({ id: props.id });
    });
});
