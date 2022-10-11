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

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, Divider, IconButton, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { get } from 'lodash';
import { TuneOutlined } from '@material-ui/icons';
import Db2Storage from './db2-storage';
import CosStorage from './cos-storage';
import AwsStorage from './aws-storage';
import ElasticStorage from './elastic-storage';
import MongoStorage from './mongo-storage';
import { STORAGES } from '../../constants';
import CassandraStorage from './cassandra-storage';
import RedisStorage from './redis-storage';
import RedShiftStorage from './redshift-storage';
import StdoutStorage from './stdout-storage';
import useStyles from './ReadWriteConfiguration.Styles';
import DividerWithText from '../helpers/DividerWithText';

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
    switch (name.toLowerCase()) {
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
        default:
            throw new Error(`Unsupported storage: ${name}`);
    }
};

const ReadWriteConfiguration = ({
    state,
    ableToEdit,
    onChange,
    openModal,
    connection
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const { truncateMode, writeMode, storage } = state;

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
    }, [writeMode, storage, truncateMode]);

    const renderStorageComponent = name => {
        const Comp = getStorageComponent(name);
        return (
            <Comp
                ableToEdit={ableToEdit}
                inputValues={state}
                handleInputChange={event =>
                    onChange(event.target.name, event.target.value)
                }
                openModal={openModal}
                connection={connection}
            />
        );
    };
    return (
        <>
            <Autocomplete
                disabled={!ableToEdit}
                name="storage"
                options={Object.values(STORAGES).filter(
                    st => !get(st, 'hide', []).includes(state.operation)
                )}
                getOptionLabel={option => option.label || option}
                value={
                    Object.values(STORAGES).find(el => el.value === state.storage) ||
                    null
                }
                onChange={(event, newValue) => {
                    onChange('storage', newValue?.value || undefined);
                    if (state.connectionName) {
                        onChange('connectionName', null);
                    }
                }}
                renderInput={params => (
                    <Box className={classes.wrapper}>
                        <TextField
                            {...params}
                            variant="outlined"
                            margin="normal"
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

            {state.connectionName ? (
                <DividerWithText>{state.connectionName}</DividerWithText>
            ) : (
                <Divider />
            )}
            {state.storage && renderStorageComponent(state.storage)}
        </>
    );
};

ReadWriteConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    openModal: PropTypes.func,
    connection: PropTypes.object
};

export default ReadWriteConfiguration;
