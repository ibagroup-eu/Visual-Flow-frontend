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
import { PauseTwoTone, PlayArrow, Stop } from '@material-ui/icons';
import ControlButtons from './ControlButtons';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('ControlButtons', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            status: 'Running',
            runnable: true,
            run: jest.fn(),
            stoppable: true,
            stop: jest.fn(),
            suspend: jest.fn(),
            resume: jest.fn(),
            changesNotSaved: false
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = shallow(<ControlButtons {...props} />);
    });

    it('should render without crashes', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render Stop and Suspend buttons', () => {
        expect(wrapper.find(Stop)).toBeDefined();
        expect(wrapper.find(PauseTwoTone)).toBeDefined();
    });

    it('should render Resume button', () => {
        wrapper.setProps({
            status: 'Suspended'
        });
        expect(wrapper.find(PlayArrow)).toBeDefined();
    });

    it('should render Play button', () => {
        wrapper.setProps({
            status: 'Draft'
        });
        expect(wrapper.find(PlayArrow)).toBeDefined();
    });
});
