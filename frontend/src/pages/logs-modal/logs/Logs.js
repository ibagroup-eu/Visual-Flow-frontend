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
import { Box, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    fetchContainerLogs,
    fetchJobHistoryLogs,
    fetchJobLogs
} from '../../../redux/actions/logsActions';
import LogsList from '../logs-list';
import LogsPageHeader from '../../../components/logs-page-header';
import history from '../../../utils/history';
import { PENDING, RUNNING } from '../../../mxgraph/constants';
import fetchJobStatus from '../../../redux/actions/oneJobStatusAction';

export const Logs = ({
    projId,
    jobId,
    logs: { data, loading, error },
    getJobLogs,
    getContainerLogs,
    getJobHistoryLogs,
    modal,
    pipelineId,
    nodeId,
    logId,
    query,
    getJob,
    jobStatus,
    jobsStatuses,
    status: initialStatus
}) => {
    const [search, setSearch] = React.useState('');
    const [levels, setLevels] = React.useState([]);
    const status =
        initialStatus || new URLSearchParams(history.location.search).get('status');

    const sameJob = jobId && jobStatus.id === jobId;

    React.useEffect(() => {
        if (jobId && !logId && projId && !status) {
            getJob(projId, jobId, true);
        }
    }, [projId, jobId, jobStatus.id, logId, getJob, status]);

    const callGetLogs = useCallback(() => {
        if (projId) {
            if (jobId && logId) {
                getJobHistoryLogs(projId, jobId, logId);
            } else if (nodeId && pipelineId) {
                getContainerLogs(projId, pipelineId, nodeId);
            } else if (jobId) {
                getJobLogs(projId, jobId);
            }
        }
    }, [
        getContainerLogs,
        getJobHistoryLogs,
        getJobLogs,
        jobId,
        logId,
        nodeId,
        pipelineId,
        projId
    ]);

    React.useEffect(() => {
        callGetLogs();
    }, [nodeId, jobId, callGetLogs]);

    const backTo = new URLSearchParams(history.location.search).get('backTo');
    const jobName = new URLSearchParams(history.location.search).get('jobName');

    const arrowLink = () => {
        switch (backTo) {
            case 'jobsTable':
                return `/${projId}/jobs${query}`;
            case 'JD':
                return `/jobs/${projId}/${jobId}`;
            case undefined:
                return '/';
            // backTo here is just a pipelineId
            default:
                return `/pipelines/${projId}/${backTo}`;
        }
    };

    const isRunning = () => {
        if (status && jobId) {
            return [RUNNING, PENDING].includes(status);
        }

        if (!sameJob) {
            return false;
        }

        const containerRunning = !!(
            nodeId && [RUNNING, PENDING].includes(jobsStatuses?.[nodeId])
        );

        const jobRunning = !!(
            !logId &&
            jobStatus.id === jobId &&
            [RUNNING, PENDING].includes(jobStatus.status)
        );

        const instanceRunning = !!(
            nodeId &&
            jobId &&
            [RUNNING, PENDING].includes(jobsStatuses?.[nodeId])
        );

        return containerRunning || jobRunning || instanceRunning;
    };

    return (
        <Box p={3}>
            <Grid container>
                {!modal && (
                    <Grid item xs={12}>
                        <LogsPageHeader title={jobName} arrowLink={arrowLink()} />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <LogsList
                        data={data}
                        modal={modal}
                        onRefresh={callGetLogs}
                        search={search}
                        onSearch={setSearch}
                        levels={levels}
                        onSelect={setLevels}
                        loading={loading}
                        error={error}
                        isRunning={isRunning()}
                        logId={logId}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

Logs.propTypes = {
    modal: PropTypes.bool,
    projId: PropTypes.string,
    jobId: PropTypes.string,
    pipelineId: PropTypes.string,
    nodeId: PropTypes.string,
    logs: PropTypes.object,
    getJobLogs: PropTypes.func,
    getContainerLogs: PropTypes.func,
    getJobHistoryLogs: PropTypes.func,
    getJob: PropTypes.func,
    query: PropTypes.string,
    logId: PropTypes.string,
    jobStatus: PropTypes.object,
    jobsStatuses: PropTypes.object,
    status: PropTypes.string
};

const mapStateToProps = state => ({
    logs: state.pages.logs,
    query: state.pages.urlSearch.search,
    jobStatus: state.jobStatus,
    jobsStatuses: state.mxGraph.data.jobsStatuses
});

const mapDispatchToProps = {
    getJob: fetchJobStatus,
    getJobLogs: fetchJobLogs,
    getContainerLogs: fetchContainerLogs,
    getJobHistoryLogs: fetchJobHistoryLogs
};

export default connect(mapStateToProps, mapDispatchToProps)(Logs);
