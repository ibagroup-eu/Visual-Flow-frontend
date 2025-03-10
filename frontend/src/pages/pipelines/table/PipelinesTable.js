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

import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import EventIcon from '@material-ui/icons/Event';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import StopIcon from '@material-ui/icons/Stop';
import PaletteOutlinedIcon from '@material-ui/icons/PaletteOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import ExportIcon from '@material-ui/icons/Publish';
import PauseTwoToneIcon from '@material-ui/icons/PauseTwoTone';
import PlayArrowTwoToneIcon from '@material-ui/icons/PlayArrowTwoTone';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { HistoryOutlined } from '@material-ui/icons';
import { isEqual } from 'lodash';
import PipelineTitleCell from '../cells/PipelineTitleCell';
import DividerCell from '../../../components/table/cells/divider-cell';
import PipelineStatusCell from '../cells/PipelineStatusCell';
import PipelineUtilizationCell from '../cells/PipelineUtilizationCell';
import ActionsCell from '../../../components/table/cells/action-cell';
import EnhancedTable from '../../../components/table/enhanced-table';
import toggleConfirmationWindow from '../../../redux/actions/modalsActions';
import { setCurrentTablePage } from '../../../redux/actions/enhancedTableActions';
import {
    copyPipeline,
    deletePipeline,
    resumePipeline,
    runPipeline,
    setPipelinesLastRun,
    setPipelinesStatus,
    stopPipeline,
    suspendPipeline
} from '../../../redux/actions/pipelinesActions';
import withStyles from './PipelinesTable.Styles';
import timeRange from '../../../utils/timeRangeOptions';
import DropdownFilter from '../../../components/table/dropdown-filter';
import history from '../../../utils/history';
import ExportModalWindow from '../../../components/export-modal-window';
import {
    DATABRICKS,
    PENDING,
    PIPELINE_STATUSES,
    RUNNING,
    SUSPENDED
} from '../../../mxgraph/constants';
import {
    joinDataNames,
    removeHandler,
    runWithValidation
} from '../../../components/helpers/JobsPipelinesTable';
import CronModal from '../../../components/cron-modal';
import withPagination from '../../../routes/withPagination';
import { filterData } from '../../jobs/table/JobsTable';
import HistoryPanel from '../../../components/history-panel/HistoryPanel';
import { fetchPipelineById } from '../../../redux/actions/mxGraphActions';
import UnitConfig from '../../../unitConfig';

const utilizationField = (t, lastRun, onChange, classname) => (
    <Grid item className={classname}>
        <DropdownFilter
            items={Object.keys(timeRange).map(value => ({
                value,
                label: t(`filters:timeRange.${value}`) || value
            }))}
            label={t('filters:lastRun')}
            value={lastRun}
            onChange={onChange}
        />
    </Grid>
);

const PipelinesTable = ({
    ableToEdit,
    disabled,
    projectId,
    data,
    remove,
    confirmationWindow,
    run,
    stop,
    copy,
    suspend,
    resume,
    lastRun,
    setLastRun,
    status,
    setStatus,
    setCurrentPage,
    currentPage,
    rowsPerPage,
    jobs,
    params,
    resetTags,
    onCheckTags,
    checkedTags,
    getPipeline,
    pipelineData,
    isUpdating
}) => {
    const { t } = useTranslation();
    const classes = withStyles();
    const [showModal, setShowModal] = React.useState(false);
    const [cronPipeline, setCronPipeline] = React.useState({
        pipelineId: '',
        cronExists: false
    });
    const [selectedPipelines, setSelectedPipelines] = React.useState([]);
    const [pipelineHistory, setPipelineHistory] = React.useState({ data: {} });

    useEffect(() => {
        setPipelineHistory(prev => {
            if (!isEqual(prev, {}) && pipelineData?.definition) {
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        definition: pipelineData.definition
                    }
                };
            }
            return prev;
        });
    }, [pipelineData?.definition]);

    const getActions = item =>
        [
            ![RUNNING, PENDING, SUSPENDED].includes(item.status)
                ? {
                      title: t('pipelines:tooltip.Play'),
                      Icon: PlayArrowTwoToneIcon,
                      disabled: !item.runnable || isUpdating === 'true',
                      onClick: async () => {
                          await runWithValidation(
                              projectId,
                              item.id,
                              { dataJobs: jobs, dataParams: params },
                              run,
                              t('main:validation.pipelineWithoutJobParams'),
                              () =>
                                  confirmationWindow({
                                      title: t('main:confirm.titleContinue'),
                                      body: t('main:validation.pipelineWithEmpyJob'),
                                      callback: () => run(projectId, item.id)
                                  })
                          );
                      }
                  }
                : {
                      title: t('pipelines:tooltip.Stop'),
                      Icon: StopIcon,
                      disabled: !item.runnable || item.status === PENDING,
                      onClick: () => {
                          stop(projectId, item.id);
                      }
                  },
            {
                title: t('pipelines:tooltip.Suspend'),
                Icon: PauseTwoToneIcon,
                onClick: () => {
                    suspend(projectId, item.id);
                },
                visible: item.status === RUNNING,
                disabled: window.PLATFORM === DATABRICKS
            },
            {
                title: t('pipelines:tooltip.Resume'),
                Icon: PlayArrowOutlinedIcon,
                onClick: () => {
                    resume(projectId, item.id);
                },
                visible: item.status === SUSPENDED
            },
            {
                title: t('pipelines:tooltip.pipelineDesigner'),
                Icon: PaletteOutlinedIcon,
                onClick: () => history.push(`/pipelines/${projectId}/${item.id}`),
                visible: true
            },
            {
                title: t('pipelines:tooltip.Scheduling'),
                Icon: item.cron && !item.cronSuspend ? EventIcon : CalendarTodayIcon,
                disabled: !item.runnable,
                onClick: () =>
                    setCronPipeline({ pipelineId: item.id, cronExists: item.cron }),
                visible: !!item.runnable
            },
            window.PLATFORM !== DATABRICKS && {
                title: t('pipelines:tooltip.History'),
                Icon: HistoryOutlined,
                visible: UnitConfig.PIPELINE.HISTORY,
                onClick: () => {
                    setPipelineHistory({ data: item, display: true });
                    getPipeline(projectId, item.id);
                }
            },
            {
                title: t('pipelines:tooltip.Copy'),
                Icon: FileCopyOutlinedIcon,
                disabled,
                onClick: () => copy(projectId, item.id)
            },

            {
                title: t('pipelines:tooltip.Remove'),
                Icon: DeleteOutlinedIcon,
                onClick: () =>
                    confirmationWindow({
                        body: t('pipelines:confirm.delete', { name: item.name }),
                        callback: () => {
                            removeHandler(
                                projectId,
                                [item.id],
                                data.length,
                                { rowsPerPage, currentPage },
                                remove,
                                setCurrentPage
                            );
                        }
                    })
            }
        ].filter(action => action.visible !== false && action !== false);

    const getGlobalActions = () => [
        {
            title: t('pipelines:tooltip.Remove selected'),
            Icon: DeleteIcon,
            onClick: selected => {
                const pipId = selected.map(item => item.id);
                confirmationWindow({
                    body: t('pipelines:confirm.delete', {
                        name: joinDataNames(pipId, data)
                    }),
                    callback: () => {
                        removeHandler(
                            projectId,
                            pipId,
                            data.length,
                            { rowsPerPage, currentPage },
                            remove,
                            setCurrentPage
                        );
                    }
                });
            }
        },
        {
            title: t('jobs:tooltip.Export selected'),
            Icon: ExportIcon,
            onClick: selected => {
                const pipId = selected.map(item => item.id);
                setShowModal(true);
                setSelectedPipelines(pipId);
            }
        }
    ];

    const withRunAction = act =>
        act.runnable
            ? getActions(act)
                  .slice(0, 1)
                  .concat(getActions(act).filter(action => action.visible))
            : getActions(act).filter(action => action.visible);

    const closeCronModal = () =>
        setCronPipeline({ pipelineId: '', cronExists: false });

    const closeHistory = () =>
        setPipelineHistory({ ...pipelineHistory, display: false });

    return (
        <>
            {UnitConfig.PIPELINE.HISTORY && (
                <HistoryPanel
                    type="pipeline"
                    data={pipelineHistory.data}
                    display={pipelineHistory.display}
                    onClose={closeHistory}
                    projectId={projectId}
                />
            )}
            <CronModal
                cronPipeline={cronPipeline}
                onClose={closeCronModal}
                projectId={projectId}
            />
            <EnhancedTable
                data={filterData(data, status, lastRun)}
                actions={
                    ableToEdit ? getGlobalActions() : getGlobalActions().slice(-1)
                }
                orderColumns={[
                    { id: 'name', name: t('main:form.Name') },
                    { id: 'startedAt', name: t('filters:lastRun') },
                    { id: 'lastModified', name: t('filters:lastEdit') },
                    { id: 'status', name: t('filters:status') }
                ]}
                tagsData={checkedTags}
                resetTags={resetTags}
                onCheckTags={onCheckTags}
                filter={
                    <>
                        <ExportModalWindow
                            showModal={showModal}
                            tableData={data}
                            isPipelineModal
                            display={showModal}
                            projectId={projectId}
                            selectedPipelines={selectedPipelines}
                            onClose={() => setShowModal(false)}
                        />
                        <Grid item className={classes.status}>
                            <DropdownFilter
                                items={PIPELINE_STATUSES.map(value => ({
                                    value,
                                    label: t(`filters:statuses.${value}`) || value
                                }))}
                                label={t('filters:status')}
                                value={status}
                                onChange={event => {
                                    setStatus(event.target.value);
                                    setCurrentPage(0);
                                }}
                            />
                        </Grid>
                        {utilizationField(
                            t,
                            lastRun,
                            event => {
                                setLastRun(event.target.value);
                                setCurrentPage(0);
                            },
                            classes.utilization
                        )}
                    </>
                }
            >
                {({ item, checked, onClick }) => (
                    <>
                        <PipelineTitleCell
                            checked={checked}
                            onClick={onClick}
                            title={item.name}
                            cron={item.cron}
                            lastRun={item.startedAt}
                            lastFinished={item.finishedAt}
                            lastEdit={item.lastModified}
                            tags={item.tags}
                            resetTags={resetTags}
                            onCheckTags={onCheckTags}
                            checkedTags={checkedTags}
                        />

                        <DividerCell />

                        <PipelineStatusCell
                            showRerun={ableToEdit && item.runnable}
                            classes={{ cell: classes.status }}
                            status={item.status}
                            projectId={projectId}
                            pipelineId={item.id}
                        />

                        <DividerCell />

                        <PipelineUtilizationCell
                            classes={{ cell: classes.utilization }}
                            status={item.status}
                            progress={item.progress}
                        />
                        <DividerCell />
                        <ActionsCell
                            actions={
                                ableToEdit ? getActions(item) : withRunAction(item)
                            }
                        />
                    </>
                )}
            </EnhancedTable>
        </>
    );
};

PipelinesTable.propTypes = {
    data: PropTypes.array,
    ableToEdit: PropTypes.bool,
    disabled: PropTypes.bool,
    projectId: PropTypes.string,
    remove: PropTypes.func,
    run: PropTypes.func,
    stop: PropTypes.func,
    copy: PropTypes.func,
    suspend: PropTypes.func,
    resume: PropTypes.func,
    lastRun: PropTypes.string,
    setLastRun: PropTypes.func,
    status: PropTypes.string,
    setStatus: PropTypes.func,
    confirmationWindow: PropTypes.func,
    setCurrentPage: PropTypes.func,
    currentPage: PropTypes.number,
    rowsPerPage: PropTypes.number,
    jobs: PropTypes.array,
    params: PropTypes.array,
    resetTags: PropTypes.func,
    onCheckTags: PropTypes.func,
    checkedTags: PropTypes.object,
    getPipeline: PropTypes.func,
    pipelineData: PropTypes.object,
    isUpdating: PropTypes.string
};

const mapStateToProps = state => ({
    lastRun: state.pages.pipelines.lastRun,
    status: state.pages.pipelines.status,
    currentPage: state.enhancedTable.page,
    rowsPerPage: state.enhancedTable.rowsPerPage,
    pipelineData: state.mxGraph.data,
    isUpdating: state.pages.settingsBasic?.project?.isUpdating
});

const mapDispatchToProps = {
    run: runPipeline,
    stop: stopPipeline,
    remove: deletePipeline,
    copy: copyPipeline,
    suspend: suspendPipeline,
    resume: resumePipeline,
    setLastRun: setPipelinesLastRun,
    setStatus: setPipelinesStatus,
    setCurrentPage: setCurrentTablePage,
    confirmationWindow: toggleConfirmationWindow,
    getPipeline: fetchPipelineById
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withPagination(PipelinesTable));
