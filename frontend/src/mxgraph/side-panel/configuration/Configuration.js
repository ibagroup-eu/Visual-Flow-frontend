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
import { isEqual, pickBy, get } from 'lodash';
import { Box, TextField, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useTranslation } from 'react-i18next';

import styles from './Configuration.Styles';
import SaveCancelButtons from '../buttons';
import ParametersModal from '../read-write-configuration/parameters-modal';
import { JOIN, CDC } from '../../constants';

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
    params
}) => {
    const { t } = useTranslation();
    const [state, setState] = useState({ ...configuration });
    const [showModal, setShowModal] = useState(false);
    const [fieldInModal, setFieldInModal] = useState(null);
    const [swap, setSwap] = useState(false);

    const currentCell = graph.getSelectionCell();
    const inputEdges = graph.getIncomingEdges(currentCell);
    const edgeLabels = inputEdges.map(edge =>
        get(edge, 'source.value.attributes.name.value', '')
    );

    useEffect(() => {
        setState(configuration);
    }, [configuration, sidePanelIsOpen]);

    useEffect(() => {
        setPanelDirty(!isEqual(configuration, state));
        if (state.operation === 'READ' || state.operation === 'WRITE') {
            selectedStorage(state.storage);
        }
    }, [state]);

    const handleChange = (key, value) =>
        setState(prevState =>
            pickBy(
                {
                    ...prevState,
                    [key]: value
                },
                v => v !== ''
            )
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
        setState({ ...configuration });
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

    return (
        <Box className={classes.root}>
            <ParametersModal
                display={showModal}
                ableToEdit={ableToEdit}
                onClose={() => setShowModal(false)}
                onSetValue={newValue => {
                    setShowModal(false);
                    setState({
                        ...state,
                        [fieldInModal]: `#${newValue}#`
                    });
                }}
                currentValue={get(state, fieldInModal, '')}
            />
            <Box>
                <TextField
                    disabled={!ableToEdit}
                    label={t('jobDesigner:readConfiguration.Name')}
                    placeholder={t('jobDesigner:readConfiguration.Name')}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="name"
                    value={state.name || ''}
                    onChange={event =>
                        handleChange(event.target.name, event.target.value)
                    }
                    required
                />
                <Component
                    ableToEdit={ableToEdit}
                    state={state}
                    onChange={handleChange}
                    openModal={openModal}
                    edgeLabels={edgeLabels}
                    handleSwap={handleSwap}
                    params={params}
                />
            </Box>
            <SaveCancelButtons
                ableToEdit={ableToEdit}
                saveCell={() => handleSaveCell(state)}
                cancelChanges={cancelChanges}
                isDisabled={isDisabled(state)}
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
    params: PropTypes.array
};

const mapStateToProps = state => ({
    sidePanelIsOpen: state.mxGraph.sidePanelIsOpen,
    params: state.pages.settingsParameters.data.params
});

export default compose(withStyles(styles), connect(mapStateToProps))(Configuration);
