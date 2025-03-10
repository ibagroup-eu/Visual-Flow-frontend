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
import { Grid, Paper, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import useStyles from './Row.Styles';
import Arrows from '../../helpers/arrows';
import Actions from '../../helpers/actions';

const VALIDATION_ERROR = 'jobDesigner:avroSchema.validation.duplicatedRow';

const Row = ({
    defaultKey,
    defaultValue,
    shouldDisableDeleteBtn = false,
    onChange,
    onAdd,
    onRemove,
    onMoveTop,
    onMoveDown,
    autoFocus = false,
    duplicated = false,
    editable = true
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <Paper className={classes.root} variatn="outlined">
            {editable && <Arrows onMoveDown={onMoveDown} onMoveTop={onMoveTop} />}
            <Grid container direction="row" alignItems="center" spacing={1}>
                <Grid item xs={6}>
                    <TextField
                        disabled={!editable}
                        error={duplicated}
                        helperText={duplicated && t(VALIDATION_ERROR)}
                        autoFocus={autoFocus}
                        label={t('jobDesigner:clusterSchema.fields.key')}
                        variant="outlined"
                        defaultValue={defaultKey}
                        onChange={onChange}
                        fullWidth
                        name="clusterKey"
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        disabled={!editable}
                        autoFocus={autoFocus}
                        label={t('jobDesigner:clusterSchema.fields.value')}
                        variant="outlined"
                        defaultValue={defaultValue}
                        onChange={onChange}
                        fullWidth
                        name="value"
                    />
                </Grid>
            </Grid>

            {editable && (
                <Actions
                    className={classes.actions}
                    shouldDisableDeleteBtn={shouldDisableDeleteBtn}
                    onAdd={onAdd}
                    onRemove={onRemove}
                />
            )}
        </Paper>
    );
};

Row.propTypes = {
    onMoveTop: PropTypes.func.isRequired,
    onMoveDown: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    autoFocus: PropTypes.bool,
    duplicated: PropTypes.bool,
    defaultKey: PropTypes.string,
    defaultValue: PropTypes.string,
    shouldDisableDeleteBtn: PropTypes.bool
};

export default Row;
