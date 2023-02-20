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

import { Typography } from '@material-ui/core';
import { CheckCircleOutlined } from '@material-ui/icons';
import { shallow } from 'enzyme';
import React from 'react';
import ValidateModalRowValidation from './ValidateModalRowValidation';

describe('ValidateModalRowValidation', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            data: {
                type: 'dataType',
                dataType: 'string',
                isError: false
            },
            onChangeValidation: jest.fn(),
            onDeleteValidation: jest.fn(),
            editable: true
        };

        wrapper = shallow(<ValidateModalRowValidation {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render CheckCircleOutline', () => {
        wrapper = shallow(
            <ValidateModalRowValidation
                {...props}
                data={{ type: 'notNull', isError: 'false' }}
            />
        );
        expect(wrapper.find(CheckCircleOutlined)).toHaveLength(1);
    });

    it('should render Typography for data parameter', () => {
        wrapper = shallow(
            <ValidateModalRowValidation
                {...props}
                data={{
                    type: 'inValues',
                    inValues: '12345678910'
                }}
            />
        );
        expect(wrapper.find(Typography)).toHaveLength(2);
    });

    it('should render Typography for data parameter with long name', () => {
        wrapper = shallow(
            <ValidateModalRowValidation
                {...props}
                data={{
                    type: 'inValues',
                    inValues: '1234567891011121314151617192021'
                }}
            />
        );
        expect(wrapper.find(Typography)).toHaveLength(2);
        expect(
            wrapper
                .find(Typography)
                .at(1)
                .text()
        ).toHaveLength(30);
    });
});
