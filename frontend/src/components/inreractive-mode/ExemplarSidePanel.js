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
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
    Box,
    FormControlLabel,
    FormGroup,
    Paper,
    Switch,
    Typography
} from '@material-ui/core';

import ExemplarCheckboxes from './ExemplarCheckboxes';
import SearchWithClear from './SearchWithClear';

import useStyles from './InteractiveMode.Styles';

const ExemplarSidePanel = ({
    columns,
    visibleColumns,
    selectAll,
    onSelectAll,
    onColumnToggle
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [searchText, setSearchText] = useState('');
    const [filteredRows, setFilteredRows] = useState(columns);

    const handleSearch = event => {
        const value = event.target.value.toLowerCase();
        setSearchText(value);

        const filtered = columns.filter(row =>
            Object.values(row).some(cell =>
                String(cell)
                    .toLowerCase()
                    .includes(value)
            )
        );
        setFilteredRows(filtered);
    };

    const handleClear = () => {
        setSearchText('');
        setFilteredRows(columns);
    };

    return (
        <Paper elevation={3} sx={{ padding: 2 }} className={classes.exemplarPaper}>
            <SearchWithClear
                searchText={searchText}
                onClear={handleClear}
                onSearch={handleSearch}
            />
            <Box
                component={Paper}
                elevation={3}
                sx={{
                    height: 460,
                    maxHeight: 460,
                    overflow: 'auto',
                    padding: 2,
                    marginBottom: 2
                }}
            >
                {filteredRows.length === 0 ? (
                    <Typography style={{ fontSize: 14, padding: 7 }}>
                        {t('jobDesigner:interactiveMode.nothingToShow')}
                    </Typography>
                ) : (
                    <FormGroup>
                        <ExemplarCheckboxes
                            columns={filteredRows}
                            onColumnToggle={onColumnToggle}
                            visibleColumns={visibleColumns}
                        />
                    </FormGroup>
                )}
            </Box>
            <div style={{ textAlign: 'left' }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={selectAll}
                            onChange={onSelectAll}
                            name="selectAll"
                            color="primary"
                        />
                    }
                    label={
                        selectAll
                            ? t('jobDesigner:interactiveMode.deselectAll')
                            : t('jobDesigner:interactiveMode.selectAll')
                    }
                />
            </div>
        </Paper>
    );
};

ExemplarSidePanel.propTypes = {
    columns: PropTypes.array,
    visibleColumns: PropTypes.array,
    selectAll: PropTypes.bool,
    onSelectAll: PropTypes.func,
    onColumnToggle: PropTypes.func
};

export default ExemplarSidePanel;
