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

import { List } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import useStyles from './MenuBar.Styles';
import MenuBarItem from './MenuBarItem';

const MenuBar = ({ items, open, onItemClick }) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const dispatchEvents = (events = []) => events.map(dispatch);

    return (
        <List component="nav" className={classes.root}>
            {items.map(
                item =>
                    !item.hidden && (
                        <MenuBarItem
                            item={item}
                            key={item.name}
                            menuOpen={open}
                            onClick={event => {
                                onItemClick(event);
                                dispatchEvents(item.dispatch);
                            }}
                        />
                    )
            )}
        </List>
    );
};
MenuBar.propTypes = {
    items: PropTypes.array,
    open: PropTypes.bool,
    onItemClick: PropTypes.func
};

export default MenuBar;
