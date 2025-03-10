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
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { Grid } from '@material-ui/core';

import ExemplarTable from './ExemplarTable';
import ExemplarSidePanel from './ExemplarSidePanel';
import PaperWithText from './PaperWithText';

import useStyles from './InteractiveMode.Styles';

const Exemplar = ({ columns, data, openSidePanel }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [visibleColumns, setVisibleColumns] = useState(columns.map(col => col.id));
    const [allSelected, setAllSelected] = useState(true);

    useEffect(() => {
        if (visibleColumns.length === 0) {
            setAllSelected(false);
        }
        if (visibleColumns.length === columns.length) {
            setAllSelected(true);
        }
    }, [allSelected, visibleColumns, columns]);

    const handleColumnToggle = columnId => {
        setVisibleColumns(prev =>
            prev.includes(columnId)
                ? prev.filter(id => id !== columnId)
                : [...prev, columnId]
        );
    };

    const handleSelectAll = () => {
        if (allSelected) {
            setVisibleColumns([]);
            setAllSelected(false);
        } else {
            setVisibleColumns(columns.map(col => col.id));
            setAllSelected(true);
        }
    };

    const renderTable = () =>
        visibleColumns.length > 0 ? (
            <ExemplarTable
                visibleColumns={visibleColumns}
                columns={columns}
                rows={data}
            />
        ) : (
            <PaperWithText
                text={t('jobDesigner:interactiveMode.selectColumn')}
                className={
                    openSidePanel ? classes.exemplarPaper : classes.exemplarPaperOpen
                }
            />
        );

    return (
        <Grid container spacing={2} sx={{ padding: 2 }}>
            {openSidePanel ? (
                <>
                    <Grid item xs={5} md={3}>
                        <ExemplarSidePanel
                            columns={columns}
                            visibleColumns={visibleColumns}
                            onColumnToggle={handleColumnToggle}
                            selectAll={allSelected}
                            onSelectAll={handleSelectAll}
                        />
                    </Grid>
                    <Grid item xs={7} md={9}>
                        {renderTable()}
                    </Grid>
                </>
            ) : (
                renderTable()
            )}
        </Grid>
    );
};

Exemplar.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    openSidePanel: PropTypes.bool
};

export default Exemplar;
