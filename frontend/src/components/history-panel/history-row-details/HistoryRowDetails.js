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
import { Box, IconButton, Tooltip, Typography, useTheme } from '@material-ui/core';
import {
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator
} from '@material-ui/lab';
import {
    CloseOutlined,
    DescriptionOutlined,
    DoneOutlined
} from '@material-ui/icons';
import moment from 'moment';
import classNames from 'classnames';
import { truncate } from 'lodash';
import useStyles from './HistoryRowDetails.Styles';
import { DATE_FORMAT } from '../../../globalConstants';

const duration = (finished, started) => {
    const timeDuration = moment.duration(
        moment(finished, DATE_FORMAT).diff(moment(started, DATE_FORMAT))
    );
    return `${Math.floor(timeDuration.asMinutes())}m ${
        timeDuration.seconds() < 10 ? '0' : ''
    }${timeDuration.seconds()}s`;
};

const HistoryRowDetails = ({ data, latest, logsHandler, findName }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const theme = useTheme();
    const dataName = data?.name || findName(data.id);

    const dotIcon = {
        Succeeded: { Icon: DoneOutlined, dotColor: theme.palette.success.light },
        Failed: { Icon: CloseOutlined, dotColor: theme.palette.error.light }
    };

    const formatTime = date =>
        moment(date, DATE_FORMAT).format(`[${t('main:history.At')}] HH:mm`);

    const { Icon, dotColor } = dotIcon[data.status] || dotIcon.Failed;

    return (
        <TimelineItem className={classes.root}>
            <TimelineOppositeContent className={classes.opposite} />
            <TimelineSeparator>
                <TimelineDot
                    style={{ backgroundColor: dotColor }}
                    className={classes.dot}
                >
                    <Icon className={classes.dotSize} />
                </TimelineDot>
                {!latest && <TimelineConnector className={classes.connector} />}
            </TimelineSeparator>
            <TimelineContent className={classes.timelineContent}>
                <Tooltip
                    arrow
                    title={dataName?.length > 23 ? dataName : ''}
                    interactive
                >
                    <Typography
                        className={classNames(classes.typography, classes.nameText)}
                    >
                        {truncate(dataName, { length: 23 })}
                    </Typography>
                </Tooltip>
                <Typography
                    className={classNames(classes.typography, classes.startedText)}
                >
                    {formatTime(data.startedAt)}
                </Typography>
                <Typography
                    className={classNames(classes.typography, classes.durationText)}
                >
                    {duration(data.finishedAt, data.startedAt)}
                </Typography>
                <Box className={classes.logIconBox}>
                    <Tooltip title={t('jobs:tooltip.Logs')} arrow>
                        <div>
                            <IconButton
                                className={classes.logIcon}
                                onClick={() =>
                                    logsHandler({
                                        jobId: data.id,
                                        logId: data.logId
                                    })
                                }
                            >
                                <DescriptionOutlined />
                            </IconButton>
                        </div>
                    </Tooltip>
                </Box>
            </TimelineContent>
        </TimelineItem>
    );
};

HistoryRowDetails.propTypes = {
    data: PropTypes.object,
    latest: PropTypes.bool,
    logsHandler: PropTypes.func,
    findName: PropTypes.func
};

export default HistoryRowDetails;
