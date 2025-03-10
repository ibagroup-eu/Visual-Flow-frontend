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
import { shallow, mount } from 'enzyme';
import history from '../utils/history';
import Routes from './Routes';
import { Router } from 'react-router';
import { set } from 'lodash';
import redux from 'react-redux';
import * as settingsActions from '../redux/actions/settingsActions';

describe('Main routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without error', () => {
        const wrapper = shallow(<Routes />);
        expect(wrapper).toBeDefined();
    });

    it.each([
        { route: 'Overview', path: '/vf-dev-backend/overview' },
        {
            route: 'Logs',
            path: '/jobs/b6a095a3-86b9-40e4-a891-31e08588bf25/logs/vf-dev-backend/'
        },
        {
            route: 'JobDesigner',
            path: '/jobs/vf-dev-backend/b6a095a3-86b9-40e4-a891-31e08588bf25'
        }
    ])('should process "$route" route', ({ path }) => {
        set(history, 'location.pathname', path);
        const dispatch = jest.fn();
        const func = jest.fn();

        jest.spyOn(redux, 'useDispatch').mockReturnValue(dispatch);
        jest.spyOn(settingsActions, 'getProject').mockReturnValue(func);

        mount(
            <Router history={{ location: {}, listen: jest.fn() }}>
                <Routes />
            </Router>
        );
        expect(dispatch).toHaveBeenCalledWith(func);
    });
});
