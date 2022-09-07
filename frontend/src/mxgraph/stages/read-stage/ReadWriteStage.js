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
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import stageIcon from '../../sidebar/stage-icon/stageIcon';
import useStyles from './ReadWriteStage.Styles';
import { STORAGES } from '../../constants';
import makeTooltip from '../helpers/makeTooltip';

import StageTag from '../../../components/stage-tag';

const ReadWriteStage = ({ stage }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const cosStageFields = () => (
        <>
            <Typography
                variant="caption"
                component="div"
                className={classes.bucket}
                color="textSecondary"
            >
                {t('jobDesigner:readConfiguration.Bucket')}:{' '}
                {makeTooltip(stage.bucket, stage.bucket)}
            </Typography>
            <Typography
                variant="caption"
                component="div"
                className={classes.pathInBucket}
                color="textSecondary"
            >
                {t('jobDesigner:Path')}: {makeTooltip(stage.path, stage.path)}
            </Typography>
        </>
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
                return (
                    <>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.schema}
                            color="textSecondary"
                        >
                            {t('jobDesigner:readConfiguration.Schema')}:{' '}
                            {makeTooltip(stage.schema, stage.schema)}
                        </Typography>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.table}
                            color="textSecondary"
                        >
                            {t('jobDesigner:readConfiguration.Table')}:{' '}
                            {makeTooltip(stage.table, stage.table)}
                        </Typography>
                    </>
                );
            case STORAGES.ELASTIC.value:
                return (
                    <Typography
                        variant="caption"
                        component="div"
                        className={classes.bucket}
                        color="textSecondary"
                    >
                        {t('jobDesigner:readConfiguration.Index')}:{' '}
                        {makeTooltip(stage.index, stage.index)}
                    </Typography>
                );
            case STORAGES.COS.value:
            case STORAGES.AWS.value:
                return cosStageFields();
            case STORAGES.MONGO.value:
                return (
                    <>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.schema}
                            color="textSecondary"
                        >
                            {t('jobDesigner:readConfiguration.Database')}:{' '}
                            {makeTooltip(stage.database, stage.database)}
                        </Typography>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.table}
                            color="textSecondary"
                        >
                            {t('jobDesigner:readConfiguration.Collection')}:{' '}
                            {makeTooltip(stage.collection, stage.collection)}
                        </Typography>
                    </>
                );
            case STORAGES.CASSANDRA.value:
                return (
                    <>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.schema}
                            color="textSecondary"
                        >
                            {t('jobDesigner:readConfiguration.Keyspace')}:{' '}
                            {makeTooltip(stage.keyspace, stage.keyspace)}
                        </Typography>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.table}
                            color="textSecondary"
                        >
                            {t('jobDesigner:readConfiguration.Table')}:{' '}
                            {makeTooltip(stage.table, stage.table)}
                        </Typography>
                    </>
                );
            case STORAGES.REDIS.value:
                return (
                    <>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.schema}
                            color="textSecondary"
                        >
                            {t('jobDesigner:readConfiguration.Host')}:{' '}
                            {makeTooltip(stage.host, stage.host)}
                        </Typography>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.table}
                            color="textSecondary"
                        >
                            {t('jobDesigner:readConfiguration.KeyColumn')}:{' '}
                            {makeTooltip(stage.keyColumn, stage.keyColumn)}
                        </Typography>
                    </>
                );
            case STORAGES.STDOUT.value:
                return null;
            default:
                throw new Error(`Unsupported storage: ${stage.storage}`);
        }
    };

    return (
        <div className={classes.root}>
            <Typography variant="body2" component="div" className={classes.name}>
                {stageIcon(stage.operation)}
                {makeTooltip(stage.name, stage.name)}
            </Typography>
            {stage.storage && renderStorageData()}
            <StageTag
                className={classes.storage}
                content={
                    Object.values(STORAGES).find(
                        ({ value }) => value === stage.storage
                    )?.label
                }
            />
        </div>
    );
};

ReadWriteStage.propTypes = {
    stage: PropTypes.object
};

export default ReadWriteStage;
