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
    wrapper: {
        maxHeight: 546,
        overflow: 'hidden',
        minWidth: 356
    },
    header: {
        paddingLeft: 4
    },
    row: {
        height: 64,
        borderRadius: 4,
        paddingTop: theme.spacing(1),
        margin: theme.spacing(0.5, 0.5, 1, 0.5)
    },
    linear: {
        background: theme.palette.secondary.light
    },
    center: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: theme.spacing(1)
    },
    paddingLeft: {
        paddingLeft: theme.spacing(2)
    },
    hint: {
        color: theme.palette.text.hint
    },
    truncate: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    secondary: {
        color: theme.palette.text.secondary
    },
    buttonsGroup: {
        marginTop: 52,
        textAlign: 'center'
    },
    button: {
        height: 40,
        minWidth: 160,
        margin: theme.spacing(0, 2, 7, 2),
        color: theme.palette.primary.contrastText
    },
    cancelBtn: {
        background: theme.palette.grey[600]
    },
    typography: {
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(1)
    }
}));
