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
import { Typography, TextField, Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import useStyles from './AggregationField.Styles';
import getMenuItems from '../../helpers/getMenuItems';
import { aggregateFunctions } from '../../groupby-configuration/GroupByConfiguration';

const AggregationField = ({
    ableToEdit,
    value,
    onChange,
    name,
    label,
    required
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [aggregate, column] = value?.split('(') || [];

    return (
        <Box>
            <Typography
                variant="body2"
                color="textSecondary"
                className={classes.text}
            >
                {label}
            </Typography>
            <Box className={classes.row}>
                <TextField
                    label={t('jobDesigner:Function')}
                    placeholder={t('jobDesigner:Function')}
                    disabled={!ableToEdit}
                    value={aggregate || ''}
                    className={classes.func}
                    name={name}
                    select
                    onChange={event =>
                        onChange(
                            event.target.name,
                            `${event.target.value}(${column?.slice(0, -1) || ''})`
                        )
                    }
                    required={required}
                >
                    {getMenuItems(aggregateFunctions)}
                </TextField>
                <TextField
                    label={t('jobDesigner:Column')}
                    placeholder={t('jobDesigner:Column')}
                    disabled={!ableToEdit}
                    value={column?.slice(0, -1) || ''}
                    name={name}
                    fullWidth
                    onChange={event =>
                        onChange(
                            event.target.name,
                            `${aggregate || ''}(${event.target.value})`
                        )
                    }
                    required={required}
                />
            </Box>
        </Box>
    );
};

AggregationField.propTypes = {
    required: PropTypes.bool,
    ableToEdit: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string
};

AggregationField.defaultProps = {
    required: false
};

export default AggregationField;
