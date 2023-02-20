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

export default theme => ({
    root: {
        display: 'flex'
    },
    content: {
        width: '100%'
    },
    container: {
        overflow: 'hidden',
        background: theme.palette.primary.background,
        position: 'fixed',
        width: '100%',
        height: '100%'
    },
    panTool: {
        cursor: 'grab'
    },
    popupMenu: {
        position: 'absolute',
        borderRadius: theme.spacing(1),
        paddingBlock: theme.spacing(1),
        boxShadow: theme.shadows[5],
        backgroundColor: theme.palette.background.paper
    },
    popupMenuTable: {
        borderCollapse: 'collapse',
        borderSpacing: 0
    },
    popupMenuItem: {
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        },
        cursor: 'pointer',
        transition: theme.transitions.create('background-color')
    },
    popupMenuItemCell: {
        padding: theme.spacing(0.75, 2),
        whiteSpace: 'nowrap',
        fontSize: '1rem'
    }
});
