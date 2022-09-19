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
import { Chip, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { noop } from 'lodash';
import useStyles from './ParamsChipsField.Styles';

export const ParamsChipsField = ({
    name,
    value,
    label,
    onChange,
    ableToEdit,
    hint
}) => {
    const classes = useStyles();

    const handleChange = chips =>
        onChange({
            target: { name, value: chips },
            persist: noop
        });

    return (
        <>
            <Autocomplete
                className={classes.root}
                disabled={!ableToEdit}
                id="chips"
                multiple
                freeSolo
                autoSelect
                options={[]}
                value={value || []}
                onChange={(_, chips) => handleChange(chips)}
                renderTags={(chips, getTagProps) =>
                    chips?.map((option, index) => (
                        <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                        />
                    ))
                }
                renderInput={params => (
                    <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        label={label}
                    />
                )}
            />
            {hint && (
                <Typography
                    variant="caption"
                    color="textSecondary"
                    display="block"
                    align="right"
                >
                    {hint}
                </Typography>
            )}
        </>
    );
};

ParamsChipsField.propTypes = {
    name: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.string,
    onChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    hint: PropTypes.string
};

export default ParamsChipsField;
