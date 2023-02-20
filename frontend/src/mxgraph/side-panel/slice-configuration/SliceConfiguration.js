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
import { useTranslation } from 'react-i18next';
import { TextField, Chip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import SelectField from '../../../components/select-field';
import { OTHER } from '../../constants';
import ConfigurationDivider from '../../../components/divider';

const mode = [
    {
        value: 'Keep',
        label: 'Keep'
    },
    {
        value: 'Drop',
        label: 'Drop'
    }
];

const SLICE_DEFAULT_VALUE = 'Drop';

const SliceConfiguration = ({ state, ableToEdit, onChange }) => {
    const { t } = useTranslation();
    const slicingColumns = state.columns?.split(',') || [];

    return (
        <>
            {state.name && (
                <>
                    <ConfigurationDivider />
                    <SelectField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:sliceConfiguration.Mode"
                        name="mode"
                        value={state.mode}
                        menuItems={mode}
                        handleInputChange={onChange}
                        type={OTHER}
                        defaultValue={SLICE_DEFAULT_VALUE}
                        required
                    />
                    <Autocomplete
                        disabled={!ableToEdit}
                        id="columns"
                        multiple
                        freeSolo
                        autoSelect
                        options={[]}
                        value={slicingColumns}
                        onChange={(event, value) =>
                            onChange('columns', value?.join(','))
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
                                margin="normal"
                                variant="outlined"
                                label={t('jobDesigner:sliceConfiguration.Columns')}
                                required
                            />
                        )}
                    />
                </>
            )}
        </>
    );
};

SliceConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    openModal: PropTypes.func,
    required: PropTypes.bool
};

export default SliceConfiguration;
