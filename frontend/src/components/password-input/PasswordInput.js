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
import classNames from 'classnames';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const PasswordInput = ({
    id,
    className,
    onChange,
    placeholder,
    value,
    label,
    disabled,
    fullWidth,
    error,
    isTouched,
    onBlur,
    helperText,
    fromDesigner,
    name,
    required,
    InputProps
}) => {
    const [visible, setVisibility] = React.useState(false);

    return (
        <TextField
            id={id}
            required={required}
            fullWidth={fullWidth}
            variant="outlined"
            disabled={disabled}
            className={classNames(className)}
            type={(disabled && !fromDesigner) || !visible ? 'password' : 'text'}
            value={value}
            name={name}
            onChange={onChange}
            label={label}
            InputProps={{
                ...InputProps,
                endAdornment: (fromDesigner || !disabled) && (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setVisibility(!visible)}
                            edge="end"
                        >
                            {visible ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
            placeholder={placeholder}
            error={isTouched && error}
            helperText={isTouched && helperText}
            onBlur={onBlur}
        />
    );
};

PasswordInput.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    error: PropTypes.bool,
    isTouched: PropTypes.bool,
    onBlur: PropTypes.func,
    helperText: PropTypes.any,
    fromDesigner: PropTypes.bool,
    InputProps: PropTypes.object,
    required: PropTypes.bool
};

export default PasswordInput;
