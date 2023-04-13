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
import { useTranslation } from 'react-i18next';
import React from 'react';

import { JobDesigner } from './JobDesigner';
import { PageSkeleton } from '../../components/skeleton';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('JobDesigner', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            project: 'project',
            jobId: 'jobId',
            loading: true,
            getJob: jest.fn(),
            createFields: jest.fn(),
            getParameters: jest.fn(),
            getConnections: jest.fn()
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<JobDesigner {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should show skeletons', () => {
        const [wrapper] = init();

        expect(wrapper.find(PageSkeleton).exists()).toBeTruthy();
    });

    it('should not show skeletons', () => {
        const [wrapper] = init({ loading: false });

        expect(wrapper.find(PageSkeleton).exists()).toBeFalsy();
    });

    it('should fetch data', () => {
        const [_, props] = init({}, true, mount);

        expect(props.getConnections).toHaveBeenCalled();
        expect(props.getParameters).toHaveBeenCalled();
        expect(props.getJob).toHaveBeenCalled();
    });

    it('should not fetch data', () => {
        const [_, props] = init({ project: undefined }, true, mount);

        expect(props.getConnections).not.toHaveBeenCalled();
        expect(props.getParameters).not.toHaveBeenCalled();
        expect(props.getJob).not.toHaveBeenCalled();
    });

    describe('isValidPositive', () => {
        it('should return correct results', () => {
            const [_, props] = init({}, true, mount);

            const validate =
                props.createFields.mock.calls[0][0]['RESOURCES_PANEL']['fields'][
                    'DRIVER_REQUEST_CORES'
                ].validate;

            expect(validate(1)).toBeNull();
            expect(validate(-1)).toBe('main:validation.positive');
        });
    });

    describe('isValidName', () => {
        it('should return correct results', () => {
            const [_, props] = init({}, true, mount);

            const validate = props.createFields.mock.calls[0][0]['NAME'].validate;

            expect(validate('  ')).toBe('main:validation.notBlank');
            expect(validate('a'.repeat(100))).toBe(
                'main:validation.incorrectJobLength'
            );
            expect(validate('#ab')).toBe('main:validation.incorrectCharacters');
            expect(validate('ab')).toBe('main:validation.incorrectJobLength');
            expect(validate('abcd')).toBeNull();
        });
    });
});
