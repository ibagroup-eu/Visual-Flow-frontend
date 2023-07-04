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
import { Box, Button, FormControlLabel, Switch } from '@material-ui/core';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import useStyles from './CronModal.Styles';
import HelperTable from './helper-table';
import CronInput from './cron-input/CronInput';
import { createCron, getCron, updateCron } from '../../redux/actions/cronActions';
import RunInfo from './run-info';
import CronPopupForm from './cron-popup-form/CronPopupForm';
import trimCronValue from './trimCronValue';

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

    const handleClose = () => {
        cronValue.value &&
            cronInit(cronState?.data.schedule, !cronState?.data.suspend);
        onClose();
    };

    React.useEffect(() => {
        if (pipelineId) {
            if (cronExists) {
                getCronValue(projectId, pipelineId);
            } else {
                cronInit('', false);
            }
        }
    }, [pipelineId, projectId, cronExists, getCronValue]);

    React.useEffect(() => {
        cronInit(cronState?.data.schedule, !cronState?.data.suspend);
    }, [cronState]);

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

    const updatePipeline = () => refreshPipeline?.();

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
        <CronPopupForm
            display={!!pipelineId}
            onClose={handleClose}
            loading={!!cronState?.loading}
        >
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
                    label={t('pipelines:tooltip.OnOff')}
                />
            </Box>
            <RunInfo cronValue={cronValue} isUseCron={isUseCron.current} />
            <CronInput
                cronValue={cronValue}
                isUseCron={isUseCron.current}
                setCronValue={setCronValue}
                pipelineId={pipelineId}
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
                    onClick={handleClose}
                >
                    {t('main:button.Cancel')}
                </Button>
            </Box>
        </CronPopupForm>
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
