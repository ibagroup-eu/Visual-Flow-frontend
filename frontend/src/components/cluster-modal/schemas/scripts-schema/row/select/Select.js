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
import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select as SelectMU
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

const Select = ({
    defaultValue,
    onChange,
    values,
    label,
    error,
    helperText,
    disabled
}) => (
    <FormControl variant="outlined" fullWidth>
        <InputLabel error={error}>{label}</InputLabel>
        <SelectMU
            disabled={disabled}
            defaultValue={defaultValue}
            label={label}
            onChange={onChange}
            error={error}
        >
            {values?.map(({ key, value }) => (
                <MenuItem key={key} value={value}>
                    {key}
                </MenuItem>
            ))}
        </SelectMU>
        {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </FormControl>
);

Select.propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    onChange: PropTypes.func,
    helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    error: PropTypes.bool,
    values: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
        })
    ),
    label: PropTypes.string,
    disabled: PropTypes.bool
};

Select.defaultProps = {
    onChange: noop,
    values: [],
    error: false,
    disabled: false
};

export default Select;
