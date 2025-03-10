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
import { IconButton, Tooltip } from '@material-ui/core';
import { BugReport, PlayArrow } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

const DebugRunButtons = ({ hasFailedStages, isRunnable, onDebug, onRunAll }) => {
    const DebugColor = hasFailedStages ? 'green' : 'lightgrey';
    const RunAllColor = isRunnable ? 'green' : 'lightgrey';
    const { t } = useTranslation();

    return (
        <div>
            <IconButton
                disabled={!isRunnable}
                aria-label="runAllIcon"
                onClick={onRunAll}
            >
                <Tooltip title={t('jobs:tooltip.RunAll')} arrow>
                    <PlayArrow htmlColor={RunAllColor} />
                </Tooltip>
            </IconButton>
            <IconButton
                disabled={!hasFailedStages}
                aria-label="debugIcon"
                onClick={onDebug}
            >
                <Tooltip title={t('jobs:tooltip.Debug')} arrow>
                    <BugReport htmlColor={DebugColor} />
                </Tooltip>
            </IconButton>
        </div>
    );
};

DebugRunButtons.propTypes = {
    hasFailedStages: PropTypes.bool.isRequired,
    isRunnable: PropTypes.bool.isRequired,
    onDebug: PropTypes.func.isRequired,
    onRunAll: PropTypes.func.isRequired
};

export default DebugRunButtons;
