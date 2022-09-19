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

import { get } from 'lodash';

import { SET_CURRENT_PROFILE } from './types';
import { setCurrentProfile } from './profileActions';

describe('profileActions', () => {
    it('should set current profile', () => {
        expect(setCurrentProfile({ name: 'Bruce' })).toEqual({
            type: SET_CURRENT_PROFILE,
            payload: { profile: { name: 'Bruce' } }
        });

        expect(setCurrentProfile({ profile: { name: 'Bruce' } })).toEqual({
            type: SET_CURRENT_PROFILE,
            payload: { profile: { name: 'Bruce' } }
        });

        expect(
            setCurrentProfile({
                profile: { name: 'Bruce' },
                accessToken: 'accessToken'
            })
        ).toEqual({
            type: SET_CURRENT_PROFILE,
            payload: { profile: { name: 'Bruce', accessToken: 'accessToken' } }
        });
    });
});
