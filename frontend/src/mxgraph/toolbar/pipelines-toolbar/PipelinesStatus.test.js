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
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@material-ui/lab';
import Status from '../../../components/status';
import PipelinesStatus from './PipelinesStatus';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('PipelinesStatus', () => {
    const init = (props = {}) => {
        const defaultProps = {
            loading: false,
            status: 'Running'
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(<PipelinesStatus {...defaultProps} {...props} />);

        return [wrapper, { ...defaultProps, ...props }];
    };

    afterEach(() => useTranslation.mockClear());

    it('should render component', () => {
        const [wrapper] = init();

        expect(wrapper).toBeDefined();

        expect(wrapper.find(Status)).toHaveLength(1);
    });

    it('should render skeleton while loading', () => {
        const [wrapper] = init({
            loading: true
        });

        expect(wrapper.find(Skeleton)).toHaveLength(1);
    });
});
