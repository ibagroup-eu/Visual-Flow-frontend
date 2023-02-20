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

import Autocomplete from '@material-ui/lab/Autocomplete';
import { Chip, TextField } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const AutocompleteParameter = ({
    state,
    className,
    id,
    name,
    required,
    ableToEdit,
    handleInputChange,
    label
}) => (
    <Autocomplete
        className={className}
        disabled={!ableToEdit}
        id={id}
        multiple
        freeSolo
        autoSelect
        options={[]}
        value={state[name]?.split(',') || []}
        onChange={(event, value) =>
            handleInputChange({
                target: {
                    name,
                    value: value?.join(',')
                }
            })
        }
        renderTags={(value, getTagProps) =>
            value.map((option, index) => (
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
                required={required}
            />
        )}
    />
);

AutocompleteParameter.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    handleInputChange: PropTypes.func,
    required: PropTypes.bool,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string
};

export default AutocompleteParameter;
