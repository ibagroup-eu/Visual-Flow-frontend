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

import { shallow } from 'enzyme';
import React from 'react';

import { useTranslation } from 'react-i18next';

import { PropertyListModal } from './PropertyListModal';
import { Button } from '@material-ui/core';
import PropertyListRow from './PropertyListRow';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('PropertyListModal', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            open: true,
            classes: {},
            onClose: jest.fn(),
            onSave: jest.fn(),
            items: [
                ['a', '5'],
                ['b', '4']
            ]
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<PropertyListModal {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);

        expect(wrapper.find(PropertyListRow)).toHaveLength(2);
    });

    it('should calls onClick prop for save button', () => {
        const [wrapper, props] = init({}, true);
        wrapper
            .find(Button)
            .at(1)
            .prop('onClick')();
        expect(props.onSave).toHaveBeenCalled();
    });

    it('should handle remove', () => {
        const [wrapper] = init({}, true);
        wrapper
            .find(PropertyListRow)
            .at(0)
            .prop('onRemove')(0)();

        expect(wrapper.find(PropertyListRow)).toHaveLength(1);
    });

    it('should handle move', () => {
        const [wrapper] = init({}, true);
        wrapper
            .find(PropertyListRow)
            .at(0)
            .prop('onMove')(0)();

        expect(
            wrapper
                .find(PropertyListRow)
                .at(0)
                .prop('keyName')
        ).toBe('b');
    });

    it('should handle change', () => {
        const [wrapper] = init({}, true);
        wrapper
            .find(PropertyListRow)
            .at(0)
            .prop('onChange')(0, ['c', 'b']);

        expect(
            wrapper
                .find(PropertyListRow)
                .at(0)
                .prop('keyName')
        ).toBe('c');
    });

    it('should handle add item', () => {
        const [wrapper] = init({}, true);
        wrapper
            .find(Button)
            .at(0)
            .prop('onClick')();

        expect(wrapper.find(PropertyListRow)).toHaveLength(3);
    });

    it('should disable Save button if validation errors', () => {
        const [wrapper] = init({}, true);
        wrapper
            .find(PropertyListRow)
            .at(0)
            .prop('onChange')(0, ['c', '']);

        expect(
            wrapper
                .find(Button)
                .at(1)
                .prop('disabled')
        ).toBe(true);
    });
});
