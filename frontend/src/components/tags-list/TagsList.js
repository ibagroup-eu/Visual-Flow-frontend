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
import classNames from 'classnames';
import {
    Box,
    Chip,
    ClickAwayListener,
    Grow,
    Paper,
    Popper
} from '@material-ui/core';
import useStyles from './TagsList.Styles';
import TagsItem from '../tags-filter/tags-item/TagsItem';

const TagsList = ({ tags, limit, onCheckTags, checkedTags }) => {
    const classes = useStyles();
    const [menuAnchor, setMenuAnchor] = useState(null);
    const hiddenChecked = tags.slice(limit).find(tag => checkedTags[tag]);

    const openMenu = event => {
        setMenuAnchor(event.currentTarget);
    };

    return (
        <Box className={classes.root}>
            {tags.slice(0, limit).map(tag => (
                <TagsItem
                    key={tag}
                    label={tag}
                    checked={checkedTags[tag] || false}
                    setChecked={onCheckTags}
                />
            ))}
            <ClickAwayListener onClickAway={() => setMenuAnchor(null)}>
                <Box className={classes.hiddenTags}>
                    {tags.length > limit && (
                        <Chip
                            className={classNames(classes.chip, {
                                [classes.chipHover]: hiddenChecked,
                                [classes.checkedChip]: hiddenChecked
                            })}
                            variant="outlined"
                            size="small"
                            label={`+${tags.length - limit}`}
                            onClick={openMenu}
                        />
                    )}
                    <Popper
                        open={!!menuAnchor}
                        anchorEl={menuAnchor}
                        placement="bottom-start"
                        role={undefined}
                        transition
                    >
                        {({ TransitionProps }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: 'left top'
                                }}
                            >
                                <Paper className={classes.paper}>
                                    <Box className={classes.tags}>
                                        {tags.slice(limit).map(tag => (
                                            <TagsItem
                                                key={tag}
                                                label={tag}
                                                checked={checkedTags[tag] || false}
                                                setChecked={onCheckTags}
                                            />
                                        ))}
                                    </Box>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Box>
            </ClickAwayListener>
        </Box>
    );
};

TagsList.defaultProps = {
    tags: [],
    limit: 3
};

TagsList.propTypes = {
    tags: PropTypes.array,
    limit: PropTypes.number,
    checkedTags: PropTypes.object,
    onCheckTags: PropTypes.func
};

export default TagsList;
