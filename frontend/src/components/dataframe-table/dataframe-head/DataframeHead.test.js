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
import DataframeHead from './DataframeHead';

describe('DataframeHead', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            columns: [
                { column: 'test', type: 'String' },
                { column: 'test2', type: 'String' }
            ],
            handleSelectAllClick: jest.fn(),
            rowsLength: 6,
            selectedLength: 2,
            order: 'asc',
            orderBy: -1,
            onSetRename: jest.fn(),
            onDeleteColumn: jest.fn(),
            handleRequestSort: jest.fn(),
            isVisibled: jest.fn(),
            setInvisibled: jest.fn(),
            editable: true
        };

        wrapper = shallow(<DataframeHead {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls useEffect', () => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
        wrapper = mount(<DataframeHead {...props} />);
    });
});
