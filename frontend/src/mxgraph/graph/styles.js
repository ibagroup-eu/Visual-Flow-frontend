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
import { get, isEmpty } from 'lodash';

import { mxConstants, mxEdgeStyle, mxPerimeter } from './graph';
import {
    ERROR,
    FAILED,
    PENDING,
    RUNNING,
    SKIPPED,
    SUCCEEDED,
    TERMINATED
} from '../constants';

export const getDefaultVertexStyle = theme => ({
    [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_RECTANGLE,
    [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter,
    [mxConstants.STYLE_VERTICAL_ALIGN]: mxConstants.ALIGN_MIDDLE,
    [mxConstants.STYLE_ALIGN]: mxConstants.ALIGN_CENTER,
    [mxConstants.STYLE_STROKECOLOR]: theme.palette.other.border,
    [mxConstants.STYLE_STROKEWIDTH]: theme.mxgraph.border.normal,
    [mxConstants.STYLE_ROUNDED]: 1
});

export const getDefaultEdgeStyle = theme => ({
    [mxConstants.STYLE_STROKECOLOR]: theme.palette.success.light,
    [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_CONNECTOR,
    [mxConstants.STYLE_ALIGN]: mxConstants.ALIGN_CENTER,
    [mxConstants.STYLE_VERTICAL_ALIGN]: mxConstants.ALIGN_MIDDLE,
    [mxConstants.STYLE_EDGE]: mxEdgeStyle.ElbowConnector,
    [mxConstants.STYLE_ENDARROW]: mxConstants.ARROW_CLASSIC,
    [mxConstants.STYLE_ROUNDED]: 1
});

export const getBorderColor = (status, theme) => {
    const COLORS = {
        [SUCCEEDED]: theme.palette.success.light,
        [FAILED]: theme.palette.error.light,
        [RUNNING]: theme.palette.info.text,
        [PENDING]: theme.palette.info.text,
        [TERMINATED]: theme.palette.error.light,
        [SKIPPED]: theme.palette.other.skipped,
        [ERROR]: theme.palette.error.light
    };

    return COLORS[status];
};

export const getWaitBorderColor = (node, statuses, theme) => {
    const parentStatuses = get(node, 'edges', [])
        .filter(edge => node.id === edge.target)
        .reduce((acc, edge) => [...acc, get(statuses, edge.source)], []);

    return !isEmpty(parentStatuses) &&
        parentStatuses.every(status => status === SUCCEEDED)
        ? getBorderColor(SUCCEEDED, theme)
        : undefined;
};

export const setDefaultPopupMenuStyle = (menu, classes) => {
    menu.div.classList.add(classes.popupMenu);
    menu.table.classList.add(classes.popupMenuTable);
    menu.tbody.childNodes.forEach(item => {
        item.classList.add(classes.popupMenuItem);
        item.firstChild.remove();
        item.lastChild.remove();
        item.firstChild.classList.add(classes.popupMenuItemCell);
    });
};
