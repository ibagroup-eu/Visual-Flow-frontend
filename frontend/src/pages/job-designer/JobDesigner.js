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
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { fetchJob, setFields } from '../../redux/actions/mxGraphActions';
import GraphDesigner from '../../mxgraph';
import { PageSkeleton } from '../../components/skeleton';
import { fetchParameters } from '../../redux/actions/settingsParametersActions';
import { JOB } from '../../mxgraph/constants';

const JobDesigner = ({
    project,
    jobId,
    loading,
    getJob,
    createFields,
    getParameters
}) => {
    const { t } = useTranslation();

    const isValidPositive = value =>
        value > 0 ? null : t('main:validation.positive');

    const isValidName = value => {
        const reg = /^[a-z0-9]([\w\\.-]*[a-z0-9])?$/i;
        if (!value.trim()) {
            return t('main:validation.notBlank');
        }
        if (value.length > 63) {
            return t('main:validation.incorrectJobLength');
        }
        if (!reg.test(value)) {
            return t('main:validation.incorrectCharacters');
        }
        return null;
    };

    React.useEffect(() => {
        createFields({
            NAME: {
                label: t('jobs:params.Name'),
                type: 'text',
                validate: isValidName
            },

            DRIVER_REQUEST_CORES: {
                label: t('jobs:params.driverRequestCores'),
                type: 'number',
                inputProps: { step: 0.1, min: 0 },
                validate: isValidPositive
            },

            DRIVER_CORES: {
                label: t('jobs:params.driverCores'),
                type: 'number',
                inputProps: { step: 1, min: 0 },
                validate: isValidPositive
            },

            DRIVER_MEMORY: {
                label: t('jobs:params.driverMemory'),
                type: 'number',
                inputProps: { step: 1, min: 0 },
                adornment: 'GB',
                validate: isValidPositive
            },

            EXECUTOR_REQUEST_CORES: {
                label: t('jobs:params.executorRequestCores'),
                type: 'number',
                inputProps: { step: 0.1, min: 0 },
                validate: isValidPositive
            },

            EXECUTOR_CORES: {
                label: t('jobs:params.executorCores'),
                type: 'number',
                inputProps: { step: 1, min: 0 },
                validate: isValidPositive
            },

            EXECUTOR_MEMORY: {
                label: t('jobs:params.executorMemory'),
                type: 'number',
                inputProps: { step: 1, min: 0 },
                adornment: 'GB',
                validate: isValidPositive
            },

            EXECUTOR_INSTANCES: {
                label: t('jobs:params.executorInstances'),
                type: 'number',
                inputProps: { step: 1, min: 0 },
                validate: isValidPositive
            },

            SHUFFLE_PARTITIONS: {
                label: t('jobs:params.shufflePartitions'),
                type: 'number',
                inputProps: { step: 1, min: 0 },
                validate: isValidPositive
            }
        });

        project && getJob(project, jobId, t) && getParameters(project);
    }, [project, jobId]);
    return loading ? <PageSkeleton /> : <GraphDesigner type={JOB} />;
};

JobDesigner.propTypes = {
    project: PropTypes.string,
    jobId: PropTypes.string,
    loading: PropTypes.bool,
    getJob: PropTypes.func,
    createFields: PropTypes.func,
    getParameters: PropTypes.func
};

const mapStateToProps = state => ({
    loading: state.mxGraph.loading
});

const mapDispatchToProps = {
    getJob: fetchJob,
    createFields: setFields,
    getParameters: fetchParameters
};

export default connect(mapStateToProps, mapDispatchToProps)(JobDesigner);
