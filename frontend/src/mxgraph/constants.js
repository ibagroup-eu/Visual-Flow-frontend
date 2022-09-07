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
export const FILTER = 'FILTER';
export const JOB = 'JOB';
export const NOTIFICATION = 'NOTIFICATION';
export const CONTAINER = 'CONTAINER';
export const PIPELINE = 'PIPELINE';
export const CACHE = 'CACHE';
export const SORT = 'SORT';

export const PENDING = 'Pending';
export const RUNNING = 'Running';
export const DRAFT = 'Draft';
export const SUCCEEDED = 'Succeeded';
export const FAILED = 'Failed';
export const ERROR = 'Error';
export const SKIPPED = 'Skipped';
export const TERMINATED = 'Terminated';
const SUSPENDED = 'Suspended';
const STOPPED = 'Stopped';
const UNKNOWN = 'Unknown';

export const READWRITE = 'ReadWrite';
export const OTHER = 'Other';

export const JOB_STATUSES = [DRAFT, FAILED, PENDING, RUNNING, SUCCEEDED, UNKNOWN];

export const PIPELINE_STATUSES = [
    DRAFT,
    ERROR,
    FAILED,
    PENDING,
    RUNNING,
    STOPPED,
    SUCCEEDED,
    SUSPENDED,
    TERMINATED
];

export const STORAGES = {
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
    REDSHIFTJDBC: {
        value: 'redshift-jdbc',
        label: 'Redshift-jdbc'
    },
    STDOUT: {
        value: 'stdout',
        label: 'STDOUT',
        hide: [READ]
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
