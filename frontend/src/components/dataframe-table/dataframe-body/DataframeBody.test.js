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

import { Checkbox } from '@material-ui/core';
import { mount, shallow } from 'enzyme';
import React from 'react';
import DataframeBody from './DataframeBody';

describe('DataframeBody', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            columns: [
                { column: 'test', type: 'String' },
                { column: 'test2', type: 'String' }
            ],
            rows: [
                { rowId: '123', data: ['1', '2'] },
                { rowId: '1234', data: ['1', '2'] },
                { rowId: '12345', data: ['1', '2'] },
                { rowId: '123456', data: ['1', '2'] },
                { rowId: '1234567', data: ['1', '2'] },
                { rowId: '12345678', data: ['1', '2'] }
            ],
            page: 1,
            rowsPerPage: 5,
            scrollTop: 300,
            changeField: jest.fn(),
            isSelected: jest.fn(),
            onSelect: jest.fn(),
            isVisibled: jest.fn(),
            editable: true
        };
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
        wrapper = shallow(<DataframeBody {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render component with first page', () => {
        wrapper = shallow(<DataframeBody {...props} page={0} />);
        expect(wrapper).toBeDefined();
    });

    it('should calls onClick prop', () => {
        wrapper
            .find(Checkbox)
            .at(0)
            .prop('onClick')();
        expect(props.onSelect).toBeCalledWith('12345678');
    });

    it('should calls useEffect', () => {
        wrapper = mount(<DataframeBody {...props} />);
    });

    it('should calls useEffect with rows.length !== pageRows.length + page * rowsPerPage', () => {
        wrapper = mount(<DataframeBody {...props} page={0} />);
    });

    it('should calls useEffect with offsetTop > scrollTop', () => {
        jest.spyOn(
            window.HTMLElement.prototype,
            'offsetTop',
            'get'
        ).mockImplementation(() => 500);
        wrapper = mount(<DataframeBody {...props} />);
    });
});
