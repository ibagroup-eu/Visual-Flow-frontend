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
import SingleSelectModal from './SingleSelectModal';
import PopupForm from '../../../../components/popup-form';
import { PageSkeleton } from '../../../../components/skeleton';
import { Radio, TableRow, TextField } from '@material-ui/core';
import SearchInput from '../../../../components/search-input';

describe('SingleSelectModal', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            items: [],
            loading: true,
            ableToEdit: true
        };

        const wrapper = func(<SingleSelectModal {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(PopupForm).exists()).toBeTruthy();
    });

    it('should render skeletons', () => {
        const [wrapper] = init({ loading: true });

        expect(wrapper.find(PageSkeleton).exists()).toBeTruthy();
    });

    it('should not render skeletons', () => {
        const [wrapper] = init({ loading: false });

        expect(wrapper.find(PageSkeleton).exists()).toBeFalsy();
    });

    it('should hide a radio section if a user is not able to edit', () => {
        const items = [{ pipelineId: null }];

        const [wrapper] = init({ ableToEdit: false, loading: false, items });

        expect(wrapper.find(Radio).exists()).toBeFalsy();
    });

    it('should handle change search', () => {
        const items = [
            { name: 'first', pipelineId: null },
            { name: 'second', pipelineId: null }
        ];

        const [wrapper] = init({ loading: false, items }, false, shallow);

        expect(wrapper.find(TableRow).length).toBe(items.length);

        wrapper.find(SearchInput).simulate('change', { target: { value: 'SE' } });

        wrapper.update();

        expect(wrapper.find(TableRow).length).toBe(items.length - 1);

        expect(
            wrapper
                .find(TableRow)
                .at(0)
                .find(TextField)
                .prop('value')
        ).toBe('second');
    });

    it('should mark selected values as checked', () => {
        const items = [{ id: 'job_1', pipelineId: null }];

        const [wrapper] = init({ loading: false, items });

        expect(wrapper.find(Radio).prop('checked')).toBeFalsy();

        wrapper.find(Radio).simulate('change', { target: { value: 'job_1' } });

        wrapper.update();

        expect(wrapper.find(Radio).prop('checked')).toBeTruthy();
    });

    it('should call useEffect', () => {
        const items = [{ id: 'job_1', pipelineId: null }];

        const [wrapper] = init(
            { loading: false, currentValue: 'job_1', display: true, items },
            false,
            mount
        );

        expect(wrapper.find(Radio).prop('checked')).toBeTruthy();
    });
});