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
import { useTranslation } from 'react-i18next';
import { Box, Typography, Tooltip, Avatar, useTheme } from '@material-ui/core';
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';
import DoneIcon from '@material-ui/icons/Done';
import useStyles from './HistoryHeader.Styles';

const HistoryHeader = ({ status, name, startedBy }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const theme = useTheme();

    const statusIcon = {
        Succeeded: { Icon: DoneIcon, color: theme.palette.success.light },
        Failed: { Icon: WarningOutlinedIcon, color: theme.palette.error.light }
    };

    const { Icon, color } = statusIcon[status] || statusIcon.Failed;

    return (
        <Box className={classes.root}>
            <Tooltip title={t(`filters:statuses.${status || 'Unknown'}`)} arrow>
                <Avatar
                    style={{ backgroundColor: color }}
                    variant="rounded"
                    className={classes.avatar}
                >
                    <Icon />
                </Avatar>
            </Tooltip>
            <Box className={classes.flexColumn}>
                <Typography variant="h5">{name}</Typography>
                <Typography variant="subtitle1">
                    {`${t('jobs:history.LastRunBy')}: ${startedBy || 'Unknown'}`}
                </Typography>
            </Box>
        </Box>
    );
};

HistoryHeader.propTypes = {
    status: PropTypes.string,
    name: PropTypes.string,
    startedBy: PropTypes.string
};

export default HistoryHeader;
