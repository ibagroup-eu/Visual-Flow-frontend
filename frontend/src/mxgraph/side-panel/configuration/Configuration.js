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

import React, { useCallback, useEffect, useState } from 'react';
import { get, has, isNil, keys, omit, pickBy, reduce } from 'lodash';
import { Box, TextField, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useTranslation } from 'react-i18next';

import styles from './Configuration.Styles';
import SaveCancelButtons from '../buttons';
import ParametersModal from '../read-write-configuration/parameters-modal';
import { CDC, DATETIME, JOIN, READ, WRITE } from '../../constants';
import ConnectionsModal from '../read-write-configuration/connections-modal/ConnectionsModal';
import SQLEditorModal from '../read-write-configuration/sql-editor-modal';
import { updateInteractiveJobSession } from '../../../redux/actions/mxGraphActions';
import history from '../../../utils/history';

const sqlEditorFields = {
    query: { config: 'readConfiguration', name: 'query' },
    statement: { config: 'transformConfiguration', name: 'Output' },
    'option.dbtable': { config: 'readConfiguration', name: 'optiondbtable' }
};

export const isDuplicatedName = (stageName, graph, currentCell) => {
    if (!isNil(stageName)) {
        const cells = Object.values(graph.getModel().cells);

        const currentGraphCells = cells
            ?.filter(({ id }) => currentCell !== id)
            .map(({ value: { attributes } = {} }) => attributes?.name?.nodeValue);

        return currentGraphCells.some(
            name => name?.toLowerCase() === stageName?.toLowerCase()
        );
    }
    return false;
};

const Configuration = ({
    ableToEdit,
    configuration,
    saveCell,
    setPanelDirty,
    isDisabled,
    Component,
    classes,
    swapEdges,
    graph,
    sidePanelIsOpen,
    selectedStorage,
    params,
    connections,
    state,
    setState,
    currentCell,
    data: { definition },
    interactiveMode,
    updateJobSession,
    runId
}) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [fieldInModal, setFieldInModal] = useState(null);
    const [swap, setSwap] = useState(false);

    const selectedCell = graph.getSelectionCell();
    const inputEdges = graph.getIncomingEdges(selectedCell);
    const edgeLabels = reduce(
        inputEdges,
        (result, edge) => ({
            ...result,
            [get(edge, 'value.attributes.text.value', '')]: get(
                edge,
                'source.value.attributes.name.value',
                ''
            )
        }),
        {}
    );
    const [connectionState, setConnectionState] = useState({});

    const duplicatedName = isDuplicatedName(state.name, graph, currentCell);

    useEffect(() => {
        if (state.operation === READ || state.operation === WRITE) {
            selectedStorage(state.storage);
        }
        if (state.operation === DATETIME) {
            selectedStorage(state.operationType);
        }
    }, [state, selectedStorage]);

    useEffect(() => {
        const connection = state.connectionName
            ? omit(
                  connections.find(
                      ({ value }) => value.connectionName === state.connectionName
                  )?.value,
                  ['connectionName']
              )
            : {};

        setConnectionState(connection);
    }, [connections, state.connectionName]);

    useEffect(() => {
        if (state.connectionName === null) {
            setState(prevState => {
                if (prevState.operation === READ || prevState.operation === WRITE) {
                    return omit(prevState, [
                        'connectionId',
                        'connectionName',
                        ...keys(omit(connectionState, 'storage'))
                    ]);
                }

                return prevState;
            });
        }
    }, [state.connectionName, connectionState, setState]);

    const handleChange = useCallback(
        (key, value) =>
            setState(prevState =>
                pickBy(
                    {
                        ...prevState,
                        [key]: value
                    },
                    (v, k) =>
                        k === 'option.kafka.ssl.endpoint.identification.algorithm' ||
                        v !== ''
                )
            ),
        [setState]
    );

    const openModal = openedField => {
        setFieldInModal(openedField);
        setShowModal(true);
    };

    const handleSwap = () => {
        if (state.operation === CDC) {
            const temp = state.newDataset;
            setState(prevState =>
                pickBy(
                    {
                        ...prevState,
                        newDataset: state.oldDataset,
                        oldDataset: temp
                    },
                    v => v !== ''
                )
            );
        } else if (state.operation === JOIN) {
            const temp = state.leftDataset;
            setState(prevState =>
                pickBy(
                    {
                        ...prevState,
                        leftDataset: state.rightDataset,
                        rightDataset: temp
                    },
                    v => v !== ''
                )
            );
        }
        swapEdges();
        setSwap(prevState => !prevState);
    };

    const cancelChanges = () => {
        setState(configuration);
        setPanelDirty(false);
        if (swap) {
            handleSwap();
        }
    };

    const handleSaveCell = async inputValues => {
        const currentPath = history.location.pathname.split('/');
        const currentProject = currentPath.slice(-2, -1)[0];
        const currentJob = currentPath.slice(-1)[0];

        let savedCell;
        if (inputValues.operation === CDC) {
            savedCell = {
                ...inputValues,
                newDataset: get(inputEdges, '[0].source.id'),
                oldDataset: get(inputEdges, '[1].source.id')
            };
        } else if (inputValues.operation === JOIN) {
            savedCell = {
                ...inputValues,
                leftDataset: get(inputEdges, '[0].source.id'),
                rightDataset: get(inputEdges, '[1].source.id')
            };
        } else {
            savedCell = inputValues;
        }

        saveCell(savedCell);
        setSwap(false);

        if (interactiveMode && runId && definition) {
            const stageId = graph.getSelectionCell()?.id;

            const updatedStageData = definition.graph.find(el => el.id === stageId);

            if (updatedStageData) {
                updatedStageData.value = savedCell;
            }
            updateJobSession(currentProject, currentJob, runId, definition);
        }
    };

    const modalProps = () => ({
        ableToEdit,
        display: showModal,
        onClose: () => setShowModal(false),
        onSetValue: newValue => {
            setShowModal(false);
            setState(prevState => ({
                ...prevState,
                [fieldInModal]: `#${newValue}#`
            }));
        },
        onChange: handleChange,
        currentValue: get(state, fieldInModal, '')
    });

    const handleChangeConnection = newValue => {
        setShowModal(false);
        setState(prevState => {
            const { value: connection, key: connectionId } = connections.find(
                ({ value }) => value.connectionName === newValue
            );
            let newState = prevState;
            if (prevState.operation === READ || prevState.operation === WRITE) {
                newState = {
                    ...omit(prevState, keys(connectionState)),
                    ...connection
                };
            }
            setConnectionState(connection);
            return {
                ...newState,
                [fieldInModal]: `${newValue}`,
                connectionId
            };
        });
    };

    const handleSQLUpdate = newValue => {
        setShowModal(false);
        setState(prevState => ({ ...prevState, [fieldInModal]: newValue }));
    };

    const renderModalComponent = fieldName => {
        const editorField = sqlEditorFields[fieldName];

        if (editorField) {
            return (
                <SQLEditorModal
                    {...modalProps()}
                    title={t(
                        `jobDesigner:${editorField.config}.${editorField.name}`
                    )}
                    onSetValue={handleSQLUpdate}
                    storageName={state.storage}
                    ableToEdit={ableToEdit && !has(connectionState, fieldInModal)}
                />
            );
        }

        if (fieldName === 'connectionName') {
            return (
                <ConnectionsModal
                    {...modalProps()}
                    onSetValue={handleChangeConnection}
                />
            );
        }

        return (
            <ParametersModal
                {...modalProps()}
                ableToEdit={ableToEdit && !has(connectionState, fieldInModal)}
            />
        );
    };

    return (
        <Box className={classes.root}>
            {renderModalComponent(fieldInModal)}
            <Box className={classes.fieldWrapper}>
                <TextField
                    disabled={!ableToEdit || !sidePanelIsOpen}
                    label={t('jobDesigner:readConfiguration.Name')}
                    placeholder={t('jobDesigner:readConfiguration.Name')}
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={state.name || ''}
                    onChange={event =>
                        handleChange(event.target.name, event.target.value)
                    }
                    required
                    helperText={
                        duplicatedName &&
                        t('main:validation.projectConnections.nameDuplication')
                    }
                    error={!!duplicatedName}
                />

                <Component
                    ableToEdit={ableToEdit && sidePanelIsOpen}
                    state={state}
                    setState={setState}
                    onChange={handleChange}
                    openModal={openModal}
                    edgeLabels={edgeLabels}
                    handleSwap={handleSwap}
                    params={params}
                    connection={connectionState}
                    stageId={graph.getSelectionCell()?.id}
                />
            </Box>
            <SaveCancelButtons
                ableToEdit={ableToEdit}
                saveCell={() => handleSaveCell(state)}
                cancelChanges={cancelChanges}
                isDisabled={isDisabled(state) || duplicatedName}
            />
        </Box>
    );
};

Configuration.propTypes = {
    ableToEdit: PropTypes.bool,
    saveCell: PropTypes.func,
    setPanelDirty: PropTypes.func,
    isDisabled: PropTypes.func,
    configuration: PropTypes.object,
    Component: PropTypes.elementType,
    classes: PropTypes.object,
    swapEdges: PropTypes.func,
    graph: PropTypes.object,
    sidePanelIsOpen: PropTypes.bool,
    selectedStorage: PropTypes.func,
    params: PropTypes.array,
    connections: PropTypes.array,
    state: PropTypes.object,
    setState: PropTypes.func,
    currentCell: PropTypes.string,
    data: PropTypes.object,
    interactiveMode: PropTypes.bool,
    updateJobSession: PropTypes.func,
    runId: PropTypes.string
};

const mapStateToProps = state => ({
    params: state.pages.settingsParameters.params,
    connections: state.pages.settingsConnections.connections,
    currentCell: state.mxGraph.currentCell,
    data: state.mxGraph.data,
    interactiveMode: state.mxGraph.interactive.interactiveMode,
    runId: state.pages.jobs.runId
});

const mapDispatchToProps = {
    updateJobSession: updateInteractiveJobSession
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(Configuration);
