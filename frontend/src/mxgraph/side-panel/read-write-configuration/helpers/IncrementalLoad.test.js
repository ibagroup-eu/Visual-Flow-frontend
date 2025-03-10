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
import { useTranslation } from 'react-i18next';

import IncrementalLoad from './IncrementalLoad';
import { READ, WRITE } from '../../../constants';
import ParamsSwitchField from '../../../sidebar/params/fields/switch/ParamsSwitchField';
import ReadTextFields from '../../../../components/rw-text-fields';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('IncrementalLoad', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            inputValues: {
                incrementalLoad: 'false',
                operation: READ
            },
            ableToEdit: true,
            handleInputChange: jest.fn(),
            openModal: jest.fn(),
            connection: {}
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = shallow(<IncrementalLoad {...defaultProps} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
        expect(wrapper.find(ParamsSwitchField).length).toEqual(1);
        expect(wrapper.find(ParamsSwitchField).prop('value')).toBeFalsy();
    });

    it('should render Incremental Load fields', () => {
        const props = {
            ...defaultProps,
            inputValues: {
                incrementalLoad: 'true',
                operation: READ
            }
        };

        const fields = [
            {
                field: 'incrementalOffsetKey',
                required: true,
                fieldToClear: 'incrementalOffsetValue',
                reset: true
            },
            {
                disabled: true,
                field: 'incrementalOffsetValue',
                hideModal: true,
                ableToClear: true,
                showConfirmClearModal: true
            }
        ];

        wrapper = shallow(<IncrementalLoad {...props} />);

        expect(wrapper.find(ParamsSwitchField).length).toEqual(1);
        expect(
            wrapper
                .find(ParamsSwitchField)
                .at(0)
                .prop('value')
        ).toBeTruthy();

        expect(wrapper.find(ReadTextFields).length).toEqual(1);

        expect(wrapper.find(ReadTextFields).prop('fields')).toEqual(fields);
    });

    it('should not render Incremental Load for WRITE', () => {
        const props = {
            ...defaultProps,
            inputValues: {
                operation: WRITE
            }
        };

        wrapper = shallow(<IncrementalLoad {...props} />);

        expect(wrapper.find(ParamsSwitchField).length).toEqual(0);
    });

    it('should render Incremental Load for READ without IncrementalLoad fields', () => {
        const props = {
            ...defaultProps,
            inputValues: {
                operation: READ,
                incrementalLoad: undefined
            }
        };

        wrapper = shallow(<IncrementalLoad {...props} />);

        expect(wrapper.find(ParamsSwitchField).length).toEqual(1);
        expect(wrapper.find(ParamsSwitchField).prop('value')).toEqual(undefined);
        expect(wrapper.find(ReadTextFields).length).toEqual(0);
    });
});
