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

import { Button, Popover, TextField } from '@material-ui/core';
import { mount, shallow } from 'enzyme';
import React from 'react';
import ValidateModalToolbar from './ValidateModalToolbar';

describe('ValidateModalToolbar', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            validationState: [
                { column: 'test', validations: [] },
                { column: 'test2', validations: [] }
            ],
            addColumn: jest.fn(),
            cancelRename: jest.fn(),
            renameColumnIndex: null,
            editable: true
        };

        wrapper = shallow(<ValidateModalToolbar {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls useEffect', () => {
        wrapper = mount(<ValidateModalToolbar {...props} />);
    });

    it('should calls useEffect with renameColumnIndex', () => {
        wrapper = mount(<ValidateModalToolbar {...props} renameColumnIndex={0} />);
    });

    it('should calls onClick add column Button with rename', () => {
        wrapper = shallow(<ValidateModalToolbar {...props} renameColumnIndex={0} />);
        wrapper
            .find(Button)
            .at(0)
            .prop('onClick')({ currentTarget: {} });
        wrapper
            .find(Button)
            .at(1)
            .prop('onClick')();
        expect(props.addColumn).toBeCalledWith('test');
    });

    it('should calls onClick for open add column popover', () => {
        wrapper
            .find(Button)
            .at(0)
            .prop('onClick')({ currentTarget: {} });
    });

    it('should calls onChange for TextField', () => {
        wrapper.find(TextField).prop('onChange')({ target: { value: 'test' } });
    });

    it('should calls onKeyDown for TextField', () => {
        wrapper.find(TextField).prop('onChange')({ target: { value: 'test3' } });
        wrapper.find(TextField).prop('onKeyDown')({
            key: 'Enter',
            preventDefault: jest.fn()
        });
    });

    it('should calls onKeyDown for TextField with key != Enter', () => {
        wrapper.find(TextField).prop('onKeyDown')({
            key: '',
            preventDefault: jest.fn()
        });
    });

    it('should calls onClose for Popover', () => {
        wrapper.find(Popover).prop('onClose')();
        expect(props.cancelRename).toBeCalled();
    });
});
