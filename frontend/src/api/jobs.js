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
    getJobs: projectId => axiosInstance.get(`/project/${projectId}/job`),

    getJobById: (projectId, jobId) =>
        axiosInstance.get(`/project/${projectId}/job/${jobId}`),

    getInteractiveJobSession: (projectId, jobId, runId) =>
        axiosInstance.get(`/project/${projectId}/job/${jobId}/session/${runId}`),

    deleteInteractiveJobSession: (projectId, jobId, runId) =>
        axiosInstance.delete(`/project/${projectId}/job/${jobId}/session/${runId}`),

    interactiveSessionEvent: (projectId, jobId, runId, data = {}) =>
        axiosInstance.post(
            `/project/${projectId}/job/${jobId}/session/${runId}/events`,
            data
        ),

    updateInteractiveJobSession: (projectId, jobId, runId, data) =>
        axiosInstance.put(
            `/project/${projectId}/job/${jobId}/session/${runId}`,
            data
        ),

    fetchJobMetadata: (projectId, jobId, runId, offset = 0) =>
        axiosInstance.get(
            `/project/${projectId}/job/${jobId}/session/${runId}/metadata`,
            {
                params: { offset }
            }
        ),

    getJobLogs: (projectId, jobId) =>
        axiosInstance.get(`/project/${projectId}/job/${jobId}/logs`),

    getDatabricksJobLogs: (projectId, pipeLineId, jobName) =>
        axiosInstance.get(
            `/project/${projectId}/pipeline/${pipeLineId}/jobName/${jobName}/logs`
        ),

    getJobHistoryLogs: (projectId, jobId, logId) =>
        axiosInstance.get(`/project/${projectId}/job/${jobId}/logsHistory/${logId}`),

    createJob: (projectId, job) =>
        axiosInstance.post(`/project/${projectId}/job`, job),

    updateJob: (projectId, job, id) =>
        axiosInstance.post(`/project/${projectId}/job/${id}`, job),

    deleteJob: (projectId, jobId) =>
        axiosInstance.delete(`/project/${projectId}/job/${jobId}`),

    runJob: (projectId, jobId, interactive = false) =>
        axiosInstance.post(`/project/${projectId}/job/${jobId}/run`, null, {
            params: { interactive }
        }),

    stopJob: (projectId, jobId, interactive = false) =>
        axiosInstance.post(`/project/${projectId}/job/${jobId}/stop`, null, {
            params: { interactive }
        }),

    copyJob: (projectId, jobId) =>
        axiosInstance.post(`/project/${projectId}/job/${jobId}/copy`),

    getJobHistory: (projectId, jobId) =>
        axiosInstance.get(`/project/${projectId}/job/${jobId}/history`)
};
