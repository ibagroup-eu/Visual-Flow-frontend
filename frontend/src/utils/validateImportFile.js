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

import { sortUnique } from './array';

export const isNotValidJobPipeline = (pipelinesList, jobsList) => {
    const pipelinesData = {
        JOB: [],
        PIPELINES: []
    };
    const keys = Object.keys(pipelinesData);
    pipelinesList?.forEach(pipeline => {
        pipelinesData.PIPELINES.push(pipeline.id);
        pipeline?.definition?.graph?.forEach(graph => {
            if (keys.includes(graph?.value?.operation)) {
                pipelinesData[graph.value.operation].push(graph?.value?.jobId);
            }
        });
    });
    keys.forEach(key => {
        pipelinesData[key] = sortUnique(pipelinesData[key]);
    });

    return (
        jobsList.length !== pipelinesData.JOB.length ||
        pipelinesList.length !== pipelinesData.PIPELINES.length
    );
};

export const isNotValidFileContent = fileData => {
    const jobsList = fileData.jobs;
    const pipelinesList = fileData.pipelines;

    if (jobsList === undefined || pipelinesList === undefined) {
        return true;
    }

    return (
        pipelinesList.length > 0 &&
        jobsList.length > 0 &&
        isNotValidJobPipeline(pipelinesList, jobsList)
    );
};
