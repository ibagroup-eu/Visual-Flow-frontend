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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import useStyles from './Basic.Styles';
import AddProjectForm from '../../../components/project-form';
import { getProject } from '../../../redux/actions/settingsActions';
import { PageSkeleton } from '../../../components/skeleton';

const Basic = ({ project, projectId, loading, getProject: getProjectById }) => {
    const classes = useStyles();
    React.useEffect(() => {
        if (projectId) {
            getProjectById(projectId);
        }
    }, [projectId]);

    return loading ? (
        <PageSkeleton />
    ) : (
        <Grid container>
            <Grid item xs={3} />
            <Grid item xs={6} className={classes.root}>
                <AddProjectForm project={project} />
            </Grid>
            <Grid item xs={3} />
        </Grid>
    );
};

Basic.propTypes = {
    project: PropTypes.object,
    getProject: PropTypes.func,
    projectId: PropTypes.string,
    loading: PropTypes.bool
};

const mapStateToProps = state => ({
    project: state.pages.settingsBasic.project,
    loading: state.pages.settingsBasic.loading,
    projectId: state.projects.currentProject
});

const mapDispatchToProps = {
    getProject
};

export default connect(mapStateToProps, mapDispatchToProps)(Basic);
