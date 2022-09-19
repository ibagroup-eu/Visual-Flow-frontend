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

import withPagination from './withPagination';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => ({})),
    useDispatch: jest.fn()
}));

describe('withPagination', () => {
    const FakeComponent = ({ children }) => children;

    it('should return a component with appropriate props', () => {
        const Component = withPagination(FakeComponent);

        expect(shallow(<Component>Hi!</Component>).prop('children')).toBe('Hi!');
    });

    it('should replace history state', () => {
        const dispatch = jest.fn();

        global.history.replaceState = jest.fn();
        global.location.search = '?page=0&rows=5&orderBy=name&order=asc';

        useSelector.mockImplementation(() => ({ isInitial: false }));
        useDispatch.mockImplementation(() => dispatch);

        const Component = withPagination(FakeComponent);

        mount(<Component children={'Hi!'} />);

        expect(global.history.replaceState).toHaveBeenCalled();
        expect(dispatch.mock.calls.length).toBe(3);
    });

    it('should not replace history state', () => {
        const dispatch = jest.fn();

        global.history.replaceState = jest.fn();
        global.location.search = '';

        useSelector.mockImplementation(() => ({ isInitial: true }));
        useDispatch.mockImplementation(() => dispatch);

        const Component = withPagination(FakeComponent);

        mount(<Component children={'Hi!'} />);

        expect(global.history.replaceState).not.toHaveBeenCalled();
        expect(dispatch.mock.calls.length).toBe(0);
    });
});
