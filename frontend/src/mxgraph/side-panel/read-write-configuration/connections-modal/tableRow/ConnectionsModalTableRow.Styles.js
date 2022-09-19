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
    row: {
        display: 'flex',
        width: '100%'
    },
    column: {
        display: 'flex',
        flexDirection: 'column'
    },
    tableCell: {
        width: '100%',
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1, 0.5)
    },
    cell: {
        padding: theme.spacing(0, 0.5)
    },
    buttonCell: {
        padding: theme.spacing(2)
    },
    keyCell: {
        width: '30%'
    },
    valueCell: {
        width: '100%'
    },
    openRest: {
        transition: theme.transitions.create('transform'),
        transform: 'rotate(0deg)'
    },
    closeRest: {
        transition: theme.transitions.create('transform'),
        transform: 'rotate(180deg)'
    },
    rest: {
        margin: theme.spacing(1, 8.5, 0, 8.5),
        border: '1px solid rgba(0, 0, 0, 0.26)',
        borderRadius: 4
    },
    restNotEditable: {
        paddingLeft: theme.spacing(0.5)
    },
    restInputPadding: {
        padding: theme.spacing(0, 1.75)
    },
    paper: {
        backgroundColor: theme.palette.background.paper
    }
}));
