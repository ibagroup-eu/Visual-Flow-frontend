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

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    ListItemText,
    MenuItem,
    Menu,
    ListItemIcon,
    Divider
} from '@material-ui/core';
import { ExitToAppSharp, FaceSharp, LocalOffer } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import ProfilePageModal from '../profile-page';
import api from '../../../api/auth';
import { fetchVersion } from '../../../redux/actions/appSettingsActions';

export const ProfileMenu = ({
    anchorEl,
    open,
    handleClose,
    getVersion,
    version
}) => {
    const { t } = useTranslation();
    const [openProfilePage, setOpenProfilePage] = useState(false);

    useEffect(() => {
        !version && getVersion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenProfilePage = () => {
        setOpenProfilePage(true);
        handleClose();
    };
    const handleCloseProfilePage = () => {
        setOpenProfilePage(false);
    };

    return (
        <>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        width: 200,
                        borderRadius: 8
                    }
                }}
            >
                <MenuItem onClick={handleOpenProfilePage}>
                    <ListItemIcon>
                        <FaceSharp fontSize="small" />
                    </ListItemIcon>
                    <ListItemText> {t('main:profileMenu.profile')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => api.logout()}>
                    <ListItemIcon>
                        <ExitToAppSharp fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('main:profileMenu.logOut')}</ListItemText>
                </MenuItem>
                {version && (
                    <div>
                        <Divider />
                        <MenuItem>
                            <ListItemIcon>
                                <LocalOffer fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Version: {version}</ListItemText>
                        </MenuItem>
                    </div>
                )}
            </Menu>

            <ProfilePageModal
                display={openProfilePage}
                onClose={handleCloseProfilePage}
                title={t('main:profilePage.header')}
            />
        </>
    );
};

ProfileMenu.propTypes = {
    anchorEl: PropTypes.any,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    getVersion: PropTypes.func,
    version: PropTypes.string
};

const mapStateToProps = state => ({
    version: state.appSettings.version
});

export default connect(mapStateToProps, { getVersion: fetchVersion })(ProfileMenu);
