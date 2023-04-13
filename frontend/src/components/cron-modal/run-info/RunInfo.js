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
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import parser from 'cron-parser';
import moment from 'moment';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import useStyles from '../CronModal.Styles';
import { DATE_FORMAT_UTC, DATE_FORMAT_Z } from '../../../globalConstants';
import getCronHint from '../../../utils/getCronHint';

export const correctInvalidCron = cronValue =>
    cronValue
        .split(' ')
        .map(value =>
            value
                .split(',')
                .map(val => {
                    const items = val.split('-');
                    if (items[0] === items[1]) {
                        return items[0];
                    }
                    return val;
                })
                .join(',')
        )
        .join(' ');

const RunInfo = ({ cronValue, isUseCron }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const computeNextCron = cron => {
        const utc = moment.utc(
            parser
                .parseExpression(cron, { utc: true })
                .next()
                .toISOString(),
            DATE_FORMAT_UTC
        );

        const nextRun = utc.local().format(DATE_FORMAT_Z);

        return `${t('pipelines:cronInfo.nextAt')}: ${nextRun}`;
    };

    let nextCron = '';
    let cronHint = '';
    if (!cronValue.errorMessage && cronValue.value) {
        try {
            nextCron = computeNextCron(cronValue.value);
        } catch (error) {
            const errorMessage = error.message;
            if (errorMessage.startsWith('Invalid range')) {
                const validCronValue = correctInvalidCron(cronValue.value);
                nextCron = computeNextCron(validCronValue);
            }
        }
        cronHint = getCronHint(cronValue.value);
    }

    const colorClass = isUseCron ? classes.runInfoLabel : classes.disabledColor;

    return (
        <>
            <Typography
                className={classNames(
                    classes.messageBox,
                    classes.runTimeLabel,
                    colorClass
                )}
            >
                {!cronHint ? t('pipelines:cronInfo.helperText') : cronHint}
            </Typography>
            <Typography
                className={classNames(
                    classes.messageBox,
                    classes.nextCron,
                    colorClass
                )}
            >
                {nextCron}
            </Typography>
        </>
    );
};

RunInfo.propTypes = {
    cronValue: PropTypes.object,
    isUseCron: PropTypes.bool
};

export default RunInfo;
