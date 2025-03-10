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

import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import ReadWriteStage from './read-stage';
import GroupByStage from './groupby-stage';
import RemoveDuplicatesStage from './remove-duplicates-stage';
import TransformStage from './transform-stage';
import FilterStage from './filter-stage';

import UnionStage from './union-stage';
import JoinStage from './join-stage';
import SliceStage from './slice-stage/SliceStage';
import PivotStage from './pivot-stage';
import StringFunctionsStage from './string-functions-stage';
import CDCStage from './cdc-stage';
import EdgeStage from './edge-stage';
import NotificationStage from './notification-stage';
import PDStages from './pd-stages/PDStages';
import CacheStage from './cache-stage';
import SortStage from './sort-stage';
import WithColumnStage from './withcolumn-stage';
import {
    CACHE,
    CDC,
    CONTAINER,
    DATETIME,
    EDGE,
    FILTER,
    GROUP,
    JOB,
    JOIN,
    NOTIFICATION,
    PIPELINE,
    READ,
    REMOVE_DUPLICATES,
    SLICE,
    SORT,
    STAGE_WIDTH,
    TRANSFORM,
    UNION,
    WRITE,
    STRING,
    VALIDATE,
    WITH_COLUMN,
    PIVOT,
    HANDLE_NULL,
    AI_TEXT_TASK
} from '../constants';
import { StageWithIcon } from '../sidebar/stage-icon';
import ValidateStage from './validate-stage';
import DateTimeStage from './datetime-stage/DateTimeStage';
import HandleNullStage from './handlenull-stage';
import AiStage from './ai-stage';

const root = {
    position: 'relative',
    width: STAGE_WIDTH
};

// eslint-disable-next-line complexity
const renderContent = (stage, t, type, jobs, params, pipelines) => {
    // if have only stage.type (on first drag-and-drop)
    if (
        Object.keys(stage).length === 1 ||
        (!stage.name && stage.operation !== EDGE)
    ) {
        return (
            <div style={root}>
                <StageWithIcon
                    name={t(`jobDesigner:palette.${stage.operation}`)}
                    operation={stage.operation}
                />
            </div>
        );
    }

    switch (stage.operation) {
        case READ:
        case WRITE:
            return <ReadWriteStage stage={stage} />;
        case UNION:
            return <UnionStage stage={stage} />;
        case GROUP:
            return <GroupByStage stage={stage} />;
        case REMOVE_DUPLICATES:
            return <RemoveDuplicatesStage stage={stage} />;
        case JOIN:
            return <JoinStage stage={stage} />;
        case SLICE:
            return <SliceStage stage={stage} />;
        case STRING:
            return <StringFunctionsStage stage={stage} />;
        case CDC:
            return <CDCStage stage={stage} />;
        case EDGE:
            return <EdgeStage stage={stage} />;
        case TRANSFORM:
            return <TransformStage stage={stage} />;
        case FILTER:
            return <FilterStage stage={stage} />;
        case JOB:
            return (
                <PDStages
                    stage={stage}
                    jobs={jobs}
                    iconId={stage.jobId}
                    tooltipName={stage.jobName}
                    tooltipClass="jobName"
                />
            );
        case PIPELINE:
            return (
                <PDStages
                    stage={stage}
                    pipelines={pipelines}
                    iconId={stage.pipelineId}
                    tooltipName={stage.pipelineName}
                    tooltipClass="pipelineName"
                />
            );
        case NOTIFICATION:
            return <NotificationStage stage={stage} params={params} />;
        case CONTAINER:
            return (
                <PDStages
                    stage={stage}
                    params={params}
                    iconId={stage.name}
                    tooltipName={stage.image}
                    tooltipClass="image"
                />
            );
        case CACHE:
            return <CacheStage stage={stage} />;
        case SORT:
            return <SortStage stage={stage} />;
        case VALIDATE:
            return <ValidateStage stage={stage} />;
        case WITH_COLUMN:
            return <WithColumnStage stage={stage} />;
        case DATETIME:
            return <DateTimeStage stage={stage} />;
        case PIVOT:
            return <PivotStage stage={stage} />;
        case HANDLE_NULL:
            return <HandleNullStage stage={stage} />;
        case AI_TEXT_TASK:
            return <AiStage stage={stage} />;
        default:
            return null;
    }
};

const renderStage = (stage, t, type, jobs, params, pipelines, theme) => (
    <MuiThemeProvider theme={theme}>
        <span className={stage.operation}>
            {renderContent(stage, t, type, jobs, params, pipelines)}
        </span>
    </MuiThemeProvider>
);

export default renderStage;
