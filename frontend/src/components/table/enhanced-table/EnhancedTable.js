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

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    Typography,
    withStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { noop } from 'lodash';

import TableToolbar from '../table-toolbar';
import styles from './EnhancedTable.Styles';
import { getComparator, stableSort } from '../../../utils/sort';
import {
    setCurrentTablePage,
    updateOrderBy,
    setRowsPerPage
} from '../../../redux/actions/enhancedTableActions';

const EnhancedTable = ({
    data,
    actions,
    orderColumns,
    filter,
    children,
    classes,
    page,
    rowsPerPage,
    labelRowsPerPage,
    rowsPerPageOptions,
    setCurrentPage,
    setRows,
    setTableOrderBy,
    orderBy,
    order
}) => {
    const [selected, setSelected] = React.useState([]);

    useEffect(() => {
        setTableOrderBy(orderColumns[0]?.id, 'asc');
    }, []);

    const { t } = useTranslation();
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRows(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setTableOrderBy(property, isAsc ? 'desc' : 'asc');
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const items = data
                ?.filter(
                    item =>
                        item.pipelineInstances === undefined ||
                        item.pipelineInstances?.length === 0
                )
                .map(item => item.id);
            setSelected(items);
        } else {
            setSelected([]);
        }
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const isSelected = id => selected.indexOf(id) !== -1;

    return (
        <>
            <TableToolbar
                rowCount={data?.length}
                selected={selected}
                onSelectAllClick={handleSelectAllClick}
                actions={actions}
                labelRowsPerPage={labelRowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                orderColumns={orderColumns}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
            >
                {filter}
            </TableToolbar>
            {data && data.length ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            {stableSort(data, getComparator(order, orderBy))
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map(item => {
                                    const checked = isSelected(item.id);
                                    return (
                                        <TableRow
                                            key={item.id}
                                            classes={{ root: classes.row }}
                                            selected={checked}
                                        >
                                            {children({
                                                item,
                                                checked,
                                                onClick: event =>
                                                    handleClick(event, item.id)
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography color="textSecondary" variant="h6">
                    {t('jobs:noItems')}
                </Typography>
            )}
        </>
    );
};

EnhancedTable.propTypes = {
    data: PropTypes.array,
    actions: PropTypes.arrayOf(PropTypes.object),
    orderColumns: PropTypes.array,
    children: PropTypes.func,
    filter: PropTypes.object,
    classes: PropTypes.object,
    page: PropTypes.number,
    labelRowsPerPage: PropTypes.string,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
    rowsPerPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    setRows: PropTypes.func,
    setTableOrderBy: PropTypes.func,
    order: PropTypes.string,
    orderBy: PropTypes.string
};

EnhancedTable.defaultProps = {
    labelRowsPerPage: 'Rows:',
    rowsPerPageOptions: [5, 10, 25, 50],
    setTableOrderBy: noop
};

const mapStateToProps = state => ({
    page: state.enhancedTable.page,
    rowsPerPage: state.enhancedTable.rowsPerPage,
    order: state.enhancedTable.order,
    orderBy: state.enhancedTable.orderBy
});

const mapDispatchToProps = {
    setCurrentPage: setCurrentTablePage,
    setRows: setRowsPerPage,
    setTableOrderBy: updateOrderBy
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
    withStyles(styles)(EnhancedTable)
);
