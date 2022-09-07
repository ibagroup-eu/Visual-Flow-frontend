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
import { Box, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';

import {
    fetchJobLogs,
    fetchContainerLogs
} from '../../../redux/actions/logsActions';
import LogsList from '../logs-list';
import LogsPageHeader from '../../../components/logs-page-header';
import history from '../../../utils/history';

export const Logs = ({
    projId,
    jobId,
    logs: { data, loading },
    getJobLogs,
    getContainerLogs,
    modal,
    pipelineId,
    nodeId,
    query
}) => {
    const [search, setSearch] = React.useState('');
    const [levels, setLevels] = React.useState([]);

    const callGetLogs = () =>
        nodeId
            ? getContainerLogs(projId, pipelineId, nodeId)
            : getJobLogs(projId, jobId);

    React.useEffect(() => {
        callGetLogs();
    }, [nodeId, jobId]);

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

    return (
        <Box p={3}>
            <Grid container>
                {!modal && (
                    <Grid item xs={12}>
                        {loading ? (
                            <Skeleton />
                        ) : (
                            <LogsPageHeader
                                title={jobName}
                                arrowLink={arrowLink()}
                            />
                        )}
                    </Grid>
                )}
                <Grid item xs={12}>
                    {loading ? (
                        <Skeleton />
                    ) : (
                        <LogsList
                            data={data}
                            modal={modal}
                            projId={projId}
                            jobId={jobId}
                            onRefresh={callGetLogs}
                            search={search}
                            onSearch={setSearch}
                            levels={levels}
                            onSelect={setLevels}
                        />
                    )}
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
    query: PropTypes.string
};

const mapStateToProps = state => ({
    logs: state.pages.logs,
    query: state.enhancedTable.search
});

const mapDispatchToProps = {
    getJobLogs: fetchJobLogs,
    getContainerLogs: fetchContainerLogs
};

export default connect(mapStateToProps, mapDispatchToProps)(Logs);
