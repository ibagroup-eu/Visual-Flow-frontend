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
import PopupForm from '../../../../components/popup-form';
import SQLEditor from '../../../../components/sql-editor';
import ModalConfirmButtons from '../connections-modal/confirmButtons/ModalConfirmButtons';
import SQLEditorModal from '.';

describe('SQLEditorModal', () => {
    const init = (props = {}, returnProps = false) => {
        const defaultProps = {
            display: true,
            fieldName: 'testField',
            currentValue: 'test value',
            ableToEdit: true
        };

        const wrapper = shallow(<SQLEditorModal {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should handle value change', () => {
        const newValue = 'new value';
        const [wrapper, props] = init({}, true);

        expect(wrapper.find(SQLEditor).prop('value')).toBe(props.currentValue);
        expect(wrapper.find(ModalConfirmButtons).prop('selectedValue')).toBe(
            props.currentValue
        );

        wrapper.find(SQLEditor).simulate('change', newValue);

        expect(wrapper.find(SQLEditor).prop('value')).toEqual(newValue);
        expect(wrapper.find(ModalConfirmButtons).prop('selectedValue')).toEqual(
            newValue
        );
    });

    it('should handle value confirmation', () => {
        const valueSetHandler = jest.fn();
        const [wrapper] = init({ onSetValue: valueSetHandler });

        wrapper.find(ModalConfirmButtons).simulate('setValue');
        expect(valueSetHandler).toHaveBeenCalled();
    });

    it('should close modal', () => {
        const closeHandler = jest.fn();
        const [wrapper] = init({ onClose: closeHandler });

        wrapper.find(PopupForm).simulate('close');
        expect(closeHandler).toHaveBeenCalled();
    });

    it('should close modal when clicking discard button', () => {
        const closeHandler = jest.fn();
        const [wrapper] = init({ onClose: closeHandler });

        wrapper.find(ModalConfirmButtons).simulate('close');
        expect(closeHandler).toHaveBeenCalled();
    });
});
