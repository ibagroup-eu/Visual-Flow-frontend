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
import ParametersModal from './ParametersModal';
import { PageSkeleton } from '../../../../components/skeleton';
import SearchInput from '../../../../components/search-input';

describe('ParametersModal', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            ableToEdit: true,
            display: true,
            onClose: jest.fn(),
            onSetValue: jest.fn(),
            loading: false,
            parameters: { params: [{ key: 'test', secret: true }] },
            currentValue: ''
        };

        wrapper = shallow(<ParametersModal {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render PageSkeleton', () => {
        wrapper = shallow(<ParametersModal {...props} loading />);
        expect(wrapper.find(PageSkeleton)).toHaveLength(1);
    });

    it('should calls useEffect', () => {
        wrapper = mount(<ParametersModal {...props} currentValue="#test1#" />);
    });

    it('should calls useEffect without parameters and currentValue', () => {
        const changedProps = {
            parameters: null,
            currentValue: null
        };
        wrapper = mount(<ParametersModal {...props} {...changedProps} />);
    });

    it('should calls onChange prop for SearchInput', () => {
        wrapper.find(SearchInput).prop('onChange')({ target: { value: 'test' } });
    });
});
