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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InputAdornment, TextField } from '@material-ui/core';
import { isFunction } from 'lodash';

const ParamsTextField = ({
    name,
    value,
    label,
    type,
    inputProps,
    adornment,
    onChange,
    validate,
    ableToEdit
}) => {
    const [error, setError] = useState(null);

    const handleChange = event => {
        setError(isFunction(validate) ? validate(event.target.value) : null);
        onChange(event);
    };

    return (
        <TextField
            disabled={!ableToEdit}
            name={name}
            label={label}
            placeholder={label}
            type={type}
            variant="outlined"
            margin="normal"
            value={value}
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
            helperText={error}
            error={!!error}
        />
    );
};

ParamsTextField.propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    type: PropTypes.string,
    inputProps: PropTypes.object,
    adornment: PropTypes.string,
    onChange: PropTypes.func,
    validate: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default ParamsTextField;
