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

import { Collapse, Divider, List, ListItemText } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';
import ItemIcon from './ItemIcon';
import useStyles from './MenuBarItem.Styles';

const isSelected = (item, path) => item.link === path;

export const MenuBarItem = ({ item, menuOpen, onClick, location }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const { name, Icon, items = [] } = item;
    const isExpandable = items && items.length > 0;

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(menuOpen ? !open : true);
        onClick && onClick(item);
    };

    return (
        <>
            <MenuItem
                button
                selected={isSelected(item, location?.pathname)}
                onClick={handleClick}
            >
                {Icon && (
                    <ItemIcon
                        item={item}
                        menuOpen={menuOpen}
                        isSelected={isSelected(item, location?.pathname)}
                    />
                )}
                <ListItemText
                    primaryTypographyProps={{
                        color: 'inherit'
                    }}
                    primary={t(`main:${name}`)}
                    inset={!Icon}
                />
                {isExpandable && (
                    <ExpandMore
                        className={open ? classes.iconClose : classes.iconOpen}
                    />
                )}
            </MenuItem>

            {isExpandable && menuOpen && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Divider />
                    <List component="div" disablePadding>
                        {items.map(
                            value =>
                                !value.hidden && (
                                    <MenuBarItem
                                        item={value}
                                        key={value.name}
                                        onClick={onClick}
                                        location={location}
                                    />
                                )
                        )}
                    </List>
                </Collapse>
            )}
        </>
    );
};

MenuBarItem.propTypes = {
    item: PropTypes.shape({
        link: PropTypes.string,
        items: PropTypes.array,
        Icon: PropTypes.object,
        name: PropTypes.string
    }),
    location: PropTypes.object,
    onClick: PropTypes.func,
    menuOpen: PropTypes.bool
};

export default withRouter(MenuBarItem);
