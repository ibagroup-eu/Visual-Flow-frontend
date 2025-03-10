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
    Tooltip,
    Typography,
    useTheme
} from '@material-ui/core';
import {
    Timeline,
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
    DoneOutlined,
    ExpandMoreOutlined,
    TimelineOutlined
} from '@material-ui/icons';
import moment from 'moment';
import classNames from 'classnames';
import { truncate } from 'lodash';
import useStyles from './HistoryRow.Styles';
import { DATE_FORMAT } from '../../../globalConstants';
import history from '../../../utils/history';
import HistoryRowDetails from '../history-row-details/HistoryRowDetails';
import HistoryRowDetailsHeader from '../history-row-details-header/HistoryRowDetailsHeader';

const duration = (finished, started) => {
    const timeDuration = moment.duration(
        moment(finished, DATE_FORMAT).diff(moment(started, DATE_FORMAT))
    );
    return `${Math.floor(timeDuration.asMinutes())}m ${
        timeDuration.seconds() < 10 ? '0' : ''
    }${timeDuration.seconds()}s`;
};

const sortRowHistory = data =>
    data?.sort((a, b) =>
        moment(b.startedAt, DATE_FORMAT).diff(moment(a.startedAt, DATE_FORMAT))
    ) || [];

const HistoryRow = ({ data, latest, logsHandler, projectId, type, findName }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const dotIcon = {
        Succeeded: { Icon: DoneOutlined, dotColor: theme.palette.success.light },
        Failed: { Icon: CloseOutlined, dotColor: theme.palette.error.light }
    };

    const { Icon, dotColor } = dotIcon[data.status] || dotIcon.Failed;

    const pipelineHandler = () => {
        history.push(`/pipelines/${projectId}/${data.pipelineId}`);
    };

    const formatTime = date =>
        moment(date, DATE_FORMAT).format(`[${t('main:history.At')}] HH:mm`);

    return (
        <TimelineItem className={classes.root}>
            <TimelineOppositeContent className={classes.timelineOpposite} />
            <TimelineSeparator>
                <TimelineDot
                    style={{ backgroundColor: dotColor }}
                    className={classes.timelineDot}
                >
                    <Icon className={classes.timelineDotSize} />
                </TimelineDot>
                {!latest && <TimelineConnector className={classes.connector} />}
            </TimelineSeparator>
            <TimelineContent className={classes.timelineContent}>
                <Box className={classes.mainContent}>
                    <Box className={classes.pipelineBox}>
                        {type === 'job' && data.flag === 'pipeline' && (
                            <Tooltip title={data.pipelineName || ''} arrow>
                                <IconButton
                                    className={classes.pipelineIcon}
                                    onClick={() => pipelineHandler()}
                                >
                                    <TimelineOutlined />
                                </IconButton>
                            </Tooltip>
                        )}
                        {data.statuses?.length > 0 && type !== 'job' && (
                            <IconButton
                                className={classNames(classes.moreIcon, {
                                    [classes.iconClose]: !open
                                })}
                                onClick={() => {
                                    setOpen(!open);
                                }}
                            >
                                <ExpandMoreOutlined />
                            </IconButton>
                        )}
                    </Box>
                    <Typography
                        className={classNames(
                            classes.typography,
                            classes.startedText
                        )}
                    >
                        {formatTime(data.startedAt)}
                    </Typography>
                    <Typography
                        className={classNames(
                            classes.typography,
                            classes.durationText
                        )}
                    >
                        {duration(data.finishedAt, data.startedAt)}
                    </Typography>
                    <Tooltip
                        arrow
                        title={data.startedBy?.length > 32 ? data.startedBy : ''}
                        interactive
                    >
                        <Typography
                            className={classNames(
                                classes.typography,
                                classes.runByText
                            )}
                        >
                            {truncate(data.startedBy, { length: 32 })}
                        </Typography>
                    </Tooltip>
                    {type === 'job' && (
                        <Box className={classes.logIconBox}>
                            <Tooltip title={t('jobs:tooltip.Logs')} arrow>
                                <div>
                                    <IconButton
                                        className={classes.logIcon}
                                        onClick={() =>
                                            logsHandler({
                                                jobId: data.jobId || data.id,
                                                logId: data.logId
                                            })
                                        }
                                    >
                                        <DescriptionOutlined />
                                    </IconButton>
                                </div>
                            </Tooltip>
                        </Box>
                    )}
                </Box>
                <Collapse in={open} timeout="auto" className={classes.collapsed}>
                    <HistoryRowDetailsHeader />
                    <Timeline className={classes.timeline}>
                        {sortRowHistory(data.statuses).map((item, index) => (
                            <HistoryRowDetails
                                key={`${item.startedAt + index}details`}
                                findName={findName}
                                data={item}
                                logsHandler={logsHandler}
                                latest={index === data.statuses.length - 1}
                            />
                        ))}
                    </Timeline>
                </Collapse>
            </TimelineContent>
        </TimelineItem>
    );
};

HistoryRow.propTypes = {
    data: PropTypes.object,
    latest: PropTypes.bool,
    logsHandler: PropTypes.func,
    projectId: PropTypes.string,
    type: PropTypes.string,
    findName: PropTypes.func
};

export default HistoryRow;
