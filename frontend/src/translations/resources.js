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

import combinedEn from './en';
import combinedRu from './ru';

const resources = {
    en: {
        main: combinedEn.main,
        jobs: combinedEn.jobs,
        setting: combinedEn.setting,
        jobDesigner: combinedEn.jobDesigner,
        pipelines: combinedEn.pipelines,
        ReadWrite: combinedEn.ReadWrite,
        filter: combinedEn.filter,
        transformer: combinedEn.transformer,
        removeDuplicates: combinedEn.removeDuplicates,
        union: combinedEn.union,
        groupBy: combinedEn.groupBy,
        join: combinedEn.join,
        cdc: combinedEn.cdc,
        job: combinedEn.job,
        notification: combinedEn.notification,
        container: combinedEn.container,
        pipelineDesigner: combinedEn.pipelineDesigner,
        filters: combinedEn.filters,
        cache: combinedEn.cache,
        sort: combinedEn.sort,
        slice: combinedEn.slice,
        pipeline: combinedEn.pipeline,
        wait: combinedEn.wait,
        stringFunctions: combinedEn.stringFunctions,
        validation: combinedEn.validation,
        withColumn: combinedEn.withColumn,
        datetime: combinedEn.datetime,
        pivot: combinedEn.pivot,
        handleNull: combinedEn.handleNull
    },
    ru: {
        main: combinedRu.main,
        filters: combinedRu.filters,
        jobs: combinedRu.jobs,
        setting: combinedRu.setting,
        ReadWrite: combinedRu.ReadWrite,
        filter: combinedRu.filter,
        transformer: combinedRu.transformer,
        removeDuplicates: combinedRu.removeDuplicates,
        union: combinedRu.union,
        groupBy: combinedRu.groupBy,
        join: combinedRu.join,
        cdc: combinedRu.cdc,
        job: combinedRu.job,
        notification: combinedRu.notification,
        container: combinedRu.container,
        cache: combinedRu.cache,
        sort: combinedRu.sort,
        slice: combinedRu.slice,
        pipeline: combinedRu.pipeline,
        wait: combinedRu.wait,
        stringFunctions: combinedRu.stringFunctions,
        validation: combinedRu.validation,
        withColumn: combinedRu.withColumn,
        datetime: combinedRu.datetime,
        pivot: combinedRu.pivot,
        handleNull: combinedRu.handleNull,
        jobDesigner: combinedRu.jobDesigner,
        pipelineDesigner: combinedRu.pipelineDesigner,
        pipelines: combinedRu.pipelines
    }
};

export default resources;
