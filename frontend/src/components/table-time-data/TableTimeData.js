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
import { Tooltip } from '@material-ui/core';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import useStyles from './TableTimeData.Styles';
import { DATE_FORMAT_UTC } from '../../globalConstants';

const NA = 'filters:N/A';

const TableTimeData = ({ lastRun, lastFinished, lastEdit }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const formatDate = date =>
        (date && moment.utc(date, DATE_FORMAT_UTC).fromNow()) || t(NA);

    const formatTooltip = date =>
        (date && moment(date, DATE_FORMAT_UTC).format(DATE_FORMAT_UTC)) || t(NA);

    return (
        <>
            <Tooltip title={formatTooltip(lastRun)} arrow>
                <span className={classes.item}>
                    <span className={classes.hint}>{t('filters:lastRun')}: </span>
                    {formatDate(lastRun)}
                </span>
            </Tooltip>
            <Tooltip title={formatTooltip(lastFinished)} arrow>
                <span className={classes.item}>
                    <span className={classes.hint}>
                        {t('filters:lastFinished')}:{' '}
                    </span>
                    {formatDate(lastFinished)}
                </span>
            </Tooltip>
            <Tooltip title={formatTooltip(lastEdit)} arrow>
                <span className={classes.item}>
                    <span className={classes.hint}>{t('filters:lastEdit')}: </span>
                    {formatDate(lastEdit)}
                </span>
            </Tooltip>
        </>
    );
};

TableTimeData.propTypes = {
    lastRun: PropTypes.string,
    lastFinished: PropTypes.string,
    lastEdit: PropTypes.string
};

export default TableTimeData;
