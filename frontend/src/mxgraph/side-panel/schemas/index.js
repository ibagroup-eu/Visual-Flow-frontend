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

import { get } from 'lodash';
import commonSchema from './commonSchema.json';
import read from './read.json';
import write from './write.json';
import cdc from './cdc.json';
import join from './join.json';
import group from './group.json';
import removeDuplicates from './removeDuplicates.json';
import union from './union.json';
import transform from './transform.json';
import filter from './filter.json';
import job from './job.json';
import container from './container.json';
import readWriteCommon from './read-write-common.json';
import cache from './cache.json';
import notification from './notification.json';
import sort from './sort.json';

const schemas = {
    ...commonSchema,
    ...read,
    ...cdc,
    ...join,
    ...group,
    ...removeDuplicates,
    ...union,
    ...transform,
    ...filter,
    ...job,
    ...container,
    ...cache,
    ...notification,
    ...sort,
    READ: [...get(readWriteCommon, 'READ_WRITE'), ...get(read, 'READ')],
    WRITE: [...get(readWriteCommon, 'READ_WRITE'), ...get(write, 'WRITE')]
};

export default schemas;
