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
import CronPopupForm from './index';
import PopupForm from '../../popup-form';
import { PageSkeleton } from '../../skeleton';

describe('CronPopupForm', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            display: 'pipelineId',
            loading: false,
            onClose: jest.fn()
        };

        const wrapper = func(<CronPopupForm {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(PopupForm).exists()).toBeTruthy();
    });

    it('should show skeleton', () => {
        const [wrapper] = init({ loading: true });
        expect(wrapper.find(PageSkeleton).exists()).toBeTruthy();
    });
});
