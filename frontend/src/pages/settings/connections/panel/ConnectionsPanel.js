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
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Drawer,
    Toolbar,
    Typography,
    IconButton,
    TextField,
    Divider
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { get, isEmpty, isEqual, isFunction, pickBy } from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';

import useStyles from './ConnectionsPanel.Styles';
import toggleConfirmationWindow from '../../../../redux/actions/modalsActions';
import { getStorageComponent } from '../../../../mxgraph/side-panel/read-write-configuration/ReadWriteConfiguration';
import ParametersModal from '../../../../mxgraph/side-panel/read-write-configuration/parameters-modal';
import schemas from '../../../../mxgraph/side-panel/schemas';
import { READ } from '../../../../mxgraph/constants';
import { cleanUpConfiguration } from '../../../../mxgraph/side-panel/SidePanel';
import ConnectionsPanelButtons from './buttons';
import { validations } from '../../../../mxgraph/side-panel/render-configuration/validation';

const validateConnectionName = (connections, currentKey, nameState) => {
    if (
        connections?.find(
            ({ key, value }) =>
                nameState?.toLowerCase() === value?.connectionName?.toLowerCase() &&
                currentKey !== key
        )
    ) {
        return 'main:validation.projectConnections.nameDuplication';
    }
    if (/[^A-Za-z0-9\-_]/g.test(nameState)) {
        return 'main:validation.projectConnections.nameSymbols';
    }
    if (nameState?.length > 50) {
        return 'main:validation.projectConnections.nameLength';
    }
    return '';
};

// eslint-disable-next-line complexity
const ConnectionsPanel = ({
    panelIsOpen,
    setPanelState,
    newConnection,
    viewMode,
    confirmationWindow,
    handleNewConnection,
    handlePingConnection,
    selectConnections,
    panelTitle,
    connections,
    uploading,
    pingingConnections
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [connectionState, setConnectionState] = useState({ ...newConnection });
    const [showModal, setShowModal] = useState(false);
    const [fieldInModal, setFieldInModal] = useState(null);
    const schema = get(schemas, READ, []);
    const invalidConnectionName = validateConnectionName(
        connections,
        connectionState.key,
        connectionState.value?.connectionName
    );

    const openModal = openedField => {
        setFieldInModal(openedField);
        setShowModal(true);
    };

    useEffect(() => {
        if (newConnection) {
            setConnectionState({ ...newConnection });
        }
    }, [newConnection]);

    const setState = useCallback(
        value =>
            setConnectionState(prevState => ({
                ...prevState,
                value: isFunction(value) ? value(prevState.value) : value
            })),
        [setConnectionState]
    );

    const handleChange = useCallback(
        event => {
            if (event.persist) {
                event.persist();
            }
            setConnectionState(prevState => ({
                ...prevState,
                value: pickBy(
                    {
                        ...prevState.value,
                        [event.target.name]: event.target.value
                    },
                    (v, k) =>
                        k === 'option.kafka.ssl.endpoint.identification.algorithm' ||
                        v !== ''
                )
            }));
        },
        [setConnectionState]
    );

    const saveConnection = () =>
        panelTitle === 'Edit'
            ? handleNewConnection({
                  key: connectionState.key,
                  value: cleanUpConfiguration(connectionState.value, schema)
              })
            : handleNewConnection({
                  value: cleanUpConfiguration(connectionState.value, schema)
              });

    const pingConnection = () =>
        handlePingConnection({
            key: connectionState.value?.connectionName,
            value: connectionState.value
        });

    const saveIsDisabled = () => {
        const { value: connectionValue = {} } = connectionState;
        const nameValidate =
            !connectionValue.connectionName || !!invalidConnectionName;
        const validate = validations[connectionValue.storage];
        return (
            nameValidate ||
            !connectionValue.storage ||
            isEqual(
                newConnection.value,
                cleanUpConfiguration(connectionValue, schema)
            ) ||
            validate({ ...connectionValue, isConnectionPage: true })
        );
    };

    const isPingable = () =>
        !isEmpty(connectionState.value?.connectionName) &&
        !isEmpty(connectionState.value?.storage);

    const confirmCancel = () => {
        if (
            panelIsOpen &&
            !isEqual(
                newConnection.value,
                cleanUpConfiguration(connectionState.value, schema)
            )
        ) {
            confirmationWindow({
                body: `${t('main:unsavedChanges.leaveWithUnsavedChanges')}`,
                callback: () => {
                    setPanelState(false);
                    setConnectionState({ ...newConnection });
                }
            });
        } else {
            setPanelState(false);
            setConnectionState({ ...newConnection });
        }
    };

    const renderStorageComponent = name => {
        const Comp = getStorageComponent(name);

        return (
            <Comp
                ableToEdit={!viewMode && panelIsOpen && !uploading}
                inputValues={connectionState.value}
                setState={setState}
                handleInputChange={handleChange}
                openModal={openModal}
                connectionPage
            />
        );
    };

    return (
        <div className={classes.root}>
            <Drawer open={panelIsOpen} anchor="right" variant="persistent">
                <Toolbar />
                <div className={classes.content}>
                    <Box className={classes.form}>
                        <Box className={classes.header}>
                            <Typography variant="h6">
                                {t(`setting:connection.${panelTitle}`)}
                            </Typography>
                            <IconButton
                                className={classes.leftAuto}
                                disabled={uploading}
                                onClick={confirmCancel}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box className={classes.fieldsRoot}>
                            <ParametersModal
                                display={showModal}
                                ableToEdit={!viewMode && !uploading}
                                onClose={() => setShowModal(false)}
                                onSetValue={newValue => {
                                    setShowModal(false);
                                    setConnectionState({
                                        ...connectionState,
                                        value: {
                                            ...connectionState.value,
                                            [fieldInModal]: `#${newValue}#`
                                        }
                                    });
                                }}
                                currentValue={get(
                                    connectionState.value,
                                    fieldInModal,
                                    ''
                                )}
                            />
                            <Box>
                                <TextField
                                    disabled={viewMode || uploading || !panelIsOpen}
                                    label={t('setting:connection.Name')}
                                    placeholder={t('setting:connection.Name')}
                                    variant="outlined"
                                    className={classes.nameField}
                                    fullWidth
                                    name="connectionName"
                                    value={
                                        connectionState.value?.connectionName || ''
                                    }
                                    onChange={handleChange}
                                    error={!!invalidConnectionName && panelIsOpen}
                                    helperText={
                                        panelIsOpen ? t(invalidConnectionName) : ''
                                    }
                                    required
                                />
                                <Autocomplete
                                    disabled={viewMode || uploading || !panelIsOpen}
                                    name="storage"
                                    options={selectConnections}
                                    getOptionLabel={option => option.name || option}
                                    value={
                                        selectConnections.find(
                                            ({ value }) =>
                                                value ===
                                                connectionState.value?.storage
                                        ) || null
                                    }
                                    onChange={(e, newValue) =>
                                        handleChange({
                                            target: {
                                                name: 'storage',
                                                value: newValue?.value
                                            }
                                        })
                                    }
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            margin="normal"
                                            placeholder={t(
                                                'setting:connection.Storage'
                                            )}
                                            label={t('setting:connection.Storage')}
                                            required
                                            className={classes.storageField}
                                        />
                                    )}
                                />
                                <Divider />
                                {connectionState.value?.storage &&
                                    renderStorageComponent(
                                        connectionState.value.storage
                                    )}
                            </Box>
                            <ConnectionsPanelButtons
                                saveConnection={saveConnection}
                                saveIsDisabled={
                                    saveIsDisabled() || !panelIsOpen || viewMode
                                }
                                pingIsDisabled={!panelIsOpen || !isPingable()}
                                confirmCancel={confirmCancel}
                                pingConnection={pingConnection}
                                pinging={get(
                                    pingingConnections,
                                    connectionState.value?.connectionName,
                                    false
                                )}
                                uploading={uploading}
                            />
                        </Box>
                    </Box>
                </div>
            </Drawer>
        </div>
    );
};

ConnectionsPanel.propTypes = {
    panelIsOpen: PropTypes.bool,
    setPanelState: PropTypes.func,
    newConnection: PropTypes.object,
    viewMode: PropTypes.bool,
    confirmationWindow: PropTypes.func,
    handlePingConnection: PropTypes.func,
    handleNewConnection: PropTypes.func,
    selectConnections: PropTypes.array,
    panelTitle: PropTypes.string,
    connections: PropTypes.array,
    uploading: PropTypes.bool,
    pingingConnections: PropTypes.object
};

const mapStateToProps = state => ({
    pingingConnections: state.pages.settingsConnections.pingingConnections
});

const mapDispatchToProps = {
    confirmationWindow: toggleConfirmationWindow
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionsPanel);
