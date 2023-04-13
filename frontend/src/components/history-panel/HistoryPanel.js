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

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Drawer, IconButton, List, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import { groupBy, isNil } from 'lodash';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useStyles from './HistoryPanel.Styles';
import HistoryHeader from './history-header/HistoryHeader';
import { DATE_FORMAT } from '../../globalConstants';
import { PageSkeleton } from '../skeleton';
import LogsModal from '../../pages/logs-modal';
import HistoryListHeader from './history-list-header/HistoryListHeader';
import HistoryDaysRow from './history-days-row/HistoryDaysRow';
import {
    fetchJobHistory,
    fetchPipelineHistory
} from '../../redux/actions/historyActions';

const sortHistory = data =>
    data?.sort((a, b) =>
        moment(b.startedAt, DATE_FORMAT).diff(moment(a.startedAt, DATE_FORMAT))
    ) || [];

const groupHistory = data =>
    Object.entries(
        groupBy(data, obj =>
            moment()
                .endOf('d')
                .diff(moment(obj.startedAt, DATE_FORMAT).endOf('d'))
        )
    );

const HistoryPanel = ({
    data,
    display,
    onClose,
    type = 'job',
    historyData,
    loading,
    projectId,
    getJobHistory,
    getPipelineHistory
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const sortByDate = sortHistory(historyData);
    const groupByDate = groupHistory(sortByDate);
    const [logsModal, setLogsModal] = useState(false);
    const [logId, setLogId] = useState(null);
    const [jobId, setJobId] = useState(null);

    useEffect(() => {
        if (display) {
            if (type === 'job') {
                getJobHistory(projectId, data.id);
            } else {
                getPipelineHistory(projectId, data.id);
            }
        }
    }, [display, data.id, getJobHistory, getPipelineHistory, projectId, type]);

    const findName = currentId =>
        data?.definition?.graph.find(obj => obj.value.jobId === currentId)?.value
            .name || '';

    const setShowLogsModal = logIds => {
        setLogId(logIds.logId);
        setJobId(logIds.jobId);
        setLogsModal(true);
    };

    return (
        <div className={classes.root}>
            <Drawer
                open={display}
                onClose={onClose}
                anchor="right"
                classes={{ paper: classes.drawer }}
            >
                {loading ? (
                    <PageSkeleton />
                ) : (
                    <Box className={classes.form}>
                        <LogsModal
                            display={logsModal}
                            projectId={projectId}
                            jobId={jobId}
                            logId={logId}
                            onClose={() => setLogsModal(false)}
                        />
                        <Box className={classes.content}>
                            <Box className={classes.header}>
                                <HistoryHeader
                                    status={
                                        !isNil(groupByDate) && sortByDate[0]
                                            ? sortByDate[0].status
                                            : data.status
                                    }
                                    name={data.name}
                                    startedBy={
                                        !isNil(groupByDate) && sortByDate[0]
                                            ? sortByDate[0].startedBy
                                            : ''
                                    }
                                />
                                <IconButton
                                    className={classes.closeIcon}
                                    onClick={onClose}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            {isNil(groupByDate) || groupByDate.length === 0 ? (
                                <Box className={classes.emptyList}>
                                    <Typography variant="h6">
                                        {t('main:history.EmptyList')}
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    <HistoryListHeader type={type} />
                                    <List disablePadding className={classes.list}>
                                        {groupByDate.map((day, index) => (
                                            <HistoryDaysRow
                                                key={day[0]}
                                                type={type}
                                                dayHistory={day[1]}
                                                findName={findName}
                                                logsHandler={setShowLogsModal}
                                                projectId={projectId}
                                                isOpen={index < 2}
                                            />
                                        ))}
                                    </List>
                                </>
                            )}
                        </Box>
                    </Box>
                )}
            </Drawer>
        </div>
    );
};

HistoryPanel.propTypes = {
    data: PropTypes.object,
    type: PropTypes.string,
    loading: PropTypes.bool,
    historyData: PropTypes.array,
    projectId: PropTypes.string,
    getJobHistory: PropTypes.func,
    getPipelineHistory: PropTypes.func,
    display: PropTypes.bool,
    onClose: PropTypes.func
};

const mapStateToProps = state => ({
    loading: state.pages.history.loading,
    historyData: state.pages.history.data
});

const mapDispatchToProps = {
    getJobHistory: fetchJobHistory,
    getPipelineHistory: fetchPipelineHistory
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryPanel);
