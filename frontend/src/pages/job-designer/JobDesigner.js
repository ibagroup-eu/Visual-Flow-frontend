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

import React, { useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { fetchJob, setFields } from '../../redux/actions/mxGraphActions';
import GraphDesigner from '../../mxgraph';
import { PageSkeleton } from '../../components/skeleton';
import { fetchParameters } from '../../redux/actions/settingsParametersActions';
import { DATABRICKS, JOB } from '../../mxgraph/constants';
import { fetchConnections } from '../../redux/actions/settingsConnectionsActions';
import validators from './validators';
import { fetchClusterUtils } from '../../redux/actions/clusterUtilsActions';

export const JobDesigner = ({
    project,
    jobId,
    loading,
    getJob,
    createFields,
    getParameters,
    getConnections,
    getClusterUtils
}) => {
    const { t } = useTranslation();

    const isValidPositive = useCallback(
        value => validators.isValidPositive(value, t),
        [t]
    );

    const isValidLimits = useCallback(
        (value, multiple, min, max) =>
            validators.isValidLimits(value, multiple, min, max, t),
        [t]
    );

    const isValidName = useCallback(value => validators.isValidName(value, t), [t]);

    const isValidRange = useCallback(
        (value, min, max) => validators.isValidRange(value, min, max, t),
        [t]
    );

    const isDatabricksPlatform = useMemo(
        () => window.PLATFORM !== DATABRICKS && [],
        []
    );

    const isNotDatabricksPlatform = useMemo(
        () => window.PLATFORM === DATABRICKS && [],
        []
    );

    React.useEffect(() => {
        createFields({
            NAME: {
                label: t('jobs:params.Name'),
                type: 'text',
                required: true,
                validate: isValidName
            },

            TAGS: {
                label: t('jobs:params.Tags'),
                type: 'chips',
                hint: t('jobs:params.TagsHint')
            },

            RESOURCES_PANEL: {
                label: t('jobs:params.ResourcesPanel'),
                type: 'section',
                needs: isNotDatabricksPlatform,
                fields: {
                    DRIVER_REQUEST_CORES: {
                        label: t('jobs:params.driverRequestCores'),
                        type: 'number',
                        inputProps: { step: 0.1, min: 0 },
                        validate: !isNotDatabricksPlatform && isValidPositive,
                        needs: isNotDatabricksPlatform
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
                        validate: !isNotDatabricksPlatform && isValidPositive,
                        needs: isNotDatabricksPlatform
                    },

                    EXECUTOR_CORES: {
                        label: t('jobs:params.executorCores'),
                        type: 'number',
                        inputProps: { step: 1, min: 0 },
                        validate: !isNotDatabricksPlatform && isValidPositive,
                        needs: isNotDatabricksPlatform
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
                        validate: !isNotDatabricksPlatform && isValidPositive,
                        needs: isNotDatabricksPlatform
                    },

                    SHUFFLE_PARTITIONS: {
                        label: t('jobs:params.shufflePartitions'),
                        type: 'number',
                        inputProps: { step: 1, min: 0 },
                        validate: !isNotDatabricksPlatform && isValidPositive,
                        needs: isNotDatabricksPlatform
                    }
                }
            },
            // will newer be visible
            JOB_CLUSTER: {
                type: 'section',
                needs: [],
                fields: {
                    CLUSTER_NAME: {
                        label: t('jobDesigner:Cluster.modal.title'),
                        type: 'text',
                        required: true,
                        validate: isValidName
                    },
                    POLICY: {
                        label: t('jobDesigner:Cluster.modal.policy'),
                        type: 'text'
                    },
                    NODES: {
                        type: 'radio',
                        radios: [
                            {
                                value: 'multy',
                                label: t('jobDesigner:Cluster.modal.multiNode')
                            },
                            {
                                value: 'single',
                                label: t('jobDesigner:Cluster.modal.singleNode')
                            }
                        ]
                    },
                    ACCESS_MODE: {
                        label: t('jobDesigner:Cluster.modal.accessMode'),
                        type: 'text'
                    },
                    DATABRICKS_RUNTIME_VERSION: {
                        label: t(
                            'jobDesigner:Cluster.modal.databricksRuntimeVersion'
                        ),
                        type: 'text'
                    },
                    USE_PHOTON_ACCELERATION: {
                        label: t('jobDesigner:Cluster.modal.usePhotonAcceleration'),
                        type: 'switch'
                    },
                    WORKER_TYPE: {
                        label: t('jobDesigner:Cluster.modal.workerType'),
                        type: 'text'
                    },
                    WORKERS: {
                        label: t('jobDesigner:Cluster.modal.workers'),
                        type: 'number',
                        inputProps: { step: 1, min: 1, max: 100000 },
                        required: true,
                        validate: value => isValidRange(value, 1, 100000)
                    },
                    MIN_WORKERS: {
                        label: t('jobDesigner:Cluster.modal.minWorkers'),
                        type: 'number',
                        inputProps: { step: 1, min: 1, max: 100000 },
                        required: true,
                        validate: value => isValidRange(value, 1, 100000)
                    },
                    MAX_WORKERS: {
                        label: t('jobDesigner:Cluster.modal.maxWorkers'),
                        type: 'number',
                        inputProps: { step: 1, min: 1, max: 100000 },
                        required: true,
                        validate: value => isValidRange(value, 1, 100000)
                    },
                    DRIVER_TYPE: {
                        label: t('jobDesigner:Cluster.modal.driverType'),
                        type: 'text'
                    },
                    NODE_TYPE: {
                        label: t('jobDesigner:Cluster.modal.nodeType'),
                        type: 'text'
                    },
                    AUTOSCALING_WORKERS: {
                        label: t('jobDesigner:Cluster.modal.autoscalingWorkers'),
                        type: 'switch'
                    },
                    AUTOSCALING_STORAGE: {
                        label: t('jobDesigner:Cluster.modal.autoscalingStorage'),
                        type: 'switch'
                    },
                    INSTANCE_PROFILE: {
                        type: 'switch'
                    },
                    CLUSTER_TAGS: {
                        type: 'text'
                    },
                    ON_DEMAND_SPOT: {
                        // type: 'slider'
                    },
                    IS_ON_DEMAND_SPOT: {
                        label: t('jobDesigner:Cluster.modal.isOnDemandSpot'),
                        type: 'switch'
                    },
                    ENABLE_CREDENTIAL: {
                        label: t('jobDesigner:Cluster.modal.enableCredential'),
                        type: 'switch'
                    },
                    AVAILABILITY_ZONE: {
                        label: t('jobDesigner:Cluster.modal.availabilityZone'),
                        type: 'text'
                    },
                    MAX_SPOT_PRICE: {
                        label: t('jobDesigner:Cluster.modal.maxSpotPrice'),
                        type: 'number',
                        inputProps: { step: 1, min: 1, max: 10000 },
                        adornment: t('jobDesigner:Cluster.modal.demandPrice'),
                        required: true,
                        validate: value => isValidRange(value, 1, 10000)
                    },
                    EBS_VOLUME_TYPE: {
                        label: t('jobDesigner:Cluster.modal.ebsVolumeType'),
                        type: 'text'
                    },
                    VOLUMES: {
                        label: t('jobDesigner:Cluster.modal.volumes'),
                        type: 'number',
                        inputProps: { step: 1, min: 1, max: 28 },
                        required: true,
                        validate: value => isValidRange(value, 1, 28)
                    },
                    DB_SIZE: {
                        label: t('jobDesigner:Cluster.modal.dbSize'),
                        type: 'number',
                        inputProps: { step: 1, min: 32, max: 28 },
                        required: true,
                        validate: value => isValidRange(value, 32, 4096)
                    },
                    SPARK_CONFIG: {
                        label: t('jobDesigner:Cluster.modal.sparkConfig'),
                        placeholder: t(
                            'jobDesigner:Cluster.modal.sparkConfigPlaceholder'
                        ),
                        type: 'text'
                    },
                    ENV_VAR: {
                        label: t('jobDesigner:Cluster.modal.envVar'),
                        placeholder:
                            'MY_VAR=hello\nMY_OTHER_VAR=$MY_VAR world\nMY_SECRET_DB_PASSWORD={{secrets/prod/database_password}}',
                        type: 'text'
                    },
                    DESTINATION: {
                        label: t('jobDesigner:Cluster.modal.destination'),
                        type: 'text'
                    },
                    LOG_PATH: {
                        label: t('jobDesigner:Cluster.modal.logPath'),
                        type: 'text'
                    },
                    REGION: {
                        label: t('jobDesigner:Cluster.modal.region'),
                        type: 'text'
                    },
                    CLUSTER_SCRIPTS: {
                        type: 'text'
                    },
                    SSH_PUBLIC_KEY: {
                        label: t('jobDesigner:Cluster.modal.sshPublicKey'),
                        placeholder: t('jobDesigner:Cluster.modal.sshPlaceholder'),
                        type: 'text'
                    },
                    CLUSTER_DATABRICKS_SCHEMA: {},
                    PREEMPTIBLE_INSTANCES: {
                        label: t('jobDesigner:Cluster.modal.preemptibleInstances'),
                        type: 'text'
                    },
                    GOOGLE_SERVICE_ACCOUNT: {
                        label: t('jobDesigner:Cluster.modal.googleServiceAccount'),
                        type: 'text'
                    },
                    LOCAL_SSDS: {
                        label: t('jobDesigner:Cluster.modal.localSSDs'),
                        type: 'text'
                    },
                    SPOT_INSTANCE: {
                        label: t('jobDesigner:Cluster.modal.spotInstance'),
                        type: 'text'
                    }
                }
            },

            RETRIES_PANEL: {
                label: t('jobs:params.RetriesPanel'),
                type: 'section',
                needs: isDatabricksPlatform,
                fields: {
                    UP_TO: {
                        label: t('jobs:params.retriesTotalTimeout'),
                        type: 'number',
                        inputProps: { step: 30, min: 30, max: 600 },
                        adornment: 'SEC',
                        helperText: t('jobs:params.TagsTotalTimeout'),
                        validate: value => isValidLimits(value, 30, 30, 600),
                        needs: isDatabricksPlatform
                    },
                    INTERVALS: {
                        label: t('jobs:params.retriesTimeoutPerTry'),
                        type: 'number',
                        inputProps: { step: 30, min: 30, max: 600 },
                        adornment: 'SEC',
                        helperText: t('jobs:params.TagsTimeoutPerTry'),
                        validate: value => isValidLimits(value, 30, 30, 600),
                        needs: isDatabricksPlatform
                    }
                }
            }
        });

        if (project) {
            getJob(project, jobId, t);
            getParameters(project);
            getConnections(project);
            if (window.PLATFORM === DATABRICKS) {
                getClusterUtils(project);
            }
        }
    }, [
        project,
        jobId,
        createFields,
        t,
        isValidName,
        isValidPositive,
        isValidLimits,
        isValidRange,
        getJob,
        getParameters,
        getConnections,
        getClusterUtils,
        isDatabricksPlatform,
        isNotDatabricksPlatform
    ]);

    return loading ? <PageSkeleton /> : <GraphDesigner type={JOB} />;
};

JobDesigner.propTypes = {
    project: PropTypes.string,
    jobId: PropTypes.string,
    loading: PropTypes.bool,
    getJob: PropTypes.func,
    createFields: PropTypes.func,
    getParameters: PropTypes.func,
    getConnections: PropTypes.func,
    getClusterUtils: PropTypes.func
};

const mapStateToProps = state => ({
    loading: state.mxGraph.loading
});

const mapDispatchToProps = {
    getJob: fetchJob,
    createFields: setFields,
    getParameters: fetchParameters,
    getConnections: fetchConnections,
    getClusterUtils: fetchClusterUtils
};

export default connect(mapStateToProps, mapDispatchToProps)(JobDesigner);
