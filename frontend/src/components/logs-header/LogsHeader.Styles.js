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

export default makeStyles(theme => ({
    root: {
        margin: theme.spacing(2, 0, 4)
    },
    right: {
        height: 40,
        padding: 0,
        verticalAlign: 'center'
    },
    InputLabel: {
        background: '#E0E0E0'
    },
    selectButton: {
        background: '#E0E0E0',
        width: 200,
        border: 0
    },
    search: {
        width: '35%'
    },
    autoRefresh: {
        '&.MuiToggleButton-root.Mui-selected:hover': {
            backgroundColor: theme.palette.primary.dark
        },
        '&.MuiToggleButton-root.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
        },
        '&.MuiToggleButton-root:hover': {
            backgroundColor: theme.palette.action.disabled
        },
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
        transition: theme.transitions.create(['background-color', 'color']),
        border: 0,
        paddingBlock: theme.spacing(1),
        paddingInline: theme.spacing(2.625)
    }
}));
