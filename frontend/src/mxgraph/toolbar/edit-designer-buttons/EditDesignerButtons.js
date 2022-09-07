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
import { IconButton, Tooltip } from '@material-ui/core';
import { Undo, Redo, Delete, Refresh } from '@material-ui/icons';
import { has } from 'lodash';

const PIPELINE = 'PIPELINE';

const EditDesignerButtons = ({
    data,
    graph,
    reversible,
    refresh,
    editable,
    setSidePanel,
    sidePanelIsOpen,
    setDirty,
    t,
    undoButtonsDisabling,
    setCurrentCell,
    type
}) => (
    <>
        {editable && (
            <>
                <IconButton
                    aria-label="undoIcon"
                    disabled={undoButtonsDisabling.undo}
                    onClick={() => {
                        reversible.undo();
                    }}
                >
                    <Tooltip title={t('jobs:tooltip.Undo')} arrow>
                        <Undo />
                    </Tooltip>
                </IconButton>
                <IconButton
                    aria-label="redoIcon"
                    disabled={undoButtonsDisabling.redo}
                    onClick={() => {
                        reversible.redo();
                    }}
                >
                    <Tooltip title={t('jobs:tooltip.Redo')} arrow>
                        <Redo />
                    </Tooltip>
                </IconButton>
                <IconButton
                    aria-label="deleteIcon"
                    onClick={() => {
                        if (graph.isEnabled()) {
                            sidePanelIsOpen && setSidePanel(false);
                            const currentNodes = graph.getSelectionCells();
                            graph.removeCells(currentNodes);
                            graph.popupMenuHandler.hideMenu();
                            if (type === PIPELINE) {
                                setCurrentCell('');
                            }
                            if (currentNodes.length !== 0) {
                                setDirty(true);
                            }
                        }
                    }}
                >
                    <Tooltip title={t('jobs:tooltip.Remove')} arrow>
                        <Delete />
                    </Tooltip>
                </IconButton>
            </>
        )}
        {has(data, 'editable') && (
            <IconButton aria-label="refreshIcon" onClick={refresh}>
                <Tooltip title={t('jobs:tooltip.Refresh')} arrow>
                    <Refresh />
                </Tooltip>
            </IconButton>
        )}
    </>
);

EditDesignerButtons.propTypes = {
    setSidePanel: PropTypes.func,
    sidePanelIsOpen: PropTypes.bool,
    data: PropTypes.object,
    setDirty: PropTypes.func,
    graph: PropTypes.object,
    reversible: PropTypes.object,
    refresh: PropTypes.func,
    editable: PropTypes.bool,
    t: PropTypes.func,
    undoButtonsDisabling: PropTypes.object,
    setCurrentCell: PropTypes.func,
    type: PropTypes.string
};

export default EditDesignerButtons;
