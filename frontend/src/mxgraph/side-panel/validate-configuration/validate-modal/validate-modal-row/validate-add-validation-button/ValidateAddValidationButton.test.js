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

import { Button, IconButton, Popover, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { mount, shallow } from 'enzyme';
import React from 'react';
import ValidateAddValidationButton from './ValidateAddValidationButton';

describe('ValidateAddValidationButton', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            validations: [
                { type: 'dataType', dataType: 'string' },
                { type: 'notNull' }
            ],
            addValidation: jest.fn(),
            cancelChangeValidation: jest.fn(),
            changeValidationIndex: null,
            editable: true
        };

        wrapper = shallow(<ValidateAddValidationButton {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls useEffect', () => {
        wrapper = mount(<ValidateAddValidationButton {...props} />);
    });

    it('should calls useEffect with renameColumnIndex', () => {
        wrapper = mount(
            <ValidateAddValidationButton {...props} changeValidationIndex={0} />
        );
    });

    it('should calls onClick add validation Button with rename', () => {
        wrapper = shallow(
            <ValidateAddValidationButton {...props} changeValidationIndex={0} />
        );
        wrapper.find(IconButton).prop('onClick')({ currentTarget: {} });
        wrapper.find(Button).prop('onClick')();
        expect(props.addValidation).toBeCalledWith(
            { type: 'dataType', dataType: 'string' },
            0
        );
    });

    it('should calls onClick for open add validation popover', () => {
        wrapper.find(IconButton).prop('onClick')({ currentTarget: {} });
    });

    it('should calls onClick for open add validation popover with currentType = dataType', () => {
        wrapper = shallow(
            <ValidateAddValidationButton {...props} validations={[]} />
        );
        wrapper.find(IconButton).prop('onClick')({ currentTarget: {} });
    });

    it('should calls onChange for TextField with isValues', () => {
        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({ target: { value: 'inValues' } });
        wrapper.find(Autocomplete).prop('onChange')({}, ['test']);
        wrapper.find(Autocomplete).prop('renderInput')();
    });

    it('should calls renderInput for TextField with isValues', () => {
        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({ target: { value: 'inValues' } });
        wrapper.find(Autocomplete).prop('renderInput')();
    });

    it('should calls onChange for TextField with type = dataType', () => {
        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({ target: { value: 'dataType' } });
    });

    it('should calls onChange for TextField with type', () => {
        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({ target: { value: 'minValue' } });
    });

    it('should calls onKeyDown for TextField with number value', () => {
        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({ target: { value: 'minValue' } });
        wrapper
            .find(TextField)
            .at(1)
            .prop('onKeyDown')({ key: 'Backspace', preventDefault: jest.fn() });
    });

    it('should calls onKeyDown for TextField with not number value', () => {
        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({ target: { value: 'minValue' } });
        wrapper
            .find(TextField)
            .at(1)
            .prop('onKeyDown')({ key: 'w', preventDefault: jest.fn() });
    });

    it('should calls onChange for TextField with type = text', () => {
        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({ target: { value: 'regex' } });
    });

    it('should calls onClose for Popover', () => {
        wrapper.find(Popover).prop('onClose')();
        expect(props.cancelChangeValidation).toBeCalled();
    });
});
