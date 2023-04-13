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
import mxgraph from 'mxgraph';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/styles';
import {
    Box,
    Drawer,
    Toolbar,
    Typography,
    IconButton,
    withTheme
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CloseIcon from '@material-ui/icons/Close';
import { forEach, get, isEqual } from 'lodash';
import {
    setCurrentCell,
    setGraphDirty,
    setSidePanel,
    setSidePanelDirty
} from '../../redux/actions/mxGraphActions';
import toggleConfirmationWindow from '../../redux/actions/modalsActions';
import stageLabels from '../stageLabels';
import styles from './SidePanel.Styles';
import StageModal from '../../components/stage-modals/stage';
import addPropsToChildren from '../../utils/addPropsToChildren';
import { EDGE } from '../constants';
import schemas from './schemas';

const { mxRectangle, mxConstants } = mxgraph();

export const CELL_WIDTH = 224;

export const CELL_HEIGHT = 144;

export const cleanUpConfiguration = (fields, schema) => {
    let result = {};
    Object.entries(fields).forEach(([key, value]) => {
        const schemaLine = schema.find(v => new RegExp(`^${v.field}$`).test(key));
        const conditions = get(schemaLine, 'conditions', undefined);
        if (!conditions) {
            result = { ...result, [key]: value };
        } else {
            conditions.forEach(condition => {
                if (
                    Object.entries(condition).every(
                        ([field, val]) => get(fields, field) === val
                    )
                ) {
                    result = { ...result, [key]: value };
                }
            });
        }
    });
    return result;
};

export class SidePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            configuration: {},
            showModal: false,
            storageValue: ''
        };
    }

    componentDidMount() {
        const { setCurrentCell: setCell } = this.props;
        setCell('');
    }

    componentDidUpdate(prevProps) {
        const {
            graph,
            currentCell,
            undoManagerConfig,
            setUndoManagerConfig
        } = this.props;
        if (prevProps.currentCell !== currentCell) {
            const selectedCell = graph.getSelectionCell();
            const results = {};
            if (selectedCell) {
                Object.keys(selectedCell.value.attributes).forEach(attrKey => {
                    const attribute = selectedCell.value.attributes[attrKey];
                    results[attribute.nodeName] = attribute.nodeValue;
                });
                this.setState({
                    configuration: { ...results }
                });
            }
        }
        if (
            !isEqual(undoManagerConfig, {}) &&
            get(undoManagerConfig, 'value.attributes.operation.value', null) !==
                EDGE &&
            currentCell === undoManagerConfig.cell?.id
        ) {
            const results = Object.entries(
                undoManagerConfig.value.attributes
            ).reduce(
                (acc, attrKey) => ({
                    ...acc,
                    [attrKey[1].nodeName]: attrKey[1].nodeValue
                }),
                {}
            );

            this.setState({
                configuration: { ...results }
            });
            setUndoManagerConfig({});
        }
    }

    componentWillUnmount() {
        const {
            setSidePanel: toggleSidePanel,
            setCurrentCell: setCell
        } = this.props;
        toggleSidePanel(false);
        setCell('');
    }

    graphChanged = () => {
        const {
            graph,
            data: {
                definition: { graph: dataGraph = {} }
            }
        } = this.props;
        let currentGraphCells = {};
        let initialGraphCells = {};

        forEach(dataGraph, dataCell => {
            initialGraphCells = {
                ...initialGraphCells,
                [dataCell.id]: dataCell.value
            };
        });

        forEach(graph.getModel().cells, modelCell => {
            const { value, value: { attributes } = {} } = modelCell;
            if (value) {
                const values = Object.keys(attributes).reduce(
                    (acc, attrKey) => ({
                        ...acc,
                        [attributes[attrKey].nodeName]: attributes[attrKey].nodeValue
                    }),
                    {}
                );
                currentGraphCells = {
                    ...currentGraphCells,
                    [modelCell.id]: values
                };
            }
        });

        return !isEqual(initialGraphCells, currentGraphCells);
    };

    saveCell = configuration => {
        const commonSchema = get(schemas, 'COMMON_SCHEMA', []);
        const schema = get(schemas, configuration.operation, []);
        const cleanConfiguration = cleanUpConfiguration(configuration, [
            ...commonSchema,
            ...schema
        ]);

        const { graph, currentCell, setDirty, setPanelDirty, theme } = this.props;
        const { configuration: stateConfiguration } = this.state;

        const cell = graph.model.getCell(currentCell);
        // update the cell
        if (!isEqual(cleanConfiguration, stateConfiguration)) {
            const obj = stageLabels(cleanConfiguration);
            graph.model.setValue(cell, obj);
        }

        if (cleanConfiguration.operation === EDGE) {
            graph.setCellStyles(
                mxConstants.STYLE_STROKECOLOR,
                cleanConfiguration.successPath === 'False'
                    ? theme.palette.error.light
                    : theme.palette.success.light,
                [cell]
            );
        } else {
            const newCellSize = new mxRectangle(
                cell.geometry.x,
                cell.geometry.y,
                CELL_WIDTH,
                CELL_HEIGHT
            );
            graph.resizeCell(cell, newCellSize);
        }
        setDirty(this.graphChanged());
        this.setState({
            configuration: cleanConfiguration
        });
        setPanelDirty(false);
        this.props.setSidePanel(false);
    };

    storageValueHandler = currentState => {
        if (this.state.storageValue !== currentState) {
            this.setState({
                storageValue: currentState
            });
        }
    };

    renderChildren = () => {
        const { setPanelDirty, graph, children } = this.props;
        const { configuration } = this.state;

        return addPropsToChildren(children, {
            graph,
            configuration,
            setPanelDirty,
            saveCell: this.saveCell,
            selectedStorage: this.storageValueHandler
        });
    };

    render() {
        const {
            t,
            sidePanelIsOpen,
            classes,
            sidePanelIsDirty,
            confirmationWindow,
            setSidePanel: toggleSidePanel
        } = this.props;
        const { configuration, showModal, storageValue } = this.state;

        return (
            <div className={classes.root}>
                <Drawer open={sidePanelIsOpen} anchor="right" variant="persistent">
                    <StageModal
                        display={showModal}
                        stageName={configuration.operation}
                        title={t(`jobDesigner:palette.${configuration.operation}`)}
                        onClose={() => this.setState({ showModal: false })}
                        currentStorage={storageValue}
                    />
                    <Toolbar />
                    <div className={classes.content}>
                        <Box className={classes.form}>
                            <Box className={classes.separated}>
                                <Typography variant="h6">
                                    {t('jobDesigner:Configuration')}
                                </Typography>
                                <InfoOutlinedIcon
                                    className={classes.infoIcon}
                                    onClick={() =>
                                        this.setState({ showModal: true })
                                    }
                                />
                                <IconButton
                                    className={classes.leftAuto}
                                    onClick={() => {
                                        if (sidePanelIsDirty) {
                                            confirmationWindow({
                                                body: `${t(
                                                    'main:unsavedChanges.leaveWithUnsavedChanges'
                                                )}`,
                                                callback: () =>
                                                    toggleSidePanel(false)
                                            });
                                        } else {
                                            toggleSidePanel(false);
                                        }
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            {this.renderChildren()}
                        </Box>
                    </div>
                </Drawer>
            </div>
        );
    }
}

SidePanel.propTypes = {
    sidePanelIsOpen: PropTypes.bool,
    setSidePanel: PropTypes.func,
    t: PropTypes.func,
    classes: PropTypes.object,
    currentCell: PropTypes.string,
    data: PropTypes.object,
    graph: PropTypes.object,
    setCurrentCell: PropTypes.func,
    setDirty: PropTypes.func,
    setPanelDirty: PropTypes.func,
    children: PropTypes.array,
    sidePanelIsDirty: PropTypes.bool,
    confirmationWindow: PropTypes.func.isRequired,
    undoManagerConfig: PropTypes.object,
    setUndoManagerConfig: PropTypes.func,
    theme: PropTypes.object
};

const mapStateToProps = state => ({
    data: state.mxGraph.data,
    sidePanelIsOpen: state.mxGraph.sidePanelIsOpen,
    currentCell: state.mxGraph.currentCell,
    sidePanelIsDirty: state.mxGraph.sidePanelIsDirty
});

const mapDispatchToProps = {
    setDirty: setGraphDirty,
    setPanelDirty: setSidePanelDirty,
    confirmationWindow: toggleConfirmationWindow,
    setSidePanel,
    setCurrentCell
};

export default compose(
    withTheme,
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(withTranslation()(SidePanel));
