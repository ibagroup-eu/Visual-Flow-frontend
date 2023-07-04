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
import { Box, TextField, Typography } from '@material-ui/core';
import { uniqueId } from 'lodash';
import { useTranslation } from 'react-i18next';
import cron from 'cron-validate';
import { compose } from 'redux';
import useStyles from '../CronModal.Styles';
import trimCronValue from '../trimCronValue';

const errorMessageParams = [
    'minutes',
    'hours',
    'day of month',
    'months',
    'day of week'
];
const findReplace = inputStr => {
    const values = {
        daysOfMonth: 'day of month',
        daysOfWeek: 'day of week'
    };
    return Object.entries(values).reduce(
        (result, [search, replace]) => result.replace(search, replace),
        inputStr
    );
};
const additionalCheckParams = [
    {
        index: 2,
        value: 0,
        message: "Number 0 in day of month field is smaller than lower limit '1'"
    },
    {
        index: 3,
        value: 0,
        message: "Number 0 in months field is smaller than lower limit '1'"
    },
    {
        index: 4,
        value: 7,
        message: "Number 7 in day of week field is bigger than upper limit '6'"
    }
];
const correctDayOfWeekLabel = errorMessage => {
    if (errorMessage.includes('daysOfWeek field is bigger than')) {
        return errorMessage.replace("'7'", "'6'");
    }
    return errorMessage;
};
const defaultCronLabels = [
    { label: 'MINUTE (0-59)', error: false },
    { label: 'HOUR (0-23)', error: false },
    { label: 'DAY OF MONTH (1-31)', error: false },
    { label: 'MONTH (1-12)', error: false },
    { label: 'DAY OF WEEK (0-6)', error: false }
];
const CronInput = ({ cronValue, isUseCron, setCronValue, pipelineId }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [cronLabels, setCronLabels] = React.useState(defaultCronLabels);

    const removeLabelsErrors = () =>
        setCronLabels(prevState =>
            prevState.map(label => ({ ...label, error: false }))
        );

    React.useEffect(() => {
        if (pipelineId) {
            removeLabelsErrors();
        }
    }, [pipelineId]);
    const changeCronLabel = (index, value) =>
        setCronLabels(prevState =>
            prevState.map((label, i) => ({
                ...label,
                error: i === index ? value : label.error
            }))
        );

    const validateAdditional = (checkValue, inputValue) => {
        const valuesArray = checkValue.split(' ');
        if (valuesArray.length === 5) {
            valuesArray.forEach((value, index) => {
                value.split(/,|-|\//).forEach(valueItem => {
                    if (valueItem.length > 1 && valueItem[0] === '0') {
                        setCronValue({
                            value: inputValue,
                            errorMessage: `Leading zeros (value ${valueItem}) in ${errorMessageParams[index]} field are invalid.`
                        });
                        changeCronLabel(index, true);
                    }
                });

                if (value.includes('.')) {
                    setCronValue({
                        value: inputValue,
                        errorMessage: `Element ${value} of ${errorMessageParams[index]} field is invalid.`
                    });
                    changeCronLabel(index, true);
                }
            });

            additionalCheckParams.forEach(checkParams => {
                if (
                    valuesArray[checkParams.index]
                        .split(/,|-|\//)
                        .find(item => +item === checkParams.value)
                ) {
                    setCronValue({
                        value: inputValue,
                        errorMessage: checkParams.message
                    });
                    changeCronLabel(checkParams.index, true);
                }
            });
        }
    };

    const cronChange = event => {
        const inputValue = event.target.value;
        const checkValue = trimCronValue(inputValue);
        const cronValidate = cron(checkValue);
        if (cronValidate.isValid()) {
            setCronValue({ value: inputValue, errorMessage: '' });
            removeLabelsErrors();
        } else {
            let errorValues;
            if (!checkValue) {
                errorValues = [t('main:validation.notBlank')];
            } else {
                errorValues = cronValidate
                    .getError()
                    ?.map(compose(correctDayOfWeekLabel, findReplace));
            }
            setCronValue({
                value: inputValue,
                errorMessage: errorValues[0].split(' (Input cron:')[0]
            });
            errorMessageParams.forEach((param, index) => {
                changeCronLabel(
                    index,
                    errorValues.findIndex(value => value.includes(param)) !== -1
                );
            });
        }
        validateAdditional(checkValue, inputValue);
    };

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
    setCronValue: PropTypes.func,
    pipelineId: PropTypes.string
};

export default CronInput;
