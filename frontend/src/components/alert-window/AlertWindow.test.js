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
import AlertWindow from './AlertWindow';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';

describe('AlertWindow', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            showAlert: false,
            title: 'title',
            body: 'body'
        };

        const wrapper = func(<AlertWindow {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper, props] = init({}, true);

        expect(wrapper.find(DialogTitle).text()).toBe(props.title);
        expect(wrapper.find(DialogContent).text()).toBe(props.body);
    });

    it('should "setOpen"', () => {
        const [wrapper] = init({}, false, mount);

        expect(wrapper.find(Dialog).prop('open')).toBe(false);

        wrapper.setProps({ showAlert: true });

        wrapper.update();

        expect(wrapper.find(Dialog).prop('open')).toBe(true);
    });

    it('should close a window', () => {
        const [wrapper] = init({ showAlert: true }, false, mount);

        const dialog = wrapper.find(Dialog);

        expect(dialog.prop('open')).toBe(true);

        dialog.prop('onClose')();

        wrapper.update();

        expect(wrapper.find(Dialog).prop('open')).toBe(false);
    });
});
