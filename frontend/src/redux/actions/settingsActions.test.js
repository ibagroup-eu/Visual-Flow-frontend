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

import { updateProject, getProject } from './settingsActions';
import api from '../../api/projects';
import {
    GET_PROJECT_START,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_FAIL,
    UPDATE_PROJECT_START,
    UPDATE_PROJECT_FAIL,
    UPDATE_PROJECT_SUCCESS
} from './types';

describe('Project action', () => {
    let data;
    let dispatch;

    describe('getProject', () => {
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'getProjectById').mockResolvedValue({ data });
        });

        it('should dispatch GET_PROJECT_START', () => {
            getProject()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: GET_PROJECT_START });
        });

        it('should dispatch GET_PROJECT_SUCCESS on success', () => {
            return getProject()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: GET_PROJECT_START }],
                    [{ type: GET_PROJECT_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch GET_PROJECT_FAIL on failure', () => {
            jest.spyOn(api, 'getProjectById').mockRejectedValue({});
            return getProject()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: GET_PROJECT_START }],
                    [{ type: GET_PROJECT_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('updateProject', () => {
        const project = { name: 'project', id: 'project-id' };
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'updateProject').mockResolvedValue(project);
        });

        const expected_UPDATE_PROJECT_START = {
            type: UPDATE_PROJECT_START,
            payload: project
        };

        it('should dispatch UPDATE_PROJECT_START', () => {
            updateProject(project)(dispatch);
            expect(dispatch).toHaveBeenCalledWith(expected_UPDATE_PROJECT_START);
        });

        it('should dispatch UPDATE_PROJECT_SUCCESS on success', () => {
            return updateProject(project)(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [expected_UPDATE_PROJECT_START],
                    [{ type: UPDATE_PROJECT_SUCCESS, payload: project }]
                ]);
            });
        });

        it('should dispatch UPDATE_PROJECT_FAIL on failure', () => {
            jest.spyOn(api, 'updateProject').mockRejectedValue({});
            return updateProject(project)(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [expected_UPDATE_PROJECT_START],
                    [{ type: UPDATE_PROJECT_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });
});
