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
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import PauseCircleOutlineOutlinedIcon from '@material-ui/icons/PauseCircleOutlineOutlined';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';
import SmsFailedOutlinedIcon from '@material-ui/icons/SmsFailedOutlined';
import StopOutlinedIcon from '@material-ui/icons/StopOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import DoneIcon from '@material-ui/icons/Done';
import { useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PendingIcon from '@material-ui/icons/Update';
import JobsPipelines from '../jobs-pipelines/JobsPipelines';

const PipelinesStats = ({ data, loading, setStatus, setCurrentPage }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const items = [
        {
            title: t('filters:statuses.Draft'),
            Icon: InfoOutlinedIcon,
            color: theme.palette.grey[600],
            data: data?.pipelinesStat?.Draft
        },
        {
            title: t('filters:statuses.Pending'),
            Icon: PendingIcon,
            IconColor: 'black',
            color: theme.palette.grey[400],
            data: data?.pipelinesStat?.Pending
        },
        {
            title: t('filters:statuses.Running'),
            Icon: PlayArrowIcon,
            color: theme.palette.primary.main,
            data: data?.pipelinesStat?.Running
        },
        {
            title: t('filters:statuses.Succeeded'),
            Icon: DoneIcon,
            color: theme.palette.success.main,
            data: data?.pipelinesStat?.Succeeded
        },
        {
            title: t('filters:statuses.Failed'),
            Icon: WarningOutlinedIcon,
            color: theme.palette.error.main,
            data: data?.pipelinesStat?.Failed
        },
        {
            title: t('filters:statuses.Stopped'),
            Icon: StopOutlinedIcon,
            color: theme.palette.warning.main,
            data: data?.pipelinesStat?.Stopped
        },
        {
            title: t('filters:statuses.Error'),
            Icon: SmsFailedOutlinedIcon,
            color: theme.palette.error.main,
            data: data?.pipelinesStat?.Error
        },
        {
            title: t('filters:statuses.Suspended'),
            Icon: PauseCircleOutlineOutlinedIcon,
            color: theme.palette.primary.light,
            data: data?.pipelinesStat?.Suspended
        },
        {
            title: t('filters:statuses.Terminated'),
            Icon: IndeterminateCheckBoxOutlinedIcon,
            color: theme.palette.warning.light,
            data: data?.pipelinesStat?.Terminated
        }
    ];
    return (
        <JobsPipelines
            items={items}
            loading={loading}
            title={t('main:overview.Pipelines')}
            setStatus={setStatus}
            setCurrentPage={setCurrentPage}
        />
    );
};

PipelinesStats.propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool,
    setStatus: PropTypes.func,
    setCurrentPage: PropTypes.func
};

export default PipelinesStats;
