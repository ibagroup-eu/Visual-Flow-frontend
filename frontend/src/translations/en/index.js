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

import main from './main.json';
import jobs from './jobs.json';
import setting from './setting.json';
import jobDesigner from './jobDesigner.json';
import pipelines from './pipelines.json';
import ReadWrite from './stages/ReadWrite.json';
import filter from './stages/filter.json';
import transformer from './stages/transformer.json';
import removeDuplicates from './stages/removeDuplicates.json';
import union from './stages/union.json';
import groupBy from './stages/groupBy.json';
import join from './stages/join.json';
import cdc from './stages/cdc.json';
import job from './stages/job.json';
import notification from './stages/notification.json';
import container from './stages/container.json';
import pipelineDesigner from './pipelineDesigner.json';
import filters from './filters.json';
import cache from './stages/cache.json';
import sort from './stages/sort.json';
import slice from './stages/slice.json';
import pipeline from './stages/pipeline.json';
import wait from './stages/wait.json';
import pivot from './stages/pivot.json';
import stringFunctions from './stages/stringFunctions.json';
import validation from './stages/validation.json';
import withColumn from './stages/withColumn.json';
import datetime from './stages/datetime.json';
import handleNull from './stages/handleNull.json';

export default {
    main,
    jobs,
    setting,
    jobDesigner,
    pipelines,
    ReadWrite,
    filter,
    transformer,
    removeDuplicates,
    union,
    groupBy,
    join,
    cdc,
    job,
    notification,
    container,
    pipelineDesigner,
    filters,
    cache,
    sort,
    slice,
    pipeline,
    wait,
    pivot,
    stringFunctions,
    validation,
    withColumn,
    datetime,
    handleNull
};
