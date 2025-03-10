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
import { TextField, Box, Switch, FormControlLabel } from '@material-ui/core';
import { isNil } from 'lodash';
import useStyles from './CacheConfiguration.Styles';
import ConfigurationDivider from '../../../components/divider';

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
    const { useDisk, name } = state;

    useEffect(() => {
        if (useDisk === undefined && name) {
            cacheDefaultValues.forEach(({ field, value }) => onChange(field, value));
        }
    }, [name, useDisk, onChange]);

    return (
        <>
            {name && <ConfigurationDivider />}
            {name &&
                cacheDefaultValues.map(({ field, value, props }) => (
                    <Box key={field} className={classes.field}>
                        {field !== 'replication' ? (
                            <FormControlLabel
                                className={classes.root}
                                control={
                                    <Switch
                                        color="primary"
                                        onChange={event =>
                                            onChange(
                                                field,
                                                String(event.target.checked)
                                            )
                                        }
                                        checked={
                                            !isNil(value)
                                                ? state[field] === 'true'
                                                : false
                                        }
                                    />
                                }
                                label={t(`jobDesigner:cacheConfiguration.${field}`)}
                                labelPlacement="start"
                            />
                        ) : (
                            <TextField
                                disabled={!ableToEdit}
                                label={t(`jobDesigner:cacheConfiguration.${field}`)}
                                placeholder={t(
                                    `jobDesigner:cacheConfiguration.${field}`
                                )}
                                variant="outlined"
                                fullWidth
                                name={field}
                                value={state[field] || value}
                                inputProps={props}
                                onChange={event =>
                                    onChange(event.target.name, event.target.value)
                                }
                            />
                        )}
                    </Box>
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
