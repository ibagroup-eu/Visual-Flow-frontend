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
import { get, isEqual, pickBy } from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useStyles from './ConnectionsPanel.Styles';
import toggleConfirmationWindow from '../../../../redux/actions/modalsActions';
import { getStorageComponent } from '../../../../mxgraph/side-panel/read-write-configuration/ReadWriteConfiguration';
import ParametersModal from '../../../../mxgraph/side-panel/read-write-configuration/parameters-modal';
import schemas from '../../../../mxgraph/side-panel/schemas';
import { READ } from '../../../../mxgraph/constants';
import { cleanUpConfiguration } from '../../../../mxgraph/side-panel/SidePanel';
import ConnectionsPanelButtons from '../connections-panel-buttons.js/ConnectionsPanelButtons';

const ConnectionsPanel = ({
    panelIsOpen,
    setPanelState,
    newConnection,
    viewMode,
    confirmationWindow,
    handleNewConnection,
    selectConnections,
    panelTitle
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [connectionState, setConnectionState] = useState({ ...newConnection });
    const [showModal, setShowModal] = useState(false);
    const [fieldInModal, setFieldInModal] = useState(null);
    const schema = get(schemas, READ, []);

    const openModal = openedField => {
        setFieldInModal(openedField);
        setShowModal(true);
    };

    useEffect(() => {
        if (newConnection) {
            setConnectionState({ ...newConnection });
        }
    }, [newConnection]);

    const handleChange = event => {
        if (event.persist) {
            event.persist();
        }
        setConnectionState(prevState =>
            pickBy(
                {
                    ...prevState,
                    [event.target.name]: event.target.value
                },
                v => v !== ''
            )
        );
    };

    const saveConnection = () => {
        handleNewConnection(cleanUpConfiguration(connectionState, schema));
        setPanelState(false);
    };

    const saveIsDisabled = () => {
        if (
            !connectionState.connectionName ||
            (connectionState.storage === 's3' && !connectionState.anonymousAccess) ||
            !connectionState.storage
        ) {
            return true;
        }

        return (
            panelIsOpen &&
            (isEqual(newConnection, cleanUpConfiguration(connectionState, schema)) ||
                viewMode)
        );
    };

    const confirmCancel = () => {
        if (
            panelIsOpen &&
            !isEqual(newConnection, cleanUpConfiguration(connectionState, schema))
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
                ableToEdit={!viewMode && panelIsOpen}
                inputValues={connectionState}
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
                                onClick={confirmCancel}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box className={classes.fieldsRoot}>
                            <ParametersModal
                                display={showModal}
                                ableToEdit={!viewMode}
                                onClose={() => setShowModal(false)}
                                onSetValue={newValue => {
                                    setShowModal(false);
                                    setConnectionState({
                                        ...connectionState,
                                        [fieldInModal]: `#${newValue}#`
                                    });
                                }}
                                currentValue={get(connectionState, fieldInModal, '')}
                            />
                            <Box>
                                <TextField
                                    disabled={viewMode || !panelIsOpen}
                                    label={t('setting:connection.Name')}
                                    placeholder={t('setting:connection.Name')}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    name="connectionName"
                                    value={connectionState.connectionName || ''}
                                    onChange={handleChange}
                                />
                                <Autocomplete
                                    disabled={viewMode || !panelIsOpen}
                                    name="storage"
                                    options={selectConnections}
                                    getOptionLabel={option => option.name || option}
                                    value={
                                        selectConnections.find(
                                            ({ value }) =>
                                                value === connectionState.storage
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
                                        />
                                    )}
                                />
                                <Divider />
                                {connectionState?.storage &&
                                    renderStorageComponent(connectionState.storage)}
                            </Box>
                            <ConnectionsPanelButtons
                                saveConnection={saveConnection}
                                saveIsDisabled={saveIsDisabled() || !panelIsOpen}
                                confirmCancel={confirmCancel}
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
    handleNewConnection: PropTypes.func,
    selectConnections: PropTypes.array,
    panelTitle: PropTypes.string
};

const mapDispatchToProps = {
    confirmationWindow: toggleConfirmationWindow
};

export default connect(null, mapDispatchToProps)(ConnectionsPanel);
