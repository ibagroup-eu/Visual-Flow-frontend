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

import { isNil } from 'lodash';
import { READ, STORAGES, WRITE } from '../../constants';

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 2147483631;

export const isTruncateStorageDB2 = storage =>
    [
        STORAGES.DB2.value,
        STORAGES.POSTGRE.value,
        STORAGES.ORACLE.value,
        STORAGES.MYSQL.value,
        STORAGES.MSSQL.value,
        STORAGES.REDSHIFTJDBC.value
    ].includes(storage);

export const isNilOrEmpty = v => isNil(v) || v === '';

export const checkDb2RequiredFields = state => {
    let fields = ['jdbcUrl', 'user', 'password'];

    const { customSql, operation } = state;
    if (operation === WRITE || customSql === 'false') {
        fields = fields.concat(['schema', 'table']);
    }

    return fields.some(key => isNilOrEmpty(state[key]));
};

export const checkRedisRequiredFields = state => {
    const fields = ['host', 'port', 'password', 'model'];

    const { readMode, operation } = state;

    if (operation === READ) {
        fields.push('readMode');
    }

    if (readMode === 'pattern') {
        fields.push('keysPattern');
    }
    if (readMode === 'key' || operation === WRITE) {
        fields.push('table');
    }

    return fields.some(key => isNilOrEmpty(state[key]));
};

export const checkClickHouseRequiredFields = state => {
    const { operation, customSql } = state;

    const conditions = [
        {
            condition:
                operation === READ && (customSql === 'false' || isNil(customSql)),
            fields: ['database', 'customSql', 'schema', 'table']
        },
        { condition: operation === WRITE, fields: ['schema', 'table'] },
        {
            condition: operation === READ && customSql === 'true',
            fields: ['option.dbtable']
        }
    ];

    return conditions
        .filter(({ condition }) => condition)
        .reduce((acc, { fields }) => [...acc, ...fields], [
            'host',
            'port',
            'user',
            'password'
        ])
        .some(key => isNilOrEmpty(state[key]));
};

export const checkRedshiftRequiredFields = state =>
    [
        'host',
        'port',
        'user',
        'password',
        'accessKey',
        'secretKey',
        'database',
        'bucket'
    ].some(key => isNilOrEmpty(state[key]));

export const checkMongoRequiredFields = state =>
    ['host', 'port', 'user', 'password', 'database', 'collection'].some(key =>
        isNilOrEmpty(state[key])
    );

export const checkCosRequiredFields = state => {
    let fields = ['endpoint', 'authType', 'bucket', 'path', 'format'];

    const { authType } = state;
    if (authType === 'IAM') {
        fields = fields.concat(['iamApiKey', 'iamServiceId']);
    }
    if (authType === 'HMAC') {
        fields = fields.concat(['accessKey', 'secretKey']);
    }

    return fields.some(key => isNilOrEmpty(state[key]));
};

export const checkElasticsearchRequiredFields = state =>
    ['nodes', 'port', 'user', 'password', 'index', 'certData'].some(key =>
        isNilOrEmpty(state[key])
    );

export const checkCassandraRequiredFields = state =>
    ['keyspace', 'host', 'port', 'username', 'password', 'table'].some(key =>
        isNilOrEmpty(state[key])
    );

export const checkAWSRequiredFields = state => {
    let fields = ['endpoint', 'anonymousAccess', 'bucket', 'path', 'format'];

    const { anonymousAccess } = state;
    if (anonymousAccess === 'false') {
        fields = fields.concat(['accessKey', 'secretKey']);
    }

    return fields.some(key => isNilOrEmpty(state[key]));
};

export const isAnyEmpty = (...fields) => state =>
    fields.some(key => isNilOrEmpty(state[key]));

export const validations = {
    [STORAGES.DB2.value]: checkDb2RequiredFields,
    [STORAGES.MYSQL.value]: checkDb2RequiredFields,
    [STORAGES.MSSQL.value]: checkDb2RequiredFields,
    [STORAGES.ORACLE.value]: checkDb2RequiredFields,
    [STORAGES.POSTGRE.value]: checkDb2RequiredFields,
    [STORAGES.REDSHIFTJDBC.value]: checkDb2RequiredFields,
    [STORAGES.REDSHIFT.value]: checkRedshiftRequiredFields,
    [STORAGES.REDIS.value]: checkRedisRequiredFields,
    [STORAGES.CASSANDRA.value]: checkCassandraRequiredFields,
    [STORAGES.MONGO.value]: checkMongoRequiredFields,
    [STORAGES.AWS.value]: checkAWSRequiredFields,
    [STORAGES.COS.value]: checkCosRequiredFields,
    [STORAGES.ELASTIC.value]: checkElasticsearchRequiredFields,
    [STORAGES.CLICKHOUSE.value]: checkClickHouseRequiredFields
};

// eslint-disable-next-line complexity
export const checkReadWriteFields = state => {
    const {
        name,
        storage,
        quantity,
        writeMode,
        truncateMode,
        uploaded,
        operation,
        data,
        format
    } = state;

    if (!name || !storage) {
        return true;
    }

    if (
        storage === 'stdout' &&
        (!quantity || quantity < MIN_QUANTITY || quantity > MAX_QUANTITY)
    ) {
        return true;
    }
    const localFileCheck =
        (operation === READ && uploaded !== 'true') ||
        (operation === WRITE && !format);
    if (storage === 'cluster' && localFileCheck) {
        return true;
    }
    if (storage === 'dataframe' && !data) {
        return true;
    }
    if (
        isTruncateStorageDB2(storage) &&
        writeMode === 'Overwrite' &&
        !truncateMode
    ) {
        return true;
    }

    const validate = validations[storage];
    if (validate) {
        return validate(state);
    }
    return false;
};

export const checkTransformerFields = ({ name, mode, tableName, statement }) => {
    if (!name || !statement || !mode) {
        return true;
    }
    return mode === 'Full_SQL' && !tableName;
};

export const checkSortFields = state =>
    !state.name ||
    !state.sortType ||
    !/^[^,]+?:/.test(state.orderColumns) ||
    /,:/.test(state.orderColumns);

export const checkJoinFields = state =>
    !state.name || !state.joinType || (!state.columns && state.joinType !== 'cross');

export const checkGroupByFields = state =>
    !state.name ||
    !state.groupingColumns ||
    !state.groupingCriteria ||
    !!state.groupingCriteria
        ?.split(',')
        .find(column => !/.+?:.+?/.test(column.trim()));

export const checkRemoveDuplicateFields = state =>
    !state.name ||
    !state.keyColumns ||
    !state.orderColumns ||
    !!state.orderColumns?.split(',').find(column => !/.+?:.+?/.test(column.trim()));
