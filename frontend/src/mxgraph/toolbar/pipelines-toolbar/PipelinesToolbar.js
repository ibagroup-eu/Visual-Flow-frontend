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

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Divider, IconButton, Tooltip, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { HistoryOutlined, Save } from '@material-ui/icons';
import { has } from 'lodash';
import useStyles from './PipelinesToolbar.Styles';
import history from '../../../utils/history';
import {
    createPipeline,
    resumePipeline,
    runPipelineAndRefreshIt,
    stopPipelineAndRefreshIt,
    suspendPipeline,
    updatePipeline
} from '../../../redux/actions/pipelinesActions';
import EditDesignerButtons from '../edit-designer-buttons';
import LinearProgressChart from '../../../components/chart/linear';
import { fetchPipelineById } from '../../../redux/actions/mxGraphActions';
import { fetchJobs } from '../../../redux/actions/jobsActions';
import { DATABRICKS, PENDING, RUNNING, SUSPENDED } from '../../constants';
import toggleConfirmationWindow from '../../../redux/actions/modalsActions';
import { findByProp } from '../../../components/helpers/JobsPipelinesTable';
import {
    findParamByKey,
    validParamsContainer
} from '../../../components/helpers/PipelinesValidation';
import CronButton from '../cron-button';
import HistoryPanel from '../../../components/history-panel/HistoryPanel';
import UnitConfig from '../../../unitConfig';
import ControlButtons from '../control-buttons';
import PipelinesStatus from './PipelinesStatus';

const PipelinesToolbar = ({
    graph,
    reversible,
    data,
    run,
    stop,
    suspend,
    resume,
    getActualJobs,
    getActualPipeline,
    pipelineStatus: { loading, status, progress, id },
    create,
    update,
    setSidePanel,
    sidePanelIsOpen,
    setDirty,
    dirty,
    undoButtonsDisabling,
    jobs,
    params,
    setCurrentCell,
    dirtyGraph,
    confirmationWindow,
    isUpdating
}) => {
    const { t } = useTranslation();
    const classes = useStyles({ name: 'PipelineUtilizationCell' });
    const [pipelineHistory, setPipelineHistory] = React.useState({ data: {} });

    const currentPath = history.location.pathname.split('/');
    const currentProject = currentPath.slice(-2, -1)[0];
    const currentPipeline = currentPath.slice(-1)[0];

    const statusValue = currentPipeline === id ? status : data.status;
    const progressValue = currentPipeline === id ? progress : data.progress;

    const isNotRunnableJobs = () => {
        let notRunnable = false;
        data.definition?.graph.forEach(stage => {
            if (stage.value.operation === 'JOB') {
                const job = findByProp(jobs, stage.value.jobId, 'id');
                if (!job.runnable) {
                    notRunnable = true;
                }
            }
        });
        return notRunnable;
    };

    const withWarning = action => () => {
        if (isNotRunnableJobs()) {
            confirmationWindow({
                title: t('main:confirm.titleContinue'),
                body: t('main:validation.pipelineWithEmpyJob'),
                callback: action
            });
        } else {
            action();
        }
    };

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

    const getAction = action => () =>
        action(currentProject, currentPipeline).then(() => {
            getActualJobs(currentProject);
            getActualPipeline(currentProject, currentPipeline);
        });

    const enableViewMode = () =>
        [SUSPENDED, PENDING, RUNNING].includes(data.status) ? false : data.editable;

    const pipelineRefresh = useCallback(() => {
        getActualJobs(currentProject, true);
        getActualPipeline(currentProject, currentPipeline, t, true);
    }, [getActualJobs, getActualPipeline, currentPipeline, currentProject, t]);

    const changesNotSaved = () => dirty || !validStages();

    const closeHistory = () =>
        setPipelineHistory({ ...pipelineHistory, display: false });

    return (
        <>
            <PipelinesStatus loading={loading} value={statusValue} />
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
                    <ControlButtons
                        status={statusValue}
                        runnable={data.runnable && isUpdating !== 'true'}
                        changesNotSaved={changesNotSaved()}
                        run={withWarning(getAction(run))}
                        stop={getAction(stop)}
                        suspend={getAction(suspend)}
                        resume={getAction(resume)}
                    />
                )}
                {enableViewMode() && (
                    <IconButton
                        aria-label="saveIcon"
                        disabled={!dirtyGraph}
                        onClick={createUpdatePipeline}
                    >
                        <Tooltip title={t('jobs:tooltip.Save')} arrow>
                            <Save />
                        </Tooltip>
                    </IconButton>
                )}
                {data.runnable && (
                    <CronButton
                        changesNotSaved={changesNotSaved()}
                        pipeline={data}
                        refresh={pipelineRefresh}
                        projectId={currentProject}
                    />
                )}

                {UnitConfig.PIPELINE.HISTORY && window.PLATFORM !== DATABRICKS && (
                    <>
                        <IconButton
                            onClick={() =>
                                setPipelineHistory({
                                    data: { ...data, id: currentPipeline },
                                    display: true
                                })
                            }
                        >
                            <Tooltip title={t('jobs:tooltip.History')} arrow>
                                <HistoryOutlined />
                            </Tooltip>
                        </IconButton>
                        <HistoryPanel
                            type="pipeline"
                            projectId={currentProject}
                            data={pipelineHistory.data}
                            display={pipelineHistory.display}
                            onClose={closeHistory}
                        />
                    </>
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
                status={statusValue}
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
    suspend: PropTypes.func,
    resume: PropTypes.func,
    pipelineStatus: PropTypes.object,
    reversible: PropTypes.object,
    getActualPipeline: PropTypes.func,
    getActualJobs: PropTypes.func,
    dirty: PropTypes.bool,
    undoButtonsDisabling: PropTypes.object,
    jobs: PropTypes.array,
    params: PropTypes.array,
    setCurrentCell: PropTypes.func,
    dirtyGraph: PropTypes.bool,
    confirmationWindow: PropTypes.func,
    isUpdating: PropTypes.string
};

const mapStateToProps = state => ({
    pipelineStatus: state.pipelineStatus,
    dirtyGraph: state.mxGraph.dirty,
    dirty:
        state.mxGraph.dirty ||
        state.mxGraph.graphWithParamsIsDirty ||
        state.mxGraph.paramsIsDirty ||
        state.mxGraph.sidePanelIsDirty,
    jobs: state.pages.jobs.data.jobs,
    params: state.pages.settingsParameters.params,
    isUpdating: state.pages.settingsBasic?.project?.isUpdating
});

const mapDispatchToProps = {
    create: createPipeline,
    update: updatePipeline,
    run: runPipelineAndRefreshIt,
    stop: stopPipelineAndRefreshIt,
    suspend: suspendPipeline,
    resume: resumePipeline,
    getActualPipeline: fetchPipelineById,
    getActualJobs: fetchJobs,
    confirmationWindow: toggleConfirmationWindow
};

export default connect(mapStateToProps, mapDispatchToProps)(PipelinesToolbar);
