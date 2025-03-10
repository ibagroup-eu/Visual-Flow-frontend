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
import { Grid } from '@material-ui/core';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import StopOutlinedIcon from '@material-ui/icons/StopOutlined';
import PaletteOutlinedIcon from '@material-ui/icons/PaletteOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import ExportIcon from '@material-ui/icons/Publish';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { HistoryOutlined } from '@material-ui/icons';
import TitleCell from '../../../components/table/cells/title-cell';
import DividerCell from '../../../components/table/cells/divider-cell';
import StatusCell from '../../../components/table/cells/status-cell';
import UtilizationCell from '../../../components/table/cells/utilization-cell';
import ActionsCell from '../../../components/table/cells/action-cell';
import EnhancedTable from '../../../components/table/enhanced-table';
import toggleConfirmationWindow from '../../../redux/actions/modalsActions';
import { DRAFT, JOB_STATUSES, PENDING, RUNNING } from '../../../mxgraph/constants';
import {
    deleteJob,
    runJob,
    stopJob,
    copyJob,
    setJobsLastRun,
    setJobsStatus
} from '../../../redux/actions/jobsActions';
import { setCurrentTablePage } from '../../../redux/actions/enhancedTableActions';
import withStyles from './JobsTable.Styles';
import timeRange from '../../../utils/timeRangeOptions';
import DropdownFilter from '../../../components/table/dropdown-filter';
import history from '../../../utils/history';
import ExportModalWindow from '../../../components/export-modal-window';
import { DATE_FORMAT } from '../../../globalConstants';
import {
    removeHandler,
    jobDesignerHendler,
    joinDataNames
} from '../../../components/helpers/JobsPipelinesTable';
import withPagination from '../../../routes/withPagination';
import HistoryPanel from '../../../components/history-panel/HistoryPanel';
import UnitConfig from '../../../unitConfig';

const withRunAction = (act, getActions) =>
    act.runnable ? getActions(act).slice(0, 3) : getActions(act).slice(1, 3);

export const filterData = (data, status, lastRun) =>
    data?.filter(item => {
        const itemStatus = !status || item.status === status;
        const itemLastRun =
            !timeRange[lastRun] ||
            (item.startedAt &&
                timeRange[lastRun](
                    moment(item.startedAt, DATE_FORMAT).format(DATE_FORMAT)
                ));
        return itemStatus && itemLastRun;
    });

const JobsTable = ({
    projectId,
    data,
    pipelines,
    remove,
    confirmationWindow,
    run,
    stop,
    copy,
    disabled,
    ableToEdit,
    lastRun,
    setLastRun,
    status,
    setStatus,
    setCurrentPage,
    currentPage,
    rowsPerPage,
    checkedTags,
    onCheckTags,
    resetTags,
    isUpdating
}) => {
    const { t } = useTranslation();
    const classes = withStyles();
    const [showModal, setShowModal] = React.useState(false);
    const [selectedJobs, setSelectedJobs] = React.useState([]);
    const [jobHistory, setJobHistory] = React.useState({ data: {} });

    const projId = projectId;
    const resolveStatus = value => ({
        value,
        label: t(`filters:statuses.${value}`) || value
    });

    const statuses = JOB_STATUSES.map(resolveStatus);

    const getGlobalActions = items => [
        {
            title: items?.some(item => item.pipelineInstances?.length !== 0)
                ? t('jobs:tooltip.Disable remove')
                : t('jobs:tooltip.Remove selected'),
            Icon: DeleteIcon,
            disabled: items?.some(item => item.pipelineInstances?.length !== 0),
            onClick: selected => {
                const jobId = selected.map(item => item.id);
                confirmationWindow({
                    body: t('jobs:confirm.delete', {
                        name: joinDataNames(jobId, data)
                    }),
                    callback: () => {
                        removeHandler(
                            projectId,
                            jobId,
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
                const jobId = selected.map(item => item.id);
                setShowModal(true);
                setSelectedJobs(jobId);
            }
        }
    ];

    const getPipelineInstanceStatus = item =>
        !item.runnable ? `&status=${item.status}` : '';

    const getActions = item => [
        ![RUNNING, PENDING].includes(item.status)
            ? {
                  title: t('jobs:tooltip.Play'),
                  Icon: PlayArrowOutlinedIcon,
                  disabled: !item.runnable || isUpdating === 'true',
                  onClick: () => run(projectId, item.id)
              }
            : {
                  title: t('jobs:tooltip.Stop'),
                  Icon: StopOutlinedIcon,
                  disabled: !!item.pipelineId,
                  onClick: () => stop(projectId, item.id)
              },
        {
            title: t('jobs:tooltip.jobDesigner'),
            Icon: PaletteOutlinedIcon,
            onClick: () => {
                jobDesignerHendler(projectId, item, data, history);
            }
        },
        {
            title: t('jobs:tooltip.Logs'),
            Icon: DescriptionOutlinedIcon,
            disabled: [DRAFT, PENDING].includes(item.status) || !item.startedAt,
            onClick: () =>
                history.push(
                    `/jobs/${item.id}/logs/${projId}/?backTo=jobsTable&jobName=${
                        item.name
                    }${getPipelineInstanceStatus(item)}`
                )
        },
        {
            title: t('jobs:tooltip.Copy'),
            Icon: FileCopyOutlinedIcon,
            disabled: disabled || !!item.pipelineId,
            onClick: () => copy(projectId, item.id)
        },
        {
            title: t('jobs:tooltip.History'),
            Icon: HistoryOutlined,
            disabled: !!item.pipelineId,
            onClick: () => setJobHistory({ data: item, display: true })
        },
        {
            title: t('jobs:tooltip.Remove'),
            Icon: DeleteOutlinedIcon,
            disabled: item.pipelineInstances?.length !== 0,
            onClick: () =>
                confirmationWindow({
                    body: t('jobs:confirm.delete', { name: item.name }),
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
    ];

    const closeHistory = () => setJobHistory({ ...jobHistory, display: false });

    return (
        <>
            {UnitConfig.JOB.HISTORY && (
                <HistoryPanel
                    data={jobHistory.data}
                    display={jobHistory.display}
                    onClose={closeHistory}
                    projectId={projectId}
                />
            )}
            <EnhancedTable
                data={filterData(data, status, lastRun)}
                actions={
                    ableToEdit ? getGlobalActions : getGlobalActions().slice(-1)
                }
                orderColumns={[
                    { id: 'name', name: t('main:form.Name') },
                    { id: 'startedAt', name: t('filters:lastRun') },
                    { id: 'lastModified', name: t('filters:lastEdit') },
                    { id: 'status', name: t('filters:status') }
                ]}
                tagsData={checkedTags}
                onCheckTags={onCheckTags}
                resetTags={resetTags}
                filter={
                    <>
                        <ExportModalWindow
                            showModal={showModal}
                            tableData={data}
                            display={showModal}
                            projectId={projectId}
                            selectedJobs={selectedJobs}
                            onClose={() => setShowModal(false)}
                        />
                        <Grid item className={classes.status}>
                            <DropdownFilter
                                items={statuses}
                                label={t('filters:status')}
                                value={status}
                                onChange={event => {
                                    setStatus(event.target.value);
                                    setCurrentPage(0);
                                }}
                            />
                        </Grid>
                        <Grid item className={classes.utilization}>
                            <DropdownFilter
                                items={Object.keys(timeRange).map(value => ({
                                    value,
                                    label: t(`filters:timeRange.${value}`) || value
                                }))}
                                label={t('filters:lastRun')}
                                value={lastRun}
                                onChange={event => {
                                    setLastRun(event.target.value);
                                    setCurrentPage(0);
                                }}
                            />
                        </Grid>
                    </>
                }
            >
                {({ item, checked, onClick }) => (
                    <>
                        <TitleCell
                            hasInstance={item.pipelineId !== null}
                            checked={checked}
                            onClick={onClick}
                            title={item.name}
                            pipelineId={item.pipelineId}
                            pipelines={pipelines}
                            lastRun={item.startedAt}
                            lastFinished={item.finishedAt}
                            lastEdit={item.lastModified}
                            tags={item.tags}
                            checkedTags={checkedTags}
                            onCheckTags={onCheckTags}
                        />

                        <DividerCell />

                        <StatusCell
                            classes={{ cell: classes.status }}
                            status={item.status}
                        />

                        <DividerCell />

                        <UtilizationCell
                            classes={{ cell: classes.utilization }}
                            cpu={item.usage?.cpu}
                            memory={item.usage?.memory}
                        />
                        <DividerCell />
                        <ActionsCell
                            actions={
                                ableToEdit
                                    ? getActions(item)
                                    : withRunAction(item, getActions).concat(
                                          getActions(item)[4]
                                      )
                            }
                        />
                    </>
                )}
            </EnhancedTable>
        </>
    );
};

JobsTable.propTypes = {
    data: PropTypes.array,
    pipelines: PropTypes.array,
    projectId: PropTypes.string,
    remove: PropTypes.func,
    run: PropTypes.func,
    stop: PropTypes.func,
    copy: PropTypes.func,
    lastRun: PropTypes.string,
    setLastRun: PropTypes.func,
    status: PropTypes.string,
    setStatus: PropTypes.func,
    confirmationWindow: PropTypes.func,
    ableToEdit: PropTypes.bool,
    disabled: PropTypes.bool,
    setCurrentPage: PropTypes.func,
    currentPage: PropTypes.number,
    rowsPerPage: PropTypes.number,
    checkedTags: PropTypes.object,
    onCheckTags: PropTypes.func,
    resetTags: PropTypes.func,
    isUpdating: PropTypes.string
};

const mapStateToProps = state => ({
    lastRun: state.pages.jobs.lastRun,
    status: state.pages.jobs.status,
    currentPage: state.enhancedTable.page,
    rowsPerPage: state.enhancedTable.rowsPerPage,
    isUpdating: state.pages.settingsBasic?.project?.isUpdating
});

const mapDispatchToProps = {
    run: runJob,
    stop: stopJob,
    remove: deleteJob,
    copy: copyJob,
    setLastRun: setJobsLastRun,
    setStatus: setJobsStatus,
    setCurrentPage: setCurrentTablePage,
    confirmationWindow: toggleConfirmationWindow
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withPagination(JobsTable));
