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
import { useTranslation } from 'react-i18next';
import { Divider, TextField } from '@material-ui/core';
import getMenuItems from '../helpers/getMenuItems';
import useStyles from './CacheConfiguration.Styles';

const values = [
    {
        value: 'true',
        label: 'True'
    },
    {
        value: 'false',
        label: 'False'
    }
];

const cacheDefaultValues = [
    { field: 'useDisk', value: 'true' },
    { field: 'useMemory', value: 'true' },
    { field: 'useOffHeap', value: 'false' },
    { field: 'deserialized', value: 'true' },
    { field: 'replication', value: '1', props: { min: 0, type: 'number' } }
];

const CacheConfiguration = ({ state, ableToEdit, onChange }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    useEffect(() => {
        if (state.useDisk === undefined && state.name) {
            cacheDefaultValues.forEach(({ field, value }) => onChange(field, value));
        }
    }, [state.name]);

    return (
        <>
            <Divider className={classes.divider} />
            {state.name &&
                cacheDefaultValues.map(({ field, value, props }, index) => (
                    <TextField
                        key={`${index + field.slice(0, 4)}`}
                        disabled={!ableToEdit}
                        label={t(`jobDesigner:cacheConfiguration.${field}`)}
                        placeholder={t(`jobDesigner:cacheConfiguration.${field}`)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        select={field !== 'replication'}
                        name={field}
                        value={state[field] || value}
                        inputProps={field !== 'replication' ? {} : props}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                    >
                        {field !== 'replication' && getMenuItems(values)}
                    </TextField>
                ))}
        </>
    );
};

CacheConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func
};

export default CacheConfiguration;
