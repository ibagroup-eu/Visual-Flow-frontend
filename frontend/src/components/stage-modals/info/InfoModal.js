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

import { Box, FormControl, InputLabel, Select, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { find } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import PopupForm from '../../popup-form';
import { STORAGES, SHOW_DESCRIPTION } from '../../../mxgraph/constants';

import useStyles from './InfoModal.Style';

const InfoModal = ({
    content,
    storages,
    db2,
    cos,
    aws,
    elastic,
    mongo,
    cassandra,
    redis,
    redshift,
    stdout,
    cluster,
    dataframe,
    clickhouse,
    display,
    title,
    onClose,
    currentStorage
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const storageValue = find(STORAGES, { value: currentStorage });
    const [storage, setStorage] = React.useState('');

    useEffect(() => {
        if (currentStorage && !display) {
            setStorage(storageValue.label);
        }
        if (currentStorage === undefined) {
            setStorage('');
        }
    }, [currentStorage, display]);

    // eslint-disable-next-line complexity
    const chosenStorage = () => {
        switch (storage) {
            case STORAGES.DB2.label:
            case STORAGES.POSTGRE.label:
            case STORAGES.ORACLE.label:
            case STORAGES.MYSQL.label:
            case STORAGES.MSSQL.label:
            case STORAGES.REDSHIFTJDBC.label:
                return db2;
            case STORAGES.COS.label:
                return cos;
            case STORAGES.AWS.label:
                return aws;
            case STORAGES.ELASTIC.label:
                return elastic;
            case STORAGES.MONGO.label:
                return mongo;
            case STORAGES.CASSANDRA.label:
                return cassandra;
            case STORAGES.REDIS.label:
                return redis;
            case STORAGES.REDSHIFT.label:
                return redshift;
            case STORAGES.STDOUT.label:
                return stdout;
            case STORAGES.CLUSTER.label:
                return cluster;
            case STORAGES.DATAFRAME.label:
                return dataframe;
            case STORAGES.CLICKHOUSE.label:
                return clickhouse;
            default:
                return null;
        }
    };
    const clearData = data =>
        data
            ?.filter(key => {
                if (storage === STORAGES.STDOUT.label) {
                    return !key.hide || !key.hide.includes(title);
                }
                return (
                    !key.hide ||
                    (!key.hide.includes(title) &&
                        !key.hide.includes(SHOW_DESCRIPTION) &&
                        !key.hide.includes(storage))
                );
            })
            .map(({ hide, ...cleanValue }) => cleanValue);

    const filteredStorages = data =>
        data?.map(value => {
            if (
                !(
                    (value === STORAGES.STDOUT.label && title === 'Read') ||
                    (value === STORAGES.DATAFRAME.label && title === 'Write')
                )
            ) {
                return (
                    <option key={value} value={value}>
                        {value}
                    </option>
                );
            }
            return null;
        });

    return (
        <PopupForm display={display} title={title} onClose={onClose}>
            {clearData(content)?.map(section => {
                const other = Object.keys(section).slice(1);
                return (
                    <Box className={classes.root} key={section.title}>
                        <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            className={classes.name}
                        >
                            {section.title}
                        </Typography>
                        {other.map(paragraph =>
                            paragraph.includes('link') ? (
                                <Typography
                                    key={paragraph.slice(7)}
                                    variant="body2"
                                    className={classes.paragraph}
                                >
                                    <a
                                        className={classes.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={section[paragraph].link}
                                    >
                                        {section[paragraph].title}
                                    </a>
                                </Typography>
                            ) : (
                                <Typography
                                    key={paragraph.slice(7)}
                                    variant="body2"
                                    color="textSecondary"
                                    className={
                                        (paragraph.includes('example') &&
                                            classNames(
                                                classes.paragraph,
                                                classes.example
                                            )) ||
                                        classes.paragraph
                                    }
                                >
                                    {section[paragraph]}
                                </Typography>
                            )
                        )}
                    </Box>
                );
            })}
            {storages && (
                <FormControl variant="standard">
                    <InputLabel htmlFor="standard-age-native-simple">
                        {t('ReadWrite:chooseStorage')}
                    </InputLabel>
                    <Select
                        native
                        onChange={event => setStorage(event.target.value)}
                        label={t('ReadWrite:chooseStorage')}
                        className={classNames(classes.selectButton)}
                        value={storage}
                    >
                        <option aria-label="None" value="" />
                        {filteredStorages(storages)}
                    </Select>
                </FormControl>
            )}
            {(title === 'Read' || title === 'Write') && (
                <Box className={classNames(classes.name, classes.wrapper)}>
                    {storage &&
                        clearData(chosenStorage())?.map(section => {
                            const other = Object.keys(section).slice(1);
                            return (
                                <Box className={classes.root} key={section.title}>
                                    <Typography
                                        variant="subtitle2"
                                        color="textSecondary"
                                        className={classes.name}
                                    >
                                        {section.title}
                                    </Typography>
                                    {other.map(paragraph => (
                                        <Typography
                                            key={paragraph.slice(7)}
                                            variant="body2"
                                            color="textSecondary"
                                            className={classes.paragraph}
                                        >
                                            {section[paragraph]}
                                        </Typography>
                                    ))}
                                </Box>
                            );
                        })}
                </Box>
            )}
        </PopupForm>
    );
};

InfoModal.propTypes = {
    content: PropTypes.array,
    storages: PropTypes.array,
    clickhouse: PropTypes.array,
    db2: PropTypes.array,
    cos: PropTypes.array,
    aws: PropTypes.array,
    mongo: PropTypes.array,
    cassandra: PropTypes.array,
    redis: PropTypes.array,
    redshift: PropTypes.array,
    elastic: PropTypes.array,
    stdout: PropTypes.array,
    cluster: PropTypes.array,
    dataframe: PropTypes.array,
    display: PropTypes.bool,
    title: PropTypes.string,
    onClose: PropTypes.func,
    currentStorage: PropTypes.string
};

export default InfoModal;
