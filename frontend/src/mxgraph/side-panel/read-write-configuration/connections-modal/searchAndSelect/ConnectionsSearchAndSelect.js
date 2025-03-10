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
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box } from '@material-ui/core';

import useStyles from './ConnectionsSearchAndSelect.Styles';
import SearchInput from '../../../../../components/search-input';
import DropdownFilter from '../../../../../components/table/dropdown-filter';

const ConnectionsSearchAndSelect = ({
    searchValue,
    setSearchValue,
    storageSelection,
    setStorageSelection,
    connectionsLabels
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Box className={classes.search}>
                <SearchInput
                    fullWidth
                    value={searchValue}
                    onChange={event => setSearchValue(event.target.value)}
                    placeholder={t('main:searchByName')}
                />
            </Box>
            <Box className={classes.storage}>
                <DropdownFilter
                    value={storageSelection}
                    label={t('setting:connection.Storage')}
                    items={connectionsLabels.map(({ value, name }) => ({
                        value,
                        label: name
                    }))}
                    onChange={event => setStorageSelection(event.target.value)}
                    menuProps={{
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                        },
                        getContentAnchorEl: null,
                        style: {
                            maxHeight: 300,
                            maxWidth: 0
                        }
                    }}
                />
            </Box>
        </Box>
    );
};

ConnectionsSearchAndSelect.propTypes = {
    searchValue: PropTypes.string,
    setSearchValue: PropTypes.func,
    storageSelection: PropTypes.string,
    setStorageSelection: PropTypes.func,
    connectionsLabels: PropTypes.array
};

export default ConnectionsSearchAndSelect;
