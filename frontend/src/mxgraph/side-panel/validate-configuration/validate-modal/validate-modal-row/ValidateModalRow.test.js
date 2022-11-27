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

import { IconButton, Typography } from '@material-ui/core';
import { mount, shallow } from 'enzyme';
import React from 'react';
import ValidateAddValidationButton from './validate-add-validation-button/ValidateAddValidationButton';
import ValidateModalRowValidation from './validate-modal-row-validation/ValidateModalRowValidation';
import ValidateModalRow from './ValidateModalRow';

describe('ValidateModalRow', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            rowData: {
                column: 'test',
                validations: []
            },
            addValidation: jest.fn(),
            deleteValidation: jest.fn(),
            onSetRename: jest.fn(),
            onDeleteColumn: jest.fn(),
            editable: true
        };

        wrapper = shallow(<ValidateModalRow {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls useEffect', () => {
        wrapper = mount(<ValidateModalRow {...props} />);
    });

    it('should calls useEffect with validations.length > 0', () => {
        wrapper = mount(
            <ValidateModalRow
                {...props}
                rowData={{
                    ...props.rowData,
                    validations: [{ type: 'dataType', dataType: 'string' }]
                }}
            />
        );
    });

    it('should calls onClick prop for IconButton', () => {
        wrapper = shallow(
            <ValidateModalRow
                {...props}
                rowData={{
                    ...props.rowData,
                    validations: [{ type: 'dataType', dataType: 'string' }]
                }}
            />
        );
        wrapper.find(IconButton).prop('onClick')();
    });

    it('should render column with long name', () => {
        wrapper = shallow(
            <ValidateModalRow
                {...props}
                rowData={{
                    ...props.rowData,
                    column: '1234567891011121314151617192021'
                }}
            />
        );
        expect(wrapper.find(Typography).text()).toHaveLength(30);
    });

    it('should calls onResetValidationChange prop for ValidateAddValidationButton', () => {
        wrapper.find(ValidateAddValidationButton).prop('cancelChangeValidation')();
    });

    it('should calls addValidation prop for ValidateAddValidationButton', () => {
        wrapper.find(ValidateAddValidationButton).prop('addValidation')({});
        expect(props.addValidation).toBeCalledWith({}, null);
    });

    it('should calls onDeleteValidation prop for ValidateAddValidationButton', () => {
        wrapper = shallow(
            <ValidateModalRow
                {...props}
                rowData={{
                    ...props.rowData,
                    validations: [{ type: 'dataType', dataType: 'string' }]
                }}
            />
        );
        wrapper
            .find(ValidateModalRowValidation)
            .at(0)
            .prop('onDeleteValidation')();
        expect(props.deleteValidation).toBeCalledWith(0);
    });

    it('should calls onChangeValidation prop for ValidateAddValidationButton', () => {
        wrapper = shallow(
            <ValidateModalRow
                {...props}
                rowData={{
                    ...props.rowData,
                    validations: [{ type: 'dataType', dataType: 'string' }]
                }}
            />
        );
        wrapper
            .find(ValidateModalRowValidation)
            .at(0)
            .prop('onChangeValidation')();
    });
});
