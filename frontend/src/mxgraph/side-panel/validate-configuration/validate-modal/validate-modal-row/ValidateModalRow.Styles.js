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
    cell: {
        padding: 0,
        borderBottom: 0,
        backgroundColor: theme.palette.background.default
    },
    columnRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(0, 1.5)
    },
    columnHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        userSelect: 'none'
    },
    withPointer: {
        cursor: 'pointer'
    },
    headerIcon: {
        padding: theme.spacing(0.75),
        marginRight: theme.spacing(1.25),
        transition: theme.transitions.create('transform')
    },
    headerIconClose: {
        transform: 'rotate(-90deg)'
    },
    columnName: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        '&:hover button': {
            opacity: 1
        }
    },
    columnMenu: {
        opacity: 0,
        transition: theme.transitions.create('opacity')
    },
    collapse: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1.5),
        marginLeft: theme.spacing(7.375)
    }
}));
