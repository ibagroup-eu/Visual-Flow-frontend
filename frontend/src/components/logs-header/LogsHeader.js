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
import {
    Grid,
    Button,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Checkbox,
    Tooltip
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import PropTypes from 'prop-types';
import RefreshIcon from '@material-ui/icons/Refresh';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { TimerOffOutlined, TimerOutlined } from '@material-ui/icons';
import SearchInput from '../search-input/SearchInput';
import useStyles from './LogsHeader.Styles';

const LogsHeader = ({
    dropList,
    onRefreshClick,
    onSearch,
    searchValue,
    onSelect,
    levels,
    modal,
    autoRefresh,
    onSetAutoRefresh,
    autoRefreshDisabled,
    logId
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Grid container justifyContent="space-between" className={classes.root}>
            <Grid className={classNames({ [classes.search]: modal })} item>
                <SearchInput
                    fullWidth
                    value={searchValue}
                    placeholder={t('main:search')}
                    onChange={onSearch}
                />
            </Grid>
            <Grid item>
                <Grid
                    container
                    justifyContent="space-between"
                    spacing={3}
                    className={classes.right}
                >
                    <Grid item>
                        <FormControl variant="outlined" size="small">
                            <InputLabel className={classes.InputLabel}>
                                {t('jobs:Level')}
                            </InputLabel>
                            <Select
                                multiple
                                onChange={onSelect}
                                label="Level"
                                className={classes.selectButton}
                                value={levels}
                                renderValue={selected => selected.join(', ')}
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left'
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'left'
                                    },
                                    getContentAnchorEl: null
                                }}
                            >
                                {dropList.map(value => (
                                    <MenuItem key={value} value={value}>
                                        <Checkbox
                                            checked={levels.indexOf(value) > -1}
                                        />
                                        <option key={value} value={value}>
                                            {t(`jobs:level.${value}`) || value}
                                        </option>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {!logId && (
                        <Grid item>
                            <Tooltip
                                arrow
                                title={
                                    autoRefreshDisabled
                                        ? ''
                                        : t('main:tooltip:AutoRefresh')
                                }
                            >
                                <ToggleButton
                                    className={classes.autoRefresh}
                                    disabled={autoRefreshDisabled}
                                    size="small"
                                    value="check"
                                    selected={!autoRefreshDisabled && autoRefresh}
                                    onChange={onSetAutoRefresh}
                                >
                                    {autoRefresh ? (
                                        <TimerOutlined />
                                    ) : (
                                        <TimerOffOutlined />
                                    )}
                                </ToggleButton>
                            </Tooltip>
                        </Grid>
                    )}
                    <Grid item>
                        <Tooltip arrow title={t('main:tooltip:Refresh')}>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={onRefreshClick}
                            >
                                <RefreshIcon />
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

LogsHeader.propTypes = {
    dropList: PropTypes.array,
    onRefreshClick: PropTypes.func,
    onSearch: PropTypes.func,
    onSelect: PropTypes.func,
    searchValue: PropTypes.string,
    levels: PropTypes.array,
    modal: PropTypes.bool,
    autoRefresh: PropTypes.bool,
    onSetAutoRefresh: PropTypes.func,
    autoRefreshDisabled: PropTypes.bool,
    logId: PropTypes.string
};

export default LogsHeader;
