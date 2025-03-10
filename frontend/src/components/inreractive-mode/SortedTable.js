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
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableSortLabel,
    Typography
} from '@material-ui/core';

import SortIcon from './SortIcon';
import { StyledTableCell, StyledTableRow } from './TableStyles';
import SearchWithClear from './SearchWithClear';

const SortedTable = ({ headers, originalRows, className }) => {
    const { t } = useTranslation();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState();

    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState(originalRows);

    const handleClear = () => {
        setSearchText('');
        setRows(originalRows);
    };

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

    const filteredData = rows.filter(row =>
        Object.values(row).some(value =>
            value
                .toString()
                .toLowerCase()
                .includes(searchText.toLowerCase())
        )
    );

    return (
        <>
            <SearchWithClear
                searchText={searchText}
                onClear={handleClear}
                onSearch={e => setSearchText(e.target.value)}
            />
            <TableContainer component={Paper} className={className}>
                {filteredData.length !== 0 ? (
                    <Table stickyHeader aria-label="customized table">
                        <TableHead>
                            <StyledTableRow>
                                {headers.map(header => (
                                    <StyledTableCell>
                                        <TableSortLabel
                                            active={
                                                orderBy === header && order !== null
                                            }
                                            direction={order || 'asc'}
                                            onClick={() => handleSort(header)}
                                            IconComponent={() =>
                                                orderBy === header ? (
                                                    <SortIcon order={order} />
                                                ) : null
                                            }
                                        >
                                            {header}
                                        </TableSortLabel>
                                    </StyledTableCell>
                                ))}
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row, index) => (
                                <StyledTableRow
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0
                                        }
                                    }}
                                >
                                    {Object.values(row).map(el => (
                                        <StyledTableCell>{el}</StyledTableCell>
                                    ))}
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography
                        style={{ fontSize: 14, padding: 7, textAlign: 'center' }}
                    >
                        {t('jobDesigner:interactiveMode.nothingToShow')}
                    </Typography>
                )}
            </TableContainer>
        </>
    );
};

export default SortedTable;

SortedTable.propTypes = {
    headers: PropTypes.array,
    originalRows: PropTypes.array,
    className: PropTypes.any
};
