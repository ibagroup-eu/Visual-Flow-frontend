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

import jobs from './jobs';
import axiosInstance from './axiosInstance';

describe('jobs', () => {
    const projectId = 'some_id';
    let jobId = 'some_id';
    const expected = { data: {} };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get jobs by projectId', () => {
        const requestURL = `/project/${projectId}/job`;
        const spy = jest.spyOn(axiosInstance, 'get').mockResolvedValue(expected);
        return jobs.getJobs(projectId).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should creact job by createJob', () => {
        const job = { graph: {} };
        jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return jobs.createJob(projectId, job).then(result => {
            expect(result).toEqual(expected);
        });
    });

    it('should updata job by updateJob', () => {
        const job = { graph: {} };
        jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return jobs.updateJob(projectId, job, 1).then(result => {
            expect(result).toEqual(expected);
        });
    });

    it('should delete jobs', () => {
        const requestURL = `/project/${projectId}/job/${jobId}`;
        const spy = jest.spyOn(axiosInstance, 'delete').mockResolvedValue(expected);
        return jobs.deleteJob(projectId, jobId).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should get job in project by id', () => {
        jobId = 'fff';
        const requestURL = `/project/${projectId}/job/${jobId}`;
        const spy = jest.spyOn(axiosInstance, 'get').mockResolvedValue(expected);
        return jobs.getJobById(projectId, jobId).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should run job by projectId and jobId', () => {
        const requestURL = `/project/${projectId}/job/${jobId}/run`;
        const spy = jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return jobs.runJob(projectId, jobId).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });

    it('should copy job', () => {
        const requestURL = `/project/${projectId}/${jobId}/copyJob`;
        const spy = jest.spyOn(axiosInstance, 'post').mockResolvedValue(expected);
        return jobs.copyJob(projectId, jobId).then(result => {
            expect(result).toEqual(expected);
            expect(spy).toHaveBeenCalledWith(requestURL);
        });
    });
});
