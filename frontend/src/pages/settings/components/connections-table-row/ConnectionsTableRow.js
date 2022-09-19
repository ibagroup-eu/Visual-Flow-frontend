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
import {
    IconButton,
    TableCell,
    TableRow,
    TextField,
    Tooltip
} from '@material-ui/core';
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

const ConnectionsTableRow = ({
    handleRemoveConnection,
    connection,
    confirmationWindow,
    handleOpenConnection
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const buttonsProps = [
        {
            title: t('setting:connection.tooltip.Open'),
            Icon: LaunchOutlined,
            disabled: false,
            onClick: () => handleOpenConnection(connection, false)
        },
        {
            title: t('setting:connection.tooltip.Edit'),
            Icon: EditOutlined,
            disabled: false,
            onClick: () => handleOpenConnection(connection, true)
        },
        {
            title: t('setting:connection.tooltip.Delete'),
            Icon: DeleteOutline,
            disabled: false,
            onClick: () =>
                confirmationWindow({
                    body: `${t('main:confirm.sure')} '${
                        connection.connectionName
                    }'?`,
                    callback: () => handleRemoveConnection(connection.id)
                })
        },
        {
            title: t('setting:connection.tooltip.Ping'),
            Icon: WifiOutlined,
            disabled: true,
            onClick: null
        }
    ];

    return (
        <TableRow>
            <TableCell className={classNames(classes.cell, classes.keyCell)}>
                <TextField
                    disabled
                    fullWidth
                    variant="outlined"
                    value={connection.storageLabel}
                    placeholder={t('setting:connection.Storage')}
                    label={t('setting:connection.Storage')}
                />
            </TableCell>
            <TableCell className={classNames(classes.cell, classes.valueCell)}>
                <TextField
                    disabled
                    fullWidth
                    variant="outlined"
                    value={connection.connectionName}
                    placeholder={t('setting:connection.Name')}
                    label={t('setting:connection.Name')}
                />
            </TableCell>
            <TableCell className={classNames(classes.cell, classes.buttonsGroup)}>
                {buttonsProps.map(({ title, disabled, onClick, Icon }) => (
                    <Tooltip key={title} title={disabled ? '' : title} arrow>
                        <IconButton
                            className={classes.btn}
                            disabled={disabled}
                            onClick={onClick}
                        >
                            <Icon />
                        </IconButton>
                    </Tooltip>
                ))}
            </TableCell>
        </TableRow>
    );
};

ConnectionsTableRow.propTypes = {
    connection: PropTypes.object,
    handleRemoveConnection: PropTypes.func,
    confirmationWindow: PropTypes.func.isRequired,
    handleOpenConnection: PropTypes.func
};
const mapDispatchToProps = {
    confirmationWindow: toggleConfirmationWindow
};

export default connect(null, mapDispatchToProps)(ConnectionsTableRow);
