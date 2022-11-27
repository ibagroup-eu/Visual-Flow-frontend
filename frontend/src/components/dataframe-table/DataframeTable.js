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

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Paper, Table, TableContainer, TablePagination } from '@material-ui/core';
import { findIndex, map, uniqueId } from 'lodash';
import useStyles from './DataframeTable.Styles';
import DataframeToolbar from './dataframe-toolbar/DataframeToolbar';
import DataframeHead from './dataframe-head/DataframeHead';
import DataframeBody from './dataframe-body/DataframeBody';
import { getComparator } from '../../utils/sort';

const dataframeSort = (array, comparator) => {
    const stabilized = array.map((el, index) => [el, index]);
    stabilized.sort((a, b) => {
        const order = comparator(a[0]?.data, b[0]?.data);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilized.map(el => el[0]);
};

const DataframeTable = ({
    columns,
    rows,
    columnTypes,
    setColumns,
    setRows,
    editable
}) => {
    const classes = useStyles();
    const [selected, setSelected] = useState([]);
    const tableContainerRef = useRef(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [renameColumnIndex, setRenameColumnIndex] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(-1);
    const [invisibled, setInvisibled] = useState([]);

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = rows.map(row => row.rowId);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = id => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const isSelected = id => selected.indexOf(id) !== -1;

    const isVisibled = id => invisibled.indexOf(id) === -1;

    const changeColumn = (columnName, columnType) => {
        if (renameColumnIndex !== null) {
            const newColumns = [...columns];
            newColumns[renameColumnIndex] = {
                ...newColumns[renameColumnIndex],
                column: columnName
            };
            setColumns(newColumns);
            setRenameColumnIndex(null);
        } else {
            setColumns([...columns, { column: columnName, type: columnType }]);
            setRows(map(rows, row => ({ ...row, data: [...row.data, ''] })));
        }
    };

    const addRow = () =>
        setRows([...rows, { rowId: uniqueId(), data: columns.map(() => '') }]);

    const changeField = (newValue, rowId, index) => {
        const newRows = [...rows];
        const rowIndex = findIndex(newRows, ['rowId', rowId]);
        newRows[rowIndex].data[index] = newValue;
        setRows(newRows);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onDeleteRows = () => {
        setRows(rows.filter(row => !isSelected(row.rowId)));
        setSelected([]);
        const pageAfterRemove = Math.ceil(
            (rows.length - selected.length) / rowsPerPage - 1
        );
        if (page > pageAfterRemove && pageAfterRemove >= 0) {
            setPage(pageAfterRemove);
        }
    };

    const onSetRename = (index = null) => setRenameColumnIndex(index);

    const onDeleteColumn = index => {
        setColumns(columns.filter((column, i) => i !== index));
        setRows(
            map(rows, row => ({
                ...row,
                data: row.data.filter((item, i) => i !== index)
            }))
        );
    };

    const handleRequestSort = property => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <Paper>
            <DataframeToolbar
                columns={columns}
                renameFieldIndex={renameColumnIndex}
                onCancelRename={onSetRename}
                deleteDisabled={selected.length === 0}
                addRow={addRow}
                addColumn={changeColumn}
                onDeleteRows={onDeleteRows}
                columnTypes={columnTypes}
                editable={editable}
                invisibled={invisibled}
                setInvisibled={setInvisibled}
                setPage={setPage}
            />
            <TableContainer
                ref={tableContainerRef}
                className={classes.wrapperMainField}
            >
                <Table stickyHeader>
                    <DataframeHead
                        columns={columns}
                        handleSelectAllClick={handleSelectAllClick}
                        rowsLength={rows.length}
                        selectedLength={selected.length}
                        onSetRename={onSetRename}
                        onDeleteColumn={onDeleteColumn}
                        order={order}
                        orderBy={orderBy}
                        handleRequestSort={handleRequestSort}
                        editable={editable}
                        setInvisibled={setInvisibled}
                        isVisibled={isVisibled}
                    />
                    <DataframeBody
                        rows={
                            columns.length === invisibled.length
                                ? []
                                : dataframeSort(rows, getComparator(order, orderBy))
                        }
                        columns={columns}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        scrollTop={tableContainerRef?.current?.scrollTop || 0}
                        changeField={changeField}
                        isSelected={isSelected}
                        onSelect={handleClick}
                        editable={editable}
                        isVisibled={isVisibled}
                    />
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                nextIconButtonProps={{
                    disabled:
                        columns.length === invisibled.length ||
                        rows.length <= page * rowsPerPage + rowsPerPage
                }}
            />
        </Paper>
    );
};

DataframeTable.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    columnTypes: PropTypes.array,
    setColumns: PropTypes.func,
    setRows: PropTypes.func,
    editable: PropTypes.bool
};

export default DataframeTable;
