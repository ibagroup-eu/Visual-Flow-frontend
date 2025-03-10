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
import { IconButton, Tooltip, useTheme } from '@material-ui/core';
import { PlayArrow, Stop, PauseTwoTone } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { DATABRICKS, PENDING, RUNNING, SUSPENDED } from '../../constants';

const ControlButtons = ({
    status,
    runnable,
    run,
    stop,
    suspend,
    resume,
    changesNotSaved
}) => {
    const stoppable = ![PENDING].includes(status);
    const PlayArrowColor = !runnable || changesNotSaved ? 'lightgrey' : 'green';
    const StopColor = stoppable ? 'red' : 'lightgrey';
    const Tip = changesNotSaved ? 'Please save your changes to run the job' : null;
    const { t } = useTranslation();
    const theme = useTheme();
    const isNotRunning = ![RUNNING, PENDING, SUSPENDED].includes(status);
    if (isNotRunning) {
        return (
            <div title={Tip}>
                <IconButton
                    disabled={!runnable || changesNotSaved}
                    aria-label="playArrowIcon"
                    onClick={run}
                >
                    <Tooltip title={t('jobs:tooltip.Play')} arrow>
                        <PlayArrow htmlColor={PlayArrowColor} />
                    </Tooltip>
                </IconButton>
            </div>
        );
    }
    return (
        <>
            <IconButton disabled={!stoppable} aria-label="stopIcon" onClick={stop}>
                <Tooltip title={t('jobs:tooltip.Stop')} arrow>
                    <Stop htmlColor={StopColor} />
                </Tooltip>
            </IconButton>
            {status === SUSPENDED && (
                <IconButton aria-label="resumeIcon" onClick={resume}>
                    <Tooltip title={t('pipelines:tooltip.Resume')} arrow>
                        <PlayArrow htmlColor={theme.palette.warning.main} />
                    </Tooltip>
                </IconButton>
            )}
            {status === RUNNING && (
                <IconButton
                    aria-label="suspendIcon"
                    onClick={suspend}
                    disabled={window.PLATFORM === DATABRICKS}
                >
                    <Tooltip title={t('pipelines:tooltip.Suspend')} arrow>
                        <PauseTwoTone
                            htmlColor={
                                window.PLATFORM === DATABRICKS
                                    ? 'lightgrey'
                                    : theme.palette.warning.main
                            }
                        />
                    </Tooltip>
                </IconButton>
            )}
        </>
    );
};

ControlButtons.propTypes = {
    status: PropTypes.string,
    runnable: PropTypes.bool,
    run: PropTypes.func,
    stop: PropTypes.func,
    suspend: PropTypes.func,
    resume: PropTypes.func,
    changesNotSaved: PropTypes.bool
};

export default ControlButtons;
