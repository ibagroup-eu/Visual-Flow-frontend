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
import classNames from 'classnames';
import { connect } from 'react-redux';
import { get } from 'lodash';
import {
    Table,
    TableBody,
    TableContainer,
    Paper,
    TablePagination,
    TableCell,
    TableRow,
    Checkbox,
    Button,
    CardActions,
    Select,
    MenuItem,
    Box
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import toggleConfirmationWindow from '../../../../redux/actions/modalsActions';
import UsersTableToolbar from './UsersTableToolbar';
import UsersTableHeader from './UsersTableHeader';
import { stableSort, getComparator } from '../../../../utils/sort';
import useStyles from './UsersTable.Styles';

const headCells = [
    {
        id: 'username',
        numeric: false,
        disablePadding: true,
        label: 'ID'
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name'
    },
    {
        id: 'role',
        numeric: true,
        disablePadding: false,
        label: 'Role'
    }
];

const renderButtons = (classes, selected, role, t, handleSubmit, onCancel) => (
    <CardActions className={classes.buttonsGroup}>
        <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={role === -1 || !selected.length}
        >
            {t('main:button.Add')}
        </Button>
        <Button
            className={classNames(classes.button, classes.cancelBtn)}
            variant="contained"
            onClick={onCancel}
        >
            {t('main:button.Close')}
        </Button>
    </CardActions>
);

const UsersTable = ({
    users,
    roles,
    onSubmit,
    onCancel,
    newUser,
    editMode,
    handleUpdateUsers,
    confirmationWindow
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState();
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [role, setRole] = React.useState(-1);

    React.useEffect(() => {
        setSelected([]);
        setPage(0);
    }, [users]);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleClick = (event, username) => {
        const selectedIndex = selected.indexOf(username);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, username);
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
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelected = users.map(n => n.username);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    const handleSubmit = () => {
        onSubmit(role, selected);
        setRole(-1);
    };
    const updateUsers = updatedUsersAndRoles =>
        handleUpdateUsers(
            users.map(user =>
                get(updatedUsersAndRoles, `${user.username}`, null)
                    ? { ...user, role: updatedUsersAndRoles[user.username] }
                    : user
            )
        );
    const handleDeleteUsers = () => {
        handleUpdateUsers(
            users.filter(user => selected.indexOf(user.username) === -1)
        );
        const lastPageAfterRemove =
            Math.ceil((users.length - selected.length) / rowsPerPage) - 1;
        if (page > lastPageAfterRemove && lastPageAfterRemove >= 0) {
            setPage(lastPageAfterRemove);
        }
    };
    const renderSelect = (username, userRole) => (
        <Select
            value={userRole}
            onChange={event => updateUsers({ [username]: event.target.value })}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
        >
            {roles.map(roleItem => (
                <MenuItem key={roleItem} value={roleItem}>
                    {roleItem}
                </MenuItem>
            ))}
        </Select>
    );
    const handleChangeRole = value =>
        handleUpdateUsers(
            users.map(user =>
                selected.indexOf(user.username) !== -1
                    ? { ...user, role: value }
                    : user
            )
        );
    const renderTableBody = () => (
        <TableBody>
            {stableSort(users, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                    const isItemSelected = selected.indexOf(row.username) !== -1;
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                        <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={`add-users-table-${row.username}`}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={isItemSelected}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                    onChange={event =>
                                        handleClick(event, row.username)
                                    }
                                    disabled={!editMode}
                                />
                            </TableCell>
                            <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                className={classes.nonePaddingLeft}
                            >
                                {row.username}
                            </TableCell>
                            <TableCell className={classes.nonePaddingLeft}>
                                {row.name}
                            </TableCell>
                            {!newUser && (
                                <TableCell className={classes.role} align="right">
                                    {editMode && selected.length === 0
                                        ? renderSelect(row.username, row.role)
                                        : row.role}
                                </TableCell>
                            )}
                        </TableRow>
                    );
                })}
        </TableBody>
    );

    return (
        <>
            <Box className={classNames({ [classes.tableWrapper]: newUser })}>
                <Paper>
                    <UsersTableToolbar
                        numSelected={selected.length}
                        roles={roles}
                        role={role}
                        handleChangeRole={newUser ? setRole : handleChangeRole}
                        handleDelete={() =>
                            confirmationWindow({
                                body: `${t('main:confirm.sure')} '${selected.join(
                                    ', '
                                )}'?`,
                                callback: () => handleDeleteUsers()
                            })
                        }
                        newUser={newUser}
                    />
                    <TableContainer>
                        <Table>
                            <UsersTableHeader
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={users.length}
                                headCells={
                                    newUser ? headCells.slice(0, 2) : headCells
                                }
                                editMode={editMode}
                            />
                            {renderTableBody()}
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelDisplayedRows={args => t('main:pagination.of', args)}
                        labelRowsPerPage={t('main:pagination.RowsPerPage')}
                    />
                </Paper>
            </Box>
            {newUser &&
                renderButtons(classes, selected, role, t, handleSubmit, onCancel)}
        </>
    );
};

UsersTable.propTypes = {
    users: PropTypes.array,
    roles: PropTypes.array,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    newUser: PropTypes.bool,
    editMode: PropTypes.bool,
    handleUpdateUsers: PropTypes.func,
    confirmationWindow: PropTypes.func.isRequired
};

const mapDispatchToProps = {
    confirmationWindow: toggleConfirmationWindow
};

export default connect(null, mapDispatchToProps)(UsersTable);
