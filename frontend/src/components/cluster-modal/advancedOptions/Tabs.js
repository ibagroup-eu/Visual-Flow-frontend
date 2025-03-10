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

import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Tab } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { v4 as uuidv4 } from 'uuid';
import { noop } from 'lodash';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import useStyles from '../ClusterModal.Styles';
import { ParamsTextField } from '../../../mxgraph/sidebar/params/fields';
import SelectField from '../../select-field';
import { AWS, AZURE, GCP, READWRITE } from '../../../mxgraph/constants';
import ScriptsSchema from '../schemas/scripts-schema/ScriptsSchema';
import AWSFirstTabPanel from './AWSFirstTabPanel';
import GCPFirstTabPanel from './GCPFirstTabPanel';

const SPARK_CONFIG = 'SPARK_CONFIG';
const ENV_VAR = 'ENV_VAR';
const DESTINATION = 'DESTINATION';
const LOG_PATH = 'LOG_PATH';
const REGION = 'REGION';
const SSH_PUBLIC_KEY = 'SSH_PUBLIC_KEY';

const loggingType = [
    {
        value: 'none',
        label: 'None'
    },
    // {
    //     value: 's3',
    //     label: 'S3'
    // },
    {
        value: 'dbsf',
        label: 'DBSF'
    }
];

// eslint-disable-next-line complexity
const Tabs = forwardRef(
    (
        {
            fields = {},
            state = {},
            onChange,
            onError,
            errors = {},
            ableToEdit,
            setState,
            setIsValidScriptsSchema,
            onSaveScripts,
            scriptsSchema
        },
        ref
    ) => {
        const classes = useStyles();
        const { t } = useTranslation();
        const firstLoading = useRef(null);

        const [logPathError, setLogPathError] = useState(undefined);
        const zones = useSelector(store => store.clusterUtils.data.zones || []);
        const cloud = useSelector(
            store => store.pages.settingsBasic.project.cloud || ''
        );

        const zonesValues = useMemo(
            () => zones.map(zone => ({ value: zone, label: zone })),
            [zones]
        );

        const [fullZones, setFullZones] = useState([]);

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
                        ENV_VAR: 'PYSPARK_PYTHON=/databricks/python3/bin/python3'
                    }));
                } else {
                    setState(prev => ({
                        ...prev,
                        AUTOSCALING_STORAGE: false,
                        SPARK_CONFIG: '',
                        ENV_VAR: ''
                    }));
                }
            } else {
                firstLoading.current = 'smth';
            }
            return () => {
                firstLoading.current = null;
            };
        }, [state.NODES, state.POLICY, setState]);

        useEffect(() => {
            if (state.DESTINATION === 's3' && !state.LOG_PATH.startsWith('s3://')) {
                setLogPathError(
                    t('jobDesigner:clusterSchema.validation.sThreeError')
                );
            } else if (
                state.DESTINATION === 'dbfs' &&
                !state.LOG_PATH.startsWith('dbfs:/')
            ) {
                setLogPathError(t('jobDesigner:clusterSchema.validation.dbfsError'));
            } else {
                setLogPathError(undefined);
            }
        }, [state.DESTINATION, state.LOG_PATH, t]);

        const [tab, setTab] = React.useState(cloud === AZURE ? '2' : '1');

        const handleChange = (event, newValue) => {
            setTab(newValue);
        };

        return (
            <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                    >
                        <Tab
                            className={classes.root}
                            label="Instances"
                            value="1"
                            disabled={cloud === AZURE}
                        />
                        <Tab className={classes.root} label="Spark" value="2" />
                        <Tab className={classes.root} label="Logging" value="3" />
                        <Tab
                            className={classes.root}
                            label="Init Scripts"
                            value="4"
                        />
                        <Tab
                            className={classes.root}
                            label="SSH"
                            value="5"
                            disabled={cloud !== AWS}
                        />
                    </TabList>
                </Box>
                {state.POLICY === 'unrestricted' && (
                    <TabPanel value="1">
                        {cloud === AWS && (
                            <AWSFirstTabPanel
                                fields={fields}
                                state={state}
                                onChange={onChange}
                                onError={onError}
                                errors={errors}
                                ableToEdit={ableToEdit}
                            />
                        )}
                        {cloud === GCP && (
                            <GCPFirstTabPanel
                                fields={fields}
                                state={state}
                                onChange={onChange}
                                ableToEdit={ableToEdit}
                            />
                        )}
                    </TabPanel>
                )}
                <TabPanel value="2">
                    <ParamsTextField
                        {...fields.SPARK_CONFIG}
                        ableToEdit={ableToEdit}
                        name={SPARK_CONFIG}
                        value={state.SPARK_CONFIG}
                        error={errors.SPARK_CONFIG}
                        onError={onError}
                        onChange={onChange}
                        multiline
                        minRows={4}
                    />
                    <ParamsTextField
                        {...fields.ENV_VAR}
                        ableToEdit={ableToEdit}
                        name={ENV_VAR}
                        value={state.ENV_VAR}
                        error={errors.ENV_VAR}
                        onError={onError}
                        onChange={onChange}
                        multiline
                        minRows={4}
                    />
                </TabPanel>
                <TabPanel value="3">
                    <Grid container direction="row" alignItems="center" spacing={1}>
                        <Grid item xs={3}>
                            <SelectField
                                {...fields.DESTINATION}
                                ableToEdit={ableToEdit}
                                name={DESTINATION}
                                value={state.DESTINATION}
                                handleInputChange={onChange}
                                menuItems={loggingType} // API
                                type={READWRITE}
                                closeIcon={false}
                            />
                        </Grid>

                        {state.DESTINATION !== 'none' && (
                            <Grid item xs={6}>
                                <ParamsTextField
                                    {...fields.LOG_PATH}
                                    placeholder={
                                        state.DESTINATION === 's3'
                                            ? 's3://'
                                            : 'dbfs:/cluster-logs'
                                    }
                                    ableToEdit={ableToEdit}
                                    name={LOG_PATH}
                                    value={state.LOG_PATH}
                                    error={logPathError}
                                    onError={onError}
                                    onChange={onChange}
                                />
                            </Grid>
                        )}
                        {state.DESTINATION === 's3' && (
                            <Grid item xs={3}>
                                <SelectField
                                    {...fields.REGION}
                                    ableToEdit={ableToEdit}
                                    name={REGION}
                                    value={state.REGION}
                                    handleInputChange={onChange}
                                    menuItems={zonesValues}
                                    type={READWRITE}
                                    closeIcon={false}
                                />
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>
                <TabPanel value="4">
                    <ScriptsSchema
                        onSave={onSaveScripts}
                        setIsValid={setIsValidScriptsSchema}
                        schemaFields={scriptsSchema.current.fields}
                        ableToEdit={ableToEdit}
                        cloud={cloud}
                        ref={ref}
                    />
                </TabPanel>
                {cloud === AWS && (
                    <TabPanel className={classes.root} value="5">
                        <ParamsTextField
                            {...fields.SSH_PUBLIC_KEY}
                            ableToEdit={ableToEdit}
                            name={SSH_PUBLIC_KEY}
                            value={state.SSH_PUBLIC_KEY}
                            error={errors.SSH_PUBLIC_KEY}
                            onError={onError}
                            onChange={onChange}
                            multiline
                            minRows={4}
                        />
                    </TabPanel>
                )}
            </TabContext>
        );
    }
);

Tabs.propTypes = {
    fields: PropTypes.object,
    state: PropTypes.object,
    onError: PropTypes.func,
    errors: PropTypes.object,
    tagsSchema: PropTypes.string,
    onChange: PropTypes.func,
    display: PropTypes.bool,
    onClose: PropTypes.func,
    ableToEdit: PropTypes.bool,
    setState: PropTypes.func,
    onSaveScripts: PropTypes.func,
    scriptsSchema: PropTypes.any
};

export default Tabs;
