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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Skeleton from '@material-ui/lab/Skeleton';
import { IconButton, Divider, Typography, Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Save } from '@material-ui/icons';

import { has } from 'lodash';
import useStyles from './PipelinesToolbar.Styles';
import Status from '../../../components/status';
import history from '../../../utils/history';
import {
    createPipeline,
    updatePipeline,
    runPipelineAndRefreshIt,
    stopPipelineAndRefreshIt
} from '../../../redux/actions/pipelinesActions';
import RunStopButtons from '../run-stop-buttons';
import EditDesignerButtons from '../edit-designer-buttons';
import LinearProgressChart from '../../../components/chart/linear';
import { fetchPipelineById } from '../../../redux/actions/mxGraphActions';
import { fetchJobs } from '../../../redux/actions/jobsActions';
import { PENDING, RUNNING } from '../../constants';
import { findByProp } from '../../../components/helpers/JobsPipelinesTable';
import {
    findParamByKey,
    validParamsContainer
} from '../../../components/helpers/PipelinesValidation';
import CronButton from '../cron-button';

const PipelinesToolbar = ({
    graph,
    reversible,
    data,
    run,
    stop,
    getActualJobs,
    getActualPipeline,
    pipelineStatus: { loading, status, progress, id },
    create,
    update,
    setSidePanel,
    sidePanelIsOpen,
    setDirty,
    sidePanelIsDirty,
    dirty,
    undoButtonsDisabling,
    jobs,
    params,
    setCurrentCell
}) => {
    const { t } = useTranslation();
    const classes = useStyles({ name: 'PipelineUtilizationCell' });

    const currentPath = history.location.pathname.split('/');
    const currentProject = currentPath.slice(-2, -1)[0];
    const currentPipeline = currentPath.slice(-1)[0];

    const statusValue = currentPipeline === id ? status : data.status;
    const progressValue = currentPipeline === id ? progress : data.progress;

    const validStages = () => {
        let isValid = true;
        data?.definition.graph.forEach(stage => {
            if (
                stage.value.operation === 'JOB' &&
                !findByProp(jobs, stage.value.jobId, 'id')
            ) {
                isValid = false;
            }
            if (
                stage.value.operation === 'NOTIFICATION' &&
                !findParamByKey(params, [stage.value.addressees])
            ) {
                isValid = false;
            }
            if (
                stage.value.operation === 'CONTAINER' &&
                !validParamsContainer(params, stage.value)
            ) {
                isValid = false;
            }
        });
        return isValid;
    };

    const createUpdatePipeline = () => {
        if (currentPipeline) {
            update(graph, currentProject, currentPipeline, data);
        } else {
            create(graph, currentProject, data);
        }
    };

    const runAndUpdate = () => {
        return run(currentProject, currentPipeline).then(() => {
            getActualJobs(currentProject);
            getActualPipeline(currentProject, currentPipeline);
        });
    };

    const stopAndUpdate = () => {
        return stop(currentProject, currentPipeline).then(() => {
            getActualJobs(currentProject);
            getActualPipeline(currentProject, currentPipeline);
        });
    };

    const enableViewMode = () =>
        data.status === PENDING || data.status === RUNNING ? false : data.editable;

    const pipelineRefresh = () => {
        getActualJobs(currentProject);
        getActualPipeline(currentProject, currentPipeline);
    };

    const changesNotSaved = () => sidePanelIsDirty || dirty || !validStages();

    return (
        <>
            <div className={classes.status}>
                <Typography variant="body2" color="textSecondary">
                    {t('pipelines:Status')}:
                </Typography>
                &nbsp;
                {loading ? (
                    <Skeleton variant="circle" width={90} height={25} />
                ) : (
                    <Status value={statusValue} />
                )}
            </div>
            <Divider orientation="vertical" flexItem />
            <div className={classes.progress}>
                <Typography
                    align="left"
                    variant="body2"
                    color="inherit"
                    className={classes.hint}
                >
                    {t('pipelines:Progress')}
                </Typography>
                <LinearProgressChart
                    value={progressValue * 100 || 0}
                    status={statusValue}
                    classes={{ caption: classes.caption, margins: classes.margins }}
                />
            </div>
            <Divider orientation="vertical" flexItem />
            <div className={classes.buttons}>
                {data.runnable && (
                    <>
                        <RunStopButtons
                            isNotRunning={![RUNNING, PENDING].includes(statusValue)}
                            runnable={data.runnable}
                            stopable={![PENDING].includes(statusValue)}
                            changesNotSaved={changesNotSaved()}
                            run={() => {
                                runAndUpdate();
                            }}
                            stop={() => {
                                stopAndUpdate();
                            }}
                        />
                        <CronButton
                            changesNotSaved={changesNotSaved()}
                            pipeline={data}
                            refresh={pipelineRefresh}
                            projectId={currentProject}
                        />
                    </>
                )}
                {enableViewMode() && (
                    <IconButton aria-label="saveIcon" onClick={createUpdatePipeline}>
                        <Tooltip title={t('jobs:tooltip.Save')} arrow>
                            <Save />
                        </Tooltip>
                    </IconButton>
                )}
            </div>
            <Divider orientation="vertical" flexItem />
            <EditDesignerButtons
                t={t}
                editable={!has(data, 'editable') || enableViewMode()}
                data={data}
                graph={graph}
                reversible={reversible}
                setSidePanel={setSidePanel}
                sidePanelIsOpen={sidePanelIsOpen}
                setDirty={setDirty}
                refresh={pipelineRefresh}
                undoButtonsDisabling={undoButtonsDisabling}
                setCurrentCell={setCurrentCell}
                type="PIPELINE"
            />
        </>
    );
};

PipelinesToolbar.propTypes = {
    setSidePanel: PropTypes.func,
    sidePanelIsOpen: PropTypes.bool,
    setDirty: PropTypes.func,
    graph: PropTypes.object,
    create: PropTypes.func,
    data: PropTypes.object,
    update: PropTypes.func,
    run: PropTypes.func,
    stop: PropTypes.func,
    pipelineStatus: PropTypes.object,
    reversible: PropTypes.object,
    getActualPipeline: PropTypes.func,
    getActualJobs: PropTypes.func,
    sidePanelIsDirty: PropTypes.bool,
    dirty: PropTypes.bool,
    undoButtonsDisabling: PropTypes.object,
    jobs: PropTypes.array,
    params: PropTypes.array,
    setCurrentCell: PropTypes.func
};

const mapStateToProps = state => ({
    pipelineStatus: state.pipelineStatus,
    sidePanelIsDirty: state.mxGraph.sidePanelIsDirty,
    dirty: state.mxGraph.dirty,
    jobs: state.pages.jobs.data.jobs,
    params: state.pages.settingsParameters.data.params
});

const mapDispatchToProps = {
    create: createPipeline,
    update: updatePipeline,
    run: runPipelineAndRefreshIt,
    stop: stopPipelineAndRefreshIt,
    getActualPipeline: fetchPipelineById,
    getActualJobs: fetchJobs
};

export default connect(mapStateToProps, mapDispatchToProps)(PipelinesToolbar);
