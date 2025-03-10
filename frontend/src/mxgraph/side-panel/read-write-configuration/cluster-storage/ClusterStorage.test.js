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
import { READ, WRITE } from '../../../constants';
import ClusterStorage from './ClusterStorage';
import FileTextField from '../../../../components/file-text-field';

describe('ClusterStorage', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            inputValues: { path: 'test/path/s', format: '' },
            stageId: 'some_id',
            handleInputChange: jest.fn(),
            ableToEdit: true
        };

        wrapper = shallow(<ClusterStorage {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls setFile', () => {
        wrapper = mount(
            <ClusterStorage
                {...props}
                inputValues={{ ...props.inputValues, operation: READ }}
            />
        );
        wrapper.find(FileTextField).invoke('setFile')({ name: 'testFile' });
        expect(props.handleInputChange).toBeCalledTimes(2);
    });

    it('should calls useEffect for format and change name path format', () => {
        wrapper = mount(
            <ClusterStorage
                {...props}
                inputValues={{ ...props.inputValues, operation: WRITE }}
            />
        );
        wrapper.find(FileTextField).invoke('setFile')({ name: 'testFile' });
        expect(props.handleInputChange).toBeCalledTimes(2);
    });

    it('should calls useEffect for format without format', () => {
        wrapper = mount(
            <ClusterStorage
                {...props}
                inputValues={{
                    ...props.inputValues,
                    format: null,
                    operation: WRITE
                }}
            />
        );
        expect(props.handleInputChange).toBeCalledTimes(1);
    });
});
