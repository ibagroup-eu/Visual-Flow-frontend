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

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    Popover,
    Switch,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import { truncate } from 'lodash';
import useStyles from './DataframeColumnsButton.Styles';

const DataframeColumnsButton = ({ columns, invisibled, setInvisibled, setPage }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const buttonRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterValue, setFilter] = useState('');

    const handleClose = () => {
        setAnchorEl(null);
        setFilter('');
    };

    const onOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleVisibleAllClick = () => setInvisibled([]);

    const handleHideAllClick = () => {
        const newInvisibled = columns.map(row => row.column);
        setInvisibled(newInvisibled);
        setPage(0);
    };

    const handleVisibleClick = id => {
        const visibledIndex = invisibled.indexOf(id);
        let newInvisibled = [];

        if (visibledIndex === -1) {
            newInvisibled = newInvisibled.concat(invisibled, id);
        } else if (visibledIndex === 0) {
            newInvisibled = newInvisibled.concat(invisibled.slice(1));
        } else if (visibledIndex === invisibled.length - 1) {
            newInvisibled = newInvisibled.concat(invisibled.slice(0, -1));
        } else {
            newInvisibled = newInvisibled.concat(
                invisibled.slice(0, visibledIndex),
                invisibled.slice(visibledIndex + 1)
            );
        }

        if (newInvisibled.length === columns.length && newInvisibled.length > 0) {
            setPage(0);
        }
        setInvisibled(newInvisibled);
    };

    const isVisibled = id => invisibled.indexOf(id) === -1;

    const filteredColumns = () =>
        columns?.filter(({ column }) => column.indexOf(filterValue) !== -1);

    return (
        <>
            <Button
                disabled={columns.length === 0}
                ref={buttonRef}
                aria-describedby="columns"
                onClick={onOpen}
            >
                {t('jobDesigner:Dataframe.toolbar.columns')}
            </Button>
            <Popover
                id="columns"
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                <Box className={classes.menu}>
                    <TextField
                        label={t('jobDesigner:Dataframe.columns.findColumn')}
                        placeholder={t('jobDesigner:Dataframe.columns.columnTitle')}
                        onChange={e => setFilter(e.target.value)}
                        value={filterValue}
                    />
                    <Box className={classes.switches}>
                        {filteredColumns().map(item => (
                            <Box
                                key={`${item.column}label`}
                                className={classes.switch}
                                onClick={() => handleVisibleClick(item.column)}
                            >
                                <Tooltip
                                    arrow
                                    title={
                                        item.column.length > 16 ? item.column : ''
                                    }
                                >
                                    <Typography
                                        className={classes.columnName}
                                        variant="subtitle2"
                                        color="textSecondary"
                                        display="block"
                                    >
                                        {truncate(item.column, { length: 16 })}
                                    </Typography>
                                </Tooltip>
                                <Switch
                                    color="primary"
                                    checked={isVisibled(item.column)}
                                />
                            </Box>
                        ))}
                    </Box>
                    <Box className={classes.buttons}>
                        <Button
                            disabled={invisibled.length === columns.length}
                            onClick={handleHideAllClick}
                        >
                            {t('jobDesigner:Dataframe.columns.hideAll')}
                        </Button>
                        <Button
                            disabled={invisibled.length === 0}
                            onClick={handleVisibleAllClick}
                        >
                            {t('jobDesigner:Dataframe.columns.showAll')}
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

DataframeColumnsButton.propTypes = {
    columns: PropTypes.array,
    invisibled: PropTypes.array,
    setInvisibled: PropTypes.func,
    setPage: PropTypes.func
};

export default DataframeColumnsButton;
