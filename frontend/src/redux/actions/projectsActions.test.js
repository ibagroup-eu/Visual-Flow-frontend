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

import {
    fetchProjects,
    createProject,
    deleteProject,
    setCurrentProject
} from './projectsActions';
import api from '../../api/projects';
import {
    FETCH_PROJECTS_START,
    FETCH_PROJECTS_SUCCESS,
    FETCH_PROJECTS_FAIL,
    CREATE_PROJECT,
    CREATE_PROJECT_FAIL,
    CREATE_PROJECT_SUCCESS,
    SET_CURRENT_PROJECT,
    DELETE_PROJECT_FAIL,
    DELETE_PROJECT_SUCCESS,
    DELETE_PROJECT
} from './types';

describe('Projects action', () => {
    let dispatch;

    describe('getProjects', () => {
        let data;
        beforeEach(() => {
            data = {
                projects: [{ locked: true }, { locked: false }]
            };
            dispatch = jest.fn();
            jest.spyOn(api, 'getProjects').mockResolvedValue({ data });
        });

        it('should dispatch FETCH_PROJECTS_START', () => {
            fetchProjects()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: FETCH_PROJECTS_START });
        });

        it('should return empty project list', () => {
            jest.spyOn(api, 'getProjects').mockResolvedValue({
                data: { projects: undefined }
            });
            return fetchProjects()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_PROJECTS_START }],
                    [
                        {
                            type: FETCH_PROJECTS_SUCCESS,
                            payload: {
                                projects: []
                            }
                        }
                    ]
                ]);
            });
        });

        it('should dispatch FETCH_PROJECTS_SUCCESS on success', () => {
            return fetchProjects()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_PROJECTS_START }],
                    [
                        {
                            type: FETCH_PROJECTS_SUCCESS,
                            payload: {
                                projects: [{ locked: false }, { locked: true }]
                            }
                        }
                    ]
                ]);
            });
        });

        it('should dispatch FETCH_PROJECTS_FAIL on failure', () => {
            jest.spyOn(api, 'getProjects').mockRejectedValue({});
            return fetchProjects()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: FETCH_PROJECTS_START }],
                    [{ type: FETCH_PROJECTS_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('createProject', () => {
        const project = { name: 'project' };
        const expected_CREATE_PROJECT = {
            type: CREATE_PROJECT,
            payload: { project }
        };

        beforeEach(() => {
            dispatch = jest.fn();
        });

        it('should dispatch CREATE_PROJECT', () => {
            createProject(project)(dispatch);
            expect(dispatch).toHaveBeenCalledWith(expected_CREATE_PROJECT);
        });

        it('should dispatch CREATE_PROJECT_SUCCESS on success', () => {
            jest.spyOn(api, 'createProject').mockResolvedValue({ data: {} });
            return createProject(project)(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [expected_CREATE_PROJECT],
                    [{ type: CREATE_PROJECT_SUCCESS, payload: {} }]
                ]);
            });
        });

        it('should dispatch CREATE_PROJECT_FAIL on failure', () => {
            jest.spyOn(api, 'createProject').mockRejectedValue({});
            return createProject(project)(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [expected_CREATE_PROJECT],
                    [{ type: CREATE_PROJECT_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    describe('deleteProject', () => {
        const project = { name: 'project', id: 'project-id' };
        const expected_DELETE_PROJECT = {
            type: DELETE_PROJECT,
            payload: project.id
        };

        beforeEach(() => {
            dispatch = jest.fn();
        });

        it('should dispatch DELETE_PROJECT', () => {
            deleteProject(project.id)(dispatch);
            expect(dispatch).toHaveBeenCalledWith(expected_DELETE_PROJECT);
        });

        it('should dispatch DELETE_PROJECT_SUCCESS on success', () => {
            jest.spyOn(api, 'deleteProject').mockResolvedValue({ data: 'success' });
            return deleteProject(project.id)(dispatch).then(() => {
                expect(dispatch.mock.calls[1]).toEqual([
                    {
                        type: DELETE_PROJECT_SUCCESS,
                        payload: { id: 'project-id', success: 'success' }
                    }
                ]);
            });
        });

        it('should dispatch DELETE_PROJECT_FAIL on failure', () => {
            jest.spyOn(api, 'deleteProject').mockRejectedValue({});
            return deleteProject(project.id)(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [expected_DELETE_PROJECT],
                    [{ type: DELETE_PROJECT_FAIL, payload: { error: {} } }]
                ]);
            });
        });
    });

    it('should call SET_CURRENT_PROJECT', () => {
        const payload = '#1';
        const expectedAction = { type: SET_CURRENT_PROJECT, payload };
        expect(setCurrentProject('#1')).toEqual(expectedAction);
    });
});
