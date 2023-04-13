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

import { Box, Typography, Avatar, Divider, IconButton } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Person, FileCopyOutlined } from '@material-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import PopupForm from '../../popup-form';
import useStyles from './ProfilePageModal.Styles';

export const ProfilePageModal = ({ display, onClose, title, userInfo }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const titles = [
        t('main:profilePage.titles.username'),
        t('main:profilePage.titles.fullName'),
        t('main:profilePage.titles.email'),
        userInfo?.accessToken && t('main:profilePage.titles.authorizationToken')
    ];

    const values = [
        userInfo?.username,
        userInfo?.displayName,
        userInfo?.emails?.[0].value,
        userInfo?.accessToken && (
            <CopyToClipboard text={userInfo?.accessToken}>
                <IconButton className={classes.token}>
                    <FileCopyOutlined color="secondary" fontSize="small" />
                </IconButton>
            </CopyToClipboard>
        )
    ];

    return (
        <PopupForm display={display} title={title} onClose={onClose}>
            <Box className={classes.header}>
                <Avatar className={classes.avatar} src={userInfo?.avatar}>
                    <Person fontSize="large" />
                </Avatar>
                <Typography
                    variant="h4"
                    color="textSecondary"
                    className={classes.name}
                >
                    {userInfo?.displayName}
                </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box className={classes.wrapper}>
                <Box className={classes.titles}>
                    {titles.map(item => (
                        <Typography key={titles.indexOf(item)} variant="h6">
                            {item}
                        </Typography>
                    ))}
                </Box>
                <Box className={classes.values}>
                    {values.map(value => (
                        <Typography key={values.indexOf(value)} variant="h6">
                            {value}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </PopupForm>
    );
};

ProfilePageModal.propTypes = {
    display: PropTypes.bool,
    title: PropTypes.string,
    onClose: PropTypes.func,
    userInfo: PropTypes.object
};

const mapStateToProps = state => ({
    userInfo: state.user.profile.data
});

export default connect(mapStateToProps)(ProfilePageModal);
