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

import { Button, Popover, Select, TextField } from '@material-ui/core';
import { mount, shallow } from 'enzyme';
import React from 'react';
import DataframeAddColumnButton from './DataframeAddColumnButton';

describe('DataframeAddColumnButton', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            columns: [
                { column: 'test', type: 'String' },
                { column: 'test2', type: 'String' }
            ],
            columnTypes: ['String'],
            addColumn: jest.fn(),
            onCancelRename: jest.fn(),
            renameFieldIndex: null,
            editable: true
        };

        wrapper = shallow(<DataframeAddColumnButton {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls useEffect', () => {
        wrapper = mount(<DataframeAddColumnButton {...props} />);
    });

    it('should calls useEffect with renameFieldIndex', () => {
        wrapper = mount(
            <DataframeAddColumnButton {...props} renameFieldIndex={0} />
        );
    });

    it('should calls onClick add column Button with rename', () => {
        wrapper = shallow(
            <DataframeAddColumnButton {...props} renameFieldIndex={0} />
        );
        wrapper
            .find(Button)
            .at(0)
            .prop('onClick')({ currentTarget: {} });
        wrapper
            .find(Button)
            .at(1)
            .prop('onClick')();
        expect(props.addColumn).toBeCalledWith('test', 'String');
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

    it('should calls onClose for Popover', () => {
        wrapper.find(Popover).prop('onClose')();
        expect(props.onCancelRename).toBeCalled();
    });

    it('should calls onChange for Select', () => {
        wrapper.find(Select).prop('onChange')({ target: { value: 'String' } });
    });

    it('should calls onOpen for Select', () => {
        wrapper.find(Select).prop('onOpen')();
    });

    it('should have secondary dark text color', () => {
        wrapper = shallow(<DataframeAddColumnButton {...props} />);
        const { className } = wrapper
            .find(Button)
            .first()
            .props();
        expect(className.lastIndexOf('makeStyles-btn')).toBe(0);
    });
});
