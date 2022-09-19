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
import PropTypes from 'prop-types';
import { truncate } from 'lodash';
import classNames from 'classnames';
import { Avatar, Box, Chip, Menu, MenuItem, Tooltip } from '@material-ui/core';
import useStyles from './TagsList.Styles';

const TagsList = ({ tags, limit }) => {
    const classes = useStyles();

    const showTags = tags.slice(0, limit);

    const [menuAnchor, setMenuAnchor] = useState(null);

    const openMenu = event => {
        setMenuAnchor(event.target);
    };

    const closeMenu = () => {
        setMenuAnchor(null);
    };

    const chipProps = {
        className: classNames(classes.tag, classes.tagMargins),
        variant: 'outlined',
        size: 'small'
    };

    return (
        <Box className={classes.tagsBox}>
            {showTags.map(tag => (
                <Tooltip
                    key={tag}
                    title={tag.length > 9 ? tag : ''}
                    arrow
                    placement="bottom"
                >
                    <Chip
                        {...chipProps}
                        avatar={<Avatar className={classes.avatar}>#</Avatar>}
                        label={truncate(tag, { length: 9 })}
                    />
                </Tooltip>
            ))}
            {tags.length > limit && (
                <Chip
                    {...chipProps}
                    label={`+${tags.length - limit}`}
                    onClick={openMenu}
                />
            )}
            <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
                {tags.map(
                    (tag, i) =>
                        i > limit - 1 && (
                            <MenuItem
                                key={tag}
                                disabled
                                className={classes.menuItem}
                            >
                                <Chip
                                    {...chipProps}
                                    className={classNames(
                                        classes.disabledTag,
                                        classes.tagMargins
                                    )}
                                    avatar={
                                        <Avatar
                                            className={classNames(
                                                classes.avatar,
                                                classes.disabledAvatar
                                            )}
                                        >
                                            #
                                        </Avatar>
                                    }
                                    label={tag}
                                />
                            </MenuItem>
                        )
                )}
            </Menu>
        </Box>
    );
};

TagsList.defaultProps = {
    tags: [],
    limit: 3
};

TagsList.propTypes = {
    tags: PropTypes.array,
    limit: PropTypes.number
};

export default TagsList;
