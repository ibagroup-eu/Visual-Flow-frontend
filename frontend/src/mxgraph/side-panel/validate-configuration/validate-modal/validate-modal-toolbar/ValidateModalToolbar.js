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

import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    Popover,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';
import { findIndex } from 'lodash';
import useStyles from './ValidateModalToolbar.Styles';

const ValidateModalToolbar = ({
    addColumn,
    validationState,
    editable,
    renameColumnIndex,
    cancelRename
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const buttonRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [columnName, setColumnName] = useState('');
    const renameColumn = validationState[renameColumnIndex]?.column;
    const sameName =
        findIndex(validationState, ['column', columnName.trim()]) !== -1 &&
        !!anchorEl;

    const onAddColumn = useCallback(
        event => {
            setColumnName(renameColumn || '');
            setAnchorEl(event.currentTarget);
        },
        [renameColumn]
    );

    useEffect(() => {
        if (renameColumnIndex !== null) {
            onAddColumn({ currentTarget: buttonRef.current });
        }
    }, [renameColumnIndex, onAddColumn]);

    const handleClose = () => {
        setAnchorEl(null);
        cancelRename();
    };

    const handleColumnNameChange = event => {
        setColumnName(event.target.value);
    };

    const handleChangeColumn = () => {
        addColumn(columnName);
        setAnchorEl(null);
        cancelRename();
    };

    const onEnterChangeColumn = event => {
        if (event.key === 'Enter' && columnName !== '' && !sameName) {
            handleChangeColumn();
            event.preventDefault();
        }
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell className={classes.cell}>
                    <Button
                        autoFocus
                        className={classes.addButton}
                        ref={buttonRef}
                        disabled={!editable}
                        onClick={onAddColumn}
                    >
                        <AddOutlined />
                        <Typography
                            className={classes.addButtonText}
                            variant="button"
                        >
                            {t('jobDesigner:Validate.toolbar.column')}
                        </Typography>
                    </Button>
                    <Popover
                        id="add-column"
                        open={!!anchorEl}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left'
                        }}
                    >
                        <Box className={classes.addColumnMenu}>
                            <Box>
                                <TextField
                                    className={classes.columnName}
                                    autoFocus
                                    disabled={!anchorEl}
                                    error={sameName && renameColumn !== columnName}
                                    label={t(
                                        'jobDesigner:Validate.popupMenu.columnName'
                                    )}
                                    value={columnName}
                                    onKeyDown={onEnterChangeColumn}
                                    onChange={handleColumnNameChange}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                            <Button
                                disabled={
                                    columnName === '' ||
                                    sameName ||
                                    anchorEl === null
                                }
                                variant="outlined"
                                onClick={handleChangeColumn}
                            >
                                {t('jobDesigner:Validate.popupMenu.ok')}
                            </Button>
                        </Box>
                    </Popover>
                </TableCell>
            </TableRow>
        </TableHead>
    );
};

ValidateModalToolbar.propTypes = {
    addColumn: PropTypes.func,
    validationState: PropTypes.array,
    editable: PropTypes.bool,
    renameColumnIndex: PropTypes.number,
    cancelRename: PropTypes.func
};

export default ValidateModalToolbar;
