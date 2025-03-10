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
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { INTERACTIVE_RUNNING, STORAGES } from '../../constants';
import makeTooltip from '../helpers/makeTooltip';
import { JobStageTag } from '../../../components/stage-tag';
import { StageParameters, Parameter } from '../parameters';
import { ConfiguredStageWithIcon } from '../../sidebar/stage-icon';
import InteractiveModeButtons from '../helpers/InteractiveModeButtons';
import InteractiveModeTooltips from '../helpers/InteractiveModeTooltips';
import Spinner from '../helpers/Spinner';

import useStyles from './ReadWriteStage.Styles';

const ReadWriteStage = ({ stage }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const cosStageFields = () => (
        <>
            <Parameter name={t('jobDesigner:readConfiguration.bucket')}>
                {' '}
                {makeTooltip(stage.bucket, stage.bucket)}
            </Parameter>
            <Parameter name={t('jobDesigner:Path')}>
                {' '}
                {makeTooltip(stage.path, stage.path)}
            </Parameter>
        </>
    );

    const tableField = () => (
        <Parameter name={t('jobDesigner:readConfiguration.table')}>
            {' '}
            {makeTooltip(stage.table, stage.table)}
        </Parameter>
    );

    // eslint-disable-next-line complexity
    const renderStorageData = () => {
        switch (stage.storage.toLowerCase()) {
            case STORAGES.DB2.value:
            case STORAGES.POSTGRE.value:
            case STORAGES.ORACLE.value:
            case STORAGES.MYSQL.value:
            case STORAGES.MSSQL.value:
            case STORAGES.REDSHIFTJDBC.value:
            case STORAGES.CLICKHOUSE.value:
            case STORAGES?.DATABRICKSJDBC?.value:
                return (
                    <>
                        <Parameter name={t('jobDesigner:readConfiguration.schema')}>
                            {' '}
                            {makeTooltip(stage.schema, stage.schema)}
                        </Parameter>
                        {tableField()}
                    </>
                );
            case STORAGES?.DATABRICKS?.value:
                return (
                    <>
                        <Parameter name={t('jobDesigner:readConfiguration.schema')}>
                            {' '}
                            {makeTooltip(stage.schema, stage.schema)}
                        </Parameter>
                        {stage.objectType === 'table' && tableField()}
                        {stage.objectType === 'volume' && (
                            <Parameter
                                name={t('jobDesigner:readConfiguration.volume')}
                            >
                                {' '}
                                {makeTooltip(stage.volume, stage.volume)}
                            </Parameter>
                        )}
                    </>
                );
            case STORAGES.ELASTIC.value:
                return (
                    <Parameter name={t('jobDesigner:readConfiguration.index')}>
                        {' '}
                        {makeTooltip(stage.index, stage.index)}
                    </Parameter>
                );
            case STORAGES.COS.value:
            case STORAGES.AWS.value:
            case STORAGES.GOOGLECLOUD.value:
                return cosStageFields();
            case STORAGES.MONGO.value:
                return (
                    <>
                        <Parameter
                            name={t('jobDesigner:readConfiguration.database')}
                        >
                            {' '}
                            {makeTooltip(stage.database, stage.database)}
                        </Parameter>
                        <Parameter
                            name={t('jobDesigner:readConfiguration.collection')}
                        >
                            {' '}
                            {makeTooltip(stage.collection, stage.collection)}
                        </Parameter>
                    </>
                );
            case STORAGES.REDSHIFT.value:
                return (
                    <>
                        <Parameter
                            name={t('jobDesigner:readConfiguration.database')}
                        >
                            {' '}
                            {makeTooltip(stage.database, stage.database)}
                        </Parameter>
                        <Parameter name={t('jobDesigner:readConfiguration.bucket')}>
                            {' '}
                            {makeTooltip(stage.bucket, stage.bucket)}
                        </Parameter>
                    </>
                );
            case STORAGES.CASSANDRA.value:
                return (
                    <>
                        <Parameter
                            name={t('jobDesigner:readConfiguration.keyspace')}
                        >
                            {' '}
                            {makeTooltip(stage.keyspace, stage.keyspace)}
                        </Parameter>
                        {tableField()}
                    </>
                );
            case STORAGES.REDIS.value:
                return (
                    <>
                        <Parameter name={t('jobDesigner:readConfiguration.host')}>
                            {' '}
                            {makeTooltip(stage.host, stage.host)}
                        </Parameter>
                        <Parameter
                            name={t('jobDesigner:readConfiguration.keyColumn')}
                        >
                            {' '}
                            {makeTooltip(stage.keyColumn, stage.keyColumn)}
                        </Parameter>
                    </>
                );
            case STORAGES.STDOUT.value:
            case STORAGES.DATAFRAME.value:
            case STORAGES.KAFKA.value:
                return null;
            case STORAGES.CLUSTER.value:
                return (
                    <Parameter name={t('jobDesigner:readConfiguration.file')}>
                        {' '}
                        {makeTooltip(
                            stage.path?.split('/')[3],
                            stage.path?.split('/')[3]
                        )}
                    </Parameter>
                );
            case STORAGES.API.value:
                return (
                    <Parameter name={t('jobDesigner:readConfiguration.method')}>
                        {' '}
                        {makeTooltip(stage.method, stage.method)}
                    </Parameter>
                );
            case STORAGES.AZURE.value:
                return (
                    <>
                        <Parameter
                            name={t('jobDesigner:readConfiguration.container')}
                        >
                            {' '}
                            {makeTooltip(stage.container, stage.container)}
                        </Parameter>
                        <Parameter
                            name={t('jobDesigner:readConfiguration.containerPath')}
                        >
                            {' '}
                            {makeTooltip(stage.containerPath, stage.containerPath)}
                        </Parameter>
                    </>
                );
            default:
                throw new Error(`Unsupported storage: ${stage.storage}`);
        }
    };

    return (
        <>
            <ConfiguredStageWithIcon
                operation={stage.operation}
                name={
                    <>
                        {makeTooltip(stage.name, stage.name)}

                        {stage.interactiveMode && (
                            <InteractiveModeButtons stage={stage} />
                        )}
                    </>
                }
            >
                {stage.status === INTERACTIVE_RUNNING && <Spinner />}
                <StageParameters>
                    {stage.storage && renderStorageData()}
                </StageParameters>

                {stage.status !== INTERACTIVE_RUNNING && (
                    <InteractiveModeTooltips stage={stage} />
                )}
                <JobStageTag className={classes.storage}>
                    {
                        Object.values(STORAGES).find(
                            ({ value }) => value === stage.storage
                        )?.label
                    }
                </JobStageTag>
            </ConfiguredStageWithIcon>
        </>
    );
};

ReadWriteStage.propTypes = {
    stage: PropTypes.object
};

export default ReadWriteStage;
