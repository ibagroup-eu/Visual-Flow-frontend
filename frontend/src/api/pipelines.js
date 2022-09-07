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

import { axiosInstance } from './axiosInstance';

export default {
    getPipelines: projectId => axiosInstance.get(`/project/${projectId}/pipeline`),

    getPipelineById: (projectId, pipelineId) =>
        axiosInstance.get(`/project/${projectId}/pipeline/${pipelineId}`),

    createPipeline: (projectId, pipeline) =>
        axiosInstance.post(`/project/${projectId}/pipeline`, pipeline),

    updatePipeline: (projectId, pipeline, id) =>
        axiosInstance.post(`/project/${projectId}/pipeline/${id}`, pipeline),

    deletePipeline: (projectId, pipelineId) =>
        axiosInstance.delete(`/project/${projectId}/pipeline/${pipelineId}`),

    runPipeline: (projectId, pipelineId) =>
        axiosInstance.post(`/project/${projectId}/pipeline/${pipelineId}/run`),

    stopPipeline: (projectId, pipelineId) =>
        axiosInstance.post(`/project/${projectId}/pipeline/${pipelineId}/terminate`),

    resumePipeline: (projectId, pipelineId) =>
        axiosInstance.post(`/project/${projectId}/pipeline/${pipelineId}/retry`),

    copyPipeline: (projectId, pipelineId) =>
        axiosInstance.post(`/project/${projectId}/${pipelineId}/copyPipeline`),

    getPipelineLogs: (projectId, pipelineId, nodeId) =>
        axiosInstance.get(
            `/project/${projectId}/pipeline/${pipelineId}/${nodeId}/logs`
        )
};
