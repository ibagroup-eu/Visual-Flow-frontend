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
        minWidth: theme.breakpoints.values.md,
        width: '100%',
        [theme.breakpoints.down(theme.breakpoints.values.md)]: {
            minWidth: '100%'
        }
    },
    table: {
        backgroundColor: theme.palette.background.default,
        margin: theme.spacing(2, 0)
    },
    row: {
        verticalAlign: 'top'
    },
    cell: {
        padding: theme.spacing(1, 0.5),
        '& .MuiBox-root': {
            justifyContent: 'start !important',
            margin: theme.spacing(1, 0),
            '& .MuiIconButton-root': {
                padding: theme.spacing(1)
            }
        }
    },
    key: {
        width: '35%'
    },
    addButton: {
        color: theme.palette.secondary.dark
    },
    button: {
        width: 100,
        margin: theme.spacing(0, 2, 2, 2),
        color: theme.palette.primary.contrastText
    },
    cancelBtn: {
        background: theme.palette.grey[600]
    },
    buttonsGroup: {
        marginTop: 24,
        display: 'flex',
        justifyContent: 'center'
    }
});
