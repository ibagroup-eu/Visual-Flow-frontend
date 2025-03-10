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
import RunInfo, { correctInvalidCron } from './RunInfo';
import { Typography } from '@material-ui/core';

describe('CronRunInfo', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            cronValue: { value: '* * * * *', errorMessage: '' },
            isUseCron: true
        };

        const wrapper = func(<RunInfo {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();
        expect(wrapper.find(Typography).length).toBe(2);
    });

    it('should throw an error', () => {
        const [wrapper] = init({ cronValue: { value: '2-2 * * * *,2' } });
        expect(wrapper.find(Typography).length).toBe(2);
    });

    it('should correct a cron value', () => {
        expect(correctInvalidCron('2-2 * * * *,2')).toBe('2 * * * *,2');
        expect(correctInvalidCron('0-2 * * * *,2')).toBe('0-2 * * * *,2');
    });

    it('should render hint about UTC format for new cron', () => {
        const [wrapper] = init({ cronValue: { value: '', errorMessage: '' } });
        expect(
            wrapper
                .find(Typography)
                .at(0)
                .text()
        ).toBe('pipelines:cronInfo.helperText');
    });
});
