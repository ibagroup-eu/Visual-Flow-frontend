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

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { DeleteOutline } from '@material-ui/icons';
import { TableCell, TableRow, TextField, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import { Autocomplete } from '@material-ui/lab';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import ActionCell from '../../../components/table/cells/action-cell';
import styles from './PropertyListModal.Styles';

const PropertyListRow = ({
    index,
    keyName,
    keyValue,
    onChange,
    onMove,
    onRemove,
    disabled,
    options,
    fieldName,
    size,
    classes,
    errors,
    valueRequired = true
}) => {
    const buttons = [];

    const { t } = useTranslation();

    if (index < size - 1) {
        buttons.push({
            title: t('main:tooltip.MoveDown'),
            Icon: ArrowDownwardIcon,
            disabled,
            onClick: onMove(index)
        });
    }
    if (index > 0) {
        buttons.push({
            title: t('main:tooltip.MoveUp'),
            Icon: ArrowUpwardIcon,
            disabled,
            onClick: onMove(index - 1)
        });
    }
    buttons.push({
        title: t('main:tooltip.Delete'),
        Icon: DeleteOutline,
        disabled,
        onClick: onRemove(index)
    });

    return (
        <TableRow className={classes.row}>
            <TableCell className={classNames(classes.cell, classes.key)}>
                <Autocomplete
                    fullWidth
                    freeSolo
                    options={options.map(option => option)}
                    disabled={disabled}
                    value={keyName}
                    onInputChange={(_, newValue) => {
                        onChange(index, [newValue, keyValue]);
                    }}
                    renderInput={params => (
                        <TextField
                            {...params}
                            variant="outlined"
                            placeholder={fieldName || t('jobDesigner:apiModal.key')}
                            label={fieldName || t('jobDesigner:apiModal.key')}
                            error={!!errors?.nameValidationError}
                            helperText={errors?.nameValidationError}
                            required
                        />
                    )}
                />
            </TableCell>
            <TableCell className={classNames(classes.cell, classes.value)}>
                <TextField
                    disabled={disabled}
                    fullWidth
                    variant="outlined"
                    value={keyValue}
                    onChange={event => {
                        event.persist();
                        const newValue = event.target.value;
                        onChange(index, [keyName, newValue]);
                    }}
                    multiline
                    maxRows={4}
                    placeholder={t('setting:parameter.Value')}
                    label={t('setting:parameter.Value')}
                    error={!!errors?.valueValidationError}
                    helperText={errors?.valueValidationError}
                    required={valueRequired}
                />
            </TableCell>
            <ActionCell className={classes.cell} actions={buttons} />
        </TableRow>
    );
};

PropertyListRow.propTypes = {
    size: PropTypes.number,
    classes: PropTypes.object,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onMove: PropTypes.func,
    onRemove: PropTypes.func,
    keyName: PropTypes.string,
    keyValue: PropTypes.string,
    index: PropTypes.number,
    options: PropTypes.array,
    fieldName: PropTypes.string,
    errors: PropTypes.object,
    valueRequired: PropTypes.bool
};

export default compose(memo, withStyles(styles))(PropertyListRow);
