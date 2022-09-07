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

import { Chip, Divider, TextField } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useStyles from '../groupby-configuration/GroupByConfiguration.Styles';
import PropertyList from '../property-list';

const orderBy = [
    {
        value: 'asc',
        label: 'asc'
    },
    {
        value: 'desc',
        label: 'desc'
    }
];

const RemoveDuplicatesConfiguration = ({ ableToEdit, state, onChange }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const orderColumns = state.orderColumns?.split(',') || [];

    const handleItemChange = (index, value) =>
        onChange(
            'orderColumns',
            [
                ...orderColumns.slice(0, index),
                value,
                ...orderColumns.slice(index + 1)
            ].join(',')
        );

    return (
        <>
            <Divider className={classes.divider} />
            <Autocomplete
                disabled={!ableToEdit}
                id="keyColumns"
                multiple
                freeSolo
                autoSelect
                options={[]}
                value={state.keyColumns?.split(',') || []}
                className={classes.divider}
                onChange={(event, value) => onChange('keyColumns', value?.join(','))}
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
                        label={t('jobDesigner:RemoveDuplConfiguration.Key')}
                        required
                    />
                )}
            />
            <Divider className={classes.divider} />
            <PropertyList
                ableToEdit={ableToEdit}
                items={orderColumns}
                defaultValue={orderBy[0].value}
                onAddItem={() =>
                    onChange('orderColumns', orderColumns.concat(':').join(','))
                }
                onChange={value => onChange('orderColumns', value.join(','))}
                label={t('jobDesigner:RemoveDuplConfiguration.OrderBy')}
                handleItemChange={handleItemChange}
                options={orderBy}
            />
        </>
    );
};

RemoveDuplicatesConfiguration.propTypes = {
    ableToEdit: PropTypes.bool,
    state: PropTypes.object,
    onChange: PropTypes.func
};

export default RemoveDuplicatesConfiguration;
