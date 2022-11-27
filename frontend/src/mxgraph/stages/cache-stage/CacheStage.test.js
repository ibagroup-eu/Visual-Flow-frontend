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
import { Typography } from '@material-ui/core';
import { ConfiguredStageWithIcon } from '../../sidebar/stage-icon';
import CacheStage from './CacheStage';
import { Parameter } from '../parameters';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('CacheStage', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            stage: {
                deserialized: true,
                name: 'Pavel',
                operation: 'CACHE',
                replication: 1,
                useDisk: true,
                useMemory: true,
                useOffHeap: false
            }
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = shallow(<CacheStage {...props} />);
    });

    it('should render without crashes', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render Typography', () => {
        expect(wrapper.find(Typography)).toBeDefined();
    });

    it('should render ConfiguredStageWithIcon', () => {
        expect(wrapper.find(ConfiguredStageWithIcon)).toHaveLength(1);
    });

    it('should render Parameter 2 times', () => {
        expect(wrapper.find(Parameter)).toHaveLength(2);
    });
});
