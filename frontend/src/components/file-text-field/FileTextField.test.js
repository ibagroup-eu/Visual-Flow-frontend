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
import { mount, shallow } from 'enzyme';
import { TextField } from '@material-ui/core';
import FileTextField from './FileTextField';
import ClearButton from '../../mxgraph/side-panel/helpers/ClearButton';

describe('FileTextField', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            name: 'testName',
            value: 'testValue',
            handleInputChange: jest.fn(),
            ableToEdit: true,
            uploadStage: true,
            setFile: jest.fn()
        };

        wrapper = shallow(<FileTextField {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render ClearButton', () => {
        wrapper = shallow(<FileTextField {...props} clearable={true} />);
        expect(wrapper.find(ClearButton)).toHaveLength(1);
    });

    it('should render TextField without value', () => {
        wrapper = mount(<FileTextField {...props} value={null} />);
        expect(wrapper.find(TextField).prop('value')).toBe('');
    });

    it('should calls onChange for "icon-button-file" input', () => {
        wrapper = mount(<FileTextField {...props} />);
        wrapper.find('#icon-button-file').prop('onChange')({
            target: { files: [{}] }
        });
    });

    it('should calls onChange for "icon-button-file" input without file', () => {
        wrapper = mount(<FileTextField {...props} />);
        wrapper.find('#icon-button-file').prop('onChange')({
            target: { files: [] }
        });
    });

    it('should calls onChange for TextField', () => {
        wrapper.find(TextField).prop('onChange')({ target: { value: 'test' } });
        expect(props.setFile).toBeCalledWith({ name: 'test' });
    });
});
