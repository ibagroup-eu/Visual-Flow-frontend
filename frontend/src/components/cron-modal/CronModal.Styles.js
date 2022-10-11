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
    button: {
        width: 100,
        margin: theme.spacing(0, 2, 2, 2),
        color: theme.palette.primary.contrastText
    },
    cancelBtn: {
        background: theme.palette.grey[600]
    },
    buttonsGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    switchBox: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: theme.spacing(0, 0, 3, 0)
    },
    cell: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1, 0, 1, 3)
    },
    activeCell: {
        color: theme.palette.grey[600]
    },
    disabledColor: {
        color: theme.palette.grey[400]
    },
    tableBox: {
        width: 270,
        margin: theme.spacing(3, 0, 5, 0),
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    cronBox: {
        display: 'flex',
        justifyContent: 'center',
        margin: theme.spacing(0, 10, 0, 10)
    },
    labelsBox: {
        width: 300,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between'
    },
    label: {
        verticalAlign: 'top',
        width: 50,
        fontSize: 13,
        textAlign: 'center'
    },
    activeLabel: {
        color: theme.palette.grey[800]
    },
    cronInput: {
        fontSize: 35,
        textAlign: 'center',
        padding: theme.spacing(1, 0, 1, 0)
    },
    errorLabel: {
        color: theme.palette.error.main
    },
    messageBox: {
        textAlign: 'center'
    },
    inputMinWidth: {
        minWidth: 330
    },
    runInfoLabel: {
        color: theme.palette.secondary.dark
    },
    runTimeLabel: {
        fontSize: 25,
        margin: theme.spacing(-1, 0, 1, 0)
    },
    nextCron: {
        margin: theme.spacing(0, 0, 2, 0)
    }
}));
