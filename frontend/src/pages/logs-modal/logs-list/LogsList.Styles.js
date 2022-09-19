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
        marginTop: theme.spacing(-3)
    },
    logsHeader: {
        minWidth: 700,
        width: '85vw',
        maxWidth: '100%'
    },
    list: {
        wordBreak: 'break-word',
        height: '70vh',
        minWidth: 700,
        width: '85vw',
        maxWidth: '100%',
        overflow: 'auto',
        borderRadius: 4,
        backgroundColor: theme.palette.background.paper,
        boxShadow:
            '0px 3px 3px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.14), 0px 1px 8px rgba(0, 0, 0, 0.12)'
    },
    listModal: {
        height: '45vh'
    },
    textItem: {
        padding: theme.spacing(0, 2),
        margin: 0
    },
    text: {
        padding: 0,
        margin: 0,
        fontFamily: 'monospace'
    },
    highlight: {
        background: theme.palette.warning.light
    },
    textMultisting: {
        whiteSpace: 'pre'
    }
}));
