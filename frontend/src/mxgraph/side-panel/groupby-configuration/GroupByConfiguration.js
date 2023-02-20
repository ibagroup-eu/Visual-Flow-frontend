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

import { Checkbox, Chip, FormControlLabel, TextField, Box } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useStyles from './GroupByConfiguration.Styles';
import PropertyList from '../property-list';
import ConfigurationDivider from '../../../components/divider';

export const aggregateFunctions = [
    {
        value: 'Count',
        label: 'Count'
    },
    {
        value: 'Avg',
        label: 'Avg'
    },
    {
        value: 'Max',
        label: 'Max'
    },
    {
        value: 'Min',
        label: 'Min'
    },
    {
        value: 'Sum',
        label: 'Sum'
    },
    {
        value: 'Mean',
        label: 'Mean'
    }
];

const GroupByConfiguration = ({ ableToEdit, state, onChange }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const groupingColumns = state.groupingColumns?.split(',') || [];
    const groupingCriteria = state.groupingCriteria?.split(',') || [];

    const handleItemChange = (index, value) =>
        onChange(
            'groupingCriteria',
            [
                ...groupingCriteria.slice(0, index),
                value,
                ...groupingCriteria.slice(index + 1)
            ].join(',')
        );

    return (
        <>
            <ConfigurationDivider />
            <FormControlLabel
                className={classes.divider}
                control={
                    <Checkbox
                        disabled={!ableToEdit}
                        onChange={event =>
                            onChange(
                                'dropGroupingColumns',
                                event.target.checked.toString()
                            )
                        }
                        name="dropGroupColumns"
                        checked={
                            state.dropGroupingColumns === true ||
                            state.dropGroupingColumns === 'true' ||
                            false
                        }
                    />
                }
                label={t('jobDesigner:groupByConfiguration.DropGroupingColumns')}
            />
            <Autocomplete
                disabled={!ableToEdit}
                id="groupingColumns"
                multiple
                freeSolo
                autoSelect
                options={[]}
                value={groupingColumns}
                onChange={(event, value) =>
                    onChange('groupingColumns', value?.join(','))
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
                    <Box className={classes.groupBy}>
                        <TextField
                            {...params}
                            fullWidth
                            variant="outlined"
                            label={t('jobDesigner:groupByConfiguration.GroupBy')}
                            required
                        />
                    </Box>
                )}
            />
            <ConfigurationDivider />
            <PropertyList
                required
                ableToEdit={ableToEdit}
                items={groupingCriteria}
                onAddItem={() =>
                    onChange(
                        'groupingCriteria',
                        groupingCriteria.concat(':').join(',')
                    )
                }
                onChange={value => onChange('groupingCriteria', value.join(','))}
                label={t('jobDesigner:groupByConfiguration.AggregateFunctions')}
                handleItemChange={handleItemChange}
                options={aggregateFunctions}
            />
        </>
    );
};

GroupByConfiguration.propTypes = {
    ableToEdit: PropTypes.bool,
    state: PropTypes.object,
    onChange: PropTypes.func
};

export default GroupByConfiguration;
