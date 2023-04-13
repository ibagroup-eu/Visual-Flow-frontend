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
import ReadWriteTextFields from './ReadWriteTextFields';
import { TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('ReadWriteTextFields', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            inputValues: {},
            fields: [
                {
                    field: 'field1',
                    rows: 1
                },
                {
                    field: 'field2',
                    rows: 2
                }
            ]
        };

        const wrapper = func(<ReadWriteTextFields {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        useTranslation.mockImplementation(() => ({ t: x => x }));

        const [wrapper, props] = init({}, true, mount);

        expect(wrapper.find(TextField).length).toBe(props.fields.length);
    });
});
