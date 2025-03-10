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

import React, { useCallback, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, isEqual, noop } from 'lodash';
import { Grid, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
    isCorrectName,
    isCorrectDescription,
    isCorrectHost,
    isCorrectPath
} from '../../utils/projectValidations';
import { createProject } from '../../redux/actions/projectsActions';
import { updateProject } from '../../redux/actions/settingsActions';
import history from '../../utils/history';
import FormWrapper from '../form-wrapper';
import useStyles from './ProjectForm.Styles';
import LimitsField from './limits';
import LimitSubtitle from './limit-subtitle';
import {
    isDatabricksValidationPassed,
    isEmpty,
    isLimitsAndDemoLimitsValidationsPassed
} from './validations/validations';
import useUnsavedChangesWarning from '../../pages/settings/useUnsavedChangesWarning';
import toggleConfirmationWindow from '../../redux/actions/modalsActions';
import DemoLimits from './demo-limits/DemoLimits';
import { AWS, AZURE, DATABRICKS, GCP } from '../../mxgraph/constants';
import Authentication from './authentication';
import { fetchCurrentUser } from '../../redux/actions/currentUserActions';

// eslint-disable-next-line complexity
export const ProjectForm = ({
    project,
    create,
    update,
    confirmationWindow,
    currentUser,
    getCurrentUser
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [Prompt, setDirty, setPristine, dirty] = useUnsavedChangesWarning();

    React.useEffect(() => {
        getCurrentUser();
    }, [getCurrentUser]);

    const initialState = {
        id: get(project, 'id'),
        name: get(project, 'name', ''),
        description: get(project, 'description', ''),
        limits: {
            limitsCpu: get(project, 'limits.limitsCpu', 6),
            limitsMemory: get(project, 'limits.limitsMemory', 6),
            requestsCpu: get(project, 'limits.requestsCpu', 4),
            requestsMemory: get(project, 'limits.requestsMemory', 4),
            editable: get(project, 'limits.editable')
        },
        demoLimits: {
            sourcesToShow: {
                READ: get(project, 'demoLimits.sourcesToShow.READ', []),
                WRITE: get(project, 'demoLimits.sourcesToShow.WRITE', [])
            },
            jobsNumAllowed: get(project, 'demoLimits.jobsNumAllowed', 1),
            pipelinesNumAllowed: get(project, 'demoLimits.pipelinesNumAllowed', 1),
            expirationDate: get(project, 'demoLimits.expirationDate'),
            editable: get(project, 'demoLimits.editable')
        },
        demo: get(project, 'demo', false),
        usage: get(project, 'usage'),
        editable: get(project, 'editable'),
        cloud: get(project, 'cloud', 'AWS'),
        host: get(project, 'host', ''),
        authentication: {
            token: get(project, 'authentication.token', ''),
            clientId: get(project, 'authentication.clientId', ''),
            secret: get(project, 'authentication.secret', ''),
            authenticationType: get(
                project,
                'authentication.authenticationType',
                'OAUTH'
            )
        },
        pathToFile: get(project, 'pathToFile', '')
    };

    const [card, setCardState] = React.useState(initialState);
    const [editMode, setEditMode] = React.useState(!project);
    const firstUpdate = useRef(true);

    const isValid = useCallback(value => isCorrectHost(value));

    const handleChange = event => {
        event.persist();
        setCardState(prevState => ({
            ...prevState,
            [event.target.id]: event.target.value
        }));
        setDirty();
    };

    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        let cloud = '';
        if (card.host?.includes('cloud.databricks.com')) {
            cloud = AWS;
        }
        if (card.host?.includes('azuredatabricks.net')) {
            cloud = AZURE;
        }
        if (card.host?.includes('gcp.databricks.com')) {
            cloud = GCP;
        }
        handleChange({
            target: {
                id: 'cloud',
                value: cloud
            },
            persist: noop
        });
    }, [card.host]);

    const handleChangeLimits = event => {
        event.persist();
        setCardState(prevState => ({
            ...prevState,
            limits: { ...prevState.limits, [event.target.id]: event.target.value }
        }));
        setDirty();
    };

    const onSubmit = () => {
        const finalCard = {
            ...card,
            demoLimits: card.demo
                ? {
                      ...card.demoLimits,
                      sourcesToShow: {
                          ...card.demoLimits.sourcesToShow,
                          READ:
                              card.demoLimits.sourcesToShow.READ?.length === 0
                                  ? null
                                  : card.demoLimits.sourcesToShow.READ,
                          WRITE:
                              card.demoLimits.sourcesToShow.WRITE?.length === 0
                                  ? null
                                  : card.demoLimits.sourcesToShow.WRITE
                      }
                  }
                : null
        };
        if (project) {
            update(finalCard);
            setEditMode(false);
        } else {
            create(finalCard);
        }
        setPristine();
    };

    const onCancel = () => {
        const onCancelFunctions = () => {
            setEditMode(false);
            setCardState(initialState);
        };
        if (project) {
            if (dirty) {
                confirmationWindow({
                    body: `${t('main:confirm.unsaved')}`,
                    callback: () => onCancelFunctions()
                });
            } else {
                onCancelFunctions();
            }
        } else {
            history.push('/');
        }
        setPristine();
    };

    const editTitle = editMode ? 'editProject' : 'viewProject';
    const formTitle = project ? editTitle : 'createProject';

    const isSaveBtnDisabled = () =>
        isEmpty(card) ||
        !isDatabricksValidationPassed(card) ||
        !isLimitsAndDemoLimitsValidationsPassed(card) ||
        isEqual(project, card);

    const isEditable =
        window.PLATFORM === DATABRICKS
            ? project?.editable
            : currentUser.data.superuser && project?.editable;

    return (
        <FormWrapper
            editMode={editMode}
            editable={isEditable}
            setEditMode={() => setEditMode(true)}
            onCancel={onCancel}
            onSubmit={onSubmit}
            title={formTitle}
            isSaveBtnDisabled={isSaveBtnDisabled()}
        >
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <TextField
                        value={card.name}
                        disabled={!!project}
                        required
                        id="name"
                        label={t('main:form.Name')}
                        fullWidth
                        multiline
                        variant="outlined"
                        onChange={handleChange}
                        helperText={
                            !isCorrectName(card.name) &&
                            t('main:validation.3to40chars')
                        }
                        error={!isCorrectName(card.name)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        value={card.description}
                        disabled={
                            project &&
                            (!editMode ||
                                (!card.limits.editable &&
                                    window.PLATFORM !== DATABRICKS))
                        }
                        id="description"
                        label={t('main:form.Description')}
                        fullWidth
                        multiline
                        variant="outlined"
                        onChange={handleChange}
                        helperText={
                            !isCorrectDescription(card.description) &&
                            t('main:validation.moreThen500')
                        }
                        error={!isCorrectDescription(card.description)}
                    />
                </Grid>
                {window.PLATFORM === DATABRICKS ? (
                    <>
                        <Grid item xs={12}>
                            <TextField
                                value={card.host}
                                disabled={project && !editMode}
                                required
                                id="host"
                                label={t('main:form.Host')}
                                fullWidth
                                multiline
                                variant="outlined"
                                onChange={handleChange}
                                helperText={
                                    !isValid(card.host) && t('main:validation.host')
                                }
                                error={!isValid(card.host)}
                            />
                        </Grid>
                        <Authentication
                            project={project}
                            card={card}
                            setCardState={setCardState}
                            editMode={editMode}
                            setDirty={setDirty}
                        />
                        <Grid item xs={12}>
                            <TextField
                                value={card.pathToFile}
                                disabled={project && !editMode}
                                required
                                id="pathToFile"
                                label={t('main:form.Path')}
                                placeholder="/Volumes/catalog/schema/volume_path"
                                fullWidth
                                multiline
                                variant="outlined"
                                onChange={handleChange}
                                helperText={
                                    !isCorrectPath(card.pathToFile) &&
                                    t('main:validation.path')
                                }
                                error={!isCorrectPath(card.pathToFile)}
                            />
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid item xs={12} className={classes.label}>
                            <LimitSubtitle subtitle={t('main:form.Requests')} />
                        </Grid>
                        <LimitsField
                            project={project}
                            card={card.limits}
                            label="CPU"
                            id="requestsCpu"
                            adornment={t('jobs:Cores')}
                            editMode={editMode}
                            handleChangeLimits={handleChangeLimits}
                        />
                        <LimitsField
                            project={project}
                            card={card.limits}
                            label="Memory"
                            id="requestsMemory"
                            adornment={t('jobs:GB')}
                            editMode={editMode}
                            handleChangeLimits={handleChangeLimits}
                        />
                        <Grid item xs={12} className={classes.label}>
                            <LimitSubtitle subtitle={t('main:form.Limits')} />
                        </Grid>
                        <LimitsField
                            project={project}
                            card={card.limits}
                            label="CPU"
                            id="limitsCpu"
                            adornment={t('jobs:Cores')}
                            editMode={editMode}
                            handleChangeLimits={handleChangeLimits}
                        />
                        <LimitsField
                            project={project}
                            card={card.limits}
                            label="Memory"
                            id="limitsMemory"
                            adornment={t('jobs:GB')}
                            editMode={editMode}
                            handleChangeLimits={handleChangeLimits}
                        />
                        <DemoLimits
                            project={project}
                            card={card}
                            setCardState={setCardState}
                            editMode={editMode}
                            setDirty={setDirty}
                        />
                    </>
                )}
            </Grid>
            {Prompt}
        </FormWrapper>
    );
};

ProjectForm.propTypes = {
    create: PropTypes.func,
    update: PropTypes.func,
    project: PropTypes.object,
    confirmationWindow: PropTypes.func,
    currentUser: PropTypes.object,
    getCurrentUser: PropTypes.func
};

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
});

const mapDispatchToProps = {
    create: createProject,
    update: updateProject,
    confirmationWindow: toggleConfirmationWindow,
    getCurrentUser: fetchCurrentUser
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm);
