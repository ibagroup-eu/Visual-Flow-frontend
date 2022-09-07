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
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useTranslation } from 'react-i18next';
import useStyles from './LogsPageHeader.Styles';

import history from '../../utils/history';

const LogsPageHeader = ({ title, arrowLink }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <IconButton onClick={() => history.push(arrowLink)}>
                    <ArrowBackIcon fontSize="large" htmlColor="white" />
                </IconButton>
                <Typography variant="h5" noWrap className={classes.title}>
                    {t(`jobs:${title}`)}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

LogsPageHeader.propTypes = {
    title: PropTypes.string,
    arrowLink: PropTypes.string
};

export default LogsPageHeader;
