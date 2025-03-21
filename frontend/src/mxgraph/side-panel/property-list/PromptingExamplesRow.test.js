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

import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';

import PromptingExamplesRow from './PromptingExamplesRow';
import JSONEditor from '../../../components/json-editor';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('PromptingExamplesRow', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            keyName: 'parameter1',
            keyValue: 'value1',
            index: 0,
            classes: {},
            onChange: jest.fn(),
            onMove: jest.fn(),
            onRemove: jest.fn(),
            size: 2,
            options: []
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<PromptingExamplesRow {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);

        expect(wrapper).toBeDefined();
    });

    it('should check onChange for TextField', () => {
        const [wrapper, props] = init({}, true, mount);

        const textField = wrapper.find(TextField);
        expect(textField.length).toBe(1);

        textField.at(0).prop('onChange')(
            { persist: jest.fn(), target: { value: 'value' } },
            'value'
        );
        expect(props.onChange).toHaveBeenCalled();
    });

    it('should check onChange for JSONEditor', () => {
        const [wrapper, props] = init({}, true, mount);

        const editor = wrapper.find(JSONEditor);
        expect(editor.length).toBe(1);

        editor.at(0).prop('onChange')({ target: { value: 'value' } }, 'value');
        expect(props.onChange).toHaveBeenCalled();
    });
});
