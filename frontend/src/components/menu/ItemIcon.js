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

import { ListItemIcon, useTheme, Tooltip } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const isIconSelected = (item, path, isSelected) =>
    isSelected || item.items?.find(v => v.link === path && !v.icon);

const ItemIcon = ({ item, menuOpen, isSelected, location }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { name, Icon } = item;
    const colorIcon = isIconSelected(item, location?.pathname, isSelected)
        ? theme.palette.text.primary
        : null;
    return (
        <ListItemIcon>
            {menuOpen ? (
                <Icon htmlColor={colorIcon} />
            ) : (
                <Tooltip title={t(`main:${name}`)} arrow>
                    <Icon htmlColor={colorIcon} />
                </Tooltip>
            )}
        </ListItemIcon>
    );
};

ItemIcon.propTypes = {
    item: PropTypes.shape({
        link: PropTypes.string,
        items: PropTypes.array,
        Icon: PropTypes.object,
        name: PropTypes.string
    }),
    location: PropTypes.object,
    menuOpen: PropTypes.bool,
    isSelected: PropTypes.bool
};

export default ItemIcon;
