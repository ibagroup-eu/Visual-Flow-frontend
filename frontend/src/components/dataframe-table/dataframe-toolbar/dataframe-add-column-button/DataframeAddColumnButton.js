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

import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Popover,
    Select,
    TextField
} from '@material-ui/core';
import { findIndex } from 'lodash';
import classNames from 'classnames';
import { AddOutlined } from '@material-ui/icons';
import useStyles from './DataframeAddColumnButton.Styles';
// import theme from '../../../../theme';

const DataframeAddColumnButton = ({
    columns,
    addColumn,
    renameFieldIndex,
    onCancelRename,
    columnTypes,
    editable
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const buttonRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [columnType, setType] = useState(columnTypes[0]);
    const [columnName, setColumnName] = useState('');
    const [openSelect, setOpenSelect] = useState(false);
    const renameField = columns[renameFieldIndex];
    const sameName =
        findIndex(columns, ['column', columnName.trim()]) !== -1 && !!anchorEl;

    const isDisabled = !editable;

    const onAddColumn = useCallback(
        event => {
            setType(renameField?.type || columnTypes[0]);
            setColumnName(renameField?.column || '');
            setAnchorEl(event.currentTarget);
        },
        [renameField, columnTypes]
    );

    useEffect(() => {
        if (renameFieldIndex !== null) {
            onAddColumn({ currentTarget: buttonRef.current });
        }
    }, [renameFieldIndex, onAddColumn]);

    const handleClose = () => {
        setAnchorEl(null);
        onCancelRename();
    };

    const handleSelectChange = event => {
        setType(event.target.value);
    };

    const handleSelect = () => {
        setOpenSelect(!openSelect);
    };

    const handleColumnNameChange = event => {
        setColumnName(event.target.value);
    };

    const handleAddColumn = () => {
        addColumn(columnName, columnType);
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                className={classNames({ [classes.btn]: editable })}
                disabled={isDisabled}
                ref={buttonRef}
                aria-describedby="add-column"
                onClick={onAddColumn}
                startIcon={<AddOutlined />}
            >
                {t('jobDesigner:Dataframe.toolbar.addColumn')}
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
                            error={sameName && renameField?.column !== columnName}
                            label={t('jobDesigner:Dataframe.addColumn.columnName')}
                            value={columnName}
                            onChange={handleColumnNameChange}
                            variant="outlined"
                            size="small"
                        />
                        <FormControl
                            className={classes.formControl}
                            variant="outlined"
                            size="small"
                            disabled={renameFieldIndex !== null || anchorEl === null}
                        >
                            <InputLabel id="label">Column Type</InputLabel>
                            <Select
                                labelId="label"
                                label={t(
                                    'jobDesigner:Dataframe.addColumn.columnType'
                                )}
                                open={openSelect}
                                onClose={handleSelect}
                                onOpen={handleSelect}
                                onChange={handleSelectChange}
                                value={columnType}
                                MenuProps={{
                                    style: {
                                        maxHeight: 300
                                    }
                                }}
                            >
                                {columnTypes.map(type => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Button
                        disabled={columnName === '' || sameName || anchorEl === null}
                        variant="outlined"
                        onClick={handleAddColumn}
                    >
                        {t(
                            `jobDesigner:Dataframe.addColumn.${
                                renameFieldIndex === null ? 'add' : 'rename'
                            }`
                        )}
                    </Button>
                </Box>
            </Popover>
        </>
    );
};

DataframeAddColumnButton.propTypes = {
    columns: PropTypes.array,
    columnTypes: PropTypes.array,
    addColumn: PropTypes.func,
    onCancelRename: PropTypes.func,
    renameFieldIndex: PropTypes.number,
    editable: PropTypes.bool
};

export default DataframeAddColumnButton;
