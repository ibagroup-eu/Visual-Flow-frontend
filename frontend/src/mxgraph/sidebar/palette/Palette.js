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

import mxgraph from 'mxgraph';
import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { compose } from 'redux';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import { jobStages, jobStagesByType } from '../../jobStages';
import styles from './Palette.Styles';
import StageWithIcon from '../stage-icon/StageWithIcon';
import stageLabels from '../../stageLabels';
import { pipelinesStages, pipelinesStagesByType } from '../../pipelinesStages';
import history from '../../../utils/history';

const { mxEvent, mxUtils, mxDragSource } = mxgraph();

class Palette extends React.Component {
    constructor(props) {
        super(props);
        const currentPath = history.location.pathname.split('/')[1];
        this.state = {
            refSidebar: React.createRef(),
            stages: currentPath === 'jobs' ? jobStages : pipelinesStages,
            stagesByType:
                currentPath === 'jobs' ? jobStagesByType : pipelinesStagesByType
        };
    }

    componentDidMount() {
        this.makeDraggable();
    }

    // position when drag element
    graphF = event => {
        const { graph } = this.props;
        const x = mxEvent.getClientX(event);
        const y = mxEvent.getClientY(event);
        const elem = document.elementFromPoint(x, y);
        if (mxUtils.isAncestorNode(graph.container, elem)) {
            return graph;
        }
        return null;
    };

    // add new cells
    addCell = (graph, event, target, x, y, type) => {
        const { setDirty } = this.props;
        const { stagesByType } = this.state;
        const stage = stagesByType[type];
        const obj = stageLabels({ operation: stage.operation });
        // Get the top layer, which can be considered as the parent node
        const parent = graph.getDefaultParent();
        // parent - drawing board parent layer, value，x，y - starting point coordinates，width，height, style
        const cell = graph.insertVertex(
            parent,
            target,
            obj,
            x,
            y,
            130,
            72,
            `fillColor=${stage.color};rounded=1;strokeColor=#000000;arcSize=7`
        );
        setDirty(true);
        graph.setSelectionCell(cell);
    };

    // change stages to drag element
    makeDraggable = () => {
        const { graph } = this.props;
        const tasksDrag = this.state.refSidebar.current.querySelectorAll('.stages');
        Array.prototype.slice.call(tasksDrag).forEach(elem => {
            const type = elem.getAttribute('data-type');
            const ds = mxUtils.makeDraggable(
                elem,
                this.graphF,
                (_graph, _event, _target, _x, _y) =>
                    this.addCell(_graph, _event, _target, _x, _y, type),
                null,
                null,
                null,
                graph.autoscroll,
                true
            );
            ds.createDragElement = mxDragSource.prototype.createDragElement;
        });
    };

    doubleClickAdder = stageName => {
        const { graph } = this.props;
        const getRandomPoint = () => {
            const crypto = window.crypto || window.msCrypto;
            const array = new Uint8Array(1);
            crypto.getRandomValues(array); // Compliant for security-sensitive use cases
            const point = array[0];
            if (point >= 150) {
                return point / 2;
            }
            return point;
        };
        const xPoint = getRandomPoint();
        const yPoint = getRandomPoint();
        this.addCell(graph, null, null, xPoint, yPoint, stageName);
    };

    render() {
        const { classes, t } = this.props;
        const { refSidebar, stages } = this.state;

        return (
            <div ref={refSidebar}>
                <Grid container spacing={2}>
                    {stages.map(stage => (
                        <Grid item xs={6} key={stage.operation}>
                            <Card
                                className={`${classes.stages} stages`}
                                data-type={stage.operation}
                                style={{ background: stage.color || '' }}
                                onDoubleClick={() =>
                                    this.doubleClickAdder(stage.operation)
                                }
                            >
                                <StageWithIcon
                                    operation={stage.operation}
                                    name={t(
                                        `jobDesigner:palette.${stage.operation}`
                                    )}
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    }
}

Palette.propTypes = {
    graph: PropTypes.object,
    classes: PropTypes.object,
    setDirty: PropTypes.func,
    t: PropTypes.func
};

export default compose(withStyles(styles), withTranslation())(Palette);
