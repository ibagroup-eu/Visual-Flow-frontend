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

import { Box, ListItem, Typography } from '@material-ui/core';
import { ExpandMoreOutlined } from '@material-ui/icons';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import { DATE_FORMAT_UTC } from '../../../globalConstants';
import HistoryDaysRow from './HistoryDaysRow';

describe('HistoryDaysRow', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            isOpen: true,
            logsHandler: jest.fn(),
            dayHistory: [
                {
                    status: 'Succeeded',
                    startedAt: moment()
                        .subtract(3, 'm')
                        .format(DATE_FORMAT_UTC),
                    finishedAt: moment().format(DATE_FORMAT_UTC),
                    runBy: 'testbigbigemailwithname1-gomel-iba-by',
                    id: 'testId',
                    name: 'testName',
                    pipelineId: 'pipelineId'
                }
            ],
            projectId: 'id'
        };

        wrapper = shallow(<HistoryDaysRow {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render ListItem component', () => {
        expect(wrapper.find(ListItem)).toHaveLength(1);
    });

    it('should render ChevronRightOutlined component', () => {
        wrapper.find(Box).invoke('onClick')();
        expect(wrapper.find(ExpandMoreOutlined)).toHaveLength(1);
    });
});
