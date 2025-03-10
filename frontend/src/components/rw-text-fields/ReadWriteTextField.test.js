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
import { IconButton, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { Visibility } from '@material-ui/icons';

import ReadWriteTextField from './ReadWriteTextField';
import ConfirmationDialog from '../../mxgraph/side-panel/helpers/ConfirmationDialog';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('ReadWriteTextField', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            inputValues: {
                'option.dbtable': '#blabla'
            },
            rows: 1,
            field: 'option.dbtable',
            nameWIthPoint: true,
            hidden: true,
            openModal: jest.fn(),
            handleInputChange: jest.fn()
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<ReadWriteTextField {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper, props] = init({}, true, mount);

        expect(wrapper.find(TextField).length).toBe(1);
        expect(wrapper.find(TextField).prop('type')).toBe('password');

        expect(wrapper.find(IconButton).length).toBe(3);

        wrapper
            .find(IconButton)
            .at(0)
            .prop('onClick')();
        expect(wrapper.find(Visibility).length).toBe(0);

        wrapper
            .find(IconButton)
            .at(1)
            .prop('onClick')();
        expect(props.openModal).toHaveBeenCalled();
    });

    it('should render text field', () => {
        const [wrapper] = init(
            {
                inputValues: {
                    option: 'bla'
                },
                hidden: false
            },
            true,
            mount
        );

        expect(wrapper.find(TextField).length).toBe(1);
        expect(wrapper.find(TextField).prop('type')).toBe('text');
        expect(wrapper.find(TextField).prop('disabled')).toBeTruthy();
        expect(wrapper.find(TextField).prop('value')).toBe('');
    });

    it('should render text field', () => {
        const [wrapper] = init(
            {
                ableToEdit: true,
                inputValues: {
                    'option.dbtable': '#blabla#'
                },
                rows: 3,
                field: 'Option.dbtable',
                hidden: false,
                connection: {
                    option: {
                        smth: 'dbtable'
                    }
                },
                nameWIthPoint: false
            },
            true,
            mount
        );

        expect(wrapper.find(TextField).length).toBe(1);
        expect(wrapper.find(TextField).prop('type')).toBe('text');
        expect(wrapper.find(TextField).prop('disabled')).toBeFalsy();
    });

    it('should render ConfirmationDialog', () => {
        const [wrapper, props] = init(
            {
                reset: true,
                fieldToClear: 'fieldToClear',
                inputValues: {
                    field: 'vlaue',
                    fieldToClear: 'fieldToClear'
                },
                field: 'filed'
            },
            true,
            mount
        );

        expect(wrapper.find(TextField).length).toBe(1);

        wrapper.find(TextField).prop('onFocus')({ target: { value: 'smth' } });
        wrapper.find(TextField).prop('onBlur')({ target: { value: 'someting' } });

        wrapper
            .find(ConfirmationDialog)
            .at(0)
            .prop('onClose')();

        expect(props.handleInputChange).toHaveBeenCalled();
    });

    it('should clear field after confirm in ConfirmationDialog', () => {
        const [wrapper, props] = init(
            {
                reset: true,
                fieldToClear: 'fieldToClear',
                inputValues: {
                    field: 'vlaue',
                    fieldToClear: 'fieldToClear'
                },
                field: 'filed'
            },
            true,
            mount
        );

        expect(wrapper.find(TextField).length).toBe(1);

        wrapper.find(TextField).prop('onFocus')({ target: { value: 'smth' } });
        wrapper.find(TextField).prop('onBlur')({ target: { value: 'someting' } });

        wrapper
            .find(ConfirmationDialog)
            .at(0)
            .prop('onConfirm')();

        expect(props.handleInputChange).toHaveBeenCalledWith({
            target: { name: 'fieldToClear', value: '' }
        });
    });
});
