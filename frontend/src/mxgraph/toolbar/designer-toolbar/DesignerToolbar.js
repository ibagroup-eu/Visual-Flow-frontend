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
import { compose } from 'redux';
import { Toolbar, Divider } from '@material-ui/core';
import mxgraph from 'mxgraph';
import { withStyles } from '@material-ui/styles';

import { get, isEmpty, times } from 'lodash';
import styles from './DesignerToolbar.Styles';
import Zoom from '../zoom';
import addPropsToChildren from '../../../utils/addPropsToChildren';
import { JOIN, CDC, EDGE } from '../../constants';

const { mxEvent, mxUndoManager, mxEventObject } = mxgraph();

export class DesignerToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            undoManager: {},
            undoButtonsDisabling: { undo: true, redo: true }
        };
    }

    componentDidUpdate(prevProps) {
        const { graph, data } = this.props;
        if (prevProps.graph !== graph) {
            const undoManagerStartIndex = isEmpty(data.definition?.graph) ? 0 : 1;
            const undoManager = new mxUndoManager(25);
            undoManager.undo = this.undoManagerUndo();
            undoManager.redo = this.undoManagerRedo();
            const listener = (sender, event) => {
                const unnecessaryEdit =
                    event.getProperty('edit').changes.find(obj => {
                        let skipEdit = false;
                        skipEdit =
                            Object.getPrototypeOf(obj).constructor.name ===
                                'mxStyleChange' && !obj.cell.edge;
                        if (
                            Object.getPrototypeOf(obj).constructor.name ===
                            'mxValueChange'
                        ) {
                            skipEdit = this.edgeCheck(obj);
                        }
                        return skipEdit;
                    }) || false;
                if (
                    !(
                        unnecessaryEdit &&
                        event.getProperty('edit').changes.length === 1
                    )
                ) {
                    undoManager.undoableEditHappened(event.getProperty('edit'));
                    undoManagerStartIndex !== undoManager.indexOfNextAdd &&
                        this.setState({
                            undoButtonsDisabling: {
                                undo: false,
                                redo: true
                            }
                        });
                }
            };
            graph.getModel().addListener(mxEvent.UNDO, listener);
            graph.getView().addListener(mxEvent.UNDO, listener);
            this.setState({ undoManager });
        }
    }

    edgeCheck = obj =>
        get(obj, 'value.attributes.successPath.value', '') ===
            get(obj, 'previous.attributes.successPath.value', '') &&
        get(obj, 'value.attributes.operation.value', '') === EDGE;

    undoManagerChangedStage = history => {
        return history?.changes?.find(obj => {
            const mxGeometryCond =
                Object.getPrototypeOf(obj).constructor.name === 'mxGeometryChange' &&
                obj.previous.width !== obj.geometry.width;
            const mxStyleCond =
                Object.getPrototypeOf(obj).constructor.name === 'mxStyleChange' &&
                obj.cell.edge &&
                history.changes.length <= 1;
            return mxGeometryCond || mxStyleCond;
        });
    };

    lengthCheck = (obj, first = false, second = false, third = false) =>
        obj.length === first || obj.length === second || obj.length === third;

    joinCDCChange = (history, operationValue) =>
        history?.changes.find(
            obj =>
                Object.getPrototypeOf(obj).constructor.name === 'mxValueChange' &&
                (get(obj, operationValue, '') === JOIN ||
                    get(obj, operationValue, '') === CDC) &&
                this.lengthCheck(history.changes, 1, 6)
        );

    joinCDCChangedEdge = (history, index, joinCDCChange) =>
        history[index - 1]?.changes.find(obj => {
            let addedEdge = false;
            if (obj.child?.edge) {
                const JoinCDCEdge =
                    get(obj, 'child.value.attributes.text.value', '') !== '';
                addedEdge =
                    this.lengthCheck(history[index - 1].changes, 12, 14, 16) &&
                    JoinCDCEdge;
            }

            const deletedEdge =
                obj.child?.edge && history[index - 1].changes.length === 1;
            return joinCDCChange && (addedEdge || deletedEdge);
        });

    joinCDCDeletedEdge = (history, index, joinCDCChange) =>
        history[index - 1]?.changes.find(
            obj =>
                obj.child?.edge &&
                joinCDCChange &&
                history[index - 1].changes.length === 1
        );

    changedConfigurationCheck = history =>
        history?.changes.find(
            obj =>
                Object.getPrototypeOf(obj).constructor.name === 'mxValueChange' &&
                history.changes.length === 1
        );

    linkSwitchCheck = (obj, operationValue) => {
        if (
            get(obj, operationValue, null) === CDC ||
            get(obj, operationValue, null) === JOIN
        ) {
            const rightLink = get(
                obj,
                'previous.attributes.oldDataset.value',
                get(obj, 'previous.attributes.rightDataset.value', '')
            );
            const leftLink = get(
                obj,
                'value.attributes.newDataset.value',
                get(obj, 'value.attributes.leftDataset.value', '')
            );
            return rightLink === leftLink && rightLink !== '' && leftLink !== '';
        }
        return false;
    };

    undoButtonsDeactivation = (index, startIndex) => {
        const { setDirty } = this.props;
        if (index === startIndex) {
            setDirty(false);
            this.setState({
                undoButtonsDisabling: { redo: false, undo: true }
            });
        } else {
            setDirty(true);
            this.setState({
                undoButtonsDisabling: { undo: false, redo: false }
            });
        }
    };

    redoButtonsDeactivation = (index, startIndex, endIndex) => {
        const { setDirty } = this.props;
        if (startIndex !== index) {
            setDirty(true);
            this.setState({
                undoButtonsDisabling: {
                    undo: false,
                    redo: false
                }
            });
        }
        if (index === endIndex) {
            this.setState({
                undoButtonsDisabling: {
                    undo: false,
                    redo: true
                }
            });
        }
    };

    undoManagerUndo() {
        const { setUndoManagerConfig, data } = this.props;
        const that = this;
        const operationValue = 'cell.value.attributes.operation.value';
        // eslint-disable-next-line complexity
        return function undo() {
            const undoStartIndex = isEmpty(data.definition.graph) ? 0 : 1;
            while (this.indexOfNextAdd > undoStartIndex) {
                this.indexOfNextAdd -= 1;
                const changedConfiguration = that.changedConfigurationCheck(
                    this.history[this.indexOfNextAdd]
                );
                const joinCDCChangedEdge = that.joinCDCChangedEdge(
                    this.history,
                    this.indexOfNextAdd,
                    that.joinCDCChange(
                        this.history[this.indexOfNextAdd],
                        operationValue
                    )
                );
                const changedStage = that.undoManagerChangedStage(
                    this.history[this.indexOfNextAdd]
                );
                const edit = this.history[this.indexOfNextAdd];
                edit.undo();
                that.undoButtonsDeactivation(this.indexOfNextAdd, undoStartIndex);

                if (changedConfiguration) {
                    if (that.linkSwitchCheck(changedConfiguration, operationValue)) {
                        times(4, () => that.state.undoManager.undo());
                    }
                    setUndoManagerConfig(changedConfiguration);
                }

                if (changedStage || joinCDCChangedEdge) {
                    that.state.undoManager.undo();
                }

                if (edit.isSignificant()) {
                    this.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', edit));
                    break;
                }
            }
        };
    }

    undoManagerRedo() {
        const { setUndoManagerConfig, data } = this.props;
        const that = this;
        const operationValue = 'cell.value.attributes.operation.value';
        // eslint-disable-next-line complexity
        return function redo() {
            const redoStartIndex = isEmpty(data.definition.graph) ? 0 : 1;
            while (this.indexOfNextAdd < this.history.length) {
                const changedConfiguration = that.changedConfigurationCheck(
                    this.history[this.indexOfNextAdd]
                );
                const joinCDCChangedEdge = that.joinCDCChangedEdge(
                    this.history,
                    this.indexOfNextAdd + 1,
                    that.joinCDCChange(
                        this.history[this.indexOfNextAdd + 1],
                        operationValue
                    )
                );
                const changedStage = that.undoManagerChangedStage(
                    this.history[this.indexOfNextAdd + 1]
                );
                const edit = this.history[this.indexOfNextAdd];
                this.indexOfNextAdd += 1;
                edit.redo();
                that.redoButtonsDeactivation(
                    this.indexOfNextAdd,
                    redoStartIndex,
                    this.history.length
                );
                if (
                    that.linkSwitchCheck(
                        that.changedConfigurationCheck(
                            this.history[this.indexOfNextAdd + 3]
                        ),
                        operationValue
                    )
                ) {
                    times(4, () => that.state.undoManager.redo());
                }

                if (changedConfiguration) {
                    setUndoManagerConfig(changedConfiguration);
                }

                if (changedStage || joinCDCChangedEdge) {
                    that.state.undoManager.redo();
                }

                if (edit.isSignificant()) {
                    this.fireEvent(new mxEventObject(mxEvent.REDO, 'edit', edit));
                    break;
                }
            }
        };
    }

    renderChildren = () => {
        const { graph, children, data, setDirty } = this.props;
        const { undoManager: reversible, undoButtonsDisabling } = this.state;

        return addPropsToChildren(children, {
            graph,
            reversible,
            data,
            setDirty,
            undoButtonsDisabling
        });
    };

    render() {
        const { graph, classes, zoom } = this.props;

        return (
            <Toolbar disableGutters className={classes.toolbar}>
                <Zoom zoom={zoom} graph={graph} />
                <Divider orientation="vertical" flexItem />
                {this.renderChildren()}
            </Toolbar>
        );
    }
}

DesignerToolbar.propTypes = {
    graph: PropTypes.object,
    classes: PropTypes.object,
    children: PropTypes.array,
    zoom: PropTypes.func,
    setUndoManagerConfig: PropTypes.func,
    setDirty: PropTypes.func,
    data: PropTypes.object
};

export default compose(withStyles(styles))(DesignerToolbar);
