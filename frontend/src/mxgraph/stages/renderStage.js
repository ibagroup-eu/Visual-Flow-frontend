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
import stageIcon from '../sidebar/stage-icon/stageIcon';

import UnionStage from './union-stage';
import JoinStage from './join-stage';
import SliceStage from './slice-stage/SliceStage';
import CDCStage from './cdc-stage';
import EdgeStage from './edge-stage';
import NotificationStage from './notification-stage';
import PDStages from './pd-stages/PDStages';
import CacheStage from './cache-stage';
import StageWarning from '../../components/stage-warning';
import SortStage from './sort-stage';
import {
    CACHE,
    CDC,
    CONTAINER,
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
    TRANSFORM,
    UNION,
    WRITE
} from '../constants';

const root = {
    position: 'relative',
    width: 130
};

const stageStyle = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const textStyle = {
    textAlign: 'left',
    marginLeft: '4.8px'
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
                <div style={stageStyle}>
                    {stageIcon(stage.operation)}
                    <div style={textStyle}>
                        {t(`jobDesigner:palette.${stage.operation}`)}
                    </div>
                </div>
                {type === PIPELINE && (
                    <StageWarning
                        stage={stage}
                        jobs={jobs}
                        params={params}
                        pipelines={pipelines}
                    />
                )}
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
        default:
            return null;
    }
};

const renderStage = (stage, t, type, jobs, params, pipelines, theme) => (
    <MuiThemeProvider theme={theme}>
        {renderContent(stage, t, type, jobs, params, pipelines)}
    </MuiThemeProvider>
);

export default renderStage;
