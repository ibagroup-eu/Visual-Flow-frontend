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
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
    Toolbar,
    Select,
    FormControl,
    Tooltip,
    IconButton
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import useStyles from './UsersTableToolbar.Styles';

const UsersTableToolbar = ({
    numSelected,
    roles,
    handleChangeRole,
    role,
    handleDelete,
    newUser
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0
            })}
        >
            {numSelected > 0 && (
                <>
                    {!newUser && (
                        <Tooltip title={t('setting:usersAndRoles.Toolbar.Delete')}>
                            <IconButton aria-label="delete" onClick={handleDelete}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    )}

                    <FormControl variant="outlined">
                        <Select
                            native
                            onChange={event => handleChangeRole(event.target.value)}
                            inputProps={{ 'aria-label': 'Without label' }}
                            className={classes.selectButton}
                            value={role}
                        >
                            <option value="-1" disabled>
                                {t('main:button.setRole')}
                            </option>
                            {roles.map(roleItem => (
                                <option key={roleItem} value={roleItem}>
                                    {roleItem}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </>
            )}
        </Toolbar>
    );
};

UsersTableToolbar.propTypes = {
    numSelected: PropTypes.number,
    roles: PropTypes.array,
    handleChangeRole: PropTypes.func,
    role: PropTypes.any,
    handleDelete: PropTypes.func,
    newUser: PropTypes.bool
};

export default UsersTableToolbar;
