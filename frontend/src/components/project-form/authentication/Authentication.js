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
import { noop } from 'lodash';
import { Grid, MenuItem, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { isCorrectName } from '../../../utils/projectValidations';
import PasswordInput from '../../password-input';

const authenticationType = [
    {
        value: 'OAUTH',
        label: 'OAuth'
    },
    {
        value: 'PAT',
        label: 'Personal Access Token'
    }
];

export const Authentication = ({
    project,
    card,
    setCardState,
    editMode,
    setDirty
}) => {
    const { t } = useTranslation();

    const handleChangeAuthentication = event => {
        event.persist();
        setCardState(prevState => ({
            ...prevState,
            authentication: {
                ...prevState.authentication,
                [event.target.id]: event.target.value
            }
        }));
        setDirty();
    };

    return (
        <>
            <Grid item xs={12}>
                <TextField
                    value={card.authentication.authenticationType}
                    disabled={project && !editMode}
                    required
                    id="authenticationType"
                    label={t('main:form.AuthenticationType')}
                    fullWidth
                    multiline
                    variant="outlined"
                    onChange={event =>
                        handleChangeAuthentication({
                            target: {
                                id: 'authenticationType',
                                value: event.target.value
                            },
                            persist: noop
                        })
                    }
                    select
                >
                    {authenticationType.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            {card.authentication.authenticationType === 'OAUTH' && (
                <>
                    <Grid item xs={12}>
                        <TextField
                            value={card.authentication.clientId}
                            disabled={project && !editMode}
                            required
                            id="clientId"
                            label={t('main:form.ClientID')}
                            fullWidth
                            multiline
                            variant="outlined"
                            onChange={handleChangeAuthentication}
                            // helperText={
                            //     !isValid(card.host) && t('main:validation.host')
                            // }
                            // error={!isValid(card.host)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <PasswordInput
                            value={card.authentication.secret}
                            disabled={project && !editMode}
                            required
                            id="secret"
                            label={t('main:form.Secret')}
                            fullWidth
                            multiline
                            variant="outlined"
                            onChange={handleChangeAuthentication}
                            // helperText={
                            //     !isValid(card.host) && t('main:validation.host')
                            // }
                            // error={!isValid(card.host)}
                        />
                    </Grid>
                </>
            )}
            {card.authentication.authenticationType === 'PAT' && (
                <>
                    <Grid item xs={12}>
                        <PasswordInput
                            value={card.authentication.token}
                            disabled={project && !editMode}
                            required
                            id="token"
                            label={t('main:form.Token')}
                            fullWidth
                            onChange={handleChangeAuthentication}
                            helperText={
                                !isCorrectName(card.authentication.token) &&
                                t('main:validation.3to40chars')
                            }
                            error={!isCorrectName(card.authentication.token)}
                            isTouched
                        />
                    </Grid>
                </>
            )}
        </>
    );
};

Authentication.propTypes = {
    project: PropTypes.object,
    card: PropTypes.object,
    editMode: PropTypes.bool,
    setCardState: PropTypes.func,
    setDirty: PropTypes.func
};

export default Authentication;
