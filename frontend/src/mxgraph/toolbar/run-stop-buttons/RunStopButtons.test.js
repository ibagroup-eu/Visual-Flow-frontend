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
import { IconButton, Tooltip } from '@material-ui/core';
import { PlayArrow, Stop } from '@material-ui/icons';
import RunStopButtons from './RunStopButtons';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('RunStopButtons', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            isNotRunning: true,
            runnable: true,
            run: jest.fn(),
            stopable: true,
            stop: jest.fn(),
            changesNotSaved: false
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = shallow(<RunStopButtons {...defaultProps} />);
    });

    it('should render without crashes', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render Tooltip', () => {
        expect(wrapper.find(Tooltip)).toBeDefined();
    });

    it('should render IconButton', () => {
        expect(wrapper.find(IconButton)).toBeDefined();
    });

    it('should render PlayArrow', () => {
        expect(wrapper.find(PlayArrow)).toBeDefined();
    });

    it('should render Stop', () => {
        expect(wrapper.find(Stop)).toBeDefined();
    });

    it('should render IconButton', () => {
        const props = {
            ...defaultProps,
            changesNotSaved: true,
            stopable: false,
            isNotRunning: false
        };

        wrapper = shallow(<RunStopButtons {...props} />);

        expect(wrapper.find(IconButton).length).toBe(1);
        expect(wrapper.find(IconButton).prop('disabled')).toBeTruthy();
    });
});
