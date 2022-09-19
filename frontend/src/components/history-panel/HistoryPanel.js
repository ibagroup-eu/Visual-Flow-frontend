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
import classNames from 'classnames';
import { Box, Drawer, IconButton, List } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import { groupBy, isEqual } from 'lodash';
import { connect } from 'react-redux';
import useStyles from './HistoryPanel.Styles';
import HistoryHeader from './history-header/HistoryHeader';
import { DATE_FORMAT } from '../../globalConstants';
import { PageSkeleton } from '../skeleton';
import LogsModal from '../../pages/logs-modal';
import { setLogsModal } from '../../redux/actions/mxGraphActions';
import HistoryListHeader from './history-list-header/HistoryListHeader';
import HistoryDaysRow from './history-days-row/HistoryDaysRow';
import fetchJobHistory from '../../redux/actions/historyActions';

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
    jobData,
    setPanelState,
    historyData,
    loading,
    showLogsModal,
    setLogs,
    projectId,
    getHistory
}) => {
    const classes = useStyles();
    const sortByDate = sortHistory(historyData);
    const groupByDate = groupHistory(sortByDate);

    const [logsId, setLogsId] = useState(null);
    const [dateGroups, setDateGroups] = useState(groupByDate);

    useEffect(() => {
        if (!isEqual(jobData, {})) {
            getHistory(projectId, jobData.id);
        }
    }, [jobData]);

    useEffect(() => {
        if (historyData) {
            setDateGroups(groupByDate);
        }
    }, [historyData]);

    const confirmCancel = () => {
        setPanelState({});
    };

    const setShowLogsModal = id => {
        setLogsId(id);
        setLogs(true);
    };

    return (
        <div className={classes.root}>
            <LogsModal
                display={showLogsModal}
                projectId={projectId}
                jobId={logsId}
                onClose={() => setLogs(false)}
            />
            <Drawer
                open={!isEqual(jobData, {})}
                onClose={() => confirmCancel()}
                anchor="right"
                classes={{ paper: classes.drawer }}
            >
                {loading ? (
                    <PageSkeleton />
                ) : (
                    <div className={classNames(classes.content)}>
                        <Box className={classes.form}>
                            <Box className={classes.header}>
                                <HistoryHeader
                                    status={
                                        sortByDate[0] ? sortByDate[0].status : ''
                                    }
                                    name={jobData.name}
                                    startedBy={
                                        sortByDate[0] ? sortByDate[0].startedBy : ''
                                    }
                                />
                                <IconButton
                                    className={classes.closeIcon}
                                    onClick={confirmCancel}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <HistoryListHeader />
                            <List disablePadding className={classes.list}>
                                {dateGroups.map((day, index) => (
                                    <HistoryDaysRow
                                        key={day[0]}
                                        dayHistory={day[1]}
                                        logsHandler={setShowLogsModal}
                                        projectId={projectId}
                                        isOpen={index < 2}
                                    />
                                ))}
                            </List>
                        </Box>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

HistoryPanel.propTypes = {
    setPanelState: PropTypes.func,
    jobData: PropTypes.object,
    loading: PropTypes.bool,
    historyData: PropTypes.array,
    showLogsModal: PropTypes.bool,
    setLogs: PropTypes.func,
    projectId: PropTypes.string,
    getHistory: PropTypes.func
};

const mapStateToProps = state => ({
    projectId: state.projects.currentProject,
    showLogsModal: state.mxGraph.showLogsModal,
    loading: state.pages.history.loading,
    historyData: state.pages.history.data
});

const mapDispatchToProps = {
    setLogs: setLogsModal,
    getHistory: fetchJobHistory
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryPanel);
