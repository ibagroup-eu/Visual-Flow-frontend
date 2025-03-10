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

import {
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableSortLabel
} from '@material-ui/core';

import { StyledTableCell, StyledTableRow } from './TableStyles';
import SortIcon from './SortIcon';

import useStyles from './InteractiveMode.Styles';

const ExemplarTable = ({ visibleColumns, columns, rows: originalRows }) => {
    const classes = useStyles();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState();
    const [rows, setRows] = useState(originalRows);

    const handleSort = column => {
        const toggleOrder = currentOrder =>
            // eslint-disable-next-line no-nested-ternary
            currentOrder === 'asc' ? 'desc' : currentOrder === 'desc' ? null : 'asc';

        const newOrder = orderBy === column ? toggleOrder(order) : 'asc';
        setOrder(newOrder);
        setOrderBy(column);

        if (newOrder === null) {
            setRows(originalRows);
            return;
        }

        const sortedRows = [...rows].sort((a, b) => {
            if (a[column] < b[column]) {
                return newOrder === 'asc' ? -1 : 1;
            }
            if (a[column] > b[column]) {
                return newOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setRows(sortedRows);
    };

    return (
        <TableContainer className={classes.exemplarTable} component={Paper}>
            <Table>
                <TableHead>
                    <StyledTableRow>
                        {columns
                            .filter(col => visibleColumns.includes(col.id))
                            .map(col => (
                                <StyledTableCell>
                                    <TableSortLabel
                                        active={
                                            orderBy === col.label && order !== null
                                        }
                                        direction={order || 'asc'}
                                        onClick={() => handleSort(col.label)}
                                        IconComponent={() =>
                                            orderBy === col.label ? (
                                                <SortIcon order={order} />
                                            ) : null
                                        }
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </StyledTableCell>
                            ))}
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIndex) => (
                        <StyledTableRow
                            // eslint-disable-next-line react/no-array-index-key
                            key={rowIndex}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}
                        >
                            {columns
                                .filter(col => visibleColumns.includes(col.id))
                                .map(col => (
                                    <StyledTableCell key={col.id}>
                                        {row[col.id]}
                                    </StyledTableCell>
                                ))}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

ExemplarTable.propTypes = {
    visibleColumns: PropTypes.array,
    columns: PropTypes.array,
    rows: PropTypes.array
};

export default ExemplarTable;
