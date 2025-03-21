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

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Popper, TextField } from '@material-ui/core';

import { get } from 'lodash';
import { TuneOutlined } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { connect } from 'react-redux';
import Db2Storage from './db2-storage';
import CosStorage from './cos-storage';
import AwsStorage from './aws-storage';
import ElasticStorage from './elastic-storage';
import MongoStorage from './mongo-storage';
import { DATABRICKS, STORAGES } from '../../constants';
import CassandraStorage from './cassandra-storage';
import RedisStorage from './redis-storage';
import RedShiftStorage from './redshift-storage';
import StdoutStorage from './stdout-storage';
import useStyles from './ReadWriteConfiguration.Styles';
import DividerWithText from '../helpers/DividerWithText';
import ClusterStorage from './cluster-storage';
import DataframeStorage from './dataframe-storage/DataframeStorage';
import ClickHouseStorage from './clickhouse-storage';
import ConfigurationDivider from '../../../components/divider';
import KafkaStorage from './kafka-storage';
import ApiStorage from './api-storage';
import DatabricksStorage from './databricks-configuration';
import DatabricksJDBCStorage from './databricks-jdbc-storage';
import AzureBlobStorage from './azure-blob-storage';
import GoogleCloudStorage from './google-cloud-storage';
import { stableSort, getComparator } from '../../../utils/sort';

const isTruncateStorage = storage =>
    [
        STORAGES.DB2.value,
        STORAGES.POSTGRE.value,
        STORAGES.ORACLE.value,
        STORAGES.MYSQL.value,
        STORAGES.MSSQL.value,
        STORAGES.REDSHIFTJDBC.value
    ].includes(storage);

const truncateModeDefaultValues = {
    field: 'truncateMode',
    value: 'None'
};

// eslint-disable-next-line complexity
export const getStorageComponent = name => {
    switch (name?.toLowerCase()) {
        case STORAGES.DB2.value:
        case STORAGES.POSTGRE.value:
        case STORAGES.ORACLE.value:
        case STORAGES.MYSQL.value:
        case STORAGES.MSSQL.value:
        case STORAGES.REDSHIFTJDBC.value:
            return Db2Storage;
        case STORAGES.MONGO.value:
            return MongoStorage;
        case STORAGES.COS.value:
            return CosStorage;
        case STORAGES.AWS.value:
            return AwsStorage;
        case STORAGES.ELASTIC.value:
            return ElasticStorage;
        case STORAGES.CASSANDRA.value:
            return CassandraStorage;
        case STORAGES.REDIS.value:
            return RedisStorage;
        case STORAGES.REDSHIFT.value:
            return RedShiftStorage;
        case STORAGES.STDOUT.value:
            return StdoutStorage;
        case STORAGES.CLUSTER.value:
            return ClusterStorage;
        case STORAGES.DATAFRAME.value:
            return DataframeStorage;
        case STORAGES.CLICKHOUSE.value:
            return ClickHouseStorage;
        case STORAGES.KAFKA.value:
            return KafkaStorage;
        case STORAGES.API.value:
            return ApiStorage;
        case STORAGES?.DATABRICKS?.value:
            return DatabricksStorage;
        case STORAGES?.DATABRICKSJDBC?.value:
            return DatabricksJDBCStorage;
        case STORAGES.AZURE.value:
            return AzureBlobStorage;
        case STORAGES.GOOGLECLOUD.value:
            return GoogleCloudStorage;
        default:
            throw new Error(`Unsupported storage: ${name}`);
    }
};

export const ReadWriteConfiguration = ({
    state,
    setState,
    ableToEdit,
    onChange,
    openModal,
    connection,
    stageId,
    project
}) => {
    const ref = useRef();
    const { t } = useTranslation();
    const classes = useStyles();
    const { truncateMode, writeMode, storage } = state;
    const { operation } = state;
    const { demo, demoLimits } = project;

    const storagesRes = useMemo(() => {
        const sourcesToShow = demoLimits?.sourcesToShow[operation];
        if (demo && sourcesToShow) {
            const storageObj = {};
            sourcesToShow.forEach(key => {
                if (STORAGES[key]) {
                    storageObj[key] = STORAGES[key];
                }
            });

            return storageObj;
        }
        return STORAGES;
    }, [demo, demoLimits, operation]);

    useEffect(() => {
        if (
            truncateMode === undefined &&
            writeMode === 'Overwrite' &&
            isTruncateStorage(storage)
        ) {
            onChange(
                truncateModeDefaultValues.field,
                truncateModeDefaultValues.value
            );
        }
    }, [writeMode, storage, truncateMode, onChange]);

    const changeStorage = value => {
        onChange('storage', value || undefined);
        if (state.connectionName) {
            onChange('connectionName', null);
        }
        if (
            state.path &&
            (value === 'cluster' ||
                (state.storage === 'cluster' && value !== 'cluster'))
        ) {
            onChange('path', null);
        }
        if (
            state.avroSchema &&
            (value === 'cos' || (state.storage === 'cos' && value !== 'cos'))
        ) {
            onChange('avroSchema', null);
        }
    };

    const handleInputChange = useCallback(
        event => {
            // console.log(event)
            onChange(event.target.name, event.target.value);
        },
        [onChange]
    );

    const renderStorageComponent = name => {
        const Comp = getStorageComponent(name);

        return (
            <>
                {state.connectionName ? (
                    <DividerWithText>{state.connectionName}</DividerWithText>
                ) : (
                    <ConfigurationDivider />
                )}
                <Comp
                    ableToEdit={ableToEdit}
                    inputValues={state}
                    handleInputChange={handleInputChange}
                    setState={setState}
                    openModal={openModal}
                    connection={connection}
                    stageId={stageId}
                    storageName={name}
                />
            </>
        );
    };

    return (
        <div ref={ref}>
            <Autocomplete
                PopperComponent={props => (
                    <Popper
                        {...props}
                        popperOptions={{
                            positionFixed: true,
                            modifiers: {
                                preventOverflow: { enabled: false },
                                hide: {
                                    enabled: false
                                }
                            }
                        }}
                        container={ref?.current}
                    />
                )}
                disabled={!ableToEdit}
                name="storage"
                options={stableSort(
                    storagesRes,
                    getComparator('asc', 'label')
                ).filter(
                    st =>
                        !get(st, 'hide', []).includes(operation) &&
                        !(
                            st.label === STORAGES?.DATABRICKS?.label &&
                            window.PLATFORM !== DATABRICKS
                        )
                )}
                getOptionLabel={option => option.label || option}
                value={
                    Object.values(storagesRes).find(
                        el => el.value === state.storage
                    ) || null
                }
                onChange={(event, newValue) => changeStorage(newValue?.value)}
                renderInput={params => (
                    <Box className={classes.wrapper}>
                        <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t('jobDesigner:readConfiguration.Storage')}
                            label={t('jobDesigner:readConfiguration.Storage')}
                            required
                        />
                        <IconButton
                            className={classes.button}
                            onClick={() => openModal('connectionName')}
                        >
                            <TuneOutlined />
                        </IconButton>
                    </Box>
                )}
            />
            {state.storage && renderStorageComponent(state.storage)}
        </div>
    );
};

ReadWriteConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    openModal: PropTypes.func,
    connection: PropTypes.object,
    stageId: PropTypes.string,
    setState: PropTypes.func,
    project: PropTypes.object
};

const mapStateToProps = state => ({
    project: state.pages.settingsBasic.project ?? {}
});

export default connect(mapStateToProps)(ReadWriteConfiguration);
