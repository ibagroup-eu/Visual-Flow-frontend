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

import projects from './projects';
import axiosInstance from './axiosInstance';

describe('projects', () => {
    const id = 'some_id';
    const expected = { data: {} };

    it('should call get when getProjects', () => {
        jest.spyOn(axiosInstance, 'get').mockResolvedValue(expected);
        return projects.getProjects().then(result => {
            expect(result).toEqual(expected);
        });
    });

    it('should call post when getProjects', () => {
        const project = { name: 'project' };
        const expected = { id: 'project-id' };
        jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return projects.createProject(project).then(result => {
            expect(result).toEqual(expected);
        });
    });

    it('should call delete when deleteProject', () => {
        const project = { name: 'project', id: 'project-id' };
        const expected = { data: [] };
        jest.spyOn(axiosInstance, 'delete').mockResolvedValue(expected);
        return projects.deleteProject(project.id).then(result => {
            expect(result).toEqual(expected);
        });
    });

    it('should get project by id', () => {
        const requestURL = `/project/${id}`;
        const spy = jest.spyOn(axiosInstance, 'get').mockResolvedValue(expected);
        return projects.getProjectById(id).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should get project parameters', () => {
        const requestURL = `/project/${id}/params`;
        const spy = jest.spyOn(axiosInstance, 'get').mockResolvedValue(expected);
        return projects.getProjectParameters(id).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should call post when updateProjectParameters', () => {
        const params = [{ key: 'USER', value: 'NAME' }];
        const expected = { data: { params } };
        jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return projects.updateProjectParameters(params).then(result => {
            expect(result).toEqual(expected);
        });
    });

    it('should get resource utilization', () => {
        const requestURL = `/project/${id}/usage`;
        const spy = jest.spyOn(axiosInstance, 'get').mockResolvedValue(expected);
        return projects.getResourceUtilization(id).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should call post when updateProject', () => {
        const project = { name: 'project', id: 'project-id' };
        const expected = { data: [project] };
        jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return projects.updateProject(project).then(result => {
            expect(result).toEqual(expected);
        });
    });

    it('should get project users', () => {
        const requestURL = `/project/${id}/users`;
        const spy = jest.spyOn(axiosInstance, 'get').mockResolvedValue(expected);
        return projects.getProjectUsers(id).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should call post when updateProjectUsers', () => {
        const users = { grants: [] };
        const expected = { data: [users] };
        jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return projects.updateProjectUsers('id', users).then(result => {
            expect(result).toEqual(expected);
        });
    });
});
