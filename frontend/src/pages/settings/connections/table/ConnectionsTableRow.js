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
import { Box, TableCell, TableRow, TextField } from '@material-ui/core';
import {
    DeleteOutline,
    EditOutlined,
    LaunchOutlined,
    WifiOutlined
} from '@material-ui/icons';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import useStyles from './ConnectionsTableRow.Styles';
import toggleConfirmationWindow from '../../../../redux/actions/modalsActions';
import ActionButton from '../../../../components/action-button';
import { DATABRICKS } from '../../../../mxgraph/constants';

const ConnectionsTableRow = ({
    handleRemoveConnection,
    connection: { key, value },
    pinging,
    deleting,
    confirmationWindow,
    handleOpenConnection,
    handlePingConnection,
    editableMode
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { connectionName, storageLabel } = value;

    const buttonsProps = [
        {
            title: t('setting:connection.tooltip.Open'),
            Icon: LaunchOutlined,
            disabled: pinging || deleting,
            onClick: () => handleOpenConnection({ value, key }, false),
            visible: true
        },
        {
            title: t('setting:connection.tooltip.Edit'),
            Icon: EditOutlined,
            disabled: pinging || deleting,
            onClick: () => handleOpenConnection({ value, key }, true),
            visible: editableMode
        },
        {
            title: t('setting:connection.tooltip.Delete'),
            Icon: DeleteOutline,
            disabled: pinging || deleting,
            loading: deleting,
            onClick: () =>
                confirmationWindow({
                    body: `${t('main:confirm.sure')} '${connectionName}'?`,
                    callback: () => handleRemoveConnection(key)
                }),
            visible: editableMode
        },
        window.PLATFORM !== DATABRICKS && {
            title: t('setting:connection.tooltip.Ping'),
            Icon: WifiOutlined,
            disabled: pinging || deleting,
            loading: pinging,
            onClick: () => handlePingConnection({ key, value }),
            visible: true
        }
    ].filter(el => el);

    return (
        <TableRow>
            <TableCell className={classNames(classes.cell, classes.keyCell)}>
                <TextField
                    disabled
                    fullWidth
                    variant="outlined"
                    value={storageLabel}
                    placeholder={t('setting:connection.Storage')}
                    label={t('setting:connection.Storage')}
                />
            </TableCell>
            <TableCell className={classNames(classes.cell, classes.valueCell)}>
                <TextField
                    disabled
                    fullWidth
                    variant="outlined"
                    value={connectionName}
                    placeholder={t('setting:connection.Name')}
                    label={t('setting:connection.Name')}
                />
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

ConnectionsTableRow.propTypes = {
    connection: PropTypes.object,
    handleRemoveConnection: PropTypes.func,
    confirmationWindow: PropTypes.func,
    pinging: PropTypes.bool,
    deleting: PropTypes.bool,
    handleOpenConnection: PropTypes.func,
    handlePingConnection: PropTypes.func,
    editableMode: PropTypes.bool
};

const mapDispatchToProps = {
    confirmationWindow: toggleConfirmationWindow
};

export default connect(null, mapDispatchToProps)(ConnectionsTableRow);
