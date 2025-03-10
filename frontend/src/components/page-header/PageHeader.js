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
import { Grid, Typography, Button, Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import RefreshIcon from '@material-ui/icons/Refresh';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import useStyles from './PageHeader.Styles';
import SearchInput from '../search-input';
import TagsFilter from '../tags-filter';

const PageHeader = ({
    header,
    ableToEdit,
    buttonCaption,
    onRefreshClick,
    onAddClick,
    searchValue,
    onSearch,
    tagsData,
    onCheckTags,
    resetTags,
    checkedTags,
    disabled
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Grid container justifyContent="space-between" className={classes.root}>
            <Grid item>
                <Typography variant="h4">{t(`main:${header}`)}</Typography>
            </Grid>
            <Grid item>
                <Grid
                    container
                    justifyContent="flex-end"
                    spacing={3}
                    className={classes.actions}
                >
                    <Grid className={classes.searchItem} item>
                        <Box className={classes.search}>
                            <SearchInput
                                fullWidth
                                value={searchValue}
                                onChange={onSearch}
                                placeholder={t('main:searchByName')}
                            />
                        </Box>
                        <TagsFilter
                            data={tagsData}
                            onCheckTags={onCheckTags}
                            resetTags={resetTags}
                            checkedTags={checkedTags}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            className={classNames(
                                classes.button,
                                classes.refreshBtn
                            )}
                            variant="contained"
                            color="primary"
                            startIcon={<RefreshIcon />}
                            onClick={onRefreshClick}
                        />
                    </Grid>
                    {ableToEdit && (
                        <Grid item>
                            <Button
                                className={classNames(
                                    classes.button,
                                    classes.addBtn
                                )}
                                variant="contained"
                                color="primary"
                                disabled={disabled}
                                onClick={onAddClick}
                            >
                                {buttonCaption}
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

PageHeader.propTypes = {
    header: PropTypes.string,
    ableToEdit: PropTypes.bool,
    buttonCaption: PropTypes.string,
    onRefreshClick: PropTypes.func,
    onAddClick: PropTypes.func,
    searchValue: PropTypes.string,
    onSearch: PropTypes.func,
    tagsData: PropTypes.object,
    onCheckTags: PropTypes.func,
    resetTags: PropTypes.func,
    checkedTags: PropTypes.object,
    disabled: PropTypes.bool
};

export default PageHeader;
