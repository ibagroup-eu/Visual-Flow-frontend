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
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    params: {
        flexGrow: 1
    },
    buttons: {
        whiteSpace: 'nowrap',
        display: 'flex',
        gap: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(8)
    },
    button: {
        minWidth: 100
    },
    cancelBtn: {
        background: theme.palette.grey[600],
        color: theme.palette.primary.contrastText
    },
    section: {
        marginTop: theme.spacing(2)
    },
    tabs: {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        '& .MuiTab-root': {
            minWidth: 'auto'
        }
    },
    content: {
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%'
    }
}));
