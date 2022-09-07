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
import { Grid, TextField, InputAdornment } from '@material-ui/core';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { isPositiveNumber } from '../../../utils/projectValidations';

const LimitsField = ({
    card,
    project,
    editMode,
    id,
    label,
    adornment,
    handleChangeLimits
}) => {
    const { t } = useTranslation();

    return (
        <Grid item xs={12} sm={6}>
            <TextField
                value={card.limits[id]}
                disabled={project && (!editMode || !card.limits.editable)}
                required
                id={id}
                label={t(`jobs:${label}`)}
                fullWidth
                variant="outlined"
                type="number"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">{adornment}</InputAdornment>
                    )
                }}
                onChange={handleChangeLimits}
                helperText={
                    !isPositiveNumber(Number(card.limits[id])) &&
                    t('main:validation.positive')
                }
                error={!isPositiveNumber(Number(card.limits[id]))}
            />
        </Grid>
    );
};

LimitsField.propTypes = {
    card: PropTypes.object,
    project: PropTypes.object,
    editMode: PropTypes.bool,
    handleChangeLimits: PropTypes.func,
    id: PropTypes.string,
    label: PropTypes.string,
    adornment: PropTypes.string
};

export default LimitsField;
