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
import { Box, IconButton, Typography } from '@material-ui/core';
import { SwapVert } from '@material-ui/icons';

import useStyles from './JoinConfiguration.Styles';
import SelectField from '../../../components/select-field';
import { OTHER } from '../../constants';
import ConfigurationDivider from '../../../components/divider';
import AutocompleteParameter from '../autocomplete-parameter';

const joinTypes = [
    {
        value: 'inner',
        label: 'inner'
    },
    {
        value: 'full',
        label: 'full'
    },
    {
        value: 'left',
        label: 'left'
    },
    {
        value: 'right',
        label: 'right'
    },
    {
        value: 'cross',
        label: 'cross'
    },
    {
        value: 'leftanti',
        label: 'leftanti'
    },
    {
        value: 'leftsemi',
        label: 'leftsemi'
    }
];

const JoinConfiguration = ({
    state,
    ableToEdit,
    onChange,
    edgeLabels,
    handleSwap
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <>
            <SelectField
                ableToEdit={ableToEdit}
                label="jobDesigner:joinConfiguration.JoinType"
                name="joinType"
                value={state.joinType}
                handleInputChange={onChange}
                menuItems={joinTypes}
                type={OTHER}
                required
            />

            {state.joinType && (
                <>
                    <ConfigurationDivider />
                    <div className={classes.divider}>
                        <Typography variant="subtitle1" color="textSecondary">
                            {t('jobDesigner:joinConfiguration.LinkOrdering')}
                        </Typography>
                        <Box className={classes.wrapper}>
                            <div>
                                <div className={classes.row}>
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        className={classes.heading}
                                    >
                                        {`${t(
                                            'jobDesigner:joinConfiguration.Left'
                                        )}: `}
                                    </Typography>
                                    <Typography variant="body2" color="textPrimary">
                                        {edgeLabels.Left}
                                    </Typography>
                                </div>
                                <div className={classes.row}>
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        className={classes.heading}
                                    >
                                        {`${t(
                                            'jobDesigner:joinConfiguration.Right'
                                        )}: `}
                                    </Typography>
                                    <Typography variant="body2" color="textPrimary">
                                        {edgeLabels.Right}
                                    </Typography>
                                </div>
                            </div>
                            <IconButton disabled={!ableToEdit} onClick={handleSwap}>
                                <SwapVert />
                            </IconButton>
                        </Box>
                    </div>
                    {state.joinType !== 'cross' && (
                        <>
                            <ConfigurationDivider />
                            <div className={classes.divider}>
                                <AutocompleteParameter
                                    ableToEdit={ableToEdit}
                                    id="leftColumns"
                                    name="leftColumns"
                                    handleInputChange={event =>
                                        onChange(
                                            event.target.name,
                                            event.target.value
                                        )
                                    }
                                    state={state}
                                    label={t(
                                        'jobDesigner:joinConfiguration.leftKey'
                                    )}
                                    required
                                />
                                <AutocompleteParameter
                                    className={classes.divider}
                                    ableToEdit={ableToEdit}
                                    id="rightColumns"
                                    name="rightColumns"
                                    handleInputChange={event =>
                                        onChange(
                                            event.target.name,
                                            event.target.value
                                        )
                                    }
                                    state={state}
                                    label={t(
                                        'jobDesigner:joinConfiguration.rightKey'
                                    )}
                                    required
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
};

JoinConfiguration.propTypes = {
    ableToEdit: PropTypes.bool,
    state: PropTypes.object,
    onChange: PropTypes.func,
    edgeLabels: PropTypes.object,
    handleSwap: PropTypes.func
};

export default JoinConfiguration;
