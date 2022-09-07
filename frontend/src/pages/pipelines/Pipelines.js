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
import { useTranslation } from 'react-i18next';

import { fetchPipelines } from '../../redux/actions/pipelinesActions';
import { setCurrentTablePage } from '../../redux/actions/enhancedTableActions';
import PipelinesTable from './table';
import PageHeader from '../../components/page-header';
import history from '../../utils/history';
import { PageSkeleton } from '../../components/skeleton';
import fetchJobs from '../../redux/actions/jobsActions';
import { fetchParameters } from '../../redux/actions/settingsParametersActions';

const Pipelines = ({
    projectId,
    pipelines: { data, loading },
    getPipelines,
    setCurrentPage,
    loadingExport,
    getJobs,
    jobs,
    params,
    getParameters
}) => {
    const { t } = useTranslation();
    const [search, setSearch] = React.useState('');
    const [list, setList] = React.useState([]);

    React.useEffect(() => {
        if (projectId) {
            getPipelines(projectId);
            getJobs(projectId);
            getParameters(projectId);
        }
        setList(data?.pipelines);
    }, [projectId]);

    React.useEffect(() => {
        setList(
            data?.pipelines?.filter(item =>
                item.name.toUpperCase().includes(search.toUpperCase())
            )
        );
    }, [data?.pipelines, search]);

    React.useEffect(() => {
        search.trim() && setCurrentPage(0);
    }, [search]);

    return loading || loadingExport ? (
        <PageSkeleton />
    ) : (
        <Box p={4}>
            <Grid container>
                <PageHeader
                    header="Pipelines"
                    ableToEdit={data.editable}
                    buttonCaption={t('main:button.addPipeline')}
                    searchValue={search}
                    onSearch={event => setSearch(event.target.value)}
                    onRefreshClick={() => getPipelines(projectId)}
                    onAddClick={() => history.push(`/pipelines/${projectId}`)}
                />
            </Grid>
            <Grid item xs={12}>
                <PipelinesTable
                    data={list}
                    ableToEdit={data.editable}
                    projectId={projectId}
                    jobs={jobs}
                    params={params}
                />
            </Grid>
        </Box>
    );
};

Pipelines.propTypes = {
    projectId: PropTypes.string,
    pipelines: PropTypes.object,
    getPipelines: PropTypes.func,
    setCurrentPage: PropTypes.func,
    loadingExport: PropTypes.bool,
    getJobs: PropTypes.func,
    jobs: PropTypes.array,
    params: PropTypes.array,
    getParameters: PropTypes.func
};

const mapStateToProps = state => ({
    pipelines: state.pages.pipelines,
    loadingExport: state.importExport.loading,
    jobs: state.pages.jobs.data.jobs,
    params: state.pages.settingsParameters.data.params
});

const mapDispatchToProps = {
    getPipelines: fetchPipelines,
    setCurrentPage: setCurrentTablePage,
    getJobs: fetchJobs,
    getParameters: fetchParameters
};

export default connect(mapStateToProps, mapDispatchToProps)(Pipelines);
