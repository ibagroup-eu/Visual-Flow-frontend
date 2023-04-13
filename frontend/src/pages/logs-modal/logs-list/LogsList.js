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

import React, { useEffect, useRef } from 'react';
import { List, Grid, ListItem, Typography, Box, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import useStyles from './LogsList.Styles';
import LogsHeader from '../../../components/logs-header';
import { TextSkeleton } from '../../../components/skeleton';
import useAutoRefresh from '../../../mxgraph/toolbar/auto-refresh-button/useAutoRefresh';

const LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG', 'RESULT'];

const LogsList = ({
    data,
    modal,
    onRefresh,
    search,
    onSearch,
    levels,
    onSelect,
    loading,
    error,
    isRunning,
    logId
}) => {
    const classes = useStyles();
    const listRef = useRef();

    const [autoRefresh, setAutoRefresh] = useAutoRefresh(isRunning, onRefresh);

    useEffect(() => {
        error?.message && setAutoRefresh(false);
    }, [error?.message, setAutoRefresh]);

    useEffect(() => {
        !loading &&
            listRef?.current?.scrollIntoView({
                block: 'end'
            });
    }, [loading]);

    const highlight = (string, value) => {
        if (!value) {
            return string;
        }
        return string.split(new RegExp(`(${value})`, 'gi')).map((item, index) => (
            <span
                key={index} // eslint-disable-line react/no-array-index-key
                className={classNames({
                    [classes.highlight]: item.toLowerCase() === value.toLowerCase()
                })}
            >
                {item}
            </span>
        ));
    };

    const logs = list =>
        list.map(
            ({ message, timestamp, level }) =>
                (timestamp ? `${timestamp} - ` : '') +
                (level ? `${level} - ` : '') +
                (message ? `${message}` : '')
        );

    return (
        <Grid
            container
            alignItems={modal ? 'flex-start' : 'center'}
            direction="column"
            className={classNames({ [classes.root]: modal })}
        >
            <Grid className={classes.logsHeader} item xs={12}>
                <LogsHeader
                    modal={modal}
                    onSearch={event => onSearch(event.target.value)}
                    searchValue={search}
                    onRefreshClick={onRefresh}
                    dropList={LEVELS}
                    onSelect={event => onSelect(event.target.value)}
                    levels={levels}
                    autoRefresh={autoRefresh}
                    onSetAutoRefresh={() => setAutoRefresh(!autoRefresh)}
                    autoRefreshDisabled={false}
                    logId={logId}
                />
            </Grid>
            <Grid item xs={12}>
                <Paper
                    elevation={3}
                    className={classNames(classes.paper, {
                        [classes.paperModal]: modal
                    })}
                >
                    {loading ? (
                        <Box className={classes.skeleton}>
                            <TextSkeleton size={10} />
                        </Box>
                    ) : (
                        <List className={classes.list}>
                            {error ? (
                                <ListItem className={classes.textItem}>
                                    <Typography className={classes.text}>
                                        {error.message}
                                    </Typography>
                                </ListItem>
                            ) : (
                                logs(data)
                                    .filter(item =>
                                        levels.length
                                            ? levels.some(level =>
                                                  item.includes(` - ${level} - `)
                                              )
                                            : item
                                    )
                                    .filter(item =>
                                        search
                                            ? item
                                                  .toLowerCase()
                                                  ?.includes(search.toLowerCase())
                                            : item
                                    )
                                    .map((str, i) =>
                                        str.includes('\n') ? (
                                            str
                                                .split('\n')
                                                .map((multiString, index) => (
                                                    <ListItem
                                                        key={`${i +
                                                            multiString.slice(
                                                                17,
                                                                24
                                                            )}_${multiString.slice(
                                                            -5
                                                        ) + index}`}
                                                        className={classes.textItem}
                                                    >
                                                        <Typography
                                                            variant="inherit"
                                                            className={classNames(
                                                                classes.text,
                                                                {
                                                                    [classes.textMultisting]:
                                                                        index !== 0
                                                                }
                                                            )}
                                                        >
                                                            {highlight(
                                                                multiString,
                                                                search
                                                            )}
                                                        </Typography>
                                                    </ListItem>
                                                ))
                                        ) : (
                                            <ListItem
                                                key={`${i +
                                                    str.slice(17, 24)}_${str.slice(
                                                    -5
                                                )}`}
                                                className={classes.textItem}
                                            >
                                                <Typography
                                                    variant="inherit"
                                                    className={classes.text}
                                                >
                                                    {highlight(str, search)}
                                                </Typography>
                                            </ListItem>
                                        )
                                    )
                            )}
                            <ListItem style={{ padding: 0, top: 8 }} ref={listRef} />
                        </List>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

LogsList.propTypes = {
    modal: PropTypes.bool,
    data: PropTypes.array,
    onRefresh: PropTypes.func,
    search: PropTypes.string,
    onSearch: PropTypes.func,
    levels: PropTypes.array,
    onSelect: PropTypes.func,
    loading: PropTypes.bool,
    error: PropTypes.object,
    isRunning: PropTypes.bool,
    logId: PropTypes.string
};

export default LogsList;
