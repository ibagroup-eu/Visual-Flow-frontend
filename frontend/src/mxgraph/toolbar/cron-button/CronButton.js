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

import { IconButton, Tooltip } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import EventIcon from '@material-ui/icons/Event';
import CronModal from '../../../components/cron-modal';

const CronButton = ({ projectId, pipeline, refresh, changesNotSaved }) => {
    const { t } = useTranslation();
    const Tip = changesNotSaved ? t('pipelines:changesNotSaved') : null;

    const [cronPipeline, setCronPipeline] = React.useState({
        pipelineId: '',
        cronExists: false
    });

    const openCronModal = () =>
        setCronPipeline({ pipelineId: pipeline.id, cronExists: pipeline.cron });

    const closeCronModal = () => {
        setCronPipeline({ pipelineId: '', cronExists: false });
    };

    return (
        <div title={Tip}>
            <CronModal
                cronPipeline={cronPipeline}
                onClose={closeCronModal}
                projectId={projectId}
                refreshPipeline={refresh}
            />
            <IconButton
                disabled={changesNotSaved}
                aria-label="cronIcon"
                onClick={openCronModal}
            >
                <Tooltip title={t('pipelines:tooltip.Scheduling')} arrow>
                    {pipeline.cron && !pipeline.cronSuspend ? (
                        <EventIcon />
                    ) : (
                        <CalendarTodayIcon />
                    )}
                </Tooltip>
            </IconButton>
        </div>
    );
};

CronButton.propTypes = {
    pipeline: PropTypes.object,
    refresh: PropTypes.func,
    changesNotSaved: PropTypes.bool,
    projectId: PropTypes.string
};

export default CronButton;
