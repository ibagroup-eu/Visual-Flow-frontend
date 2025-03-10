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
import { Box, MenuItem, Popper, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { get } from 'lodash';
import useStyles from './DateTimeConfiguration.Styles';
import schemas from '../schemas';
import { dayOfWeekData } from '../../../utils/getCronHint';
import ClearButton from '../helpers/ClearButton';
import { OTHER } from '../../constants';
import ConfigurationDivider from '../../../components/divider';

export const operationsType = [
    'current_date',
    'date_format',
    'to_date',
    'add_months',
    'date_add',
    'date_sub',
    'datediff',
    'months_between',
    'next_day',
    'year',
    'quarter',
    'month',
    'dayofweek',
    'dayofmonth',
    'dayofyear',
    'weekofyear',
    'last_day',
    'trunc',
    'current_timestamp',
    'hour',
    'minute',
    'second',
    'to_timestamp',
    'date_trunc',
    'unix_timestamp',
    'to_unix_timestamp',
    'from_unixtime'
];

const DateTimeConfiguration = ({ state, ableToEdit, onChange }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const schema = get(schemas, state.operation, []).slice(1);
    const menuItems = field =>
        field === 'option.dayOfWeek' ? dayOfWeekData : ['true', 'false'];

    return (
        <>
            {state.name && (
                <>
                    <Autocomplete
                        PopperComponent={props => (
                            <Popper
                                {...props}
                                disablePortal
                                modifiers={{
                                    flip: {
                                        enabled: false
                                    },
                                    preventOverflow: {
                                        enabled: false
                                    },
                                    hide: {
                                        enabled: false
                                    }
                                }}
                            />
                        )}
                        disabled={!ableToEdit}
                        name="function"
                        options={operationsType}
                        value={state.function || null}
                        onChange={(event, newValue) =>
                            onChange('function', newValue)
                        }
                        renderInput={params => (
                            <Box className={classes.operationType}>
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder={t(
                                        'jobDesigner:dateTimeConfiguration.operationType'
                                    )}
                                    label={t(
                                        'jobDesigner:dateTimeConfiguration.operationType'
                                    )}
                                    required
                                />
                            </Box>
                        )}
                    />
                    {state.function && <ConfigurationDivider />}
                    {schema.map(
                        ({ field, conditions }, index) =>
                            ((index === 0 && state.function) ||
                                conditions?.find(
                                    item => item.function === state.function
                                )) && (
                                <Box key={field} className={classes.wrapper}>
                                    <TextField
                                        disabled={!ableToEdit}
                                        label={t(
                                            `jobDesigner:dateTimeConfiguration.${field}`
                                        )}
                                        placeholder={t(
                                            `jobDesigner:dateTimeConfiguration.${field}`
                                        )}
                                        variant="outlined"
                                        fullWidth
                                        select={
                                            field === 'option.dayOfWeek' ||
                                            field === 'option.roundOff'
                                        }
                                        name={field}
                                        value={state[field] || ''}
                                        onChange={event =>
                                            onChange(
                                                event.target.name,
                                                event.target.value
                                            )
                                        }
                                        required
                                    >
                                        {(field === 'option.dayOfWeek' ||
                                            field === 'option.roundOff') &&
                                            menuItems(field).map(option => (
                                                <MenuItem
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                    </TextField>
                                    <ClearButton
                                        name={field}
                                        value={state[field]}
                                        ableToEdit={ableToEdit}
                                        handleInputChange={onChange}
                                        type={OTHER}
                                    />
                                </Box>
                            )
                    )}
                </>
            )}
        </>
    );
};

DateTimeConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func
};

export default DateTimeConfiguration;
