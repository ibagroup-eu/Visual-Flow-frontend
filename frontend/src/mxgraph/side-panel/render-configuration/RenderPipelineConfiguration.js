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
import { connect } from 'react-redux';

import { isEqual } from 'lodash';
import NotificationConfiguration from '../notification-configuration';
import JobConfiguration from '../configuration/job-configuration';
import Configuration from '../configuration';
import PipelineConfiguration from '../configuration/pipeline-configuration';
import ContainerConfiguration from '../container-configuration';
import { WAIT } from '../../constants';
import { findByProp } from '../../../components/helpers/JobsPipelinesTable';
import {
    findParamByKey,
    validParamsContainer
} from '../../../components/helpers/PipelinesValidation';

export const checkContainerFields = (params, inputValues) => {
    const fields = [
        inputValues.name,
        inputValues.image,
        inputValues.imagePullPolicy,
        inputValues.requestsCpu,
        inputValues.requestsMemory,
        inputValues.limitsCpu,
        inputValues.limitsMemory,
        inputValues.imagePullSecretType
    ];

    if (fields.includes(undefined)) {
        return true;
    }
    if (
        inputValues.imagePullSecretType === 'NEW' &&
        (!inputValues.username || !inputValues.password || !inputValues.registry)
    ) {
        return true;
    }
    if (
        inputValues.imagePullSecretType === 'PROVIDED' &&
        !inputValues.imagePullSecretName
    ) {
        return true;
    }
    if (inputValues.image || inputValues.imagePullSecretType) {
        return !validParamsContainer(params, inputValues);
    }

    return false;
};

export const checkNotification = (params, state) => {
    if (!state.name || !state.message || !state.addressees) {
        return true;
    }

    return !findParamByKey(params, [state.addressees]);
};

const RenderPipelineConfiguration = ({
    configuration,
    setPanelDirty,
    ableToEdit,
    saveCell,
    graph,
    jobs,
    params,
    pipelines,
    sidePanelIsOpen
}) => {
    const pipelinesConfigurationComponents = {
        NOTIFICATION: {
            component: Configuration,
            props: {
                Component: NotificationConfiguration,
                isDisabled: inputValues => checkNotification(params, inputValues),
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        JOB: {
            component: JobConfiguration,
            props: {
                isDisabled: inputValues =>
                    !inputValues.name ||
                    !inputValues.jobId ||
                    !findByProp(jobs, inputValues.jobId, 'id'),
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        CONTAINER: {
            component: Configuration,
            props: {
                Component: ContainerConfiguration,
                isDisabled: inputValues => checkContainerFields(params, inputValues),
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        PIPELINE: {
            component: PipelineConfiguration,
            props: {
                isDisabled: inputValues =>
                    !inputValues.name ||
                    !inputValues.pipelineId ||
                    !findByProp(pipelines, inputValues.pipelineId, 'id'),
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        }
    };

    const [state, setState] = useState(configuration);

    useEffect(() => {
        setState(configuration);
    }, [configuration, sidePanelIsOpen]);

    useEffect(() => {
        setPanelDirty(!isEqual(configuration, state));
    }, [state, configuration, setPanelDirty]);

    if (state.operation !== WAIT) {
        const component = pipelinesConfigurationComponents[state.operation];
        if (component) {
            const { component: Component, props } = component;
            return (
                <Component
                    {...props}
                    state={state}
                    setState={setState}
                    sidePanelIsOpen={sidePanelIsOpen}
                />
            );
        }
    }

    return null;
};

RenderPipelineConfiguration.propTypes = {
    configuration: PropTypes.object,
    setPanelDirty: PropTypes.func,
    ableToEdit: PropTypes.bool,
    saveCell: PropTypes.func,
    graph: PropTypes.object,
    jobs: PropTypes.array,
    params: PropTypes.array,
    pipelines: PropTypes.array,
    sidePanelIsOpen: PropTypes.bool
};

const mapStateToProps = state => ({
    jobs: state.pages.jobs.data.jobs,
    pipelines: state.pages.pipelines.data.pipelines,
    params: state.pages.settingsParameters.params,
    sidePanelIsOpen: state.mxGraph.sidePanelIsOpen
});

export default connect(mapStateToProps)(RenderPipelineConfiguration);
