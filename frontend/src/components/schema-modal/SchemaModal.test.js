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
import { shallow, mount } from 'enzyme';
import SchemaModal from './SchemaModal';
import PopupForm from '../popup-form';
import { Button } from '@material-ui/core';

jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: str => str
        };
    }
}));

jest.mock('@material-ui/core/styles', () => ({
    ...jest.requireActual('@material-ui/core/styles'),
    makeStyles: jest.fn().mockReturnValue(jest.fn().mockReturnValue({ classes: {} }))
}));

describe('SchemaModal', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            onChange: jest.fn(),
            display: true,
            onClose: jest.fn(),
            editable: true
        };

        const wrapper = func(<SchemaModal {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(PopupForm).exists()).toBeTruthy();
        expect(wrapper.find(Button).length).toBe(2);
    });

    it('should not show the "save" button', () => {
        const [wrapper] = init({ editable: false });

        expect(wrapper.find(Button).length).toBe(1);
    });

    it('should handle "onClose"', () => {
        const [wrapper, props] = init({}, true);

        const [_, closeBtn] = wrapper.find(Button).map(x => x);

        closeBtn.simulate('click');

        expect(props.onClose).toHaveBeenCalled();
    });

    it('should handle "onSave"', () => {
        const addProps = {
            values:
                '{"type":"record","name":"schema_71a540f380eb44959ba6295601c1256d","fields":[{"name":"int","type":["null","int"]}]}'
        };
        const [wrapper, props] = init(addProps, true, mount);

        const [saveBtn, _] = wrapper.find(Button).map(x => x);

        saveBtn.simulate('click');

        expect(props.onChange).toHaveBeenCalled();
        expect(props.onClose).toHaveBeenCalled();
    });
});
