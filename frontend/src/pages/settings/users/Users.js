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
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { get, isEqual } from 'lodash';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Grid, Box, Button } from '@material-ui/core';

import FormWrapper from '../../../components/form-wrapper';
import SearchInput from '../../../components/search-input';
import fetchUsers from '../../../redux/actions/usersActions';
import { PageSkeleton } from '../../../components/skeleton';
import {
    updateProjectUsers,
    fetchProjectUsers
} from '../../../redux/actions/settingsUsersRolesActions';
import fetchRoles from '../../../redux/actions/rolesActions';
import PopupForm from '../../../components/popup-form';
import toggleConfirmationWindow from '../../../redux/actions/modalsActions';

import UsersTable from '../components/users-table';
import useStyles from './Users.Styles';
import useUnsavedChangesWarning from '../useUnsavedChangesWarning';

const Users = ({
    projectId,
    getUsers,
    users,
    loadingUsers,
    roles,
    loadingRoles,
    getRoles,
    getProjectUsers,
    projectUsers,
    loadingProjectUsers,
    update,
    confirmationWindow
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [editMode, setEditMode] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const [searchNewUsersValue, setSearchNewUsersValue] = React.useState('');
    const [usersAndRoles, setUsersAndRoles] = React.useState([]);
    const [newUsers, setNewUsers] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

    React.useEffect(() => {
        getUsers();
        getRoles();
    }, [editMode]);

    React.useEffect(() => {
        projectId && getProjectUsers(projectId);
    }, [projectId, editMode]);

    const getMappedUsers = () =>
        users
            .filter(user => get(projectUsers, `grants.${user.username}`, false))
            .map(user => ({
                ...user,
                role: get(projectUsers, `grants.${user.username}`, '')
            }));

    const getNewUsers = () =>
        users.filter(
            user =>
                !usersAndRoles.some(
                    userAndRole => user.username === userAndRole.username
                )
        );

    React.useEffect(() => {
        !loadingProjectUsers &&
            !loadingUsers &&
            setUsersAndRoles(getMappedUsers()) &&
            setNewUsers(getNewUsers());
    }, [users, projectUsers]);

    React.useEffect(() => {
        setNewUsers(getNewUsers());
    }, [usersAndRoles]);

    const searchFilter = (user, value) =>
        user.username.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        user.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    const handleChangeSearch = value => {
        setSearchValue(value);
    };

    const handleSearchNewUsers = value => {
        setSearchNewUsersValue(value);
        setNewUsers(getNewUsers().filter(user => searchFilter(user, value)));
    };

    const onAddUsers = (newRole, listNewUsers) => {
        setShowModal(false);
        setUsersAndRoles([
            ...usersAndRoles,
            ...users
                .filter(user => listNewUsers.indexOf(user.username) !== -1)
                .map(user => ({
                    ...user,
                    role: newRole
                }))
        ]);
        setSearchNewUsersValue('');
    };

    const onSubmit = () => {
        update(projectId, usersAndRoles);
        setEditMode(false);
        setPristine();
    };

    const onCancel = () => {
        if (!isEqual(getMappedUsers().sort(), usersAndRoles.sort())) {
            confirmationWindow({
                body: `${t('main:confirm.unsaved')}`,
                callback: () => {
                    setPristine();
                    setEditMode(false);
                    setUsersAndRoles(getMappedUsers());
                }
            });
        } else {
            setEditMode(false);
            setUsersAndRoles(getMappedUsers());
        }
    };

    const saveButtonIsDisabled = () => {
        useEffect(() => {
            if (isEqual(getMappedUsers().sort(), usersAndRoles.sort())) {
                setPristine();
            } else {
                setDirty();
            }
        });

        return isEqual(getMappedUsers().sort(), usersAndRoles.sort());
    };

    const filterUsers = () =>
        usersAndRoles.filter(user => searchFilter(user, searchValue));

    return loadingUsers || loadingRoles || loadingProjectUsers ? (
        <PageSkeleton />
    ) : (
        <Grid container>
            <PopupForm
                display={showModal}
                title={t('main:form.header.addUser')}
                onClose={() => setShowModal(false)}
                isNotHelper
            >
                <SearchInput
                    value={searchNewUsersValue}
                    onChange={event => handleSearchNewUsers(event.target.value)}
                    placeholder={t('main:search')}
                />
                <UsersTable
                    users={newUsers}
                    roles={roles}
                    onCancel={() => setShowModal(false)}
                    onSubmit={onAddUsers}
                    editMode
                    newUser
                />
            </PopupForm>
            <Grid item xs={3} />
            <Grid item xs={6} className={classes.root}>
                <FormWrapper
                    title="usersAndRoles"
                    editMode={editMode}
                    editable={projectUsers.editable}
                    setEditMode={() => {
                        handleChangeSearch('');
                        setEditMode(true);
                    }}
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                    isSaveBtnDisabled={saveButtonIsDisabled}
                >
                    <Box
                        className={classNames(
                            classes.flex,
                            classes.spaceBetween,
                            classes.paddedBottom
                        )}
                    >
                        <SearchInput
                            value={searchValue}
                            onChange={event =>
                                handleChangeSearch(event.target.value)
                            }
                            placeholder={t('main:search')}
                        />

                        {editMode && !showModal && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setShowModal(true)}
                            >
                                {t('main:button.addUser')}
                            </Button>
                        )}
                    </Box>
                    <UsersTable
                        users={filterUsers()}
                        roles={roles}
                        handleUpdateUsers={setUsersAndRoles}
                        editMode={editMode}
                    />
                </FormWrapper>
            </Grid>
            <Grid item xs={3} />
            {Prompt}
        </Grid>
    );
};

const mapStateToProps = state => ({
    projectId: state.projects.currentProject,
    users: state.user.users.data,
    loadingUsers: state.user.users.loading,
    roles: state.user.roles.data,
    loadingRoles: state.user.roles.loading,
    projectUsers: state.pages.settingsUsersRoles.data,
    loadingProjectUsers: state.pages.settingsUsersRoles.loading
});

const mapDispatchToProps = {
    getUsers: fetchUsers,
    getRoles: fetchRoles,
    getProjectUsers: fetchProjectUsers,
    update: updateProjectUsers,
    confirmationWindow: toggleConfirmationWindow
};

Users.propTypes = {
    projectId: PropTypes.string,
    getUsers: PropTypes.func,
    users: PropTypes.array,
    loadingUsers: PropTypes.bool,
    roles: PropTypes.array,
    loadingRoles: PropTypes.bool,
    getRoles: PropTypes.func,
    getProjectUsers: PropTypes.func,
    projectUsers: PropTypes.object,
    loadingProjectUsers: PropTypes.bool,
    update: PropTypes.func,
    confirmationWindow: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
