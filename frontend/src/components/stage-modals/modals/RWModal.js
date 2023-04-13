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

import React from 'react';
import { useTranslation } from 'react-i18next';
import InfoModal from '../info';
import {
    SHOW_DESCRIPTION,
    STORAGES,
    READ as CONSTANTS_READ,
    WRITE as CONSTANTS_WRITE
} from '../../../mxgraph/constants';

const READ = 'Read';
const WRITE = 'Write';

const getClickHouseWriteMode = t => ({
    title: t('ReadWrite:writeMode.name'),
    paragraph: t('ReadWrite:writeMode.value'),
    paragraph1: t('ReadWrite:writeMode.value1'),
    paragraph2: t('ReadWrite:writeMode.value2'),
    paragraph3: t('ReadWrite:writeMode.value3'),
    hide: [READ]
});

const getWriteMode = t => ({
    ...getClickHouseWriteMode(t),
    paragraph4: t('ReadWrite:writeMode.value4'),
    paragraph5: t('ReadWrite:writeMode.value5'),
    hide: [READ]
});

const getTruncateMode = t => ({
    title: t('ReadWrite:truncateMode.name'),
    paragraph: t('ReadWrite:truncateMode.value1'),
    paragraph1: t('ReadWrite:truncateMode.value2'),
    paragraph2: t('ReadWrite:truncateMode.value3'),
    paragraph3: t('ReadWrite:truncateMode.value4'),
    paragraph4: t('ReadWrite:truncateMode.value5'),
    paragraph5: t('ReadWrite:truncateMode.value6'),
    hide: [READ]
});

const getTruncateModeCascade = t => ({
    title: '',
    paragraph: t('ReadWrite:truncateModeCascade.value1'),
    paragraph1: t('ReadWrite:truncateModeCascade.value2'),
    paragraph2: t('ReadWrite:truncateModeCascade.value3'),
    hide: [
        READ,
        STORAGES.DB2.label,
        STORAGES.MYSQL.label,
        STORAGES.MSSQL.label,
        STORAGES.REDSHIFTJDBC.label,
        STORAGES.CLICKHOUSE.label
    ]
});

const getContent = t => [
    {
        title: t('ReadWrite:note.name'),
        paragraph: t('ReadWrite:note.value'),
        hide: [WRITE]
    },
    {
        title: t('ReadWrite:STDOUT.description.name'),
        paragraph: t('ReadWrite:STDOUT.description.value'),
        hide: [SHOW_DESCRIPTION]
    },
    {
        title: t('ReadWrite:name.name'),
        paragraph: t('ReadWrite:name.value')
    },
    {
        title: t('ReadWrite:storage.name'),
        paragraph1: t('ReadWrite:storage.value1')
    }
];

const getQuery = t => ({
    title: t('ReadWrite:DB2.optionDbtable.name'),
    paragraph: t('ReadWrite:DB2.optionDbtable.value'),
    paragraph1: t('ReadWrite:DB2.optionDbtable.value1'),
    paragraph2: t('ReadWrite:DB2.optionDbtable.value2'),
    paragraph3: t('ReadWrite:DB2.optionDbtable.value3'),
    hide: [WRITE]
});

const getCosInfo = (label, t) => [
    {
        title: t(`ReadWrite:${label}.accessKey.name`),
        paragraph: t(`ReadWrite:${label}.accessKey.value`)
    },
    {
        title: t(`ReadWrite:${label}.secretKey.name`),
        paragraph: t(`ReadWrite:${label}.secretKey.value`)
    },
    {
        title: t(`ReadWrite:${label}.bucket.name`),
        paragraph: t(`ReadWrite:${label}.bucket.value`)
    },
    {
        title: t(`ReadWrite:${label}.pathInBucket.name`),
        paragraph: t(`ReadWrite:${label}.pathInBucket.value`)
    },
    getWriteMode(t),
    {
        title: t(`ReadWrite:${label}.format.name`),
        paragraph: t(`ReadWrite:${label}.format.value`),
        paragraph1: t(`ReadWrite:${label}.format.value1`)
    },
    {
        title: t(`ReadWrite:${label}.avroSchema.writeName`),
        paragraph: t(`ReadWrite:${label}.avroSchema.value`),
        paragraph1: t(`ReadWrite:${label}.avroSchema.value1`),
        hide: [READ]
    },
    {
        title: t(`ReadWrite:${label}.avroSchema.readName`),
        paragraph: t(`ReadWrite:${label}.avroSchema.value`),
        paragraph1: t(`ReadWrite:${label}.avroSchema.value1`),
        hide: [WRITE]
    },
    {
        title: t(`ReadWrite:${label}.partitionBy.name`),
        paragraph: t(`ReadWrite:${label}.partitionBy.value`),
        paragraph1: t(`ReadWrite:${label}.partitionBy.value1`),
        paragraph2: t(`ReadWrite:${label}.partitionBy.value2`),
        hide: [READ]
    }
];

const getDB2 = t => [
    {
        title: t('ReadWrite:DB2.JDBCURL.name'),
        paragraph: t('ReadWrite:DB2.JDBCURL.value'),
        paragraph1: t('ReadWrite:DB2.JDBCURL.value1'),
        paragraph2: t('ReadWrite:DB2.JDBCURL.value2')
    },
    {
        title: t('ReadWrite:DB2.user.name'),
        paragraph: t('ReadWrite:DB2.user.value')
    },
    {
        title: t('ReadWrite:DB2.password.name'),
        paragraph: t('ReadWrite:DB2.password.value')
    },
    {
        title: t('ReadWrite:DB2.customSql.name'),
        paragraph: t('ReadWrite:DB2.customSql.value'),
        hide: [WRITE]
    },
    {
        title: t('ReadWrite:DB2.schema.name'),
        paragraph: t('ReadWrite:DB2.schema.value')
    },
    {
        title: t('ReadWrite:DB2.table.name'),
        paragraph: t('ReadWrite:DB2.table.value')
    },
    getQuery(t),
    getWriteMode(t),
    getTruncateMode(t),
    getTruncateModeCascade(t),
    {
        title: t('ReadWrite:DB2.certData.name'),
        paragraph: t('ReadWrite:DB2.certData.value')
    }
];

const getCos = t => [
    {
        title: t('ReadWrite:COS.endpoint.name'),
        paragraph: t('ReadWrite:COS.endpoint.value')
    },
    {
        title: t('ReadWrite:COS.authType.name'),
        paragraph: t('ReadWrite:COS.authType.value')
    },
    {
        title: t('ReadWrite:COS.iamApiKey.name'),
        paragraph: t('ReadWrite:COS.iamApiKey.value')
    },
    {
        title: t('ReadWrite:COS.iamServiceId.name'),
        paragraph: t('ReadWrite:COS.iamServiceId.value')
    },
    ...getCosInfo('COS', t)
];

const getAws = t => [
    {
        title: t('ReadWrite:AWS.endpoint.name'),
        paragraph: t('ReadWrite:AWS.endpoint.value')
    },
    {
        title: t('ReadWrite:AWS.anonymousAccess.name'),
        paragraph: t('ReadWrite:AWS.anonymousAccess.value')
    },
    {
        title: t('ReadWrite:AWS.ssl.name'),
        paragraph: t('ReadWrite:AWS.ssl.value'),
        paragraph1: t('ReadWrite:AWS.ssl.value1')
    },
    ...getCosInfo('AWS', t)
];

const getElastic = t => [
    {
        title: t('ReadWrite:ELASTIC.nodes.name'),
        paragraph: t('ReadWrite:ELASTIC.nodes.value')
    },
    {
        title: t('ReadWrite:ELASTIC.port.name'),
        paragraph: t('ReadWrite:ELASTIC.port.value')
    },
    {
        title: t('ReadWrite:ELASTIC.user.name'),
        paragraph: t('ReadWrite:ELASTIC.user.value')
    },
    {
        title: t('ReadWrite:ELASTIC.password.name'),
        paragraph: t('ReadWrite:ELASTIC.password.value')
    },
    {
        title: t('ReadWrite:ELASTIC.index.name'),
        paragraph: t('ReadWrite:ELASTIC.index.value')
    },
    getWriteMode(t),
    {
        title: t('ReadWrite:ELASTIC.ssl.name'),
        paragraph: t('ReadWrite:ELASTIC.ssl.value'),
        paragraph1: t('ReadWrite:ELASTIC.ssl.value1'),
        paragraph2: t('ReadWrite:ELASTIC.ssl.value2')
    },
    {
        title: t('ReadWrite:ELASTIC.certData.name'),
        paragraph: t('ReadWrite:ELASTIC.certData.value'),
        paragraph1: t('ReadWrite:ELASTIC.certData.value1')
    }
];

const getMongo = t => [
    {
        title: t('ReadWrite:MONGO.database.name'),
        paragraph: t('ReadWrite:MONGO.database.value')
    },
    {
        title: t('ReadWrite:MONGO.collection.name'),
        paragraph: t('ReadWrite:MONGO.collection.value')
    },
    {
        title: t('ReadWrite:MONGO.host.name'),
        paragraph: t('ReadWrite:MONGO.host.value')
    },
    {
        title: t('ReadWrite:MONGO.port.name'),
        paragraph: t('ReadWrite:MONGO.port.value')
    },
    {
        title: t('ReadWrite:MONGO.user.name'),
        paragraph: t('ReadWrite:MONGO.user.value')
    },
    {
        title: t('ReadWrite:MONGO.password.name'),
        paragraph: t('ReadWrite:MONGO.password.value')
    },
    {
        title: t('ReadWrite:MONGO.ssl.name'),
        paragraph: t('ReadWrite:MONGO.ssl.value')
    },
    getWriteMode(t)
];

const getRedShift = t => [
    {
        title: t('ReadWrite:REDSHIFT.host.name'),
        paragraph: t('ReadWrite:REDSHIFT.host.value')
    },
    {
        title: t('ReadWrite:REDSHIFT.port.name'),
        paragraph: t('ReadWrite:REDSHIFT.port.value')
    },
    {
        title: t('ReadWrite:REDSHIFT.database.name'),
        paragraph: t('ReadWrite:REDSHIFT.database.value')
    },
    {
        title: t('ReadWrite:REDSHIFT.user.name'),
        paragraph: t('ReadWrite:REDSHIFT.user.value')
    },
    {
        title: t('ReadWrite:REDSHIFT.password.name'),
        paragraph: t('ReadWrite:REDSHIFT.password.value')
    },
    {
        title: t('ReadWrite:REDSHIFT.ssl.name'),
        paragraph: t('ReadWrite:REDSHIFT.ssl.value')
    },
    {
        title: t('ReadWrite:REDSHIFT.tempdir.name'),
        paragraph: t('ReadWrite:REDSHIFT.tempdir.value'),
        paragraph1: t('ReadWrite:REDSHIFT.tempdir.value1')
    },
    {
        title: t('ReadWrite:REDSHIFT.accessKey.name'),
        paragraph: t('ReadWrite:REDSHIFT.accessKey.value')
    },
    {
        title: t('ReadWrite:REDSHIFT.secretKey.name'),
        paragraph: t('ReadWrite:REDSHIFT.secretKey.value')
    },
    {
        title: t('ReadWrite:REDSHIFT.extraCopyOptions.name'),
        paragraph: t('ReadWrite:REDSHIFT.extraCopyOptions.value'),
        paragraph1: t('ReadWrite:REDSHIFT.extraCopyOptions.value1')
    },
    {
        title: t('ReadWrite:REDSHIFT.customSql.name'),
        paragraph: t('ReadWrite:REDSHIFT.customSql.value'),
        hide: [WRITE]
    },
    {
        title: t('ReadWrite:REDSHIFT.table.name'),
        paragraph: t('ReadWrite:REDSHIFT.table.value')
    },
    {
        title: t('ReadWrite:REDSHIFT.query.name'),
        paragraph: t('ReadWrite:REDSHIFT.query.value'),
        hide: [WRITE]
    },

    getWriteMode(t)
];

const getCassandra = t => [
    {
        title: t('ReadWrite:CASSANDRA.keyspace.name'),
        paragraph: t('ReadWrite:CASSANDRA.keyspace.value')
    },
    {
        title: t('ReadWrite:CASSANDRA.table.name'),
        paragraph: t('ReadWrite:CASSANDRA.table.value')
    },
    {
        title: t('ReadWrite:CASSANDRA.cluster.name'),
        paragraph: t('ReadWrite:CASSANDRA.cluster.value')
    },
    {
        title: t('ReadWrite:CASSANDRA.host.name'),
        paragraph: t('ReadWrite:CASSANDRA.host.value')
    },
    {
        title: t('ReadWrite:CASSANDRA.port.name'),
        paragraph: t('ReadWrite:CASSANDRA.port.value')
    },
    {
        title: t('ReadWrite:CASSANDRA.ssl.name'),
        paragraph: t('ReadWrite:CASSANDRA.ssl.value')
    },
    {
        title: t('ReadWrite:CASSANDRA.username.name'),
        paragraph: t('ReadWrite:CASSANDRA.username.value')
    },
    {
        title: t('ReadWrite:CASSANDRA.password.name'),
        paragraph: t('ReadWrite:CASSANDRA.password.value')
    },
    {
        title: t('ReadWrite:CASSANDRA.pushdownEnabled.name'),
        paragraph: t('ReadWrite:CASSANDRA.pushdownEnabled.value')
    },
    {
        title: t('ReadWrite:CASSANDRA.certData.name'),
        paragraph: t('ReadWrite:CASSANDRA.certData.value')
    },
    getWriteMode(t)
];

const getRedis = t => [
    {
        title: t('ReadWrite:REDIS.host.name'),
        paragraph: t('ReadWrite:REDIS.host.value')
    },
    {
        title: t('ReadWrite:REDIS.port.name'),
        paragraph: t('ReadWrite:REDIS.port.value')
    },
    {
        title: t('ReadWrite:REDIS.password.name'),
        paragraph: t('ReadWrite:REDIS.password.value')
    },
    {
        title: t('ReadWrite:REDIS.ssl.name'),
        paragraph: t('ReadWrite:REDIS.ssl.value')
    },
    {
        title: t('ReadWrite:REDIS.model.name'),
        paragraph: t('ReadWrite:REDIS.model.value')
    },
    {
        title: t('ReadWrite:REDIS.keyColumn.name'),
        paragraph: t('ReadWrite:REDIS.keyColumn.value'),
        paragraph1: t('ReadWrite:REDIS.keyColumn.value1')
    },
    {
        title: t('ReadWrite:REDIS.readMode.name'),
        paragraph: t('ReadWrite:REDIS.readMode.value'),
        hide: [WRITE]
    },
    {
        title: t('ReadWrite:REDIS.table.name'),
        paragraph: t('ReadWrite:REDIS.table.value')
    },
    {
        title: t('ReadWrite:REDIS.keysPattern.name'),
        paragraph: t('ReadWrite:REDIS.keysPattern.value')
    },
    {
        title: t('ReadWrite:REDIS.ttl.name'),
        paragraph: t('ReadWrite:REDIS.ttl.value'),
        hide: [READ]
    },
    getWriteMode(t)
];

const getStdout = t => [
    {
        title: t('ReadWrite:STDOUT.quantity.name'),
        paragraph: t('ReadWrite:STDOUT.quantity.value'),
        paragraph1: t('ReadWrite:STDOUT.quantity.value1'),
        paragraph2: t('ReadWrite:STDOUT.quantity.value2'),
        paragraph3: t('ReadWrite:STDOUT.quantity.value3')
    }
];

const getCluster = t => [
    {
        title: t('ReadWrite:CLUSTER.filePath.name'),
        paragraph: t('ReadWrite:CLUSTER.filePath.value'),
        hide: [WRITE]
    },
    {
        title: t('ReadWrite:CLUSTER.fileName.name'),
        paragraph: t('ReadWrite:CLUSTER.fileName.value'),
        hide: [READ]
    },
    {
        title: t('ReadWrite:CLUSTER.format.name'),
        paragraph: t('ReadWrite:CLUSTER.format.value'),
        paragraph1: t('ReadWrite:CLUSTER.format.value1')
    },
    {
        title: t('ReadWrite:CLUSTER.avroSchema.writeName'),
        paragraph: t('ReadWrite:CLUSTER.avroSchema.value'),
        paragraph1: t('ReadWrite:CLUSTER.avroSchema.value1'),
        hide: [READ]
    },
    {
        title: t('ReadWrite:CLUSTER.avroSchema.readName'),
        paragraph: t('ReadWrite:CLUSTER.avroSchema.value'),
        paragraph1: t('ReadWrite:CLUSTER.avroSchema.value1'),
        hide: [WRITE]
    },
    {
        title: t('ReadWrite:CLUSTER.partitionBy.name'),
        paragraph: t('ReadWrite:CLUSTER.partitionBy.value'),
        paragraph1: t('ReadWrite:CLUSTER.partitionBy.value1'),
        paragraph2: t('ReadWrite:CLUSTER.partitionBy.value2'),
        hide: [READ]
    }
];

const getDataframe = t => [
    {
        title: t('ReadWrite:DATAFRAME.dataframe.name'),
        paragraph: t('ReadWrite:DATAFRAME.dataframe.value')
    }
];

const getClickHouse = t => [
    {
        title: t('ReadWrite:CLICKHOUSE.host.name'),
        paragraph: t('ReadWrite:CLICKHOUSE.host.value')
    },
    {
        title: t('ReadWrite:CLICKHOUSE.port.name'),
        paragraph: t('ReadWrite:CLICKHOUSE.port.value')
    },
    {
        title: t('ReadWrite:CLICKHOUSE.user.name'),
        paragraph: t('ReadWrite:CLICKHOUSE.user.value')
    },
    {
        title: t('ReadWrite:CLICKHOUSE.password.name'),
        paragraph: t('ReadWrite:CLICKHOUSE.password.value')
    },
    {
        title: t('ReadWrite:CLICKHOUSE.database.name'),
        paragraph: t('ReadWrite:CLICKHOUSE.database.value')
    },
    {
        title: t('ReadWrite:CLICKHOUSE.customSql.name'),
        paragraph: t('ReadWrite:CLICKHOUSE.customSql.value'),
        hide: [WRITE]
    },
    {
        title: t('ReadWrite:CLICKHOUSE.schema.name'),
        paragraph: t('ReadWrite:CLICKHOUSE.schema.value')
    },
    {
        title: t('ReadWrite:CLICKHOUSE.table.name'),
        paragraph: t('ReadWrite:CLICKHOUSE.table.value')
    },
    getQuery(t),
    getClickHouseWriteMode(t)
];

const getKafka = t => [
    {
        title: t('ReadWrite:KAFKA.bootstrapServers.name'),
        paragraph: t('ReadWrite:KAFKA.bootstrapServers.value')
    },
    {
        title: t('ReadWrite:KAFKA.topicName.name'),
        paragraph: t('ReadWrite:KAFKA.topicName.value')
    },
    {
        title: t('ReadWrite:KAFKA.filePath.name'),
        paragraph: t('ReadWrite:KAFKA.filePath.value')
    },
    {
        title: t('ReadWrite:KAFKA.options.name'),
        paragraph: t('ReadWrite:KAFKA.options.value')
    }
];

const getAPI = t => [
    {
        title: t('ReadWrite:API.host.name'),
        paragraph: t('ReadWrite:API.host.value')
    },
    {
        title: t('ReadWrite:API.method.name'),
        paragraph: t('ReadWrite:API.method.value')
    },
    {
        title: t('ReadWrite:API.jsonPath.name'),
        paragraph: t('ReadWrite:API.jsonPath.value')
    },
    {
        title: t('ReadWrite:API.headers.name'),
        paragraph: t('ReadWrite:API.headers.value')
    },
    {
        title: t('ReadWrite:API.params.name'),
        paragraph: t('ReadWrite:API.params.value')
    }
];

const RWModal = props => {
    const { t } = useTranslation();

    const storages = Object.values(STORAGES)
        .filter(
            ({ hide }) =>
                ![CONSTANTS_READ, CONSTANTS_WRITE].every(v => hide?.includes(v))
        )
        .map(v => v.label)
        .sort();
    return (
        <InfoModal
            content={getContent(t)}
            storages={storages}
            db2={getDB2(t)}
            cos={getCos(t)}
            aws={getAws(t)}
            elastic={getElastic(t)}
            mongo={getMongo(t)}
            redshift={getRedShift(t)}
            cassandra={getCassandra(t)}
            redis={getRedis(t)}
            stdout={getStdout(t)}
            cluster={getCluster(t)}
            dataframe={getDataframe(t)}
            clickhouse={getClickHouse(t)}
            kafka={getKafka(t)}
            api={getAPI(t)}
            {...props}
        />
    );
};

export default RWModal;
