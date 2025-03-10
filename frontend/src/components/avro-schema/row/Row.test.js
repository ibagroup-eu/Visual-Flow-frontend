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

import React from 'react';
import { shallow } from 'enzyme';
import { I18nextProvider } from 'react-i18next';

import { TextField } from '@material-ui/core';
import Row from './Row';
import i18n from '../../../i18n';
import Arrows from './arrows';
import Select from './select';
import Actions from './actions';
import { ParamsSwitchField } from '../../../mxgraph/sidebar/params/fields';

describe('Row', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            onMoveTop: jest.fn(),
            onMoveDown: jest.fn(),
            onChange: jest.fn(),
            onRemove: jest.fn(),
            onAdd: jest.fn(),
            duplicated: true
        };

        wrapper = shallow(
            <I18nextProvider i18n={i18n}>
                <Row {...props} />
            </I18nextProvider>
        )
            .dive()
            .dive();
    });

    it('should render without crashes', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render correct elements', () => {
        expect(wrapper.find(Arrows).length).toBe(1);
        expect(wrapper.find(TextField).length).toBe(2);
        expect(wrapper.find(ParamsSwitchField).length).toBe(1);
    });

    it('should have default value for shouldDisableDeleteBtn property', () => {
        expect(wrapper.find(Actions).prop('shouldDisableDeleteBtn')).toBe(false);
    });

    it('should not use default value for shouldDisableDeleteBtn property', () => {
        props = {
            ...props,
            shouldDisableDeleteBtn: true
        };
        wrapper = shallow(
            <I18nextProvider i18n={i18n}>
                <Row {...props} />
            </I18nextProvider>
        )
            .dive()
            .dive();

        expect(wrapper.find(Actions).prop('shouldDisableDeleteBtn')).toBe(true);
    });
});
