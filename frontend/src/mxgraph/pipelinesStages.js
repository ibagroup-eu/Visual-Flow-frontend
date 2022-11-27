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
import { JOB, NOTIFICATION, PIPELINE, CONTAINER, WAIT } from './constants';
import UnitConfig from '../unitConfig';

const pipelinesStages = theme =>
    [
        {
            operation: JOB,
            name: palette.JOB,
            color: theme.palette.secondary.light,
            show: UnitConfig.PIPELINE.STAGES.JOB
        },
        {
            operation: PIPELINE,
            name: palette.PIPELINE,
            color: theme.palette.warning.background,
            show: UnitConfig.PIPELINE.STAGES.PIPELINE
        },
        {
            operation: CONTAINER,
            name: palette.CONTAINER,
            color: theme.palette.info.background,
            show: UnitConfig.PIPELINE.STAGES.CONTAINER
        },
        {
            operation: NOTIFICATION,
            name: palette.NOTIFICATION,
            color: theme.palette.success.background,
            show: UnitConfig.PIPELINE.STAGES.NOTIFICATION
        },
        {
            operation: WAIT,
            name: palette.WAIT,
            color: theme.palette.info.light,
            show: UnitConfig.PIPELINE.STAGES.WAIT
        }
    ].filter(stage => stage.show !== false);

const pipelinesStagesByType = theme =>
    Object.assign(
        {},
        ...pipelinesStages(theme).map(stage => ({ [stage.operation]: stage }))
    );

export { pipelinesStages, pipelinesStagesByType };
