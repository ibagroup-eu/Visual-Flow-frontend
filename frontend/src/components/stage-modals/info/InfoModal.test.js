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
import { mount, shallow } from 'enzyme';
import InfoModal from './InfoModal';
import { DATABRICKS, STORAGES } from '../../../mxgraph/constants';
import { Select } from '@material-ui/core';

describe('InfoModal', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            title: 'Read',
            storages: ['redis'],
            content: [
                { title: 'title', paragraph_1: 'paragraph', hide: false },
                { hide: false }
            ]
        };

        const wrapper = func(<InfoModal {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        Object.values(STORAGES).forEach(({ value }) => {
            const [wrapper] = init(
                {
                    currentStorage: value,
                    display: true,
                    [value]: [
                        { title: 'title', paragraph_1: 'paragraph', hide: false }
                    ]
                },
                false,
                mount
            );

            expect(wrapper).toBeDefined();
        });
    });

    it('should render without crashes 2', () => {
        Object.values(STORAGES).forEach(({ value }) => {
            const [wrapper] = init(
                {
                    currentStorage: value,
                    display: true,
                    [value]: [
                        { title: 'title', paragraph_1: 'paragraph', hide: ['Read'] }
                    ],
                    title: 'Write',
                    storages: ['Dataframe', 'STDOUT', 'Databricks']
                },
                false,
                mount
            );
            expect(wrapper).toBeDefined();
        });
    });

    it('should render with operations', () => {
        const [wrapper] = init(
            {
                title: 'Date/Time',
                currentStorage: 'current_date',
                display: true,
                storages: null,
                operations: {
                    current_date: {
                        title: 'title',
                        paragraph_1: 'paragraph'
                    }
                }
            },
            false,
            mount
        );
        expect(wrapper).toBeDefined();
    });

    it('should render without currentStorage', () => {
        const [wrapper] = init(
            {
                title: 'Date/Time',
                currentStorage: undefined,
                display: true
            },
            false,
            mount
        );
        wrapper.find(Select).prop('onChange')({ target: { value: 'Date/Time' } });
        expect(wrapper).toBeDefined();
    });
});
