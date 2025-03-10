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
import { Box, withStyles } from '@material-ui/core';

import styles from './ParametersSearch.Styles';
import SearchInput from '../../../../components/search-input';
import DropdownFilter from '../../../../components/table/dropdown-filter';

export const ParametersSearch = ({
    searchValue,
    filterValue,
    onFilter,
    filterOptions,
    classes
}) => {
    const { t } = useTranslation();

    return (
        <Box className={classes.root}>
            <Box className={classes.search}>
                <SearchInput
                    fullWidth
                    value={searchValue}
                    onChange={event => onFilter([event.target.value, filterValue])}
                    placeholder={t('main:searchByName')}
                />
            </Box>
            <Box className={classes.type}>
                <DropdownFilter
                    value={filterValue}
                    label={t('setting:parameter.Type')}
                    items={filterOptions}
                    onChange={event => onFilter([searchValue, event.target.value])}
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

ParametersSearch.propTypes = {
    classes: PropTypes.object,
    searchValue: PropTypes.string,
    onFilter: PropTypes.func,
    filterValue: PropTypes.string,
    filterOptions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
        })
    )
};

export default withStyles(styles)(ParametersSearch);
