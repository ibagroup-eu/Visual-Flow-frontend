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
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Box, TableCell, TableRow, TextField, withStyles } from '@material-ui/core';
import { DeleteOutline, EditOutlined } from '@material-ui/icons';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';

import styles from './ParametersTableRow.Styles';
import toggleConfirmationWindow from '../../../../redux/actions/modalsActions';
import PasswordInput from '../../../../components/password-input';
import ActionButton from '../../../../components/action-button';

export const ParametersTableRow = ({
    parameter: { key, value, secret },
    editing,
    deleting,
    confirmationWindow,
    handleEdit,
    handleRemove,
    classes,
    editableMode
}) => {
    const { t } = useTranslation();

    const buttonsProps = [
        {
            title: t('setting:parameter.tooltip.Edit'),
            Icon: EditOutlined,
            disabled: editing || deleting,
            loading: editing,
            onClick: handleEdit,
            visible: editableMode
        },
        {
            title: t('setting:parameter.tooltip.Delete'),
            Icon: DeleteOutline,
            disabled: editing || deleting,
            loading: deleting,
            onClick: () =>
                confirmationWindow({
                    body: `${t('main:confirm.sure')} '${key}'?`,
                    callback: handleRemove
                }),
            visible: editableMode
        }
    ];

    const defaultTextProps = {
        value,
        disabled: true,
        fullWidth: true,
        placeholder: t('setting:parameter.Value'),
        label: t('setting:parameter.Value')
    };

    return (
        <TableRow>
            <TableCell className={classNames(classes.cell, classes.keyCell)}>
                <TextField
                    disabled
                    fullWidth
                    variant="outlined"
                    value={key}
                    placeholder={t('setting:parameter.Name')}
                    label={t('setting:parameter.Name')}
                />
            </TableCell>
            <TableCell className={classNames(classes.cell, classes.valueCell)}>
                {secret ? (
                    <PasswordInput
                        {...defaultTextProps}
                        fromDesigner
                        isTouched={false}
                    />
                ) : (
                    <TextField {...defaultTextProps} variant="outlined" />
                )}
            </TableCell>
            <TableCell className={classes.cell}>
                <Box className={classes.buttonsGroup}>
                    {buttonsProps.map(
                        buttonProps =>
                            buttonProps.visible && (
                                <ActionButton
                                    key={buttonProps.title}
                                    {...buttonProps}
                                />
                            )
                    )}
                </Box>
            </TableCell>
        </TableRow>
    );
};

ParametersTableRow.propTypes = {
    parameter: PropTypes.shape({
        key: PropTypes.string,
        value: PropTypes.string,
        secret: PropTypes.bool
    }),
    confirmationWindow: PropTypes.func,
    handleEdit: PropTypes.func,
    handleRemove: PropTypes.func,
    editing: PropTypes.bool,
    deleting: PropTypes.bool,
    classes: PropTypes.object,
    editableMode: PropTypes.bool
};

const mapDispatchToProps = {
    confirmationWindow: toggleConfirmationWindow
};

export default compose(
    withStyles(styles),
    connect(null, mapDispatchToProps)
)(ParametersTableRow);
