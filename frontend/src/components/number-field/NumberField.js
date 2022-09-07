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

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ClearButton from '../../mxgraph/side-panel/helpers/ClearButton';
import useStyles from './NumberField.Styles';

const NumberField = ({
    ableToEdit,
    label,
    name,
    value,
    handleInputChange,
    type,
    minValue,
    maxValue,
    defaultValue,
    required
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    useEffect(() => {
        if (!value) {
            const event = {
                target: {
                    name,
                    value: defaultValue
                }
            };
            handleInputChange(event);
        }
    }, []);

    return (
        <Box className={classes.wrapper}>
            <TextField
                disabled={!ableToEdit}
                label={t(label)}
                placeholder={t(label)}
                variant="outlined"
                margin="normal"
                InputProps={{
                    inputProps: {
                        min: minValue,
                        max: maxValue
                    }
                }}
                fullWidth
                name={name}
                value={value || ''}
                type="number"
                onChange={handleInputChange}
                error={value < minValue || value > maxValue}
                required={required}
            />
            <ClearButton
                name={name}
                value={value}
                ableToEdit={ableToEdit}
                handleInputChange={handleInputChange}
                type={type}
            />
        </Box>
    );
};

NumberField.propTypes = {
    ableToEdit: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
    handleInputChange: PropTypes.func,
    type: PropTypes.string,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    defaultValue: PropTypes.number,
    required: PropTypes.bool
};

export default NumberField;
