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
import { connect } from 'react-redux';
import cron from 'cron-validate';
import { Button, Box, Switch, FormControlLabel } from '@material-ui/core';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import useStyles from './CronModal.Styles';
import PopupForm from '../popup-form';
import HelperTable from './helper-table';
import CronInput from './cron-input/CronInput';
import { createCron, getCron, updateCron } from '../../redux/actions/cronActions';
import { PageSkeleton } from '../skeleton';

const errorMessageParams = [
    'minutes',
    'hours',
    'daysOfMonth',
    'months',
    'daysOfWeek'
];

const additionalCheckParams = [
    {
        index: 2,
        value: 0,
        message: "Number 0 in dayOfMonth field is smaller than lower limit '1'"
    },
    {
        index: 3,
        value: 0,
        message: "Number 0 in months field is smaller than lower limit '1'"
    },
    {
        index: 4,
        value: 7,
        message: "Number 7 in daysOfWeek field is bigger than upper limit '6'"
    }
];

const trimCronValue = value => value.trim().replace(/ {2,}/g, ' ');

export const CronModal = ({
    cronPipeline: { pipelineId, cronExists },
    onClose,
    projectId,
    cronState,
    createCronValue,
    getCronValue,
    updateCronValue,
    refreshPipeline
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [isUseCron, setIsUseCron] = React.useState({
        current: false,
        initial: false
    });
    const [cronValue, setCronValue] = React.useState({
        value: '',
        errorMessage: ''
    });
    const [lastCronValue, setLastCronValue] = React.useState('');
    const [cronLabels, setCronLabels] = React.useState([
        { label: 'MINUTE (0-59)', error: false },
        { label: 'HOUR (0-23)', error: false },
        { label: 'DAY OF MONTH (1-31)', error: false },
        { label: 'MONTH (1-12)', error: false },
        { label: 'DAY OF WEEK (0-6)', error: false }
    ]);

    const removeLabelsErrors = () =>
        setCronLabels(prevState =>
            prevState.map(label => ({ ...label, error: false }))
        );

    const cronInit = (value, used) => {
        setCronValue({
            value,
            errorMessage: ''
        });
        setLastCronValue(value);
        setIsUseCron({
            current: used,
            initial: used
        });
    };

    React.useEffect(() => {
        pipelineId && removeLabelsErrors();

        pipelineId && cronExists && getCronValue(projectId, pipelineId);

        pipelineId && !cronExists && cronInit('', false);
    }, [pipelineId]);

    React.useEffect(() => {
        cronInit(cronState.data.schedule, !cronState.data.suspend);
    }, [cronState.data]);

    const changeCronLabel = (index, value) =>
        setCronLabels(prevState =>
            prevState.map((label, i) => ({
                ...label,
                error: i === index ? value : label.error
            }))
        );

    const cronChange = event => {
        const inputValue = event.target.value;
        const checkValue = trimCronValue(inputValue);

        const cronValidate = cron(checkValue);
        if (cronValidate.isValid()) {
            setCronValue({ value: inputValue, errorMessage: '' });
            removeLabelsErrors();
        } else {
            const errorValues = cronValidate.getError();

            if (
                errorValues[0].includes(
                    "daysOfWeek field is bigger than upper limit '7'"
                )
            ) {
                const newErrorValue = errorValues[0].replace("'7'", "'6'");
                errorValues[0] = newErrorValue;
            }

            setCronValue({
                value: inputValue,
                errorMessage: errorValues[0].split(' (Input cron:')[0]
            });

            errorMessageParams.forEach((param, index) => {
                errorValues.findIndex(value => value.includes(param)) !== -1
                    ? changeCronLabel(index, true)
                    : changeCronLabel(index, false);
            });
        }

        const valuesArray = checkValue.split(' ');
        if (valuesArray.length === 5) {
            valuesArray.forEach((value, index) => {
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

    const disableSaveButton = () => {
        if (cronValue.errorMessage && isUseCron.current) {
            return true;
        }

        if (cronValue.value === '') {
            return true;
        }

        return (
            cronValue.value === lastCronValue &&
            isUseCron.current === isUseCron.initial
        );
    };

    const updatePipeline = () => {
        if (refreshPipeline) {
            refreshPipeline();
        }
    };

    const saveCron = () => {
        const cronData = {
            schedule: trimCronValue(cronValue.value),
            suspend: !isUseCron.current
        };
        if (cronExists) {
            updateCronValue(projectId, pipelineId, cronData).then(updatePipeline);
        } else {
            createCronValue(projectId, pipelineId, cronData).then(updatePipeline);
        }
        onClose();
    };

    return (
        <PopupForm
            display={!!pipelineId}
            title={t('pipelines:tooltip.Cron')}
            onClose={onClose}
            isNotHelper
            minWidthClass="cronMinWidth"
        >
            {cronState.loading ? (
                <PageSkeleton />
            ) : (
                <>
                    <Box className={classes.switchBox}>
                        <FormControlLabel
                            control={
                                <Switch
                                    color="primary"
                                    onChange={event =>
                                        setIsUseCron(prevState => ({
                                            ...prevState,
                                            current: event.target.checked
                                        }))
                                    }
                                    checked={isUseCron.current}
                                />
                            }
                            label={t('pipelines:tooltip.UseCron')}
                        />
                    </Box>
                    <CronInput
                        cronValue={cronValue}
                        isUseCron={isUseCron.current}
                        cronChange={cronChange}
                        cronLabels={cronLabels}
                    />
                    <HelperTable isUseCron={isUseCron.current} />
                    <Box className={classes.buttonsGroup}>
                        <Button
                            disabled={disableSaveButton()}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={saveCron}
                        >
                            {t('main:button.Save')}
                        </Button>
                        <Button
                            className={classNames(classes.button, classes.cancelBtn)}
                            variant="contained"
                            onClick={() => onClose()}
                        >
                            {t('main:button.Cancel')}
                        </Button>
                    </Box>
                </>
            )}
        </PopupForm>
    );
};

CronModal.propTypes = {
    cronPipeline: PropTypes.object,
    onClose: PropTypes.func,
    projectId: PropTypes.string,
    cronState: PropTypes.object,
    createCronValue: PropTypes.func,
    getCronValue: PropTypes.func,
    updateCronValue: PropTypes.func,
    refreshPipeline: PropTypes.func
};

const mapStateToProps = state => ({
    cronState: state.pages.cron
});

const mapDispatchToProps = {
    createCronValue: createCron,
    getCronValue: getCron,
    updateCronValue: updateCron
};

export default connect(mapStateToProps, mapDispatchToProps)(CronModal);
