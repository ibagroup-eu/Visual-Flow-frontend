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

import { IconButton } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import { TimelineConnector, TimelineItem } from '@material-ui/lab';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import { DATE_FORMAT_UTC } from '../../../globalConstants';
import HistoryRow from './HistoryRow';

describe('HistoryRow', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            latest: true,
            logsHandler: jest.fn(),
            data: {
                status: 'Succeeded',
                startedAt: moment()
                    .subtract({ minutes: 3, seconds: 9 })
                    .format(DATE_FORMAT_UTC),
                finishedAt: moment().format(DATE_FORMAT_UTC),
                startedBy: 'testbigbigemailwithname1-gomel-iba-by',
                id: 'testId',
                statuses: [
                    {
                        status: 'Succeeded',
                        startedAt: moment()
                            .subtract(2, 'm')
                            .format(DATE_FORMAT_UTC),
                        finishedAt: moment().format(DATE_FORMAT_UTC),
                        id: '6ca1c341-88eb-4ebc-b5a6-90ed3493f09a'
                    },
                    {
                        status: 'Failed',
                        startedAt: moment()
                            .subtract(70, 'm')
                            .format(DATE_FORMAT_UTC),
                        finishedAt: moment().format(DATE_FORMAT_UTC),
                        id: '6ca1c341-88eb-4ebc-b5a6-90ed3493f09a2'
                    }
                ],
                name: 'testName',
                flag: 'pipeline'
            },
            projectId: 'id',
            type: 'pipeline'
        };

        wrapper = shallow(<HistoryRow {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render TimelineItem component', () => {
        expect(wrapper.find(TimelineItem)).toHaveLength(1);
    });

    it('should calls onClick prop for pipeline button', () => {
        wrapper = shallow(<HistoryRow {...props} type="job" />);
        wrapper
            .find(IconButton)
            .at(0)
            .invoke('onClick')();
    });

    it('should calls onClick prop for logs button', () => {
        wrapper = shallow(<HistoryRow {...props} type="job" />);
        wrapper
            .find(IconButton)
            .at(1)
            .invoke('onClick')();
    });

    it('should calls onClick prop for more button', () => {
        wrapper = shallow(<HistoryRow {...props} />);
        wrapper.find(IconButton).invoke('onClick')();
    });

    it('should render TimelineConnector component', () => {
        const changedProps = {
            latest: false
        };
        wrapper = shallow(<HistoryRow {...props} {...changedProps} />);
        expect(wrapper.find(TimelineConnector)).toHaveLength(1);
    });

    it('should render CloseOutlined if undefined data status', () => {
        wrapper = shallow(<HistoryRow {...props} data={{}} />);
        expect(wrapper.find(CloseOutlined)).toHaveLength(1);
    });
});
