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

import React, { useMemo } from 'react';
import { Box, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { isEqual, reduce } from 'lodash';
import { fetchJobs, setJobSearchField } from '../../redux/actions/jobsActions';
import { setCurrentTablePage } from '../../redux/actions/enhancedTableActions';
import JobsTable from './table';
import PageHeader from '../../components/page-header';
import history from '../../utils/history';
import { PageSkeleton } from '../../components/skeleton';
import { fetchPipelines } from '../../redux/actions/pipelinesActions';
import { DATABRICKS } from '../../mxgraph/constants';

export const sortTags = dataArray =>
    reduce(
        dataArray,
        (result, obj) => {
            const objTags = reduce(
                obj.tags,
                (resultTags, tag) => ({ ...resultTags, [tag]: false }),
                {}
            );
            return { ...result, ...objTags };
        },
        {}
    );

export const checkedTags = data =>
    reduce(
        data,
        (result, value, key) => {
            return value ? { ...result, [key]: value } : result;
        },
        {}
    );

const Jobs = ({
    projectId,
    jobs,
    pipelines,
    getJobs,
    getPipelines,
    setSearchField,
    searchField,
    setCurrentPage,
    loadingExport,
    project
}) => {
    const { t } = useTranslation();
    const [list, setList] = React.useState([]);
    const [tags, setTags] = React.useState({});
    const filteredTags = useMemo(() => checkedTags(tags), [tags]);
    const { demo, demoLimits } = project;

    React.useEffect(() => {
        if (projectId) {
            getJobs(projectId);
            if (window.PLATFORM !== DATABRICKS) {
                getPipelines(projectId);
            }
        }
    }, [getJobs, getPipelines, projectId]);

    React.useEffect(() => {
        if (jobs.data.jobs) {
            setList(jobs.data.jobs);
            setTags(sortTags(jobs.data.jobs));
        }
    }, [jobs.data?.jobs]);

    React.useEffect(() => {
        if (!isEqual(filteredTags, {})) {
            setCurrentPage(0);
            setList(
                jobs.data.jobs?.filter(
                    item =>
                        item?.name
                            ?.toUpperCase()
                            .includes(searchField.toUpperCase()) &&
                        item?.tags.find(tag => filteredTags[tag])
                )
            );
        } else {
            searchField.trim() && setCurrentPage(0);
            setList(
                jobs.data.jobs?.filter(item =>
                    item?.name?.toUpperCase().includes(searchField.toUpperCase())
                )
            );
        }
    }, [setCurrentPage, filteredTags, searchField, tags, jobs.data.jobs]);

    const resetTags = () =>
        setTags(
            reduce(
                Object.keys(tags),
                (resultTags, tag) => ({ ...resultTags, [tag]: false }),
                {}
            )
        );

    const onCheckTags = changedTag =>
        setTags({
            ...tags,
            ...changedTag
        });

    const disabled =
        demo &&
        list?.filter(item => item?.pipelineId === null).length >=
            demoLimits?.jobsNumAllowed;

    return jobs.loading || loadingExport ? (
        <PageSkeleton />
    ) : (
        <Box p={4}>
            <Grid container>
                <Grid item xs={12}>
                    <PageHeader
                        header="Jobs"
                        ableToEdit={jobs.data.editable}
                        buttonCaption={t('main:button.addJob')}
                        disabled={disabled}
                        searchValue={searchField}
                        onSearch={event => setSearchField(event.target.value)}
                        onRefreshClick={() => getJobs(projectId)}
                        onAddClick={() => history.push(`/jobs/${projectId}`)}
                        tagsData={tags}
                        onCheckTags={onCheckTags}
                        resetTags={resetTags}
                        checkedTags={filteredTags}
                    />
                </Grid>
                <Grid item xs={12}>
                    <JobsTable
                        data={list}
                        pipelines={pipelines.data.pipelines}
                        projectId={projectId}
                        disabled={disabled}
                        ableToEdit={jobs.data.editable}
                        checkedTags={filteredTags}
                        onCheckTags={onCheckTags}
                        resetTags={resetTags}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

Jobs.propTypes = {
    projectId: PropTypes.string,
    searchField: PropTypes.string,
    jobs: PropTypes.object,
    pipelines: PropTypes.object,
    getJobs: PropTypes.func,
    getPipelines: PropTypes.func,
    setSearchField: PropTypes.func,
    setCurrentPage: PropTypes.func,
    loadingExport: PropTypes.bool,
    project: PropTypes.object
};

const mapStateToProps = state => ({
    jobs: state.pages.jobs,
    pipelines: state.pages.pipelines,
    searchField: state.pages.jobs.searchField,
    loadingExport: state.importExport.loading,
    project: state.pages.settingsBasic.project ?? {}
});

const mapDispatchToProps = {
    getJobs: fetchJobs,
    getPipelines: fetchPipelines,
    setSearchField: setJobSearchField,
    setCurrentPage: setCurrentTablePage
};

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);
