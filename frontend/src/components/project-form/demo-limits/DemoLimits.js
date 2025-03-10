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
import { Switch, FormControlLabel, Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTranslation } from 'react-i18next';
import LimitsField from '../limits';
import LimitSubtitle from '../limit-subtitle';
import useStyles from './DemoLimits.Styles';
import { READ, STORAGES, WRITE } from '../../../mxgraph/constants';
import { isValidDemoLimitDate } from '../../../utils/projectValidations';

export const DemoLimits = ({ project, card, setCardState, editMode, setDirty }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const storageValues = criteria =>
        Object.entries(STORAGES)
            .filter(storage => !storage[1].hide || storage[1].hide[0] !== criteria)
            .map(([storageName, storageProps]) => ({
                value: storageName,
                label: storageProps.label
            }))
            .sort((a, b) => {
                if (a.label > b.label) {
                    return 1;
                }
                if (b.label > a.label) {
                    return -1;
                }
                return 0;
            });

    const parseStorageValues = sourcesToShow =>
        Object.entries(STORAGES)
            .map(([storageName, storageProps]) => ({
                value: storageName,
                label: storageProps.label
            }))
            .filter(storage => sourcesToShow.includes(storage.value));

    const handleChangeDemoLimits = event => {
        event.persist();
        setCardState(prevState => ({
            ...prevState,
            demoLimits: {
                ...prevState.demoLimits,
                [event.target.id]: event.target.value
            }
        }));
        setDirty();
    };

    const handleChangeAutocomplete = (event, optionList, source) => {
        event.persist();
        setCardState(prevState => ({
            ...prevState,
            demoLimits: {
                ...prevState.demoLimits,
                sourcesToShow: {
                    ...prevState.demoLimits.sourcesToShow,
                    [source]: optionList.map(option => option.value)
                }
            }
        }));
        setDirty();
    };

    const handleChangeToggle = event => {
        event.persist();
        setCardState(prevState => ({
            ...prevState,
            [event.target.name]: event.target.checked
        }));
        setDirty();
    };

    return (
        <>
            {(!project || card.editable) && (
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        className={classes.divider}
                        control={
                            <Switch
                                id="demo"
                                onChange={handleChangeToggle}
                                checked={card.demo}
                                name="demo"
                                disabled={!editMode}
                            />
                        }
                        label={t('main:form.Demo')}
                    />
                </Grid>
            )}
            {(!project || card.editable) && card.demo && (
                <>
                    <Grid item xs={12} className={classes.label}>
                        <LimitSubtitle subtitle={t('main:form.DemoLimits')} />
                    </Grid>
                    <LimitsField
                        project={project}
                        card={card.demoLimits}
                        label="Jobs"
                        id="jobsNumAllowed"
                        adornment={t('main:form.Limit')}
                        editMode={editMode}
                        handleChangeLimits={handleChangeDemoLimits}
                    />
                    <LimitsField
                        project={project}
                        card={card.demoLimits}
                        label="Pipelines"
                        id="pipelinesNumAllowed"
                        adornment={t('main:form.Limit')}
                        editMode={editMode}
                        handleChangeLimits={handleChangeDemoLimits}
                    />
                    {[READ, WRITE].map(source => (
                        <Grid key={source} item xs={12} sm={6}>
                            <Autocomplete
                                multiple
                                id={`source-${source.toLowerCase()}`}
                                options={storageValues(source)}
                                getOptionLabel={option => option.label}
                                value={parseStorageValues(
                                    card.demoLimits.sourcesToShow[source] || []
                                )}
                                onChange={(e, option) => {
                                    handleChangeAutocomplete(e, option, source);
                                }}
                                getOptionSelected={(option, value) =>
                                    option.value === value.value
                                }
                                filterSelectedOptions
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label={t(
                                            `main:form.SourceLimits:${source.toLowerCase()}`
                                        )}
                                    />
                                )}
                                disabled={!editMode}
                            />
                        </Grid>
                    ))}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="expirationDate"
                            label={t('main:form.ExpirationDate')}
                            type="date"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            value={card.demoLimits.expirationDate || ''}
                            onChange={handleChangeDemoLimits}
                            disabled={!editMode}
                            helperText={
                                !isValidDemoLimitDate(
                                    card.demoLimits.expirationDate
                                ) && t('main:validation.validDate')
                            }
                            error={
                                !isValidDemoLimitDate(card.demoLimits.expirationDate)
                            }
                        />
                    </Grid>
                </>
            )}
        </>
    );
};

DemoLimits.propTypes = {
    project: PropTypes.object,
    card: PropTypes.object,
    editMode: PropTypes.bool,
    setCardState: PropTypes.func,
    setDirty: PropTypes.func
};

export default DemoLimits;
