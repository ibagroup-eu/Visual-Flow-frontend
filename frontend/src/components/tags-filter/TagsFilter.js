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

import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Fade,
    Collapse,
    Typography,
    Popper,
    ClickAwayListener,
    Paper,
    Slide
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { isEqual, partition } from 'lodash';
import classNames from 'classnames';
import useStyles from './TagsFilter.Styles';
import SearchInput from '../search-input';
import TagsItem from './tags-item/TagsItem';
import TagsButton from './tags-button/TagsButton';
import TagsResetButton from './tags-reset-button/TagsResetButton';

const filteringTags = (tagsData, value) =>
    partition(
        tagsData,
        tag =>
            tag[0].toLowerCase().indexOf(value.trim().toLowerCase()) !== -1 &&
            value.trim() !== ''
    );

const TagsFilter = ({ data, onCheckTags, resetTags, checkedTags }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [expand, setExpand] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [expandSize, onExpandSize] = useState(0);
    const arrayData = useMemo(() => Object.entries(data), [data]);
    const [filterTags, setFilterTags] = useState(
        filteringTags(arrayData, searchValue)
    );
    const [foundTags, otherTags] = filterTags;

    useEffect(() => {
        setFilterTags(filteringTags(arrayData, searchValue));
    }, [arrayData, searchValue]);

    const onSearch = event => {
        setSearchValue(event.target.value);
    };

    const handleClick = event => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
        setSearchValue('');
        setExpand(false);
    };

    const menuContent = ({ TransitionProps }) => (
        <Fade {...TransitionProps}>
            <Box>
                <Slide {...TransitionProps}>
                    <Paper
                        className={classNames(
                            classes.paper,
                            !anchorEl && classes.paperClose
                        )}
                    >
                        <SearchInput
                            fullWidth
                            value={searchValue}
                            onChange={onSearch}
                            placeholder={t('main:searchByTags')}
                        />
                        <Box className={classes.tags}>
                            {searchValue.trim() && (
                                <Box
                                    className={
                                        otherTags.length !== 0
                                            ? classes.filteredTags
                                            : null
                                    }
                                >
                                    {foundTags.length !== 0 ? (
                                        foundTags.map(tag => (
                                            <TagsItem
                                                key={tag[0]}
                                                label={tag[0]}
                                                checked={tag[1]}
                                                setChecked={onCheckTags}
                                            />
                                        ))
                                    ) : (
                                        <Typography className={classes.noResult}>
                                            {t('main:noResult')}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                            {otherTags.length !== 0 && (
                                <Collapse
                                    in={expand}
                                    collapsedSize={expandSize > 84 ? 80 : expandSize}
                                    ref={e => onExpandSize(e?.scrollHeight)}
                                    className={classes.collapse}
                                >
                                    {otherTags.map(tag => (
                                        <TagsItem
                                            key={tag[0]}
                                            label={tag[0]}
                                            checked={tag[1]}
                                            setChecked={onCheckTags}
                                        />
                                    ))}
                                </Collapse>
                            )}
                        </Box>
                        {expandSize > 84 && (
                            <Button
                                size="small"
                                className={classes.button}
                                variant="text"
                                onClick={() => setExpand(!expand)}
                            >
                                {t(expand ? 'main:collapse' : 'main:expand')}
                            </Button>
                        )}
                        <TagsResetButton
                            disabled={isEqual(checkedTags, {})}
                            resetTags={resetTags}
                        />
                    </Paper>
                </Slide>
            </Box>
        </Fade>
    );

    return (
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <Box>
                <TagsButton
                    open={!!anchorEl}
                    onOpen={handleClick}
                    checkedCount={Object.keys(checkedTags).length}
                />
                <Popper
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    placement="bottom-end"
                    role={undefined}
                    transition
                >
                    {menuContent}
                </Popper>
            </Box>
        </ClickAwayListener>
    );
};

TagsFilter.propTypes = {
    data: PropTypes.object,
    onCheckTags: PropTypes.func,
    resetTags: PropTypes.func,
    checkedTags: PropTypes.object
};

export default TagsFilter;
