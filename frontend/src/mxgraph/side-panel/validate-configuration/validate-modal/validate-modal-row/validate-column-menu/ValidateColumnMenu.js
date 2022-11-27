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
import { IconButton, MenuItem, Menu } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { MoreVertOutlined } from '@material-ui/icons';
import classNames from 'classnames';
import useStyles from './ValidateColumnMenu.Styles';

const ValidateColumnMenu = ({
    onSetRename,
    onDeleteColumn,
    editable,
    className
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [menuAnchorEl, setMenuAnchorEl] = useState(false);

    const handleMenuClick = event => {
        setMenuAnchorEl(menuAnchorEl ? null : event.currentTarget);
    };

    return (
        <>
            <IconButton
                disabled={!editable}
                aria-controls="customized-menu"
                className={classNames(classes.moreIcon, className)}
                onClick={handleMenuClick}
            >
                <MoreVertOutlined />
            </IconButton>
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
                    onClick={() => {
                        onSetRename();
                        handleMenuClick();
                    }}
                >
                    {t('jobDesigner:Validate.columnMenu.rename')}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onDeleteColumn();
                        handleMenuClick();
                    }}
                >
                    {t('jobDesigner:Validate.columnMenu.delete')}
                </MenuItem>
            </Menu>
        </>
    );
};

ValidateColumnMenu.propTypes = {
    onSetRename: PropTypes.func,
    onDeleteColumn: PropTypes.func,
    editable: PropTypes.bool,
    className: PropTypes.string
};

export default ValidateColumnMenu;
