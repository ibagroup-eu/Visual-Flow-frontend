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

import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core';

const drawerWidth = 321;

export default makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    toolbar: {
        padding: 0
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflow: 'hidden',
        width: theme.spacing(4)
    },
    content: {
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    hidden: {
        display: 'none'
    },
    toggleButton: {
        color: theme.palette.text.secondary,
        position: 'fixed',
        top: '50%',
        backgroundColor: theme.palette.secondary.light,
        border: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1,
        '&:hover': {
            backgroundColor: darken(theme.palette.secondary.light, 0.04)
        }
    },
    toggleButtonLabel: {
        marginRight: theme.spacing(-0.5),
        paddingLeft: theme.spacing(0.5)
    },
    iconOpen: {
        left: theme.spacing(1),
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    iconClose: {
        boxSizing: 'border-box',
        left: drawerWidth - theme.spacing(3),
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    }
}));
