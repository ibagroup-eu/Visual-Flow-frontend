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

import { mount, shallow } from 'enzyme';
import React from 'react';

import { TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PropertyListWrapper } from './PropertyListWrapper';
import { PairsList } from './PairsList';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('PairsList', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            ableToEdit: true,
            classes: {},
            onChange: jest.fn(),
            onAddItem: jest.fn(),
            items: [['a', 5], []]
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<PairsList {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);

        expect(wrapper.find(PropertyListWrapper)).toBeTruthy();
    });

    it('should handle item change via text field', () => {
        const [wrapper, props] = init({}, true, mount);

        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({ target: { value: 'value' } });

        expect(props.onChange).toHaveBeenCalled();
    });

    it('should render Column and Value textFields', () => {
        const [wrapper] = init({}, true, mount);

        expect(wrapper.find(TextField)).toHaveLength(4);
    });
});
