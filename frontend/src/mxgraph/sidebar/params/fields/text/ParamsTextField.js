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
import { InputAdornment, TextField, Box } from '@material-ui/core';
import { isFunction, noop } from 'lodash';
import useStyles from './ParamsTextField.Styles';

const ParamsTextField = ({
    name,
    value,
    label,
    placeholder,
    type,
    inputProps,
    adornment,
    onChange,
    validate,
    ableToEdit,
    required,
    error,
    helperText,
    onError,
    multiline = false,
    minRows = 1
}) => {
    const handleChange = event => {
        if (isFunction(validate)) {
            onError({
                name,
                value: validate(event.target.value)
            });
        }
        onChange({ target: { name, value: event.target.value }, persist: noop });
    };

    const classes = useStyles();

    return (
        <Box className={classes.fields}>
            <TextField
                disabled={!ableToEdit}
                name={name}
                label={label}
                placeholder={placeholder || label}
                type={type}
                variant="outlined"
                value={value || ''}
                onChange={handleChange}
                fullWidth
                InputProps={{
                    inputProps,
                    endAdornment: adornment && (
                        <InputAdornment position="end">{adornment}</InputAdornment>
                    )
                }}
                InputLabelProps={{
                    shrink: true
                }}
                multiline={multiline}
                minRows={minRows}
                helperText={error || helperText}
                error={!!error}
                required={required}
            />
        </Box>
    );
};

ParamsTextField.propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    inputProps: PropTypes.object,
    adornment: PropTypes.string,
    onChange: PropTypes.func,
    validate: PropTypes.func,
    ableToEdit: PropTypes.bool,
    required: PropTypes.bool,
    error: PropTypes.string,
    helperText: PropTypes.string,
    onError: PropTypes.func,
    multiline: PropTypes.bool,
    minRows: PropTypes.number
};

export default ParamsTextField;
