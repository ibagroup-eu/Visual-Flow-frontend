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

import { TextField } from '@material-ui/core';
import { shallow } from 'enzyme';
import React from 'react';
import DataframeRowCell from './DataframeRowCell';

describe('DataframeRowCell', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            rowFieldValue: 'test',
            onChange: jest.fn(),
            isVisibled: true,
            editable: true
        };

        wrapper = shallow(<DataframeRowCell {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render component with not isVisibled', () => {
        wrapper = shallow(<DataframeRowCell {...props} isVisibled={false} />);
    });

    it('should calls onChange prop', () => {
        wrapper.find(TextField).prop('onChange')({
            target: { value: 'test1' }
        });
        expect(props.onChange).toBeCalledWith('test1');
    });
});
