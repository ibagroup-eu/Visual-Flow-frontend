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

import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { ParamsSwitchField } from '../../sidebar/params/fields';
import useFetchJobMetadata from './useFetchJobMetadata';

const InteractiveModeToggle = ({
    interactiveMode,
    toggleInteractiveMode,
    currentProject,
    currentJob,
    runId,
    getJobMetadata,
    run,
    stop,
    ableToEdit = true
}) => {
    const { t } = useTranslation();

    const prevInteractiveMode = useRef();

    useEffect(() => {
        if (prevInteractiveMode.current !== undefined && interactiveMode) {
            getJobMetadata(currentProject, currentJob, runId);
        }
        prevInteractiveMode.current = interactiveMode;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interactiveMode]);

    const refreshMetadata = () => getJobMetadata(currentProject, currentJob, runId);

    useFetchJobMetadata(interactiveMode, refreshMetadata);

    const handleToggleInteractiveMode = () => {
        toggleInteractiveMode(!interactiveMode);

        if (!interactiveMode) {
            run(currentProject, currentJob, true);
        } else {
            stop(currentProject, currentJob, true);
        }
    };

    return (
        <ParamsSwitchField
            ableToEdit={ableToEdit}
            label={t('jobs:Interactive Mode')}
            name="interactiveMode"
            value={interactiveMode}
            onChange={handleToggleInteractiveMode}
            type="boolean"
            defaultValue={false}
        />
    );
};

InteractiveModeToggle.propTypes = {
    interactiveMode: PropTypes.bool,
    toggleInteractiveMode: PropTypes.func,
    currentProject: PropTypes.string,
    currentJob: PropTypes.string,
    runId: PropTypes.string,
    getJobMetadata: PropTypes.func,
    run: PropTypes.func,
    stop: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default InteractiveModeToggle;
