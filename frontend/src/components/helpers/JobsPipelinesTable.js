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

import pipelinesApi from '../../api/pipelines';
import showNotification from '../notification/showNotification';
import { findParamByKey, validParamsContainer } from './PipelinesValidation';

export const removeHandler = (
    projectId,
    items,
    dataLength,
    { rowsPerPage, currentPage },
    remove,
    setCurrentPage
) => {
    remove(projectId, items).then(() => {
        const jobsLastPageAfterRemove =
            Math.ceil((dataLength - items.length) / rowsPerPage) - 1;

        if (currentPage > jobsLastPageAfterRemove && jobsLastPageAfterRemove >= 0) {
            setCurrentPage(jobsLastPageAfterRemove);
        }
    });
};
export const findByProp = (objects, value, prop) =>
    objects?.find(obj => obj[prop] === value);

export const runWithValidation = async (
    projectId,
    itemId,
    { dataJobs, dataParams },
    run,
    message
) => {
    const pipelineData = await pipelinesApi
        .getPipelineById(projectId, itemId)
        .then(response => response.data);
    let runDisabled = false;

    pipelineData.definition?.graph.forEach(stage => {
        if (
            stage.value.operation === 'JOB' &&
            !findByProp(dataJobs, stage.value.jobId, 'id')
        ) {
            runDisabled = true;
        }
        if (
            stage.value.operation === 'NOTIFICATION' &&
            !findParamByKey(dataParams, [stage.value.addressees])
        ) {
            runDisabled = true;
        }
        if (
            stage.value.operation === 'CONTAINER' &&
            !validParamsContainer(dataParams, stage.value)
        ) {
            runDisabled = true;
        }
    });

    runDisabled ? showNotification(message, 'error') : run(projectId, itemId);
};

export const jobDesignerHendler = (projectId, item, data, history) => {
    history.push(
        `/jobs/${projectId}/${
            item.pipelineInstances === null
                ? data.find(
                      dataItem => dataItem.name === item.name && !item.runnable
                  ).id
                : item.id
        }`
    );
};

export const joinDataNames = (selected, data) =>
    selected?.map(id => findByProp(data, id, 'id')?.name).join(', ');
