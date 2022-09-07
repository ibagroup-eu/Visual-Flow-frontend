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
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import { PageSkeleton } from '../../skeleton';
import Auth from './Auth';

describe('Auth', () => {
    const redirect = 'success';
    const user = {};

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render PageSkeleton if user not loaded', () => {
        const wrapper = mount(<Auth {...{ redirect }}>Test</Auth>);
        expect(wrapper.find(PageSkeleton).exists()).toBeTruthy();
    });

    it('should render children if user loaded', async () => {
        jest.spyOn(axios, 'get').mockResolvedValue({ data: user });
        const wrapper = mount(<Auth {...{ redirect }}>Test</Auth>);
        await act(async () => wrapper);
        wrapper.update();
        expect(wrapper.text()).toEqual('Test');
        expect(wrapper.find(PageSkeleton).exists()).toBeFalsy();
    });

    it('should open login if user not authorized', async () => {
        window.BASE_URL = '/test/';
        jest.spyOn(axios, 'get').mockRejectedValue(null);
        const wrapper = mount(<Auth {...{ redirect }}>Test</Auth>);
        await act(async () => wrapper);
        wrapper.update();
        expect(window.location.assign).toHaveBeenCalledWith(
            '/test/login?redirect=success'
        );
    });

    it('should not open login if request was canceled', async () => {
        jest.spyOn(axios, 'get').mockRejectedValue(null);
        jest.spyOn(axios, 'isCancel').mockReturnValue(true);
        const wrapper = mount(<Auth {...{ redirect }}>Test</Auth>);
        await act(async () => wrapper);
        wrapper.update();
        expect(window.location.assign).not.toHaveBeenCalled();
    });
});
