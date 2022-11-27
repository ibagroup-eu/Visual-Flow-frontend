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
import { Box, Drawer, IconButton, Toolbar } from '@material-ui/core';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PropTypes from 'prop-types';
import SidebarTabs from './sidebar-tabs';
import useStyles from './Sidebar.Styles';
import SidebarHeader from './sidebar-header';

const Sidebar = ({ graph = {}, name, ableToEdit }) => {
    const classes = useStyles();
    const [opened, setOpened] = useState(true);

    const toggleDrawer = () => setOpened(prevState => !prevState);

    return (
        <Box className={classes.root}>
            <SidebarHeader graph={graph} name={name} ableToEdit={ableToEdit} />
            <Drawer
                className={opened ? classes.drawerOpen : classes.drawerClose}
                variant="permanent"
                classes={{
                    paper: opened ? classes.drawerOpen : classes.drawerClose
                }}
            >
                <Toolbar />
                <Box
                    className={classNames(
                        classes.content,
                        opened ? classes.showContent : classes.hideContent
                    )}
                >
                    <SidebarTabs name={name} graph={graph} ableToEdit={ableToEdit} />
                </Box>
            </Drawer>
            <IconButton
                aria-label="toggle drawer"
                onClick={toggleDrawer}
                className={classNames(
                    classes.toggleButton,
                    opened ? classes.iconClose : classes.iconOpen
                )}
                size="small"
            >
                <ChevronLeftIcon fontSize="large" />
            </IconButton>
        </Box>
    );
};

Sidebar.propTypes = {
    name: PropTypes.string,
    graph: PropTypes.object,
    ableToEdit: PropTypes.bool
};

export default Sidebar;
