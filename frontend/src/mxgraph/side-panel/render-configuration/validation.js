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

import { isNil, get } from 'lodash';
import {
    ADD_CONSTANT,
    AVG,
    CHANGE_TYPE,
    COUNT,
    DERIVE_COLUMN,
    LAG,
    LEAD,
    MAX,
    MIN,
    NTILE,
    READ,
    RENAME_COLUMN,
    REPLACE_VALUES,
    REPLACE_VALUES_CHAR_BY_CHAR,
    REPLACE_VALUES_USING_CONDITIONS,
    STORAGES,
    SUM,
    USE_CONDITIONS,
    USE_WINDOW_FUNCTION,
    WRITE
} from '../../constants';
import schemas from '../schemas';
import {
    isValidPrecision,
    isValidScale,
    parseDecimalType
} from '../withcolumn-configuration/change-type-operation/ChangeTypeOperation';

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

const validateNumberFields = fields =>
    fields.some(({ value, min }) => !isNil(value) && value < min);

export const isAnyEmpty = (...fields) => state =>
    fields.some(key => isNilOrEmpty(state[key]));

export const checkDb2RequiredFields = state => {
    const numberFields = [];
    let fields = ['jdbcUrl', 'user', 'password'];

    const { customSql, operation, readingInParallel, incrementalLoad } = state;

    if (operation === READ) {
        numberFields.push({ value: state.fetchsize, min: 0 });
        fields.push('incrementalLoad');
    }
    if (operation === READ && incrementalLoad === 'true') {
        fields = fields.concat(['incrementalOffsetKey']);
    }
    if (operation === WRITE || customSql === 'false') {
        fields = fields.concat(['schema', 'table']);
    }
    if (readingInParallel === 'true') {
        numberFields.push({ value: state.numPartitions, min: 1 });
    }
    if (operation === WRITE) {
        numberFields.push({ value: state.batchsize, min: 1 });
    }

    return (
        fields.some(key => isNilOrEmpty(state[key])) ||
        validateNumberFields(numberFields)
    );
};

export const checkRedisRequiredFields = state => {
    let fields = ['host', 'port', 'password', 'model'];
    const { readMode, operation, isConnectionPage } = state;

    if (isConnectionPage) {
        fields = ['host', 'port', 'password'];
    }

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
    const { operation, customSql, isConnectionPage } = state;

    const conditions = [
        { condition: isConnectionPage, fields: ['database'] },
        {
            condition:
                operation === READ && (customSql === 'false' || isNil(customSql)),
            fields: ['database', 'customSql', 'schema', 'table']
        },
        { condition: operation === WRITE, fields: ['schema', 'table'] },
        {
            condition: operation === READ && customSql === 'true',
            fields: ['database', 'option.dbtable']
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

export const checkRedshiftRequiredFields = state => {
    let fields = [
        'host',
        'port',
        'user',
        'password',
        'accessKey',
        'secretKey',
        'database',
        'bucket'
    ];

    const { isConnectionPage } = state;

    if (isConnectionPage) {
        fields = [
            'host',
            'port',
            'user',
            'password',
            'accessKey',
            'secretKey',
            'database'
        ];
    }

    return fields.some(key => isNilOrEmpty(state[key]));
};

export const checkKafkaReqiredFields = state => {
    let fields = ['bootstrapServers'];

    if (state.operation === READ) {
        fields.push('incrementalLoad');
    }

    if (state.operation === READ || state?.isConnectionPage) {
        fields.push('subscribe');
    } else {
        fields.push('topic');
    }

    if (state.operation === READ && state.incrementalLoad === 'true') {
        fields = fields.concat(['incrementalOffsetKey']);
    }

    return isAnyEmpty(...fields)(state);
};

export const checkMongoRequiredFields = state => {
    const { isConnectionPage, operation, incrementalLoad } = state;

    let fields = ['host', 'port', 'user', 'password', 'database', 'collection'];

    if (operation === READ) {
        fields.push('incrementalLoad');
    }

    if (operation === READ && incrementalLoad === 'true') {
        fields = fields.concat(['incrementalOffsetKey']);
    }

    if (isConnectionPage) {
        fields = ['host', 'port', 'user', 'password', 'database'];
    }

    return fields.some(key => isNilOrEmpty(state[key]));
};

export const checkCosRequiredFields = state => {
    let fields = ['endpoint', 'authType', 'bucket', 'path', 'format'];
    const { authType, isConnectionPage } = state;

    if (isConnectionPage) {
        fields = ['endpoint', 'authType'];
    }

    if (authType === 'IAM') {
        fields = fields.concat(['iamApiKey', 'iamServiceId']);
    }
    if (authType === 'HMAC') {
        fields = fields.concat(['accessKey', 'secretKey']);
    }

    return fields.some(key => isNilOrEmpty(state[key]));
};

export const checkElasticsearchRequiredFields = state => {
    const { isConnectionPage } = state;
    let fields = ['nodes', 'port', 'user', 'password', 'index', 'certData'];

    if (isConnectionPage) {
        fields = ['nodes', 'port', 'user', 'password', 'certData'];
    }

    return fields.some(key => isNilOrEmpty(state[key]));
};

export const checkCassandraRequiredFields = state => {
    const { isConnectionPage } = state;
    let fields = ['keyspace', 'host', 'port', 'username', 'password', 'table'];

    if (isConnectionPage) {
        fields = ['keyspace', 'host', 'port', 'username', 'password'];
    }
    return fields.some(key => isNilOrEmpty(state[key]));
};

export const checkAWSRequiredFields = state => {
    const {
        anonymousAccess,
        format,
        incrementalLoad,
        operation,
        isConnectionPage
    } = state;
    let fields = ['endpoint', 'anonymousAccess', 'bucket', 'path', 'format'];

    if (isConnectionPage) {
        fields = ['endpoint', 'anonymousAccess'];
    }

    if (operation === READ) {
        fields.push('incrementalLoad');
    }

    if (anonymousAccess === 'false') {
        fields = fields.concat(['accessKey', 'secretKey']);
    }

    if (operation === READ && incrementalLoad === 'true') {
        fields = fields.concat(['incrementalOffsetKey']);
    }

    if (format === 'binaryFile') {
        fields = fields.concat([
            'binaryFormat',
            'outputContentColumn',
            'outputPathColumn'
        ]);
    }

    return fields.some(key => isNilOrEmpty(state[key]));
};

export const windowFunctionRequiredFields = state => {
    const { 'option.windowFunction': windowFunction } = state;

    let fields = ['option.windowFunction'];
    let valid = true;
    if (![COUNT, SUM, AVG, MAX, MIN].includes(windowFunction)) {
        fields = fields.concat(['option.orderBy']);
        const orderBy = state['option.orderBy'];
        if (orderBy) {
            const arr = orderBy.split(',');
            valid =
                arr?.length > 0 &&
                arr.every(v => {
                    const strings = v.split(':');
                    return strings.length === 2 && strings.every(s => s);
                });
        }
    } else {
        fields = fields.concat(['option.column']);
    }

    if (windowFunction === NTILE) {
        fields = fields.concat(['option.n']);
    }

    if (windowFunction === LAG || windowFunction === LEAD) {
        fields = fields.concat(['option.expression']);
    }

    return !valid || fields.some(key => isNilOrEmpty(state[key]));
};

export const checkDatabricksRequiredFields = state => {
    const numberFields = [];
    const { operation, objectType, isConnectionPage } = state;
    let fields = [];

    if (isConnectionPage) {
        fields = [...fields, 'jdbcUrl', 'user', 'password'];
    } else {
        fields = [...fields, 'catalog', 'schema', 'objectType'];
        if (operation === WRITE) {
            fields = [...fields, 'writeMode'];
        }
        if (operation === READ) {
            numberFields.push({ value: state.versionAsOf, min: 1 });
        }
        if (objectType === 'table') {
            fields = [...fields, 'table'];
        }
        if (objectType === 'volume') {
            fields = [...fields, 'volume', 'volumePath', 'format'];
        }
    }

    return (
        fields.some(key => isNilOrEmpty(state[key])) ||
        validateNumberFields(numberFields)
    );
};

export const checkDatabricksJDBCRequiredFields = state => {
    const numberFields = [];
    const { operation, isConnectionPage, readingInParallel, customSql } = state;
    let fields = ['jdbcUrl', 'user', 'password'];

    if (!isConnectionPage) {
        fields = [...fields, 'catalog'];

        if (operation === WRITE || customSql === 'false') {
            fields = [...fields, 'schema', 'table'];
        }
        if (operation === WRITE) {
            fields = [...fields, 'writeMode'];
            numberFields.push({ value: state.batchsize, min: 1 });
        }
        if (readingInParallel === 'true') {
            numberFields.push({ value: state.numPartitions, min: 1 });
        }
        if (operation === READ) {
            numberFields.push({ value: state.fetchsize, min: 0 });
        }
    }

    return (
        fields.some(key => isNilOrEmpty(state[key])) ||
        validateNumberFields(numberFields)
    );
};

export const checkAzureBlobRequiredFields = state => {
    const { isConnectionPage, authType, format } = state;
    let fields = ['storageAccount', 'authType'];

    if (authType === 'storageAccountKey') {
        fields = fields.concat('storageAccountKey');
    }
    if (authType === 'SASToken') {
        fields = fields.concat('SASToken');
    }
    if (!isConnectionPage) {
        fields = fields.concat(['container', 'containerPath', 'format']);
    }
    if (format === 'binaryFile') {
        fields = fields.concat([
            'binaryFormat',
            'outputContentColumn',
            'outputPathColumn'
        ]);
    }

    return fields.some(key => isNilOrEmpty(state[key]));
};

export const checkGoogleCloudRequiredFields = state => {
    const { isConnectionPage, format } = state;
    let fields = ['pathToKeyFile'];

    if (!isConnectionPage) {
        fields = fields.concat(['bucket', 'path', 'format']);
    }
    if (format === 'binaryFile') {
        fields = fields.concat([
            'binaryFormat',
            'outputContentColumn',
            'outputPathColumn'
        ]);
    }

    return fields.some(key => isNilOrEmpty(state[key]));
};

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
    [STORAGES.CLICKHOUSE.value]: checkClickHouseRequiredFields,
    [STORAGES.KAFKA.value]: checkKafkaReqiredFields,
    [STORAGES.API.value]: isAnyEmpty('method', 'host'),
    [STORAGES?.DATABRICKS?.value]: checkDatabricksRequiredFields,
    [STORAGES?.DATABRICKSJDBC?.value]: checkDatabricksJDBCRequiredFields,
    [STORAGES.AZURE.value]: checkAzureBlobRequiredFields,
    [STORAGES.GOOGLECLOUD.value]: checkGoogleCloudRequiredFields,
    [DERIVE_COLUMN]: isAnyEmpty('option.expression'),
    [ADD_CONSTANT]: isAnyEmpty('option.constant'),
    [CHANGE_TYPE]: state => {
        const empty = isAnyEmpty('option.columnType')(state);

        if (empty) {
            return true;
        }
        const columnType = state['option.columnType'];

        if (columnType.includes('decimal')) {
            const [precision, scale] = parseDecimalType(columnType);

            return !!(isValidScale(scale, precision) || isValidPrecision(precision));
        }
        return false;
    },
    [RENAME_COLUMN]: isAnyEmpty('option.columnName'),
    [USE_CONDITIONS]: isAnyEmpty('option.conditions'),
    [USE_WINDOW_FUNCTION]: windowFunctionRequiredFields,
    [REPLACE_VALUES]: isAnyEmpty('option.oldValue', 'option.newValue'),
    [REPLACE_VALUES_CHAR_BY_CHAR]: isAnyEmpty('option.oldChars', 'option.newChars'),
    [REPLACE_VALUES_USING_CONDITIONS]: isAnyEmpty('option.conditions')
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

// eslint-disable-next-line complexity
export const checkStringFunctionsFields = state => {
    const func = state.function;
    const fields = ['name', 'option.sourceColumn', 'option.targetColumn'];
    switch (func) {
        case 'concat_ws':
            fields.push('option.separator');
            return fields.some(key => isNilOrEmpty(state[key]));
        case 'decode':
        case 'encode':
            fields.push('option.charset');
            return fields.some(key => isNilOrEmpty(state[key]));
        case 'format_number':
            fields.push('option.decimalPlaces');
            return fields.some(key => isNilOrEmpty(state[key]));
        case 'format_string':
            fields.push('option.formatString');
            return fields.some(key => isNilOrEmpty(state[key]));
        case 'instr':
        case 'locate':
            fields.push('option.substring');
            return fields.some(key => isNilOrEmpty(state[key]));
        case 'lpad':
        case 'rpad':
            fields.push('option.pad', 'option.length');
            return fields.some(key => isNilOrEmpty(state[key]));
        case 'repeat':
            fields.push('option.repeatNumber');
            return fields.some(key => isNilOrEmpty(state[key]));
        case 'regexp_extract':
            fields.push('option.regex', 'option.groupIndex');
            return fields.some(key => isNilOrEmpty(state[key]));
        case 'substring':
            fields.push('option.position', 'option.length');
            return fields.some(key => isNilOrEmpty(state[key]));
        case 'substring_index':
            fields.push('option.delimiter', 'option.count');
            return fields.some(key => isNilOrEmpty(state[key]));
        default:
            return fields.some(key => isNilOrEmpty(state[key]));
    }
};

export const checkSortFields = state =>
    !state.name ||
    !state.sortType ||
    !/^[^,]+?:/.test(state.orderColumns) ||
    /,:/.test(state.orderColumns);

export const checkJoinFields = state =>
    isAnyEmpty('name', 'joinType')(state) ||
    (isAnyEmpty('leftColumns', 'rightColumns')(state) && state.joinType !== 'cross');

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

export const checkWithColumnFields = state => {
    const { name, column, operationType } = state;

    if (!name || !column || !operationType) {
        return true;
    }

    const validate = validations[operationType];
    if (validate) {
        return validate(state);
    }
    return false;
};

export const checkDatatimeFields = state => {
    const schema = get(schemas, state.operation, []).slice(1);
    const validateOperationType = schema.find(
        ({ conditions, field }) =>
            conditions?.find(
                ({ operationType }) => operationType === state.function
            ) && !state[field]
    );
    return (
        isAnyEmpty('name', 'function', 'option.targetColumn')(state) ||
        !!validateOperationType
    );
};

export const checkPivotFields = state => {
    if (
        (state.operationType === 'pivot' &&
            isAnyEmpty(
                'option.groupBy',
                'option.pivotColumn',
                'option.aggregation'
            )(state)) ||
        (state.operationType === 'unpivot' &&
            isAnyEmpty(
                'option.unchangedColumns',
                'option.unpivotColumns',
                'option.unpivotNames'
            )(state))
    ) {
        return true;
    }
    const [aggregate, column] = state['option.aggregation']?.split('(') || [];
    if (
        state.operationType === 'pivot' &&
        (aggregate?.length === 0 || column?.slice(0, -1).length === 0)
    ) {
        return true;
    }
    return isAnyEmpty('name', 'operationType')(state);
};

const checkDropMode = state => {
    if (isAnyEmpty('option.dropType', 'option.dropChoice')(state)) {
        return true;
    }
    return (
        state['option.dropChoice'] === 'names' &&
        isAnyEmpty('option.dropColumns')(state)
    );
};

const checkFillMode = state => {
    const {
        'option.fillValueType': fillValueType,
        'option.fillChoice': fillChoice
    } = state;
    if (isAnyEmpty('option.fillValueType')(state)) {
        return true;
    }

    if (fillValueType === 'agg') {
        if (isAnyEmpty('option.fillColumns', 'option.fillStrategy')(state)) {
            return true;
        }
    }

    if (fillValueType === 'custom') {
        if (isAnyEmpty('option.fillChoice')(state)) {
            return true;
        }

        if (fillChoice === 'all' && isAnyEmpty('option.fillValues')(state)) {
            return true;
        }
        const columns = state['option.fillColumns']?.split(',');
        const values = state['option.fillValues']?.split(',');
        return (
            fillChoice === 'names' &&
            (!columns?.length ||
                columns.length !== values?.length ||
                columns.concat(values).some(v => !v))
        );
    }
    return false;
};

export const checkHandleNullFields = state => {
    if (state.mode === 'DROP' && checkDropMode(state)) {
        return true;
    }

    if (state.mode === 'fill' && checkFillMode(state)) {
        return true;
    }

    return isAnyEmpty('name', 'mode')(state);
};

export const checkAiValidation = state => {
    const { task } = state;
    let fields = [];
    if (task === 'parseText' || task === 'generateTask' || task === 'transcribe') {
        fields = fields.concat(['sourceColumn']);
    }

    if (task === 'generateData') {
        fields = fields.concat(['numberOfRecords']);
    }

    if (task === 'generateTask' || task === 'transcribe') {
        fields = fields.concat(['outputColumn']);
    }

    if (task === 'transcribe') {
        fields = fields.concat(['pathColumn']);
    }

    fields = fields.concat(['name', 'llm', 'endpoint', 'model', 'apiKey']);
    return fields.some(key => isNilOrEmpty(state[key]));
};
