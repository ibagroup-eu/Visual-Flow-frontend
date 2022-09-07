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

import axiosInstance from './axiosInstance';

export default {
    getProjects: () => axiosInstance.get('/project'),
    createProject: project => axiosInstance.post('/project', project),
    deleteProject: id => axiosInstance.delete(`/project/${id}`),
    getProjectById: id => axiosInstance.get(`/project/${id}`),
    getProjectParameters: id => axiosInstance.get(`/project/${id}/params`),
    updateProjectParameters: (id, params) =>
        axiosInstance.post(`/project/${id}/params`, params),
    getResourceUtilization: id => axiosInstance.get(`/project/${id}/usage`),
    updateProject: project => axiosInstance.post(`/project/${project.id}`, project),
    getProjectUsers: id => axiosInstance.get(`/project/${id}/users`),
    updateProjectUsers: (id, updatedUsers) =>
        axiosInstance.post(`/project/${id}/users`, updatedUsers)
};
