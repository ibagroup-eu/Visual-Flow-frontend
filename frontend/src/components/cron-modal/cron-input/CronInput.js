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
import classNames from 'classnames';
import { Box, Typography, TextField } from '@material-ui/core';
import { uniqueId } from 'lodash';
import { useTranslation } from 'react-i18next';
import useStyles from '../CronModal.Styles';

const CronInput = ({ cronValue, isUseCron, cronChange, cronLabels }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <>
            <Box className={classes.messageBox}>
                {isUseCron && (
                    <Typography className={classes.errorLabel}>
                        {t(cronValue.errorMessage)}
                    </Typography>
                )}
            </Box>
            <Box className={classes.cronBox}>
                <TextField
                    disabled={!isUseCron}
                    variant="outlined"
                    fullWidth
                    value={cronValue.value}
                    InputProps={{ classes: { input: classes.cronInput } }}
                    onChange={cronChange}
                    error={!!cronValue.errorMessage}
                    className={classes.inputMinWidth}
                />
            </Box>
            <Box className={classes.labelsBox}>
                {cronLabels.map(value => {
                    const isErrorClass = value.error
                        ? classes.errorLabel
                        : classes.activeLabel;
                    const labelClass = isUseCron
                        ? isErrorClass
                        : classes.disabledColor;

                    return (
                        <Typography
                            key={uniqueId()}
                            className={classNames(classes.label, labelClass)}
                        >
                            {value.label}
                        </Typography>
                    );
                })}
            </Box>
        </>
    );
};

CronInput.propTypes = {
    cronValue: PropTypes.object,
    isUseCron: PropTypes.bool,
    cronChange: PropTypes.func,
    cronLabels: PropTypes.array
};

export default CronInput;
