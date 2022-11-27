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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    TableCell,
    TableSortLabel,
    Tooltip
} from '@material-ui/core';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import classNames from 'classnames';
import { truncate } from 'lodash';
import { useTranslation } from 'react-i18next';
import useStyles from './DataframeColumnCell.Styles';

const DataframeColumnCell = ({
    name,
    index,
    onSetRename,
    onDelete,
    onRequestSort,
    orderBy,
    order,
    isVisibled,
    setInvisibled,
    editable
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [menuAnchorEl, setMenuAnchorEl] = useState(false);

    const handleMenuClick = event => {
        setMenuAnchorEl(menuAnchorEl ? null : event.currentTarget);
    };

    const createSortHandler = property => onRequestSort(property);

    const hideColumnHandler = () => {
        handleMenuClick();
        setInvisibled(prevState => [...prevState, name]);
    };

    return (
        <TableCell
            className={classNames(classes.columnCell, {
                [classes.hide]: !isVisibled(name)
            })}
        >
            <Box className={classes.columnBox}>
                <Tooltip arrow title={name.length > 11 ? name : ''}>
                    <TableSortLabel
                        active={orderBy === index}
                        direction={orderBy === index ? order : 'asc'}
                        onClick={() => createSortHandler(index)}
                    >
                        {truncate(name, { length: 11 })}
                    </TableSortLabel>
                </Tooltip>
                <IconButton
                    aria-controls="customized-menu"
                    className={classes.moreIcon}
                    onClick={handleMenuClick}
                >
                    <MoreVertOutlinedIcon />
                </IconButton>
            </Box>
            <Menu
                id="customized-menu"
                anchorEl={menuAnchorEl}
                getContentAnchorEl={null}
                open={!!menuAnchorEl}
                onClose={handleMenuClick}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                <MenuItem
                    disabled={orderBy !== index}
                    onClick={() => {
                        handleMenuClick();
                        createSortHandler(-1);
                    }}
                >
                    {t('jobDesigner:Dataframe.columnMenu.unsort')}
                </MenuItem>
                <MenuItem
                    disabled={!editable}
                    onClick={() => {
                        onSetRename(index);
                        handleMenuClick();
                    }}
                >
                    {t('jobDesigner:Dataframe.columnMenu.rename')}
                </MenuItem>
                <MenuItem onClick={hideColumnHandler}>
                    {t('jobDesigner:Dataframe.columnMenu.hide')}
                </MenuItem>
                <MenuItem disabled={!editable} onClick={() => onDelete(index)}>
                    {t('jobDesigner:Dataframe.columnMenu.delete')}
                </MenuItem>
            </Menu>
        </TableCell>
    );
};

DataframeColumnCell.propTypes = {
    name: PropTypes.string,
    index: PropTypes.number,
    onSetRename: PropTypes.func,
    onDelete: PropTypes.func,
    order: PropTypes.string,
    orderBy: PropTypes.number,
    onRequestSort: PropTypes.func,
    isVisibled: PropTypes.func,
    setInvisibled: PropTypes.func,
    editable: PropTypes.bool
};

export default DataframeColumnCell;
