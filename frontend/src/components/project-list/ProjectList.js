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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import history from '../../utils/history';
import { fetchProjects } from '../../redux/actions/projectsActions';
import ProjectCard from '../project-card';
import { ProjectCardSkeleton } from '../project-card/ProjectCard';

export const ProjectList = ({ projects: { data, loading }, getProjects }) => {
    React.useEffect(() => {
        getProjects();
    }, [getProjects]);

    const projectsWithAdd = () =>
        data.editable ? [{}].concat(data?.projects) : data?.projects;

    return (
        <Box p={3}>
            <Grid container align="stretch" direction="row" spacing={3}>
                {(loading ? Array.from(new Array(12)) : projectsWithAdd())?.map(
                    (project, index) => (
                        <Grid
                            item
                            key={project?.id || index}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            xl={2}
                        >
                            {project ? (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    superUser={data.editable}
                                    onClick={() => {
                                        project.id
                                            ? history.push(`/${project.id}/overview`)
                                            : history.push('addProject');
                                    }}
                                />
                            ) : (
                                <ProjectCardSkeleton />
                            )}
                        </Grid>
                    )
                )}
            </Grid>
        </Box>
    );
};

ProjectList.propTypes = {
    projects: PropTypes.object,
    getProjects: PropTypes.func
};

const mapStateToProps = state => ({
    projects: state.projects
});

const mapDispatchToProps = {
    getProjects: fetchProjects
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
