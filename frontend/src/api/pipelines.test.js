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

import pipelines from './pipelines';
import axiosInstance from './axiosInstance';

describe('pipelines', () => {
    const projectId = 'some_id';
    const pipelineId = 'some_id';
    const nodeId = 'some_id';
    const expected = { data: {} };

    it('should get pipelines by projectId', () => {
        const requestURL = `/project/${projectId}/pipeline`;
        const spy = jest.spyOn(axiosInstance, 'get').mockResolvedValue(expected);
        return pipelines.getPipelines(projectId).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });
    it('should creact pipelines', () => {
        const pipeline = { graph: {} };
        jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return pipelines.createPipeline(projectId, pipeline).then(result => {
            expect(result).toEqual(expected);
        });
    });

    it('should update pipelines', () => {
        const pipeline = { graph: {} };
        jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return pipelines.updatePipeline(projectId, pipeline, 1).then(result => {
            expect(result).toEqual(expected);
        });
    });
    it('should delete pipelines', () => {
        const requestURL = `/project/${projectId}/pipeline/${pipelineId}`;
        const spy = jest.spyOn(axiosInstance, 'delete').mockResolvedValue(expected);
        return pipelines.deletePipeline(projectId, pipelineId).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });
    it('should run pipeline by projectId and pipelineId', () => {
        const requestURL = `/project/${projectId}/pipeline/${pipelineId}/run`;
        const spy = jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return pipelines.runPipeline(projectId, pipelineId).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should stop pipeline by projectId and pipelineId', () => {
        const requestURL = `/project/${projectId}/pipeline/${pipelineId}/terminate`;
        const spy = jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return pipelines.stopPipeline(projectId, pipelineId).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should resume pipeline by projectId and pipelineId', () => {
        const requestURL = `/project/${projectId}/pipeline/${pipelineId}/retry`;
        const spy = jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return pipelines.resumePipeline(projectId, pipelineId).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should get pipeline in project by id', () => {
        const pipelineId = 'someid';
        const requestURL = `/project/${projectId}/pipeline/${pipelineId}`;
        const spy = jest.spyOn(axiosInstance, 'get').mockResolvedValue(expected);
        return pipelines.getPipelineById(projectId, pipelineId).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should create pipeline', () => {
        const pipeline = { graph: {} };
        jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return pipelines.createPipeline(projectId, pipeline).then(result => {
            expect(result).toEqual(expected);
        });
    });

    it('should update pipeline', () => {
        const pipeline = { graph: {} };
        jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return pipelines.updatePipeline(projectId, pipeline, 1).then(result => {
            expect(result).toEqual(expected);
        });
    });

    it('should copy pipeline', () => {
        const requestURL = `/project/${projectId}/${pipelineId}/copyPipeline`;
        const spy = jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return pipelines.copyPipeline(projectId, pipelineId).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should get logs', () => {
        const requestURL = `/project/${projectId}/pipeline/${pipelineId}/${nodeId}/logs`;
        const spy = jest.spyOn(axiosInstance, 'get').mockResolvedValue(expected);
        return pipelines
            .getPipelineLogs(projectId, pipelineId, nodeId)
            .then(result => {
                expect(result).toEqual(expected);
                expect(spy).toHaveBeenCalledWith(requestURL);
            });
    });
});
