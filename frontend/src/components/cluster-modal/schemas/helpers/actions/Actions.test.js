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

import React from 'react';
import { shallow } from 'enzyme';
import Actions from './Actions';

describe('Actions', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            onAdd: jest.fn(),
            onRemove: jest.fn()
        };

        wrapper = shallow(<Actions {...props} />);
    });

    it('should render without crashes', () => {
        expect(wrapper).toBeDefined();
    });

    it('should call onAdd action', () => {
        wrapper.find('[aria-label="add"]').simulate('click');
        expect(props.onAdd).toHaveBeenCalled();
    });

    it('should call onRemove action', () => {
        wrapper.find('[aria-label="delete"]').simulate('click');
        expect(props.onRemove).toHaveBeenCalled();
    });

    it('should enable delete action', () => {
        props = {
            ...props,
            shouldDisableDeleteBtn: false
        };

        wrapper = shallow(<Actions {...props} />);
        const deleteAction = wrapper.find('[aria-label="delete"]');
        expect(deleteAction.prop('disabled')).toBe(false);
    });

    it('should disable delete action', () => {
        props = {
            ...props,
            shouldDisableDeleteBtn: true
        };

        wrapper = shallow(<Actions {...props} />);
        const deleteAction = wrapper.find('[aria-label="delete"]');
        expect(deleteAction.prop('disabled')).toBe(true);
    });
});
