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

import { DeleteOutline } from '@material-ui/icons';
import { TableCell, TableRow, TextField, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import { Autocomplete } from '@material-ui/lab';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import ActionCell from '../../../components/table/cells/action-cell';
import styles from './PromptingModal.Styles';

const PromptingDataAttributesRow = ({
    index,
    name,
    definition,
    onChange,
    onRemove,
    disabled,
    options,
    classes,
    errors
}) => {
    const buttons = [];

    const { t } = useTranslation();

    buttons.push({
        title: t('main:tooltip.Delete'),
        Icon: DeleteOutline,
        disabled,
        onClick: onRemove(index)
    });

    return (
        <TableRow className={classes.row}>
            <TableCell className={classNames(classes.cell, classes.width50)}>
                <Autocomplete
                    freeSolo
                    fullWidth
                    options={options.map(option => option)}
                    disabled={disabled}
                    value={name}
                    onInputChange={(_, newValue) => {
                        onChange(index, {
                            name: newValue,
                            definition
                        });
                    }}
                    renderInput={params => (
                        <TextField
                            {...params}
                            variant="outlined"
                            placeholder={t('jobDesigner:aiConfiguration.modal.Name')}
                            label={t('jobDesigner:aiConfiguration.modal.Name')}
                            error={!!errors?.nameValidationError}
                            helperText={errors?.nameValidationError}
                            required
                        />
                    )}
                />
            </TableCell>
            <TableCell className={classNames(classes.cell, classes.width50)}>
                <TextField
                    disabled={disabled}
                    fullWidth
                    variant="outlined"
                    value={definition}
                    onChange={event => {
                        event.persist();
                        const newValue = event.target.value;
                        onChange(index, {
                            name,
                            definition: newValue
                        });
                    }}
                    placeholder={t('jobDesigner:aiConfiguration.modal.Definition')}
                    label={t('jobDesigner:aiConfiguration.modal.Definition')}
                    error={!!errors?.definitionValidationError}
                    helperText={errors?.definitionValidationError}
                    required
                />
            </TableCell>
            <ActionCell className={classes.cell} actions={buttons} />
        </TableRow>
    );
};

PromptingDataAttributesRow.propTypes = {
    size: PropTypes.number,
    classes: PropTypes.object,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onMove: PropTypes.func,
    onRemove: PropTypes.func,
    name: PropTypes.string,
    definition: PropTypes.string,
    index: PropTypes.number,
    options: PropTypes.array,
    errors: PropTypes.object
};

export default compose(memo, withStyles(styles))(PromptingDataAttributesRow);
