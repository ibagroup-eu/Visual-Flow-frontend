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
import { get, isEqual } from 'lodash';
import { Grid, TextField } from '@material-ui/core';

import { useTranslation } from 'react-i18next';
import { isCorrectName, isCorrectDescription } from '../../utils/projectValidations';
import { createProject } from '../../redux/actions/projectsActions';
import { updateProject } from '../../redux/actions/settingsActions';
import history from '../../utils/history';
import FormWrapper from '../form-wrapper';
import useStyles from './ProjectForm.Styles';
import LimitsField from './limits';
import LimitSubtitle from './limit-subtitle';
import { isEmpty, isValidationPassed } from './validations/validations';
import useUnsavedChangesWarning from '../../pages/settings/useUnsavedChangesWarning';
import toggleConfirmationWindow from '../../redux/actions/modalsActions';

export const ProjectForm = ({ project, create, update, confirmationWindow }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [Prompt, setDirty, setPristine, dirty] = useUnsavedChangesWarning();

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
        usage: get(project, 'usage'),
        editable: get(project, 'editable')
    };

    const [card, setCardState] = React.useState(initialState);
    const [editMode, setEditMode] = React.useState(!project);

    const handleChange = event => {
        event.persist();
        setCardState(prevState => ({
            ...prevState,
            [event.target.id]: event.target.value
        }));
        setDirty();
    };

    const handleChangeLimits = event => {
        event.persist();
        setCardState(prevState => ({
            ...prevState,
            limits: { ...prevState.limits, [event.target.id]: event.target.value }
        }));
        setDirty();
    };

    const onSubmit = project
        ? () => {
              update(card);
              setPristine();
              setEditMode(false);
          }
        : () => {
              create(card);
              setPristine();
          };

    const onCancel = project
        ? () => {
              if (dirty) {
                  confirmationWindow({
                      body: `${t('main:confirm.unsaved')}`,
                      callback: () => {
                          setPristine();
                          setEditMode(false);
                          setCardState(initialState);
                      }
                  });
              } else {
                  setPristine();
                  setEditMode(false);
                  setCardState(initialState);
              }
          }
        : () => {
              setPristine();
              history.push('/');
          };

    const editTitle = editMode ? 'editProject' : 'viewProject';
    const formTitle = project ? editTitle : 'createProject';

    const isSaveBtnDisabled = () =>
        isEmpty(card) || !isValidationPassed(card) || isEqual(project, card);

    return (
        <FormWrapper
            editMode={editMode}
            editable={project?.editable}
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
                        disabled={project && (!editMode || !card.limits.editable)}
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
                <Grid item xs={12} className={classes.label}>
                    <LimitSubtitle subtitle={t('main:form.Requests')} />
                </Grid>
                <LimitsField
                    project={project}
                    card={card}
                    label="CPU"
                    id="requestsCpu"
                    adornment={t('jobs:Cores')}
                    editMode={editMode}
                    handleChangeLimits={handleChangeLimits}
                />
                <LimitsField
                    project={project}
                    card={card}
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
                    card={card}
                    label="CPU"
                    id="limitsCpu"
                    adornment={t('jobs:Cores')}
                    editMode={editMode}
                    handleChangeLimits={handleChangeLimits}
                />
                <LimitsField
                    project={project}
                    card={card}
                    label="Memory"
                    id="limitsMemory"
                    adornment={t('jobs:GB')}
                    editMode={editMode}
                    handleChangeLimits={handleChangeLimits}
                />
            </Grid>
            {Prompt}
        </FormWrapper>
    );
};

ProjectForm.propTypes = {
    create: PropTypes.func,
    update: PropTypes.func,
    project: PropTypes.object,
    confirmationWindow: PropTypes.func
};

const mapDispatchToProps = {
    create: createProject,
    update: updateProject,
    confirmationWindow: toggleConfirmationWindow
};

export default connect(null, mapDispatchToProps)(ProjectForm);
