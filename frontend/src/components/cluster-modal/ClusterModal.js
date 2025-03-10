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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Box, Grid, Slider, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { v4 as uuidv4 } from 'uuid';
import { noop } from 'lodash';
import { useSelector } from 'react-redux';
import useStyles from './ClusterModal.Styles';
import PopupForm from '../popup-form';
import {
    ParamsSwitchField,
    ParamsTextField
} from '../../mxgraph/sidebar/params/fields';
import SelectField from '../select-field';
import { AWS, AZURE, GCP, READWRITE } from '../../mxgraph/constants';
import TagsSchema from './schemas/tags-schema/TagsSchema';
import RadioGroup from '../radio-group/RadioGroup';
import Tabs from './advancedOptions/Tabs.js';
import AdvancedAWSContent from './advancedOptions/AdvancedAWSContent.js';

const CLUSTER_NAME = 'CLUSTER_NAME';
const POLICY = 'POLICY';
const NODES = 'NODES';
const ACCESS_MODE = 'ACCESS_MODE';
const DATABRICKS_RUNTIME_VERSION = 'DATABRICKS_RUNTIME_VERSION';
const USE_PHOTON_ACCELERATION = 'USE_PHOTON_ACCELERATION';
const WORKER_TYPE = 'WORKER_TYPE';
const WORKERS = 'WORKERS';
const MIN_WORKERS = 'MIN_WORKERS';
const MAX_WORKERS = 'MAX_WORKERS';
const DRIVER_TYPE = 'DRIVER_TYPE';
const NODE_TYPE = 'NODE_TYPE';
const AUTOSCALING_WORKERS = 'AUTOSCALING_WORKERS';
const AUTOSCALING_STORAGE = 'AUTOSCALING_STORAGE';
const INSTANCE_PROFILE = 'INSTANCE_PROFILE';
const CLUSTER_TAGS = 'CLUSTER_TAGS';
const CLUSTER_SCRIPTS = 'CLUSTER_SCRIPTS';
// GCP
const PREEMPTIBLE_INSTANCES = 'PREEMPTIBLE_INSTANCES';
const GOOGLE_SERVICE_ACCOUNT = 'GOOGLE_SERVICE_ACCOUNT';
// AZURE
const SPOT_INSTANCE = 'SPOT_INSTANCE';

const accessMode = [
    {
        value: 'SINGLE_USER',
        label: 'Single user'
    },
    {
        value: 'USER_ISOLATION',
        label: 'Shared'
    },
    {
        value: 'NONE',
        label: 'No isolation shared'
    }
];

// eslint-disable-next-line complexity
const ClusterModal = ({
    fields = {},
    state = {},
    onChange,
    onError,
    errors = {},
    // parentRef,
    display,
    onClose,
    ableToEdit,
    setState
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const firstLoading = useRef(null);
    const tagsSchemaRef = useRef(null);
    const scriptsSchemaRef = useRef(null);

    const [adornmentWorker, setAdornmentWorker] = useState('');
    const [adornmentDriver, setAdornmentDriver] = useState('');
    const [adornmentNode, setAdornmentNode] = useState('');
    const nodeTypes = useSelector(store => store.clusterUtils.data.node_types || []);
    const policies = useSelector(store => store.clusterUtils.data.policies || []);
    const versions = useSelector(store => store.clusterUtils.data.versions || []);
    // const instanceProfiles = useSelector(state => state.clusterUtils.data.instance_profiles);
    const zones = useSelector(store => store.clusterUtils.data.zones || []);
    const cloud = useSelector(
        store => store.pages.settingsBasic?.project?.cloud || ''
    );

    const policiesValues = useMemo(
        () =>
            policies.map(policy => ({
                value: policy.policy_id,
                label: policy.name
            })),
        [policies]
    );

    const nodeTypesValues = useMemo(
        () =>
            nodeTypes.map(nodeType => ({
                value: nodeType.node_type_id,
                label: nodeType.description,
                entity: nodeType
            })),
        [nodeTypes]
    );
    const versionsValues = useMemo(
        () =>
            versions.map(version => ({
                value: version.key,
                label: `Runtime: ${version.name}`
            })),
        [versions]
    );
    const zonesValues = useMemo(
        () => zones.map(zone => ({ value: zone, label: zone })),
        [zones]
    );

    const DEFAULT_SCHEMA_TAGS = useMemo(() => {
        return {
            type: 'record',
            name: `schema_${uuidv4().replaceAll('-', '')}`,
            fields: [],
            ...JSON.parse(state.CLUSTER_TAGS || '{}')
        };
    }, [state]);

    const DEFAULT_SCHEMA_SCRIPTS = useMemo(() => {
        return {
            type: 'record',
            name: `schema_${uuidv4().replaceAll('-', '')}`,
            fields: [],
            ...JSON.parse(state.CLUSTER_SCRIPTS || '{}')
        };
    }, [state]);

    const tagsSchema = useRef(DEFAULT_SCHEMA_TAGS);
    const scriptsSchema = useRef(DEFAULT_SCHEMA_SCRIPTS);
    const [isValidTagsSchema, setIsValidTagsSchema] = useState(true);
    const [isValidScriptsSchema, setIsValidScriptsSchema] = useState(true);

    const [fullNodeTypes, setFullNodeTypes] = useState([]);
    const [fullZones, setFullZones] = useState([]);
    const workerType = useRef({ memory: 0, cores: 0 });

    useEffect(() => {
        const nodeWorker = nodeTypesValues?.find(
            nodeTypesValue => nodeTypesValue.value === state.WORKER_TYPE
        )?.entity;
        const nodeDriver = fullNodeTypes?.find(
            nodeTypesValue => nodeTypesValue.value === state.DRIVER_TYPE
        )?.entity;
        const nodeType = nodeTypesValues?.find(
            nodeTypesValue => nodeTypesValue.value === state.NODE_TYPE
        )?.entity;
        if (nodeWorker) {
            setAdornmentWorker(
                `${+nodeWorker.memory_mb / 1024} GB, ${+nodeWorker.num_cores} Cores`
            );
            workerType.current = {
                memory: +nodeWorker.memory_mb / 1024,
                cores: +nodeWorker.num_cores
            };
        }
        if (nodeDriver) {
            setAdornmentDriver(
                `${+nodeDriver.memory_mb / 1024} GB, ${+nodeDriver.num_cores} Cores`
            );
        }
        if (nodeType) {
            setAdornmentNode(
                `${+nodeType.memory_mb / 1024} GB, ${+nodeType.num_cores} Cores`
            );
        }
    }, [
        fullNodeTypes,
        nodeTypesValues,
        state.DRIVER_TYPE,
        state.NODE_TYPE,
        state.WORKER_TYPE
    ]);

    useEffect(() => {
        if (!fullNodeTypes.length && nodeTypesValues.length) {
            setFullNodeTypes([
                {
                    label: 'Same as worker',
                    value: 'same',
                    entity: nodeTypesValues.find(
                        nodeTypesValue => nodeTypesValue.value === state.WORKER_TYPE
                    )?.entity
                },
                ...nodeTypesValues
            ]);
        }
        if (fullNodeTypes.length && nodeTypesValues.length) {
            setFullNodeTypes(
                fullNodeTypes.map(obj =>
                    obj.value === 'same'
                        ? {
                              ...obj,
                              entity: nodeTypesValues.find(
                                  nodeTypesValue =>
                                      nodeTypesValue.value === state.WORKER_TYPE
                              )?.entity
                          }
                        : obj
                )
            );
        }
    }, [
        fullNodeTypes.length,
        nodeTypesValues.length,
        state.WORKER_TYPE,
        setFullNodeTypes
    ]);

    useEffect(() => {
        if (!fullZones.length && zonesValues.length) {
            setFullZones([{ value: 'auto', label: 'auto' }, ...zonesValues]);
        }
    }, [zonesValues, fullZones]);

    useEffect(() => {
        if (firstLoading.current) {
            if (state.POLICY === 'unrestricted') {
                setState(prev => ({
                    ...prev,
                    AUTOSCALING_STORAGE: state.NODES === 'single',
                    SPARK_CONFIG:
                        state.NODES === 'single'
                            ? 'spark.master local[*, 4]\nspark.databricks.cluster.profile singleNode'
                            : '',
                    ENV_VAR: 'PYSPARK_PYTHON=/databricks/python3/bin/python3',
                    // GCP
                    PREEMPTIBLE_INSTANCES: false
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    AUTOSCALING_STORAGE: false,
                    SPARK_CONFIG: '',
                    ENV_VAR: '',
                    // GCP
                    PREEMPTIBLE_INSTANCES: true
                }));
            }
        } else {
            firstLoading.current = 'smth';
        }
        return () => {
            firstLoading.current = null;
        };
    }, [state.NODES, state.POLICY, setState]);

    const onSaveTags = updatedFields => {
        const updatedSchema = {
            ...tagsSchema.current,
            fields: updatedFields
        };

        tagsSchema.current = updatedSchema;
        onChange({
            target: {
                name: CLUSTER_TAGS,
                value: JSON.stringify(updatedSchema)
            },
            persist: noop
        });
    };

    const onSaveScripts = updatedFields => {
        const updatedSchema = {
            ...scriptsSchema.current,
            fields: updatedFields
        };

        scriptsSchema.current = updatedSchema;
        onChange({
            target: {
                name: CLUSTER_SCRIPTS,
                value: JSON.stringify(updatedSchema)
            },
            persist: noop
        });
    };

    const parseSparkSettings = (config, separator) => {
        // show error
        if (config.includes('\n')) {
            const configArray = config.split('\n');
            return [
                ...configArray.flatMap(line => {
                    if (line.trim()) {
                        const [path, ...value] = line.split(separator);
                        if (!path || !value || !value.join(separator).trim()) {
                            // show error
                            return [];
                        }
                        return { [path.trim()]: value.join(separator).trim() };
                    }
                    return [];
                })
            ];
        }
        if (!config.includes('\n')) {
            const [path, ...value] = config.split(separator);
            if (path && value && value.join(separator).trim()) {
                return { [path.trim()]: value.join(separator).trim() };
            }
            // else {
            //     show error
            // }
        }
        return {};
    };

    // eslint-disable-next-line complexity
    const createDBSchema = () => {
        const dbSchema = {};
        dbSchema.cluster_name = state.CLUSTER_NAME;

        if (state.POLICY === 'unrestricted') {
            if (state.NODES === 'multy') {
                dbSchema.num_workers = state.WORKERS;
                // Tab 1 AWS
                if (cloud === AWS) {
                    dbSchema.aws_attributes = {
                        first_on_demand: state.ON_DEMAND_SPOT,
                        availability: state.IS_ON_DEMAND_SPOT
                            ? 'SPOT_WITH_FALLBACK'
                            : 'SPOT',
                        zone_id: state.AVAILABILITY_ZONE,
                        spot_bid_price_percent: state.MAX_SPOT_PRICE
                    };
                    if (state.EBS_VOLUME_TYPE !== 'none') {
                        dbSchema.aws_attributes = {
                            ...dbSchema.aws_attributes,
                            ebs_volume_type: state.EBS_VOLUME_TYPE,
                            ebs_volume_count: state.VOLUMES,
                            ebs_volume_size: state.DB_SIZE
                        };
                    }
                }
                if (cloud === GCP) {
                    dbSchema.gcp_attributes = {
                        use_preemptible_executors: state.PREEMPTIBLE_INSTANCES,
                        availability: state.PREEMPTIBLE_INSTANCES
                            ? 'PREEMPTIBLE_WITH_FALLBACK_GCP'
                            : 'ON_DEMAND_GCP',
                        zone_id: state.AVAILABILITY_ZONE
                    };
                    if (state.GOOGLE_SERVICE_ACCOUNT !== '') {
                        dbSchema.gcp_attributes = {
                            ...dbSchema.gcp_attributes,
                            google_service_account: state.GOOGLE_SERVICE_ACCOUNT
                        };
                    }
                    if (state.LOCAL_SSDS !== 'default') {
                        dbSchema.gcp_attributes = {
                            ...dbSchema.gcp_attributes,
                            local_ssd_count: state.LOCAL_SSDS
                        };
                    }
                }
                if (cloud === AZURE) {
                    dbSchema.azure_attributes = {
                        first_on_demand: 1,
                        availability: state.PREEMPTIBLE_INSTANCES
                            ? 'SPOT_WITH_FALLBACK_AZURE'
                            : 'ON_DEMAND_AZURE',
                        spot_bid_max_price: 1
                    };
                }
            }
            if (state.NODES === 'single') {
                dbSchema.num_workers = 0;
                // not implemented. trigger customtags update
                dbSchema.custom_tags = {
                    ResourceClass: 'SingleNode'
                };
                dbSchema.node_type_id = state.NODE_TYPE;

                // Tab 1 AWS
                if (cloud === AWS) {
                    dbSchema.aws_attributes = {
                        first_on_demand: 1,
                        availability: 'SPOT_WITH_FALLBACK',
                        zone_id: 'auto',
                        spot_bid_price_percent: state.MAX_SPOT_PRICE,
                        ebs_volume_count: 0
                    };
                }
                if (cloud === GCP) {
                    dbSchema.gcp_attributes = {
                        use_preemptible_executors: false,
                        availability: 'ON_DEMAND_GCP',
                        zone_id: state.AVAILABILITY_ZONE
                    };
                    if (state.GOOGLE_SERVICE_ACCOUNT !== '') {
                        dbSchema.gcp_attributes = {
                            ...dbSchema.gcp_attributes,
                            google_service_account: state.GOOGLE_SERVICE_ACCOUNT
                        };
                    }
                    if (state.LOCAL_SSDS !== 'default') {
                        dbSchema.gcp_attributes = {
                            ...dbSchema.gcp_attributes,
                            local_ssd_count: state.LOCAL_SSDS
                        };
                    }
                }
                if (cloud === AZURE) {
                    dbSchema.azure_attributes = {
                        first_on_demand: 1,
                        availability: 'ON_DEMAND_AZURE',
                        spot_bid_max_price: -1
                    };
                }
            }
            if (cloud !== AZURE) {
                dbSchema.enable_elastic_disk = state.AUTOSCALING_STORAGE;
            }
        } else {
            dbSchema.policy_id = state.POLICY;

            // Tab 1 AWS
            if (cloud === AWS) {
                dbSchema.aws_attributes = {
                    first_on_demand: state.ON_DEMAND_SPOT,
                    availability: 'SPOT_WITH_FALLBACK',
                    zone_id: 'auto',
                    spot_bid_price_percent: state.MAX_SPOT_PRICE,
                    ebs_volume_count: 0
                };
            }
            if (cloud === GCP) {
                dbSchema.gcp_attributes = {
                    use_preemptible_executors: state.PREEMPTIBLE_INSTANCES,
                    availability: state.PREEMPTIBLE_INSTANCES
                        ? 'PREEMPTIBLE_WITH_FALLBACK_GCP'
                        : 'ON_DEMAND_GCP',
                    zone_id: 'auto'
                };
                if (state.GOOGLE_SERVICE_ACCOUNT !== '') {
                    dbSchema.gcp_attributes = {
                        ...dbSchema.gcp_attributes,
                        google_service_account: state.GOOGLE_SERVICE_ACCOUNT
                    };
                }
                if (state.LOCAL_SSDS !== 'default') {
                    dbSchema.gcp_attributes = {
                        ...dbSchema.gcp_attributes,
                        local_ssd_count: state.LOCAL_SSDS
                    };
                }
            }
            if (cloud === AZURE) {
                dbSchema.azure_attributes = {
                    first_on_demand: 1,
                    availability: state.PREEMPTIBLE_INSTANCES
                        ? 'PREEMPTIBLE_WITH_FALLBACK_GCP'
                        : 'ON_DEMAND_GCP',
                    spot_bid_max_price: 100
                };
            }
        }
        dbSchema.data_security_mode = state.ACCESS_MODE;
        dbSchema.spark_version = state.DATABRICKS_RUNTIME_VERSION;
        dbSchema.runtime_engine = state.USE_PHOTON_ACCELERATION
            ? 'PHOTON'
            : 'STANDART';

        if (!(state.POLICY === 'unrestricted' && state.NODES === 'single')) {
            dbSchema.node_type_id = state.WORKER_TYPE;
            if (state.DRIVER_TYPE !== 'same') {
                dbSchema.driver_node_type_id = state.DRIVER_TYPE;
            }
            if (state.AUTOSCALING_WORKERS) {
                dbSchema.autoscale = {
                    min_workers: state.MIN_WORKERS,
                    max_workers: state.MAX_WORKERS
                };
            } else {
                dbSchema.num_workers = state.WORKERS;
            }
        }
        /* eslint-disable-next-line */
        for (const tag of tagsSchema.current.fields) {
            dbSchema.custom_tags = {
                ...dbSchema.custom_tags,
                ...{ [tag.clusterKey]: tag.value }
            };
        }

        if (cloud === AWS) {
            if (state.ENABLE_CREDENTIAL) {
                if (state.ACCESS_MODE === 'SINGLE_USER') {
                    dbSchema.data_security_mode = 'LEGACY_SINGLE_USER';
                }
                if (state.ACCESS_MODE === 'USER_ISOLATION') {
                    dbSchema.data_security_mode = 'LEGACY_PASSTHROUGH';
                }
            }
        }

        // Tab 2
        if (state.SPARK_CONFIG.trim()) {
            dbSchema.spark_conf = parseSparkSettings(state.SPARK_CONFIG, ' ');
        }
        if (state.ENV_VAR.trim()) {
            dbSchema.spark_env_vars = parseSparkSettings(state.ENV_VAR, '=');
        }
        // Tab 3
        if (state.DESTINATION === 's3') {
            dbSchema.cluster_log_conf = {
                s3: {
                    destination: state.LOG_PATH,
                    region: state.REGION,
                    enable_encryption: true,
                    canned_acl: 'bucket-owner-full-control'
                }
            };
        }
        if (state.DESTINATION === 'dbfs') {
            dbSchema.cluster_log_conf = {
                dbfs: {
                    destination: state.LOG_PATH
                }
            };
        }

        // Tab 4
        dbSchema.init_scripts = [];
        /* eslint-disable-next-line */
        for (const script of scriptsSchema.current.fields) {
            if (script.source === 's3') {
                dbSchema.init_scripts.push({
                    [script.source]: {
                        destination: script.filePath,
                        region: script.region === 'auto' ? '' : script.region
                    }
                });
            } else {
                dbSchema.init_scripts.push({
                    [script.source]: {
                        destination: script.filePath
                    }
                });
            }
        }

        // Tab 5
        if (cloud === AWS) {
            dbSchema.ssh_public_keys = state.SSH_PUBLIC_KEY
                ? [state.SSH_PUBLIC_KEY]
                : [];
        }
        if (cloud === GCP) {
            dbSchema.ssh_public_keys = [];
        }

        return dbSchema;
    };

    const handleSave = async () => {
        if (tagsSchemaRef.current) {
            await tagsSchemaRef.current.onSaveTagsSchema();
        }
        if (scriptsSchemaRef.current) {
            await scriptsSchemaRef.current.onSaveScriptsSchema();
        }
        setState(prev => ({ ...prev, CLUSTER_DATABRICKS_SCHEMA: createDBSchema() }));
        firstLoading.current = null;
        onClose();
    };

    const handleChangeNode = e => {
        const node = fullNodeTypes?.find(
            nodeTypesValue => nodeTypesValue.value === e.target.value
        )?.entity;
        if (e.target.name === WORKER_TYPE) {
            setAdornmentWorker(
                `${+node.memory_mb / 1024} GB, ${+node.num_cores} Cores`
            );
            workerType.current = {
                memory: +node.memory_mb / 1024,
                cores: +node.num_cores
            };
        }
        if (e.target.name === DRIVER_TYPE) {
            setAdornmentDriver(
                `${+node.memory_mb / 1024} GB, ${+node.num_cores} Cores`
            );
        }
        if (e.target.name === NODE_TYPE) {
            setAdornmentNode(
                `${+node.memory_mb / 1024} GB, ${+node.num_cores} Cores`
            );
        }
        onChange(e);
    };

    const onCancel = () => {
        firstLoading.current = null;
        tagsSchema.current = DEFAULT_SCHEMA_TAGS;
        scriptsSchema.current = DEFAULT_SCHEMA_SCRIPTS;
        onClose();
    };

    return (
        <PopupForm
            display={display}
            title={t('jobDesigner:Cluster.modal.title')}
            onClose={onCancel}
        >
            <Box className={classes.modalWrapper}>
                <ParamsTextField
                    {...fields.CLUSTER_NAME}
                    ableToEdit={ableToEdit}
                    name={CLUSTER_NAME}
                    value={state.CLUSTER_NAME}
                    error={errors.CLUSTER_NAME}
                    onError={onError}
                    onChange={onChange}
                />
                <SelectField
                    {...fields.POLICY}
                    ableToEdit={ableToEdit}
                    name={POLICY}
                    value={state.POLICY}
                    handleInputChange={onChange}
                    menuItems={[
                        { label: 'Unrestricted', value: 'unrestricted' },
                        ...policiesValues
                    ]}
                    type={READWRITE}
                    closeIcon={false}
                />
                {state.POLICY === 'unrestricted' && (
                    <RadioGroup
                        {...fields.NODES}
                        ableToEdit={ableToEdit}
                        name={NODES}
                        value={state.NODES}
                        onChange={onChange}
                    />
                )}
                <SelectField
                    {...fields.ACCESS_MODE}
                    ableToEdit={ableToEdit}
                    name={ACCESS_MODE}
                    value={state.ACCESS_MODE}
                    handleInputChange={onChange}
                    menuItems={accessMode}
                    type={READWRITE}
                    closeIcon={false}
                />
                <Typography variant="h6">
                    {t('jobDesigner:Cluster.modal.performance')}
                </Typography>
                <SelectField
                    {...fields.DATABRICKS_RUNTIME_VERSION}
                    ableToEdit={false}
                    name={DATABRICKS_RUNTIME_VERSION}
                    value={state.DATABRICKS_RUNTIME_VERSION}
                    handleInputChange={onChange}
                    menuItems={versionsValues}
                    type={READWRITE}
                    closeIcon={false}
                />
                <ParamsSwitchField
                    {...fields.USE_PHOTON_ACCELERATION}
                    ableToEdit={ableToEdit}
                    name={USE_PHOTON_ACCELERATION}
                    value={state.USE_PHOTON_ACCELERATION}
                    onChange={onChange}
                    defaultValue
                />
                {!(state.POLICY === 'unrestricted' && state.NODES === 'single') && (
                    <>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            spacing={1}
                        >
                            <Grid item xs={cloud === AWS ? 8 : 6}>
                                <SelectField
                                    {...fields.WORKER_TYPE}
                                    ableToEdit={ableToEdit}
                                    name={WORKER_TYPE}
                                    value={state.WORKER_TYPE}
                                    handleInputChange={handleChangeNode}
                                    adornment={adornmentWorker}
                                    menuItems={nodeTypesValues}
                                    type={READWRITE}
                                    closeIcon={false}
                                />
                            </Grid>

                            {state.AUTOSCALING_WORKERS ? (
                                <>
                                    <Grid item xs={2}>
                                        <ParamsTextField
                                            {...fields.MIN_WORKERS}
                                            ableToEdit={ableToEdit}
                                            name={MIN_WORKERS}
                                            value={state.MIN_WORKERS}
                                            error={errors.MIN_WORKERS}
                                            onError={onError}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <ParamsTextField
                                            {...fields.MAX_WORKERS}
                                            ableToEdit={ableToEdit}
                                            name={MAX_WORKERS}
                                            value={state.MAX_WORKERS}
                                            error={errors.MAX_WORKERS}
                                            onError={onError}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                </>
                            ) : (
                                <Grid item xs={4}>
                                    <ParamsTextField
                                        {...fields.WORKERS}
                                        ableToEdit={ableToEdit}
                                        name={WORKERS}
                                        value={state.WORKERS}
                                        error={errors.WORKERS}
                                        onError={onError}
                                        onChange={onChange}
                                    />
                                </Grid>
                            )}
                            {cloud === GCP && (
                                <Grid item xs={2}>
                                    <ParamsSwitchField
                                        {...fields.PREEMPTIBLE_INSTANCES}
                                        ableToEdit={ableToEdit}
                                        name={PREEMPTIBLE_INSTANCES}
                                        value={state.PREEMPTIBLE_INSTANCES}
                                        onChange={onChange}
                                        defaultValue
                                    />
                                </Grid>
                            )}
                            {cloud === AZURE && (
                                <Grid item xs={2}>
                                    <ParamsSwitchField
                                        {...fields.SPOT_INSTANCE}
                                        ableToEdit={ableToEdit}
                                        name={SPOT_INSTANCE}
                                        value={state.SPOT_INSTANCE}
                                        onChange={onChange}
                                        defaultValue
                                    />
                                </Grid>
                            )}
                        </Grid>
                        <SelectField
                            {...fields.DRIVER_TYPE}
                            ableToEdit={ableToEdit}
                            name={DRIVER_TYPE}
                            value={state.DRIVER_TYPE}
                            handleInputChange={handleChangeNode}
                            adornment={adornmentDriver}
                            menuItems={fullNodeTypes}
                            type={READWRITE}
                            closeIcon={false}
                        />
                        <ParamsSwitchField
                            {...fields.AUTOSCALING_WORKERS}
                            ableToEdit={ableToEdit}
                            name={AUTOSCALING_WORKERS}
                            value={state.AUTOSCALING_WORKERS}
                            onChange={onChange}
                            defaultValue={false}
                        />
                    </>
                )}
                {state.POLICY === 'unrestricted' && state.NODES === 'single' && (
                    <SelectField
                        {...fields.NODE_TYPE}
                        ableToEdit={ableToEdit}
                        name={NODE_TYPE}
                        value={state.NODE_TYPE}
                        handleInputChange={handleChangeNode}
                        adornment={adornmentNode}
                        menuItems={nodeTypesValues}
                        type={READWRITE}
                        closeIcon={false}
                    />
                )}
                {state.POLICY === 'unrestricted' && cloud !== AZURE && (
                    <ParamsSwitchField
                        {...fields.AUTOSCALING_STORAGE}
                        ableToEdit={ableToEdit}
                        name={AUTOSCALING_STORAGE}
                        value={state.AUTOSCALING_STORAGE}
                        onChange={onChange}
                        defaultValue={false}
                    />
                )}
                {cloud === AWS && (
                    <>
                        <Typography variant="h6">
                            {t('jobDesigner:Cluster.modal.instanceProfile')}
                        </Typography>
                        <SelectField
                            {...fields.INSTANCE_PROFILE}
                            ableToEdit={ableToEdit}
                            name={INSTANCE_PROFILE}
                            value={state.INSTANCE_PROFILE}
                            handleInputChange={onChange}
                            menuItems={[{ value: 'none', label: 'None' }]}
                            type={READWRITE}
                            closeIcon={false}
                        />
                    </>
                )}

                <Typography variant="h6">
                    {t('jobDesigner:Cluster.modal.tags')}
                </Typography>
                <TagsSchema
                    onSave={onSaveTags}
                    setIsValid={setIsValidTagsSchema}
                    schemaFields={tagsSchema.current.fields}
                    ableToEdit={ableToEdit}
                    ref={tagsSchemaRef}
                />
                {cloud === AWS && (
                    <AdvancedAWSContent
                        fields={fields}
                        state={state}
                        onChange={onChange}
                        ableToEdit={ableToEdit}
                    />
                )}
                {cloud === GCP && (
                    <ParamsTextField
                        {...fields.GOOGLE_SERVICE_ACCOUNT}
                        ableToEdit={ableToEdit}
                        name={GOOGLE_SERVICE_ACCOUNT}
                        value={state.GOOGLE_SERVICE_ACCOUNT}
                        error={errors.GOOGLE_SERVICE_ACCOUNT}
                        onError={onError}
                        onChange={onChange}
                    />
                )}
                <Tabs
                    ref={scriptsSchemaRef}
                    fields={fields}
                    state={state}
                    onChange={onChange}
                    onError={onError}
                    errors={errors}
                    ableToEdit={ableToEdit}
                    setState={setState}
                    setIsValidScriptsSchema={setIsValidScriptsSchema}
                    onSaveScripts={onSaveScripts}
                    scriptsSchema={scriptsSchema}
                />
                <Box className={classes.buttonsGroup}>
                    {ableToEdit && (
                        <Button
                            disabled={!(isValidTagsSchema && isValidScriptsSchema)}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            // disabled={
                            //     rowsState.length === 0 || columnsState.length === 0
                            // }
                            onClick={handleSave}
                        >
                            {t('main:button.Save')}
                        </Button>
                    )}

                    <Button
                        className={classNames(classes.button, classes.cancelBtn)}
                        variant="contained"
                        onClick={onCancel}
                    >
                        {t('main:button.Cancel')}
                    </Button>
                </Box>
            </Box>
        </PopupForm>
    );
};

ClusterModal.propTypes = {
    fields: PropTypes.object,
    state: PropTypes.object,
    onError: PropTypes.func,
    errors: PropTypes.object,
    onChange: PropTypes.func,
    display: PropTypes.bool,
    onClose: PropTypes.func,
    ableToEdit: PropTypes.bool,
    setState: PropTypes.func
};

export default ClusterModal;
