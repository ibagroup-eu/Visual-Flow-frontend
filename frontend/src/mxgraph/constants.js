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

export const READ = 'READ';
export const WRITE = 'WRITE';
export const UNION = 'UNION';
export const GROUP = 'GROUP';
export const REMOVE_DUPLICATES = 'REMOVE_DUPLICATES';
export const JOIN = 'JOIN';
export const CDC = 'CDC';
export const EDGE = 'EDGE';
export const TRANSFORM = 'TRANSFORM';
export const SLICE = 'SLICE';
export const PIVOT = 'PIVOT';
export const FILTER = 'FILTER';
export const JOB = 'JOB';
export const NOTIFICATION = 'NOTIFICATION';
export const CONTAINER = 'CONTAINER';
export const WAIT = 'WAIT';
export const STRING = 'STRING';
export const PIPELINE = 'PIPELINE';
export const CACHE = 'CACHE';
export const SORT = 'SORT';
export const VALIDATE = 'VALIDATE';
export const DATETIME = 'DATETIME';
export const WITH_COLUMN = 'WITH_COLUMN';
export const HANDLE_NULL = 'HANDLE_NULL';
export const DATABRICKS = 'DATABRICKS';
export const AI_TEXT_TASK = 'AI_TEXT_TASK';

export const PENDING = 'Pending';
export const RUNNING = 'Running';
export const DEBUGGING = 'Debugging';
export const DRAFT = 'Draft';
export const SUCCEEDED = 'Succeeded';
export const FAILED = 'Failed';
export const UPSTREAM_FAILED = 'Upstream-failed';
export const ERROR = 'Error';
export const SKIPPED = 'Skipped';
export const TERMINATED = 'Terminated';
export const SUSPENDED = 'Suspended';
const UNKNOWN = 'Unknown';

export const RUN_ALL_EVENT = 'run-all';
export const RUN_FAILED_EVENT = 'run-failed';
export const RUN_EVENT = 'run';

export const INTERACTIVE_SUCCEEDED = 'succeeded';
export const INTERACTIVE_RUNNING = 'running';
export const INTERACTIVE_FAILED = 'failed';

export const OLD_STAGE_WIDTH = 130;
export const STAGE_WIDTH = 120;
export const STAGE_HEIGHT = 72;

export const AUTO_REFRESH_TIMER = 5;
export const PING_SESSION_TIMER = 30;

export const READWRITE = 'ReadWrite';
export const OTHER = 'Other';

export const DERIVE_COLUMN = 'deriveColumn';
export const ADD_CONSTANT = 'addConstant';
export const CHANGE_TYPE = 'changeType';
export const RENAME_COLUMN = 'renameColumn';
export const USE_CONDITIONS = 'useConditions';
export const USE_WINDOW_FUNCTION = 'useWindowFunction';
export const REPLACE_VALUES = 'replaceValues';
export const REPLACE_VALUES_USING_CONDITIONS = 'replaceValuesUsingConditions';
export const REPLACE_VALUES_CHAR_BY_CHAR = 'replaceValuesCharByChar';

export const RANK = 'rank';
export const DENSE_RANK = 'dense_rank';
export const PERCENT_RANK = 'percent_rank';
export const CUME_DIST = 'cume_dist';
export const ROW_NUMBER = 'row_number';
export const NTILE = 'ntile';
export const LAG = 'lag';
export const LEAD = 'lead';
export const COUNT = 'count';
export const SUM = 'sum';
export const AVG = 'avg';
export const MIN = 'min';
export const MAX = 'max';

export const JOB_STATUSES = [DRAFT, FAILED, PENDING, RUNNING, SUCCEEDED, UNKNOWN];

export const PIPELINE_STATUSES = [
    DRAFT,
    ERROR,
    FAILED,
    PENDING,
    RUNNING,
    SUCCEEDED,
    SUSPENDED,
    TERMINATED
];

const COMMON_STORAGES = {
    AWS: {
        value: 's3',
        label: 'AWS S3'
    },
    DB2: {
        value: 'db2',
        label: 'DB2'
    },
    CASSANDRA: {
        value: 'cassandra',
        label: 'Cassandra'
    },
    ELASTIC: {
        value: 'elastic',
        label: 'Elasticsearch'
    },
    COS: {
        value: 'cos',
        label: 'IBM COS'
    },
    MONGO: {
        value: 'mongo',
        label: 'Mongo'
    },
    MYSQL: {
        value: 'mysql',
        label: 'MySQL'
    },
    MSSQL: {
        value: 'mssql',
        label: 'MSSQL'
    },
    ORACLE: {
        value: 'oracle',
        label: 'Oracle'
    },
    POSTGRE: {
        value: 'postgresql',
        label: 'PostgreSQL'
    },
    REDIS: {
        value: 'redis',
        label: 'Redis'
    },
    REDSHIFT: {
        value: 'redshift',
        label: 'Redshift'
    },
    REDSHIFTJDBC: {
        value: 'redshift-jdbc',
        label: 'Redshift-jdbc'
    },
    DATAFRAME: {
        value: 'dataframe',
        label: 'Dataframe',
        hide: [WRITE]
    },
    CLUSTER: {
        value: 'cluster',
        label: 'Local File'
    },
    STDOUT: {
        value: 'stdout',
        label: 'STDOUT',
        hide: [READ]
    },
    CLICKHOUSE: {
        value: 'clickhouse',
        label: 'ClickHouse'
    },
    KAFKA: {
        value: 'kafka',
        label: 'Kafka'
    },
    API: {
        value: 'request',
        label: 'API',
        hide: [WRITE]
    },
    AZURE: {
        value: 'azure-blob-storage',
        label: 'Azure Blob Storage'
    },
    GOOGLECLOUD: {
        value: 'google-cloud-storage',
        label: 'Google Cloud Storage'
    }
};

const DATABRICKS_STORAGES = { ...COMMON_STORAGES };
DATABRICKS_STORAGES.DATABRICKS = {
    value: 'databricks',
    label: 'Databricks'
};

const VF_STORAGES = { ...COMMON_STORAGES };
VF_STORAGES.DATABRICKSJDBC = {
    value: 'databricks-jdbc',
    label: 'Databricks JDBC'
};

export const STORAGES =
    window.PLATFORM === DATABRICKS ? DATABRICKS_STORAGES : VF_STORAGES;

export const FILE_FORMATS = {
    CSV: {
        value: 'csv',
        label: 'CSV'
    },
    JSON: {
        value: 'json',
        label: 'JSON'
    },
    DELTA: {
        value: 'delta',
        label: 'Delta'
    },
    PARQUET: {
        value: 'parquet',
        label: 'Parquet'
    },
    ORC: {
        value: 'orc',
        label: 'ORC'
    },
    TEXT: {
        value: 'text',
        label: 'Text'
    },
    AVRO: {
        value: 'avro',
        label: 'Avro'
    },
    BINARY: {
        value: 'binaryFile',
        label: 'Binary'
    }
};

export const SHOW_DESCRIPTION = 'notSTDOUT';

export const SORT_TYPES = [
    {
        value: 'fullSort',
        label: 'Full sort'
    },
    {
        value: 'sortWithinPartitions',
        label: 'Sort within partitions'
    }
];

export const AWS = 'AWS';
export const GCP = 'GCP';
export const AZURE = 'Azure';
