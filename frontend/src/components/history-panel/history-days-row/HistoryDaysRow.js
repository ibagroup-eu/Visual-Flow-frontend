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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Collapse,
    IconButton,
    ListItem,
    Tooltip,
    Typography
} from '@material-ui/core';
import { Timeline } from '@material-ui/lab';
import { ExpandMoreOutlined } from '@material-ui/icons';
import moment from 'moment';
import classNames from 'classnames';
import useStyles from './HistoryDaysRow.Styles';
import { DATE_FORMAT } from '../../../globalConstants';
import HistoryRow from '../history-row/HistoryRow';

const formatDate = date => moment(date, DATE_FORMAT);

const today = moment()
    .utc(DATE_FORMAT)
    .endOf('d');

const yesterday = moment()
    .utc(DATE_FORMAT)
    .subtract(1, 'd')
    .endOf('day');

const HistoryDaysRow = ({
    dayHistory,
    isOpen,
    logsHandler,
    projectId,
    type,
    findName
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [open, setOpen] = useState(isOpen);

    const dayTooltip = date =>
        today.isSame(date, 'd') || yesterday.isSame(date, 'd')
            ? date.format('ddd MMM DD YYYY')
            : '';

    const formatDays = date => {
        if (today.isSame(date, 'd')) {
            return t('main:history.Today');
        }
        if (yesterday.isSame(date, 'd')) {
            return t('main:history.Yesterday');
        }
        return date.format('ddd MMM DD YYYY');
    };

    return (
        <ListItem disableGutters className={classes.root}>
            <Box
                className={classes.header}
                onClick={() => {
                    setOpen(!open);
                }}
            >
                <IconButton
                    className={classNames(classes.headerIcon, {
                        [classes.headerIconClose]: !open
                    })}
                >
                    <ExpandMoreOutlined />
                </IconButton>
                <Tooltip
                    title={dayTooltip(formatDate(dayHistory[0].startedAt))}
                    arrow
                >
                    <Typography variant="h6">
                        {formatDays(formatDate(dayHistory[0].startedAt))}
                    </Typography>
                </Tooltip>
            </Box>
            <Collapse in={open} timeout="auto" className={classes.collapsed}>
                <Timeline className={classes.timeline}>
                    {dayHistory.map((data, dateIndex) => (
                        <HistoryRow
                            key={data.uniqId}
                            type={type}
                            data={data}
                            projectId={projectId}
                            logsHandler={logsHandler}
                            latest={dateIndex === dayHistory.length - 1}
                            findName={findName}
                        />
                    ))}
                </Timeline>
            </Collapse>
        </ListItem>
    );
};

HistoryDaysRow.propTypes = {
    dayHistory: PropTypes.array,
    isOpen: PropTypes.bool,
    logsHandler: PropTypes.func,
    projectId: PropTypes.string,
    type: PropTypes.string,
    findName: PropTypes.func
};

export default HistoryDaysRow;
