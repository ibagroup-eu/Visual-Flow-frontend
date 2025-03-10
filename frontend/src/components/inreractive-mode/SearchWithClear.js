/* eslint-disable complexity */
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

import { Clear } from '@material-ui/icons';
import { Box, IconButton, InputAdornment, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

const SearchWithClear = ({ searchText, onSearch, onClear }) => {
    return (
        <Box display="flex" alignItems="center" gap={1} marginBottom={1}>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={onSearch}
                InputProps={{
                    style: {
                        height: '30px'
                    },
                    endAdornment: searchText && (
                        <InputAdornment position="end">
                            <IconButton onClick={onClear} edge="end">
                                <Clear fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                InputLabelProps={{
                    shrink: true
                }}
            />
        </Box>
    );
};

SearchWithClear.propTypes = {
    searchText: PropTypes.string,
    onSearch: PropTypes.func,
    onClear: PropTypes.func
};

export default SearchWithClear;
