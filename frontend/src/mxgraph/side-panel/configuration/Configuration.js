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

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    currentCell
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
    const [connectionPrevState, setConnectionState] = useState({});

    const duplicatedName = isDuplicatedName(state.name, graph, currentCell);
    const connection = useMemo(
        () =>
            state.connectionName
                ? omit(
                      connections.find(({ key }) => key === state.connectionName)
                          ?.value,
                      ['connectionName']
                  )
                : {},
        [connections, state.connectionName]
    );

    useEffect(() => {
        if (state.operation === READ || state.operation === WRITE) {
            selectedStorage(state.storage);
        }
        if (state.operation === DATETIME) {
            selectedStorage(state.operationType);
        }
    }, [state, selectedStorage]);

    useEffect(() => {
        setState(prevState => {
            if (prevState.operation === READ || prevState.operation === WRITE) {
                if (prevState.connectionName) {
                    return {
                        ...omit(prevState, keys(connectionPrevState)),
                        ...connection
                    };
                }
                if (prevState.connectionName === null) {
                    return omit(prevState, [
                        'connectionName',
                        ...keys(omit(connectionPrevState, 'storage'))
                    ]);
                }
            }
            return prevState;
        });
    }, [state.connectionName, connectionPrevState, setState, connection]);

    useEffect(() => setConnectionState(connection), [connection]);

    const handleChange = useCallback(
        (key, value) =>
            setState(prevState =>
                pickBy(
                    {
                        ...prevState,
                        [key]: value
                    },
                    v => v !== ''
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

    const handleSaveCell = inputValues => {
        if (inputValues.operation === CDC) {
            saveCell({
                ...inputValues,
                newDataset: get(inputEdges, '[0].source.id'),
                oldDataset: get(inputEdges, '[1].source.id')
            });
        } else if (inputValues.operation === JOIN) {
            saveCell({
                ...inputValues,
                leftDataset: get(inputEdges, '[0].source.id'),
                rightDataset: get(inputEdges, '[1].source.id')
            });
        } else {
            saveCell(inputValues);
        }
        setSwap(false);
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

    return (
        <Box className={classes.root}>
            {fieldInModal === 'connectionName' ? (
                <ConnectionsModal
                    {...modalProps()}
                    onSetValue={newValue => {
                        setShowModal(false);
                        setState({
                            ...state,
                            [fieldInModal]: `${newValue}`
                        });
                    }}
                />
            ) : (
                <ParametersModal
                    {...modalProps()}
                    ableToEdit={ableToEdit && !has(connection, fieldInModal)}
                />
            )}
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
                    connection={connection}
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
    currentCell: PropTypes.string
};

const mapStateToProps = state => ({
    params: state.pages.settingsParameters.params,
    connections: state.pages.settingsConnections.connections,
    currentCell: state.mxGraph.currentCell
});

export default compose(withStyles(styles), connect(mapStateToProps))(Configuration);
