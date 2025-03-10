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
import CodeMirror from '@uiw/react-codemirror';
import SQLEditor from '.';
import useStyles from './SQLEditor.Styles';

jest.mock('./SQLEditor.Styles', () => ({
    ...jest.requireActual('./SQLEditor.Styles'),
    __esModule: true,
    default: jest.fn()
}));

describe('SQLEditor', () => {
    const init = (props = {}) => {
        const defaultProps = {
            height: '100px',
            name: 'testField',
            value: 'test value',
            storageName: 'mysql',
            disabled: false
        };

        useStyles.mockImplementation(() => ({
            wrapper: 'wrapper',
            editable: 'editable'
        }));

        const wrapper = shallow(<SQLEditor {...defaultProps} {...props} />);

        return [wrapper, { ...defaultProps, ...props }];
    };

    it('should render without crashes with correct props', () => {
        const [wrapper, props] = init();
        const editor = wrapper.find(CodeMirror);

        expect(editor.length).toBe(1);
        expect(editor.prop('value')).toBe(props.value);
        expect(editor.prop('readOnly')).toBe(props.disabled);
    });

    it('should handle value change', () => {
        const value = 'test value';
        const changeHandler = jest.fn();
        const [wrapper] = init({ onChange: changeHandler });

        wrapper.find(CodeMirror).simulate('change', value);

        expect(changeHandler).toHaveBeenCalledWith(value);
    });

    it('should handle value change 2', () => {
        const value = 'test value';
        const changeHandler = jest.fn();
        const [wrapper] = init({
            onChange: changeHandler,
            required: true,
            storageName: 'mongoDB'
        });

        wrapper.find(CodeMirror).simulate('change', value);

        expect(changeHandler).toHaveBeenCalledWith(value);
    });
});
