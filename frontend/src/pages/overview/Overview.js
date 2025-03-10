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
import { Box, Grid, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';
import JobsStats from './jobs-stats';
import PipelinesStats from './pipeline-stats';
import Utilization from './utilization';
import { fetchResourceUtilization } from '../../redux/actions/overviewActions';
import { setPipelinesStatus } from '../../redux/actions/pipelinesActions';
import { setJobsStatus } from '../../redux/actions/jobsActions';
import { setCurrentTablePage } from '../../redux/actions/enhancedTableActions';
import styles from './Overview.Styles';
import { DATABRICKS } from '../../mxgraph/constants';

export const Overview = ({
    projectId,
    overview: { data, loading },
    getResourceUtilization,
    setStatusPiplines,
    setStatusJobs,
    setCurrentPage
}) => {
    const { name, description } = data;
    React.useEffect(() => {
        projectId && getResourceUtilization(projectId);
    }, [projectId, getResourceUtilization]);

    const classes = styles();

    return (
        <Box p={4}>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography className={classes.header} variant="h4" paragraph>
                        {loading ? <Skeleton /> : name}
                    </Typography>
                    <Box mb={-2}>
                        <Typography variant="body1" color="textSecondary">
                            {loading ? <Skeleton /> : description}
                        </Typography>
                    </Box>
                </Grid>
                <JobsStats
                    loading={loading}
                    data={data}
                    setStatus={setStatusJobs}
                    setCurrentPage={setCurrentPage}
                />
                <PipelinesStats
                    loading={loading}
                    data={data}
                    setStatus={setStatusPiplines}
                    setCurrentPage={setCurrentPage}
                />
                {window.PLATFORM !== DATABRICKS && (
                    <Utilization loading={loading} data={data} />
                )}
            </Grid>
        </Box>
    );
};

const mapStateToProps = state => ({
    overview: state.pages.overview
});

const mapDispatchToProps = {
    getResourceUtilization: fetchResourceUtilization,
    setStatusPiplines: setPipelinesStatus,
    setStatusJobs: setJobsStatus,
    setCurrentPage: setCurrentTablePage
};

Overview.propTypes = {
    projectId: PropTypes.string,
    overview: PropTypes.object,
    getResourceUtilization: PropTypes.func,
    setStatusPiplines: PropTypes.func,
    setStatusJobs: PropTypes.func,
    setCurrentPage: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
