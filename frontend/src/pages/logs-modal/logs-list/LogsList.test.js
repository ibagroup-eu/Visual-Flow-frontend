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
import { mount, shallow } from 'enzyme';

import { Grid, ListItem, Typography } from '@material-ui/core';
import LogsList from './LogsList';
import LogsHeader from '../../../components/logs-header';
import { RUNNING } from '../../../mxgraph/constants';
import { TextSkeleton } from '../../../components/skeleton';

describe('LogsList', () => {
    const defaultProps = {
        search: undefined,
        levels: [],
        modal: true,
        onRefresh: jest.fn(),
        onSearch: jest.fn(),
        onSelect: jest.fn(),
        data: [
            {
                timestamp: '2022-06-07 13:41:06,179',
                level: 'WARN',
                message:
                    'org.apache.hadoop.util.NativeCodeLoader - Unable t…rm... using builtin-java classes where applicable'
            },
            {
                timestamp: '2022-06-07 13:41:08,773',
                level: 'INFO',
                message:
                    'org.apache.spark.internal.Logging - Running Spark version 3.1.1'
            }
        ],
        loading: false,
        jobStatus: RUNNING
    };

    const init = (props = {}, func = shallow) => {
        return func(<LogsList {...defaultProps} {...props} />);
    };

    it('should render without crashes', () => {
        const wrapper = init();

        expect(wrapper).toBeDefined();
        expect(wrapper.find(LogsHeader).length).toBe(1);
    });

    it('should render error message', () => {
        const wrapper = init({ error: { message: 'errorMessage' } });

        const error = wrapper
            .find(ListItem)
            .find(Typography)
            .text();

        expect(error).toBe('errorMessage');
    });

    it('should render with useEffect for errorMes', () => {
        window.HTMLElement.prototype.scrollIntoView = function() {};
        const wrapper = init({ jobStatus: '' }, mount);
        wrapper.setProps({ error: 'message' });
        wrapper.find(LogsHeader).prop('onSetAutoRefresh')();
    });

    it('should render with useEffect', () => {
        jest.useFakeTimers();
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
        const wrapper = init({}, mount);
        wrapper.find(LogsHeader).prop('onSetAutoRefresh')();
        jest.runOnlyPendingTimers();
        expect(defaultProps.onRefresh).toBeCalled();
    });

    it('should call onSetAutoRefresh', () => {
        const wrapper = init({ jobStatus: '' }, mount);
        wrapper.find(LogsHeader).prop('onSetAutoRefresh')();
        wrapper.setProps({ data: defaultProps.data.slice(1) });
    });

    it('should call "onSearch" & "onSelect" functions', () => {
        const logsHeader = init().find(LogsHeader);

        logsHeader.prop('onSearch')({ target: { value: 'onSearchValue' } });
        logsHeader.prop('onSelect')({ target: { value: 'onSelectValue' } });

        expect(defaultProps.onSearch).toBeCalledWith('onSearchValue');
        expect(defaultProps.onSelect).toBeCalledWith('onSelectValue');
    });

    it('should render Skeleton when loading', () => {
        const wrapper = init({ modal: false, loading: true }, mount);
        expect(
            wrapper
                .find(Grid)
                .at(0)
                .prop('alignItems')
        ).toEqual('center');
        expect(wrapper.find(TextSkeleton).length).toEqual(1);
    });

    it('should render components with defined search and levels', () => {
        const wrapper = init(
            {
                levels: ['INFO', 'level2'],
                search: 'info'
            },
            mount
        );
        const text =
            '2022-06-07 13:41:08,773 - INFO - org.apache.spark.internal.Logging - Running Spark version 3.1.1';
        expect(wrapper.find(ListItem).length).toEqual(2);
        expect(wrapper.find(Typography).length).toEqual(1);
        expect(wrapper.find(Typography).text()).toEqual(text);
    });

    it('should render components with defined search (with \\n) and levels', () => {
        const wrapper = init(
            {
                levels: ['INFO', 'level2'],
                search: 'info',
                data: [
                    {
                        timestamp: '2022-06-07 13:41:06,179',
                        level: 'WARN',
                        message:
                            'org.apache.hadoop.util.NativeCodeLoader \n - Unable t…rm... using builtin-java classes where applicable'
                    },
                    {
                        timestamp: '2022-06-07 13:41:08,773',
                        level: 'INFO',
                        message:
                            'org.apache.spark.internal.Logging -\nRunning Spark version 3.1.1'
                    }
                ]
            },
            mount
        );
        const text1 =
            '2022-06-07 13:41:08,773 - INFO - org.apache.spark.internal.Logging -';
        const text2 = 'Running Spark version 3.1.1';
        expect(wrapper.find(ListItem).length).toEqual(3);
        expect(wrapper.find(Typography).length).toEqual(2);
        expect(
            wrapper
                .find(Typography)
                .at(0)
                .text()
        ).toEqual(text1);
        expect(
            wrapper
                .find(Typography)
                .at(1)
                .text()
        ).toEqual(text2);
    });
});
