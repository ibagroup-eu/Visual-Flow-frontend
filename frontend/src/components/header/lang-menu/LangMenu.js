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
import { useTranslation } from 'react-i18next';
import { MenuItem, Menu } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import styles from './LangMenu.Styles';

const options = [
    {
        val: 'en',
        label: 'EN'
    },
    {
        val: 'ru',
        label: 'RU'
    }
];

const LangMenu = () => {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const classes = styles();

    const onMenuItemClick = async index => {
        setSelectedIndex(index);
        setAnchorEl(null);
        await i18n.changeLanguage(options[index].val);
    };

    const onClick = e => {
        setAnchorEl(e.currentTarget);
    };

    const onClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <div id="curr-lang" className={classes.lang} onClick={onClick}>
                <p>{options[selectedIndex].label}</p>
                <ArrowDropDownIcon
                    fontSize="small"
                    htmlColor="black"
                    onClick={onClick}
                />
            </div>
            <Menu
                id="lang-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={onClose}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={option.val}
                        id={`lang-menu-item-${option.val}`}
                        selected={index === selectedIndex}
                        onClick={() => onMenuItemClick(index)}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default LangMenu;
