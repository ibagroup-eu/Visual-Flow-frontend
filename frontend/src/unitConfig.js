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

import { DATABRICKS } from './mxgraph/constants';

const UnitConfig = {
    JOB: {
        STAGES: {
            READ: true,
            WRITE: true,
            GROUP: true,
            REMOVE_DUPLICATES: true,
            FILTER: true,
            TRANSFORM: true,
            SORT: true,
            SLICE: true,
            PIVOT: true,
            JOIN: true,
            UNION: true,
            CDC: true,
            CACHE: true,
            VALIDATE: true,
            WITH_COLUMN: true,
            STRING: true,
            DATETIME: true,
            HANDLE_NULL: true,
            AI_TEXT_TASK: true
        },
        HISTORY: true
    },
    PIPELINE: {
        STAGES: {
            JOB: true,
            PIPELINE: true,
            CONTAINER: window.PLATFORM !== DATABRICKS,
            NOTIFICATION: window.PLATFORM !== DATABRICKS,
            WAIT: window.PLATFORM !== DATABRICKS
        },
        HISTORY: true
    }
};

export default UnitConfig;
