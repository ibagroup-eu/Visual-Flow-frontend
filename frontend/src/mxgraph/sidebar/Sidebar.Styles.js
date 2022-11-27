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
import { alpha, darken } from '@material-ui/core';

const drawerWidth = 321;

export default makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 3
    },
    toolbar: {
        padding: 0
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width'),
        overflow: 'hidden'
    },
    drawerClose: {
        transition: theme.transitions.create('width'),
        width: theme.spacing(4),
        overflow: 'hidden'
    },
    content: {
        width: '100%',
        height: '100%',
        display: 'flex',
        overflow: 'hidden'
    },
    showContent: {
        transition: theme.transitions.create('transform'),
        transform: 'none'
    },
    hideContent: {
        transition: theme.transitions.create('transform'),
        transform: `translateX(-${drawerWidth}px)`
    },
    toggleButton: {
        padding: 0,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        position: 'fixed',
        top: '50%',
        border: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1,
        '&:hover': {
            backgroundColor: theme.palette.background.default
        },
        '& .MuiIconButton-label': {
            padding: '3px',
            backgroundColor: alpha(theme.palette.secondary.main, 0.5),
            borderRadius: '50%',
            '&:hover': {
                backgroundColor: darken(theme.palette.secondary.main, 0.04)
            }
        }
    },
    toggleButtonLabel: {
        marginRight: theme.spacing(-0.5),
        paddingLeft: theme.spacing(0.5)
    },
    iconOpen: {
        left: theme.spacing(1),
        transition: theme.transitions.create(['left', 'transform']),
        transform: 'rotate(180deg)'
    },
    iconClose: {
        boxSizing: 'border-box',
        left: drawerWidth - theme.spacing(3),
        transition: theme.transitions.create(['left', 'transform']),
        transform: 'rotate(0deg)'
    }
}));
