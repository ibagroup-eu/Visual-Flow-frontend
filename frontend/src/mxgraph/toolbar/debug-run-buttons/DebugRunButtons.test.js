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
import { IconButton } from '@material-ui/core';
import { BugReport, PlayArrow } from '@material-ui/icons';
import DebugRunButtons from './DebugRunButtons';

describe('DebugRunButtons', () => {
    const init = (props = {}) => {
        const defaultProps = {
            hasFailedStages: false,
            isRunnable: false,
            onDebug: jest.fn(),
            onRunAll: jest.fn()
        };

        const wrapper = shallow(<DebugRunButtons {...defaultProps} {...props} />);

        return [wrapper, { ...defaultProps, ...props }];
    };

    it('should render two IconButtons', () => {
        const [wrapper] = init();
        expect(wrapper.find(IconButton)).toHaveLength(2);
    });

    it('should disable RunAll button when isRunnable is false', () => {
        const [wrapper] = init({ isRunnable: false });
        const runAllButton = wrapper.find(IconButton).at(0);

        expect(runAllButton.prop('disabled')).toBe(true);
        expect(runAllButton.find(PlayArrow).prop('htmlColor')).toBe('lightgrey');
    });

    it('should enable RunAll button when isRunnable is true', () => {
        const [wrapper] = init({ isRunnable: true });
        const runAllButton = wrapper.find(IconButton).at(0);

        expect(runAllButton.prop('disabled')).toBe(false);
        expect(runAllButton.find(PlayArrow).prop('htmlColor')).toBe('green');
    });

    it('should disable Debug button when hasFailedStages is false', () => {
        const [wrapper] = init({ hasFailedStages: false });
        const debugButton = wrapper.find(IconButton).at(1);

        expect(debugButton.prop('disabled')).toBe(true);
        expect(debugButton.find(BugReport).prop('htmlColor')).toBe('lightgrey');
    });

    it('should enable Debug button when hasFailedStages is true', () => {
        const [wrapper] = init({ hasFailedStages: true });
        const debugButton = wrapper.find(IconButton).at(1);

        expect(debugButton.prop('disabled')).toBe(false);
        expect(debugButton.find(BugReport).prop('htmlColor')).toBe('green');
    });

    it('should call onRunAll when RunAll button is clicked', () => {
        const onRunAllMock = jest.fn();
        const [wrapper] = init({ isRunnable: true, onRunAll: onRunAllMock });
        const runAllButton = wrapper.find(IconButton).at(0);

        runAllButton.simulate('click');
        expect(onRunAllMock).toHaveBeenCalledTimes(1);
    });

    it('should call onDebug when Debug button is clicked', () => {
        const onDebugMock = jest.fn();
        const [wrapper] = init({ hasFailedStages: true, onDebug: onDebugMock });
        const debugButton = wrapper.find(IconButton).at(1);

        debugButton.simulate('click');
        expect(onDebugMock).toHaveBeenCalledTimes(1);
    });
});
