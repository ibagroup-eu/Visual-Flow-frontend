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
import { Button } from '@material-ui/core';
import ValidateModal from './ValidateModal';
import PopupForm from '../../../../components/popup-form';
import ValidateModalToolbar from './validate-modal-toolbar/ValidateModalToolbar';
import ValidateModalRow from './validate-modal-row/ValidateModalRow';

describe('ValidateModal', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            validateConfig: `[{"column":"Column1","validations":[{"type":"uniqueness","isError":"true"},
                {"type":"dataType","dataType":"string","isError":"false"},
                {"type":"inValues","isError":"false","inValues":"wwwwwwwwww,wwwwwww,wwww,wwwww"}]},
                {"column":"Column2","validations":[]}]`,
            onChange: jest.fn(),
            display: true,
            onClose: jest.fn(),
            editable: true
        };

        wrapper = shallow(<ValidateModal {...props} />);
    });

    it('should render component', () => {
        expect(wrapper.find(PopupForm)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(2);
    });

    it('should calls useEffect', () => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
        wrapper = mount(<ValidateModal {...props} />);
    });

    it('should not show save button', () => {
        wrapper = shallow(<ValidateModal {...props} editable={false} />);
        expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('should calls onClick prop for save button', () => {
        wrapper
            .find(Button)
            .at(0)
            .prop('onClick')();
        expect(props.onChange).toHaveBeenCalled();
        expect(props.onClose).toHaveBeenCalled();
    });

    it('should calls onClick prop for cancel button', () => {
        wrapper
            .find(Button)
            .at(1)
            .prop('onClick')();
        expect(props.onClose).toHaveBeenCalled();
    });

    it('should calls onClick prop for cancel button with restore state', () => {
        wrapper
            .find(ValidateModalRow)
            .at(0)
            .prop('onDeleteColumn')();
        wrapper
            .find(Button)
            .at(1)
            .prop('onClick')();
        expect(props.onClose).toHaveBeenCalled();
    });

    it('should show addValidation title', () => {
        wrapper = shallow(<ValidateModal {...props} validateConfig={[]} />);
        expect(wrapper.find(PopupForm).prop('title')).toBe(
            'jobDesigner:Validate.modal.addValidation'
        );
    });

    it('should calls addColumn prop', () => {
        wrapper.find(ValidateModalToolbar).prop('addColumn')('test');
    });

    it('should calls addColumn prop with rename', () => {
        wrapper
            .find(ValidateModalRow)
            .at(0)
            .prop('onSetRename')();
        wrapper.find(ValidateModalToolbar).prop('addColumn')('test');
    });

    it('should calls cancelRename prop', () => {
        wrapper.find(ValidateModalToolbar).prop('cancelRename')();
    });

    it('should calls onDeleteColumn prop', () => {
        wrapper
            .find(ValidateModalRow)
            .at(0)
            .prop('onDeleteColumn')();
    });

    it('should calls addValidation prop', () => {
        wrapper
            .find(ValidateModalRow)
            .at(0)
            .prop('addValidation')({}, null);
    });

    it('should calls addValidation prop with change validation', () => {
        wrapper
            .find(ValidateModalRow)
            .at(0)
            .prop('addValidation')({}, 0);
    });

    it('should calls deleteValidation prop', () => {
        wrapper
            .find(ValidateModalRow)
            .at(0)
            .prop('deleteValidation')(0);
    });
});
