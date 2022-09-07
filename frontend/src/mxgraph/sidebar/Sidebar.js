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
import { Drawer, IconButton, Toolbar } from '@material-ui/core';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PropTypes from 'prop-types';
import SidebarTabs from './sidebar-tabs';
import useStyles from './Sidebar.Styles';
import SidebarHeader from './sidebar-header';

const Sidebar = ({ graph = {}, name, ableToEdit }) => {
    const classes = useStyles();
    const [opened, setOpened] = useState(true);

    const toggleDrawer = () => setOpened(prevState => !prevState);

    return (
        <div className={classes.root}>
            <SidebarHeader graph={graph} name={name} ableToEdit={ableToEdit} />
            <Drawer
                className={classNames({
                    [classes.drawerOpen]: opened,
                    [classes.drawerClose]: !opened
                })}
                variant="permanent"
                classes={{
                    paper: classNames({
                        [classes.drawerOpen]: opened,
                        [classes.drawerClose]: !opened
                    })
                }}
            >
                <Toolbar />
                <div
                    className={classNames(classes.content, {
                        [classes.hidden]: !opened
                    })}
                >
                    <SidebarTabs name={name} graph={graph} ableToEdit={ableToEdit} />
                </div>
            </Drawer>
            <IconButton
                aria-label="toggle drawer"
                onClick={toggleDrawer}
                className={classNames(classes.toggleButton, {
                    [classes.iconOpen]: !opened,
                    [classes.iconClose]: opened
                })}
                size="small"
            >
                {opened ? (
                    <ChevronLeftIcon fontSize="large" />
                ) : (
                    <ChevronRightIcon fontSize="large" />
                )}
            </IconButton>
        </div>
    );
};

Sidebar.propTypes = {
    name: PropTypes.string,
    graph: PropTypes.object,
    ableToEdit: PropTypes.bool
};

export default Sidebar;
