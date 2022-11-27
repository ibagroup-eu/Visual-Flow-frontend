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
import { Button } from '@material-ui/core';
import PopupForm from '../popup-form';
import DataframeModal from './DataframeModal';

describe('DataframeModal', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            rowsData: '["1", "2"]',
            onChange: jest.fn(),
            display: true,
            onClose: jest.fn(),
            editable: true
        };

        wrapper = shallow(<DataframeModal {...props} />);
    });

    it('should render component', () => {
        expect(wrapper.find(PopupForm)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(2);
    });

    it('should not show save button', () => {
        wrapper = shallow(<DataframeModal {...props} editable={false} />);
        expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('should calls onClick prop for save button', () => {
        wrapper
            .find(Button)
            .at(0)
            .prop('onClick')();
        expect(props.onChange).toHaveBeenCalled();
        expect(props.onClose).toHaveBeenCalled();
    });

    it('should calls onClick prop for cancel button', () => {
        wrapper
            .find(Button)
            .at(1)
            .prop('onClick')();
        expect(props.onClose).toHaveBeenCalled();
    });
});
