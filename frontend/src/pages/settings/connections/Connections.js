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
import Box from '@material-ui/core/Box';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Table, TableBody, TableContainer, Paper } from '@material-ui/core';
import { reduce } from 'lodash';
import { useTranslation } from 'react-i18next';
import FormWrapper from '../../../components/form-wrapper';
import PropertySelect from '../../../components/property-select';
import { fetchParameters } from '../../../redux/actions/settingsParametersActions';
import {
    createConnection,
    fetchConnections,
    updateConnection,
    deleteConnection
} from '../../../redux/actions/settingsConnectionsActions';
import { PageSkeleton } from '../../../components/skeleton';
import ConnectionsTableRow from '../components/connections-table-row';
import useStyles from './Connections.Styles';
import { STORAGES } from '../../../mxgraph/constants';
import ConnectionsPanel from '../components/connections-panel/ConnectionsPanel';
import ConnectionsSearchAndSelect from '../../../mxgraph/side-panel/read-write-configuration/connections-modal/searchAndSelect/ConnectionsSearchAndSelect';

export const selectConnections = reduce(
    STORAGES,
    (result, { value, label }) => {
        if (value !== 'stdout') {
            result.push({ value, name: label });
        }
        return result;
    },
    []
);

const Connections = ({
    projectId,
    loading,
    getParameters,
    getConnections,
    update,
    create,
    remove,
    connections
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [projectConnections, setProjectConnections] = useState(connections);
    const [searchValue, setSearchValue] = useState('');
    const [storageSelection, setStorageSelection] = useState('');
    const [panelIsOpen, setPanelState] = useState(false);
    const [connectionConfig, setConnectionConfig] = useState(null);
    const [viewMode, setViewMode] = useState(false);
    const [title, setTitle] = useState('Configuration');

    useEffect(() => {
        projectId && getParameters(projectId);
        projectId && getConnections(projectId);
    }, [projectId]);

    useEffect(() => setProjectConnections(connections), [connections]);

    const removeConnection = removedId => {
        remove(projectId, removedId).then(() =>
            setProjectConnections(prevState =>
                prevState.filter(connection => connection.id !== removedId)
            )
        );
    };

    const handleClickNewFieldType = event => {
        setTitle('Configuration');
        setConnectionConfig({ storage: event.target.value });
        setPanelState(true);
        setViewMode(false);
    };

    const handleAddNewConnection = value =>
        value.id ? update(projectId, value) : create(projectId, value);

    const handleOpenConnection = (connection, editMode) => {
        setTitle(editMode ? 'Edit' : 'View');
        setConnectionConfig(connection);
        setViewMode(!editMode);
        setPanelState(true);
    };

    const renderNewFieldDropdown = () => (
        <PropertySelect
            handleChange={handleClickNewFieldType}
            placeholder={t('main:button.AddConnection')}
            properties={selectConnections}
            isConnections
        />
    );

    const filterConnections = () =>
        projectConnections.filter(
            connection =>
                connection.connectionName
                    ?.toLowerCase()
                    .indexOf(searchValue.toLowerCase()) !== -1 &&
                (!storageSelection || connection.storage === storageSelection)
        );

    const shouldAddButtonRepeat = () => {
        const shownRows = window.innerHeight / 73 - 3.5;
        return projectConnections.length > shownRows;
    };

    return loading ? (
        <PageSkeleton />
    ) : (
        <Grid container>
            <Grid item xs={2} />
            <Grid item xs={8} className={classNames(classes.root)}>
                <FormWrapper
                    title="editProjectConnections"
                    editable
                    editMode
                    disableSaveButtons
                >
                    <Box
                        className={classNames(
                            classes.flex,
                            classes.spaceBetween,
                            classes.paddedBottom
                        )}
                    >
                        <ConnectionsSearchAndSelect
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            storageSelection={storageSelection}
                            setStorageSelection={setStorageSelection}
                            connectionsLabels={selectConnections}
                        />
                        {renderNewFieldDropdown()}
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                {filterConnections().map(connection => (
                                    <ConnectionsTableRow
                                        key={connection.id}
                                        connection={{
                                            ...connection,
                                            storageLabel: selectConnections.find(
                                                item =>
                                                    item.value === connection.storage
                                            )?.name
                                        }}
                                        editMode
                                        handleRemoveConnection={removeConnection}
                                        handleOpenConnection={handleOpenConnection}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {shouldAddButtonRepeat() && (
                        <Box
                            className={classNames(
                                classes.flex,
                                classes.flexEnd,
                                classes.paddedTop
                            )}
                        >
                            {renderNewFieldDropdown()}
                        </Box>
                    )}
                    <ConnectionsPanel
                        panelTitle={title}
                        handleNewConnection={handleAddNewConnection}
                        panelIsOpen={panelIsOpen}
                        viewMode={viewMode}
                        newConnection={connectionConfig}
                        setPanelState={setPanelState}
                        selectConnections={selectConnections}
                    />
                </FormWrapper>
            </Grid>
            <Grid item xs={2} />
        </Grid>
    );
};

const mapStateToProps = state => ({
    projectId: state.projects.currentProject,
    loading: state.pages.settingsConnections.loading,
    connections: state.pages.settingsConnections.connections
});

const mapDispatchToProps = {
    getParameters: fetchParameters,
    getConnections: fetchConnections,
    update: updateConnection,
    create: createConnection,
    remove: deleteConnection
};

Connections.propTypes = {
    projectId: PropTypes.string,
    loading: PropTypes.bool,
    getParameters: PropTypes.func,
    getConnections: PropTypes.func,
    update: PropTypes.func,
    create: PropTypes.func,
    remove: PropTypes.func,
    connections: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
