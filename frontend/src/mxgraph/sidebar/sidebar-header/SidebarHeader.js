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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useTranslation } from 'react-i18next';
import { createJob, updateJob } from '../../../redux/actions/jobsActions';
import {
    setParamsDirty,
    setSidePanelDirty
} from '../../../redux/actions/mxGraphActions';
import {
    createPipeline,
    updatePipeline
} from '../../../redux/actions/pipelinesActions';
import useStyles from './SidebarHeader.Styles';
import toggleConfirmationWindow from '../../../redux/actions/modalsActions';
import history from '../../../utils/history';
import { resetJobStatus as resetJob } from '../../../redux/actions/oneJobStatusAction';
import { resetPipelineStatus as resetPipeline } from '../../../redux/actions/onePipelineStatusActions';

export const SidebarHeader = ({
    name,
    createNewJob,
    updateCurrentJob,
    createNewPipeline,
    updateCurrentPipeline,
    graph = {},
    dirty,
    data,
    sidePanelIsDirty,
    paramsIsDirty,
    setDirty,
    ableToEdit,
    confirmationWindow,
    setPanelDirty,
    resetJobStatus,
    resetPipelineStatus,
    query
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const someDirty = dirty || !data.name || sidePanelIsDirty || paramsIsDirty;
    const saveEnabled = dirty && !sidePanelIsDirty && !paramsIsDirty;

    const fetchJob = () => {
        const currentPath = history.location.pathname.split('/');
        const [
            ,
            currentDesigner,
            currentProject,
            currentJobOrPipeline
        ] = currentPath;
        if (currentDesigner !== 'pipelines') {
            if (currentJobOrPipeline) {
                updateCurrentJob(graph, currentProject, currentJobOrPipeline, data);
            } else {
                createNewJob(graph, currentProject, data);
            }
        } else {
            currentJobOrPipeline
                ? updateCurrentPipeline(
                      graph,
                      currentProject,
                      currentJobOrPipeline,
                      data
                  )
                : createNewPipeline(graph, currentProject, data);
        }
    };

    const currentHeader = () => {
        const designer = history.location.pathname.split('/')[1];
        if (!data.name) {
            return t('main:enterJobName');
        }
        if (sidePanelIsDirty) {
            return t('main:unsavedChanges.sidePanelIsDirty');
        }
        if (paramsIsDirty) {
            return t('main:unsavedChanges.paramsIsDirty');
        }
        if (dirty) {
            return t(`main:unsavedChanges.${designer}GraphIsDirty`);
        }
        if (designer === 'pipelines') {
            return t('jobDesigner:pipelineTitle', {
                name: name || t('jobDesigner:untitled')
            });
        }
        return t('jobDesigner:jobTitle', {
            name: name || t('jobDesigner:untitled')
        });
    };

    const goToLastPage = () => {
        setDirty(false);
        setPanelDirty(false);
        resetJobStatus();
        resetPipelineStatus();

        const [, designer, project] = history.location.pathname.split('/');

        history.push(`/${project}/${designer}${query}`);
    };

    const confirmOrGoToLast = () => {
        if (someDirty) {
            confirmationWindow({
                body: `${t('main:unsavedChanges.leaveWithUnsavedChanges')}`,
                callback: () => goToLastPage()
            });
        } else {
            goToLastPage();
        }
    };

    return (
        <AppBar
            position="fixed"
            className={classNames(classes.appBar, {
                [classes.dirty]: someDirty
            })}
        >
            <Toolbar className={classes.toolbar}>
                <IconButton className={classes.arrow} onClick={confirmOrGoToLast}>
                    <ArrowBackIcon fontSize="large" />
                </IconButton>
                <Typography variant="h5" noWrap className={classes.title}>
                    {currentHeader()}
                </Typography>
                <div className={classes.buttons}>
                    {saveEnabled && (
                        <>
                            {ableToEdit && (
                                <Button
                                    disabled={!name}
                                    variant="outlined"
                                    size="large"
                                    color="inherit"
                                    className={classes.button}
                                    onClick={fetchJob}
                                >
                                    {t('main:button.Save')}
                                </Button>
                            )}
                            <Button
                                size="large"
                                color="inherit"
                                className={classes.button}
                                onClick={confirmOrGoToLast}
                            >
                                {t('main:button.Exit')}
                            </Button>
                        </>
                    )}
                </div>
            </Toolbar>
        </AppBar>
    );
};

SidebarHeader.propTypes = {
    graph: PropTypes.object,
    createNewJob: PropTypes.func,
    updateCurrentJob: PropTypes.func,
    createNewPipeline: PropTypes.func,
    updateCurrentPipeline: PropTypes.func,
    paramsIsDirty: PropTypes.bool,
    sidePanelIsDirty: PropTypes.bool,
    dirty: PropTypes.bool,
    name: PropTypes.string,
    data: PropTypes.object,
    ableToEdit: PropTypes.bool,
    setDirty: PropTypes.func,
    confirmationWindow: PropTypes.func.isRequired,
    setPanelDirty: PropTypes.func,
    resetJobStatus: PropTypes.func,
    resetPipelineStatus: PropTypes.func,
    query: PropTypes.string
};

const mapStateToProps = state => ({
    data: state.mxGraph.data,
    sidePanelIsDirty: state.mxGraph.sidePanelIsDirty,
    paramsIsDirty: state.mxGraph.paramsIsDirty,
    dirty: state.mxGraph.dirty || state.mxGraph.graphWithParamsIsDirty,
    currentProject: state.projects.currentProject,
    query: state.pages.urlSearch.search
});

const mapDispatchToProps = {
    createNewJob: createJob,
    updateCurrentJob: updateJob,
    createNewPipeline: createPipeline,
    updateCurrentPipeline: updatePipeline,
    setDirty: setParamsDirty,
    confirmationWindow: toggleConfirmationWindow,
    setPanelDirty: setSidePanelDirty,
    resetJobStatus: resetJob,
    resetPipelineStatus: resetPipeline
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader);
