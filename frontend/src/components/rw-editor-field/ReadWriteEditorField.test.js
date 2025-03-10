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
import { IconButton } from '@material-ui/core';
import ReadWriteEditorField from '.';
import SQLEditor from '../sql-editor';

describe('ReadWriteEditorField', () => {
    const init = (props = {}) => {
        const defaultProps = {
            inputValues: { testField: 'test' },
            name: 'testField',
            connection: {},
            ableToEdit: true,
            storageName: 'mysql'
        };

        const wrapper = shallow(
            <ReadWriteEditorField {...defaultProps} {...props} />
        );

        return [wrapper, { ...defaultProps, ...props }];
    };

    it('should render without crashes with correct props', () => {
        const [wrapper, props] = init();
        const editor = wrapper.find(SQLEditor);

        expect(editor.length).toBe(1);
        expect(editor.prop('value')).toBe(props.inputValues[props.name]);
        expect(editor.prop('disabled')).toBe(false);
    });

    it('should handle value change', () => {
        const value = 'test value';
        const changeHandler = jest.fn();
        const [wrapper, props] = init({ onChange: changeHandler });

        wrapper.find(SQLEditor).simulate('change', value);

        expect(changeHandler).toHaveBeenCalledWith({
            target: { name: props.name, value }
        });
    });

    it('should handle button click', () => {
        const openModalHandler = jest.fn();
        const [wrapper, props] = init({
            openModal: openModalHandler,
            inputValues: { testField: 'test' },
            name: 'field'
        });

        wrapper.find(IconButton).simulate('click');

        expect(openModalHandler).toHaveBeenCalledWith(props.name);
        expect(wrapper.find(SQLEditor).prop('value')).toBe('');
    });
});
