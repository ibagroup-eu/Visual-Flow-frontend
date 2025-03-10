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

import palette from '../translations/en/jobDesigner.json';
import {
    READ,
    WRITE,
    UNION,
    GROUP,
    REMOVE_DUPLICATES,
    JOIN,
    CDC,
    TRANSFORM,
    FILTER,
    CACHE,
    SLICE,
    SORT,
    PIVOT,
    STRING,
    VALIDATE,
    DATETIME,
    WITH_COLUMN,
    HANDLE_NULL,
    AI_TEXT_TASK
} from './constants';
import UnitConfig from '../unitConfig';

const jobStages = theme =>
    [
        {
            operation: READ,
            name: palette.READ,
            color: theme.palette.info.background,
            validation: {
                minCount: 1,
                maxIncomingConnections: 0,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.READ
        },
        {
            operation: WRITE,
            name: palette.WRITE,
            color: theme.palette.info.background,
            validation: {
                minCount: 1,
                maxCount: 1,
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                maxOutgoingConnections: 0
            },
            show: UnitConfig.JOB.STAGES.WRITE
        },
        {
            operation: GROUP,
            name: palette.GROUP,
            color: theme.palette.success.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.GROUP
        },
        {
            operation: REMOVE_DUPLICATES,
            name: palette.REMOVE_DUPLICATES,
            color: theme.palette.success.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.REMOVE_DUPLICATES
        },
        {
            operation: FILTER,
            name: palette.FILTER,
            color: theme.palette.success.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.FILTER
        },
        {
            operation: TRANSFORM,
            name: palette.TRANSFORM,
            color: theme.palette.success.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.TRANSFORM
        },
        {
            operation: SORT,
            name: palette.SORT,
            color: theme.palette.success.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.SORT
        },
        {
            operation: SLICE,
            name: palette.SLICE,
            color: theme.palette.success.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.SLICE
        },
        {
            operation: PIVOT,
            name: palette.PIVOT,
            color: theme.palette.success.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.PIVOT
        },
        {
            operation: WITH_COLUMN,
            name: palette.WITH_COLUMN,
            color: theme.palette.success.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.WITH_COLUMN
        },
        {
            operation: STRING,
            name: palette.STRING,
            color: theme.palette.success.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.STRING
        },
        {
            operation: DATETIME,
            name: palette.DATETIME,
            color: theme.palette.success.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.DATETIME
        },
        {
            operation: HANDLE_NULL,
            name: palette.HANDLE_NULL,
            color: theme.palette.success.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.HANDLE_NULL
        },
        {
            operation: JOIN,
            name: palette.JOIN,
            color: theme.palette.warning.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 2,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.JOIN
        },
        {
            operation: UNION,
            name: palette.UNION,
            color: theme.palette.warning.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 2,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.UNION
        },
        {
            operation: CDC,
            name: palette.CDC,
            color: theme.palette.warning.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 2,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.CDC
        },
        {
            operation: CACHE,
            name: palette.CACHE,
            color: theme.palette.info.light,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 15
            },
            show: UnitConfig.JOB.STAGES.CACHE
        },
        {
            operation: VALIDATE,
            name: palette.VALIDATE,
            color: theme.palette.info.light,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.VALIDATE
        },
        {
            operation: AI_TEXT_TASK,
            name: palette.AI_TEXT_TASK,
            color: theme.palette.primary.background,
            validation: {
                minIncomingConnections: 1,
                maxIncomingConnections: 1,
                minOutgoingConnections: 1,
                maxOutgoingConnections: 1
            },
            show: UnitConfig.JOB.STAGES.AI_TEXT_TASK
        }
    ].filter(stage => stage.show !== false);

const jobStagesByType = theme =>
    Object.assign(
        {},
        ...jobStages(theme).map(stage => ({ [stage.operation]: stage }))
    );

export { jobStages, jobStagesByType };
