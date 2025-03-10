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
import CronInput from './CronInput';
import { TextField, Typography } from '@material-ui/core';

describe('CronInput', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            cronValue: {},
            isUseCron: true,
            setCronValue: jest.fn()
        };

        const wrapper = func(<CronInput {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper).toBeDefined();
        expect(wrapper.find(Typography).length).toBe(6);
    });

    it('should handle "cronChange" with correct value', () => {
        const [wrapper, props] = init({}, true);

        const target = { value: '0 * * * *' };

        wrapper.find(TextField).prop('onChange')({ target });

        wrapper.update();

        expect(props.setCronValue).toHaveBeenCalled();
    });

    it('should handle "cronChange" with incorrect value', () => {
        const [wrapper, props] = init({}, true);

        const target = { value: '*' };

        wrapper.find(TextField).prop('onChange')({ target });

        wrapper.update();

        expect(props.setCronValue).toHaveBeenCalled();
    });

    it('should handle additionalCheckParams', () => {
        const [wrapper, props] = init({ isUseCron: false }, true);

        const target = { value: '01 0 0 0 .' };

        wrapper.find(TextField).prop('onChange')({ target });

        wrapper.update();

        expect(props.setCronValue).toHaveBeenCalled();
    });

    it('should handle additionalCheckParams', () => {
        const [wrapper, props] = init({}, true);

        const target = { value: '     ' };

        wrapper.find(TextField).prop('onChange')({ target });

        wrapper.update();

        expect(props.setCronValue).toHaveBeenCalled();
    });
});
