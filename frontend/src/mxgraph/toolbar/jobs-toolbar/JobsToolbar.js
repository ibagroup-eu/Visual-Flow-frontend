/* eslint-disable complexity */
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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { has } from 'lodash';
import Skeleton from '@material-ui/lab/Skeleton';
import { IconButton, Divider, Typography, Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Description, Save, HistoryOutlined } from '@material-ui/icons';
import HistoryPanel from '../../../components/history-panel/HistoryPanel';
import useStyles from './JobsToolbar.Styles';
import {
    stopJob,
    runJobAndRefreshIt,
    stopJobAndRefreshIt,
    updateJob
} from '../../../redux/actions/jobsActions';
import fetchJobStatus from '../../../redux/actions/oneJobStatusAction';
import Status from '../../../components/status';
import history from '../../../utils/history';
import RunStopButtons from '../run-stop-buttons';
import EditDesignerButtons from '../edit-designer-buttons';
import DebugRunButtons from '../debug-run-buttons';
import InteractiveModeToggle from '../interactive-mode-toggle';
import {
    fetchJob,
    fetchJobMetadata,
    interactiveSessionEvent
} from '../../../redux/actions/mxGraphActions';
import {
    DATABRICKS,
    DEBUGGING,
    DRAFT,
    PENDING,
    RUN_ALL_EVENT,
    RUN_FAILED_EVENT,
    RUNNING,
    SUSPENDED
} from '../../constants';
import UnitConfig from '../../../unitConfig';

export const JobsToolbar = ({
    graph,
    reversible,
    data,
    runAndRefresh,
    stop,
    stopAndRefresh,
    getStatus,
    getActualJob,
    storeStatus: { loading, status, id },
    update,
    setSidePanel,
    sidePanelIsOpen,
    setDirty,
    setShowModal,
    dirty,
    dirtyGraph,
    undoButtonsDisabling,
    isUpdating,
    interactiveMode,
    toggleInteractiveMode,
    getJobMetadata,
    runId,
    jobStagesData,
    sendInteractiveEvent
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const currentPath = history.location.pathname.split('/');
    const currentProject = currentPath.slice(-2, -1)[0];
    const currentJob = currentPath.slice(-1)[0];

    const stats = currentJob === id ? status : data.status;
    const [jobHistory, setJobHistory] = useState({ data: {} });

    const updateJobHandler = () => update(graph, currentProject, currentJob, data);

    const runAndUpdate = () =>
        runAndRefresh(currentProject, currentJob).then(() => {
            getActualJob(currentProject, currentJob);
        });

    const enableViewMode = () =>
        !interactiveMode && [SUSPENDED, PENDING, RUNNING].includes(status)
            ? false
            : data.editable;

    const closeHistory = () => setJobHistory({ ...jobHistory, display: false });

    const failedStages =
        jobStagesData?.filter(stage => stage.status === 'failed') || [];
    const hasFailedStages = failedStages.length > 0;

    const handleDebug = () => {
        if (hasFailedStages) {
            sendInteractiveEvent(currentProject, currentJob, runId, {
                session: runId,
                command: RUN_FAILED_EVENT,
                id: failedStages.map(stage => stage.id)
            });
        }
    };

    const handleRunAll = () => {
        sendInteractiveEvent(currentProject, currentJob, runId, {
            session: runId,
            command: RUN_ALL_EVENT,
            id: []
        });
    };

    const displayedStatus = interactiveMode && stats === RUNNING ? DEBUGGING : stats;

    return (
        <>
            <div className={classes.status}>
                <Typography variant="body2" color="textSecondary">
                    {t('jobs:Status')}:
                </Typography>
                &nbsp;
                {loading ? (
                    <Skeleton variant="circle" width={90} height={25} />
                ) : (
                    <Status value={displayedStatus} />
                )}
            </div>
            <Divider orientation="vertical" flexItem />
            <div className={classes.buttons}>
                {data.runnable &&
                    (interactiveMode ? (
                        <DebugRunButtons
                            hasFailedStages={hasFailedStages}
                            isRunnable={data.runnable}
                            onDebug={handleDebug}
                            onRunAll={handleRunAll}
                        />
                    ) : (
                        <RunStopButtons
                            isNotRunning={![RUNNING, PENDING].includes(stats)}
                            runnable={data.runnable && isUpdating !== 'true'}
                            stopable
                            changesNotSaved={dirty}
                            run={runAndUpdate}
                            stop={() => stopAndRefresh(currentProject, currentJob)}
                        />
                    ))}
                {enableViewMode() && (
                    <IconButton
                        aria-label="saveIcon"
                        disabled={!dirtyGraph}
                        onClick={updateJobHandler}
                    >
                        <Tooltip title={t('jobs:tooltip.Save')} arrow>
                            <Save />
                        </Tooltip>
                    </IconButton>
                )}
                <IconButton
                    disabled={[DRAFT, PENDING].includes(status) || !data.startedAt}
                    aria-label="descriptionIcon"
                    onClick={() => setShowModal(true)}
                >
                    <Tooltip title={t('jobs:tooltip.Logs')} arrow>
                        <Description />
                    </Tooltip>
                </IconButton>
                {UnitConfig.JOB.HISTORY && (
                    <>
                        <IconButton
                            onClick={() =>
                                setJobHistory({
                                    data: { ...data, id: currentJob },
                                    display: true
                                })
                            }
                        >
                            <Tooltip title={t('jobs:tooltip.History')} arrow>
                                <HistoryOutlined />
                            </Tooltip>
                        </IconButton>
                        <HistoryPanel
                            projectId={currentProject}
                            data={jobHistory.data}
                            display={jobHistory.display}
                            onClose={closeHistory}
                        />
                    </>
                )}
                {data.runnable && window.PLATFORM !== DATABRICKS && (
                    <InteractiveModeToggle
                        interactiveMode={interactiveMode}
                        toggleInteractiveMode={toggleInteractiveMode}
                        currentProject={currentProject}
                        currentJob={currentJob}
                        runId={runId}
                        getJobMetadata={getJobMetadata}
                        run={runAndRefresh}
                        stop={stop}
                        //ableToEdit={![RUNNING, PENDING].includes(stats)}
                    />
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
                refresh={() => getStatus(currentProject, currentJob)}
                undoButtonsDisabling={undoButtonsDisabling}
                status={stats}
            />
        </>
    );
};

JobsToolbar.propTypes = {
    setShowModal: PropTypes.func,
    setSidePanel: PropTypes.func,
    sidePanelIsOpen: PropTypes.bool,
    setDirty: PropTypes.func,
    graph: PropTypes.object,
    data: PropTypes.object,
    update: PropTypes.func,
    stop: PropTypes.func,
    runAndRefresh: PropTypes.func,
    stopAndRefresh: PropTypes.func,
    getStatus: PropTypes.func,
    storeStatus: PropTypes.object,
    reversible: PropTypes.object,
    getActualJob: PropTypes.func,
    dirty: PropTypes.bool,
    undoButtonsDisabling: PropTypes.object,
    dirtyGraph: PropTypes.bool,
    isUpdating: PropTypes.string,
    interactiveMode: PropTypes.bool,
    toggleInteractiveMode: PropTypes.func,
    getJobMetadata: PropTypes.func,
    runId: PropTypes.string,
    jobStagesData: PropTypes.array,
    sendInteractiveEvent: PropTypes.func
};

const mapStateToProps = state => ({
    storeStatus: state.jobStatus,
    dirtyGraph: state.mxGraph.dirty,
    dirty:
        state.mxGraph.dirty ||
        state.mxGraph.graphWithParamsIsDirty ||
        state.mxGraph.paramsIsDirty ||
        state.mxGraph.sidePanelIsDirty,
    isUpdating: state.pages.settingsBasic?.project?.isUpdating,
    interactiveMode: state.mxGraph.interactive.interactiveMode,
    runId: state.pages.jobs.runId,
    jobStagesData: state.mxGraph.interactive.data
});

const mapDispatchToProps = {
    update: updateJob,
    stop: stopJob,
    runAndRefresh: runJobAndRefreshIt,
    stopAndRefresh: stopJobAndRefreshIt,
    getStatus: fetchJobStatus,
    getActualJob: fetchJob,
    getJobMetadata: fetchJobMetadata,
    sendInteractiveEvent: interactiveSessionEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(JobsToolbar);
