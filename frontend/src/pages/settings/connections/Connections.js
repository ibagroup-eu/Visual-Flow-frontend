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
import { reduce, get } from 'lodash';
import { useTranslation } from 'react-i18next';

import FormWrapper from '../../../components/form-wrapper';
import PropertySelect from '../../../components/property-select';
import { fetchParameters } from '../../../redux/actions/settingsParametersActions';
import {
    createConnection,
    fetchConnections,
    updateConnection,
    deleteConnection,
    pingConnection
} from '../../../redux/actions/settingsConnectionsActions';
import { PageSkeleton } from '../../../components/skeleton';
import ConnectionsTableRow from './table';
import useStyles from './Connections.Styles';
import { STORAGES } from '../../../mxgraph/constants';
import ConnectionsPanel from './panel';
import ConnectionsSearchAndSelect from '../../../mxgraph/side-panel/read-write-configuration/connections-modal/searchAndSelect/ConnectionsSearchAndSelect';
import { stableSort, getComparator } from '../../../utils/sort';

const excludedStorages = ['stdout', 'cluster', 'dataframe', 'request'];

export const selectConnections = reduce(
    stableSort(STORAGES, getComparator('asc', 'label')),
    (result, { value, label }) => {
        if (!excludedStorages.includes(value)) {
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
    ping,
    create,
    remove,
    connections,
    pingingConnections,
    deletingConnections,
    uploading,
    editable
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
    }, [getConnections, getParameters, projectId]);

    useEffect(() => {
        setProjectConnections(connections);
    }, [connections]);

    const removeConnection = removedKey => remove(projectId, removedKey);

    const handlePingConnection = connection => ping(projectId, connection);

    const handleClickNewFieldType = event => {
        setTitle('Configuration');
        setConnectionConfig({ value: { storage: event.target.value } });
        setPanelState(true);
        setViewMode(false);
    };

    const handleAddNewConnection = connection => {
        title === 'Edit'
            ? update(projectId, connection)
            : create(projectId, connection);
        setPanelState(false);
    };

    const handleOpenConnection = (connection, editMode) => {
        setTitle(editMode ? 'Edit' : 'View');
        setConnectionConfig(connection);
        setViewMode(!editMode);
        setPanelState(true);
    };

    const renderNewFieldDropdown = () =>
        editable && (
            <PropertySelect
                handleChange={handleClickNewFieldType}
                placeholder={t('main:button.AddConnection')}
                properties={selectConnections}
                isConnections
            />
        );

    const filterConnections = () =>
        projectConnections.filter(
            ({ value }) =>
                value?.connectionName
                    ?.toLowerCase()
                    .indexOf(searchValue.toLowerCase()) !== -1 &&
                (!storageSelection || value.storage === storageSelection)
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
                                {filterConnections().map(({ key, value }) => (
                                    <ConnectionsTableRow
                                        key={key}
                                        connection={{
                                            key,
                                            value: {
                                                ...value,
                                                storageLabel: selectConnections.find(
                                                    item =>
                                                        item.value === value.storage
                                                )?.name
                                            }
                                        }}
                                        pinging={get(
                                            pingingConnections,
                                            value.connectionName,
                                            false
                                        )}
                                        deleting={get(
                                            deletingConnections,
                                            key,
                                            false
                                        )}
                                        connections={projectConnections}
                                        handleRemoveConnection={removeConnection}
                                        handleOpenConnection={handleOpenConnection}
                                        handlePingConnection={handlePingConnection}
                                        editableMode={editable}
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
                        handlePingConnection={handlePingConnection}
                        panelIsOpen={panelIsOpen}
                        viewMode={viewMode}
                        newConnection={connectionConfig}
                        setPanelState={setPanelState}
                        selectConnections={selectConnections}
                        connections={projectConnections}
                        uploading={uploading}
                        projectId={projectId}
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
    connections: state.pages.settingsConnections.connections,
    pingingConnections: state.pages.settingsConnections.pingingConnections,
    deletingConnections: state.pages.settingsConnections.deletingConnections,
    uploading: state.pages.settingsConnections.uploading,
    editable: state.pages.settingsConnections.editable
});

const mapDispatchToProps = {
    getParameters: fetchParameters,
    getConnections: fetchConnections,
    update: updateConnection,
    create: createConnection,
    remove: deleteConnection,
    ping: pingConnection
};

Connections.propTypes = {
    projectId: PropTypes.string,
    loading: PropTypes.bool,
    getParameters: PropTypes.func,
    getConnections: PropTypes.func,
    update: PropTypes.func,
    create: PropTypes.func,
    remove: PropTypes.func,
    ping: PropTypes.func,
    connections: PropTypes.array,
    pingingConnections: PropTypes.object,
    deletingConnections: PropTypes.object,
    uploading: PropTypes.bool,
    editable: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
