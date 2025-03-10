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

import _ from 'lodash';
import {
    FETCH_RESOURCE_UTILIZATION_START,
    FETCH_RESOURCE_UTILIZATION_SUCCESS,
    FETCH_RESOURCE_UTILIZATION_FAIL,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_FAIL
} from './types';
import projectApi from '../../api/projects';
import jobApi from '../../api/jobs';
import pipelineApi from '../../api/pipelines';
import { DATABRICKS } from '../../mxgraph/constants';

export const fetchResourceUtilization = id => async dispatch => {
    dispatch({
        type: FETCH_RESOURCE_UTILIZATION_START
    });

    let proj;
    const callback = (accumulator, currentValue) => {
        _.assign(accumulator, {
            [currentValue.status]: accumulator[currentValue.status] + 1
        });
        return accumulator;
    };
    try {
        proj = await projectApi.getProjectById(id);
        dispatch({
            type: GET_PROJECT_SUCCESS,
            payload: proj.data
        });
    } catch (error) {
        proj = Promise.reject(error);
        dispatch({
            type: GET_PROJECT_FAIL,
            payload: { error }
        });
    }

    return window.PLATFORM !== DATABRICKS
        ? Promise.all([
              proj,
              projectApi.getResourceUtilization(id),
              jobApi.getJobs(id),
              pipelineApi.getPipelines(id)
          ]).then(
              ([project, utilization, jobs, pipelines]) => {
                  const {
                      name,
                      description,
                      limits,
                      usage,
                      demo,
                      demoLimits
                  } = project.data;
                  const initJobsObj = {
                      Draft: 0,
                      Pending: 0,
                      Running: 0,
                      Succeeded: 0,
                      Failed: 0
                  };
                  const initPipelinesObj = {
                      Draft: 0,
                      Pending: 0,
                      Running: 0,
                      Succeeded: 0,
                      Failed: 0,
                      Error: 0,
                      Stopped: 0,
                      Suspended: 0,
                      Terminated: 0
                  };
                  const jobsStat = jobs.data.jobs.reduce(callback, initJobsObj);
                  const pipelinesStat = pipelines.data.pipelines.reduce(
                      callback,
                      initPipelinesObj
                  );
                  return dispatch({
                      type: FETCH_RESOURCE_UTILIZATION_SUCCESS,
                      payload: {
                          id,
                          name,
                          description,
                          jobsStat,
                          pipelinesStat,
                          used: utilization.data,
                          requested: {
                              cpu: usage.requestsCpu / limits.requestsCpu,
                              memory: usage.requestsMemory / limits.requestsMemory
                          },
                          limits: {
                              cpu: usage.limitsCpu / limits.limitsCpu,
                              memory: usage.limitsMemory / limits.limitsMemory
                          },
                          demo,
                          demoLimits
                      }
                  });
              },
              error =>
                  dispatch({
                      type: FETCH_RESOURCE_UTILIZATION_FAIL,
                      payload: { error }
                  })
          )
        : Promise.all([proj, jobApi.getJobs(id), pipelineApi.getPipelines(id)]).then(
              ([project, jobs, pipelines]) => {
                  const { name, description, demo, demoLimits } = project.data;
                  const initJobsObj = {
                      Draft: 0,
                      Pending: 0,
                      Running: 0,
                      Succeeded: 0,
                      Failed: 0
                  };
                  const initPipelinesObj = {
                      Draft: 0,
                      Pending: 0,
                      Running: 0,
                      Succeeded: 0,
                      Failed: 0,
                      Error: 0,
                      Stopped: 0,
                      Suspended: 0,
                      Terminated: 0
                  };
                  const jobsStat = jobs.data.jobs.reduce(callback, initJobsObj);
                  const pipelinesStat = pipelines.data.pipelines.reduce(
                      callback,
                      initPipelinesObj
                  );
                  return dispatch({
                      type: FETCH_RESOURCE_UTILIZATION_SUCCESS,
                      payload: {
                          id,
                          name,
                          description,
                          jobsStat,
                          pipelinesStat,
                          demo,
                          demoLimits
                      }
                  });
              },
              error =>
                  dispatch({
                      type: FETCH_RESOURCE_UTILIZATION_FAIL,
                      payload: { error }
                  })
          );
};
export default fetchResourceUtilization;
