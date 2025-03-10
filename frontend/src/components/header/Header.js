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

import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Divider,
    Drawer,
    IconButton,
    Toolbar,
    useTheme,
    withStyles
} from '@material-ui/core';
import { ChevronLeft, ChevronRight, Menu, Person } from '@material-ui/icons';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import styles from './Header.Styles';
import MenuBar from '../menu';
import getMenu from '../menu/menu';
import history from '../../utils/history';
import SelectProject from '../select-project';
import ProfileMenu from './profile-menu';
import logo from '../../assets/logo.svg';
import LangMenu from './lang-menu/LangMenu';

export const Header = ({ classes }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const menu = getMenu(useSelector(state => state.projects.currentProject));
    const userInfo = useSelector(state => state.user.profile.data);
    const [menuOpen, setMenuOpen] = useState(true);
    const opened = menuOpen && menu;
    const [anchorEl, setAnchorEl] = useState(null);
    const openProfileMenu = Boolean(anchorEl);

    const handleOpenProfileMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseProfileMenu = () => {
        setAnchorEl(null);
    };

    const handleDrawerOpen = () => setMenuOpen(true);

    const handleDrawerClose = () => setMenuOpen(false);

    const handleItemClick = item => {
        if (item.link) {
            history.push(item.link);
        } else if (!menuOpen) {
            setMenuOpen(true);
        }
    };

    const chevron = str =>
        theme.direction === str ? <ChevronRight /> : <ChevronLeft />;

    const goToProjectsPage = () => history.push('/');

    return (
        <>
            <AppBar
                position="fixed"
                className={classNames(classes.appBar, {
                    [classes.appBarShift]: opened
                })}
            >
                <Toolbar>
                    {menu && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={classNames(classes.menuButton, {
                                [classes.hide]: opened
                            })}
                        >
                            <Menu />
                        </IconButton>
                    )}
                    <div className={classes.title}>
                        <Box
                            className={classes.link}
                            onClick={goToProjectsPage}
                            component="img"
                            sx={{
                                height: 40
                            }}
                            alt={t('main:title')}
                            src={logo}
                        />
                    </div>
                    {menu && <SelectProject />}
                    {false && <LangMenu />}
                    <Avatar
                        src={userInfo?.avatar}
                        className={classes.user}
                        aria-haspopup="true"
                        onClick={handleOpenProfileMenu}
                    >
                        <IconButton>
                            <Person color="primary" />
                        </IconButton>
                    </Avatar>
                    <ProfileMenu
                        open={openProfileMenu}
                        anchorEl={anchorEl}
                        handleClose={handleCloseProfileMenu}
                    />
                </Toolbar>
            </AppBar>

            {menu && (
                <Drawer
                    variant="permanent"
                    className={classNames(classes.drawer, {
                        [classes.drawerOpen]: opened,
                        [classes.drawerClose]: !opened
                    })}
                    classes={{
                        paper: classNames({
                            [classes.drawerOpen]: opened,
                            [classes.drawerClose]: !opened
                        })
                    }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={handleDrawerClose}>
                            {chevron('rtl')}
                        </IconButton>
                    </div>
                    <Divider />
                    <MenuBar
                        items={menu}
                        open={menuOpen}
                        onItemClick={handleItemClick}
                    />
                </Drawer>
            )}
        </>
    );
};

Header.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, { name: 'Header' })(Header);
