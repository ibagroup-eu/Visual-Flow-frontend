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
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import ActionCell from '../../../components/table/cells/action-cell';
import styles from './PromptingModal.Styles';
import JSONEditor from '../../../components/json-editor';

const PromptingExamplesRow = ({
    index,
    user,
    assistant,
    onChange,
    onRemove,
    disabled,
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
            <TableCell className={classes.cell}>
                <TextField
                    disabled={disabled}
                    fullWidth
                    variant="outlined"
                    value={user}
                    onChange={event => {
                        event.persist();
                        const newValue = event.target.value;
                        onChange(index, {
                            user: newValue,
                            assistant
                        });
                    }}
                    multiline
                    minRows={4}
                    maxRows={4}
                    placeholder={t('jobDesigner:aiConfiguration.modal.User')}
                    label={t('jobDesigner:aiConfiguration.modal.User')}
                    error={!!errors?.userValidationError}
                    helperText={errors?.userValidationError}
                    required
                />
            </TableCell>
            <TableCell className={classes.cell}>
                <JSONEditor
                    height="6.9rem"
                    placeholder={t('jobDesigner:aiConfiguration.modal.Assistant')}
                    value={assistant}
                    onChange={value => {
                        onChange(index, {
                            user,
                            assistant: value
                        });
                    }}
                    disabled={disabled}
                    required
                />
            </TableCell>
            <ActionCell className={classes.cell} actions={buttons} />
        </TableRow>
    );
};

PromptingExamplesRow.propTypes = {
    classes: PropTypes.object,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    user: PropTypes.string,
    assistant: PropTypes.string,
    index: PropTypes.number,
    errors: PropTypes.object
};

export default compose(memo, withStyles(styles))(PromptingExamplesRow);
