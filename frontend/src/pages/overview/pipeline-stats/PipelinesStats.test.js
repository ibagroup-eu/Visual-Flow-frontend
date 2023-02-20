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

import i18n from '../../../i18n';
import theme from '../../../theme';
import { I18nextProvider } from 'react-i18next';
import { MuiThemeProvider } from '@material-ui/core/styles';
import JobsPipelines from '../jobs-pipelines';
import PipelinesStats from './PipelinesStats';

const JOB_STATS = {
    Draft: 'Draft',
    Pending: 'Pending',
    Running: 'Running',
    Succeeded: 'Succeeded',
    Failed: 'Failed',
    Error: 'Error',
    Suspended: 'Suspended',
    Terminated: 'Terminated'
};

describe('PipelinesStats', () => {
    const init = (props = {}) => {
        const defaultProps = {
            data: {
                jobsStat: JOB_STATS
            },
            loading: false,
            setStatus: jest.fn(),
            setCurrentPage: jest.fn()
        };

        return shallow(
            <I18nextProvider i18n={i18n}>
                <MuiThemeProvider theme={theme}>
                    <PipelinesStats {...defaultProps} {...props} />
                </MuiThemeProvider>
            </I18nextProvider>
        )
            .dive()
            .dive()
            .dive()
            .dive();
    };

    it('should use correct props', () => {
        const pipelines = init().find(JobsPipelines);

        expect(pipelines.length).toBe(1);

        pipelines.prop('items').forEach(({ data }) => {
            expect(data).toBe(JOB_STATS[data]);
        });
    });
});
