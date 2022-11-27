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
        minHeight: theme.spacing(4.5)
    },
    opposite: {
        display: 'none'
    },
    dotSize: {
        fontSize: '0.75rem'
    },
    dot: {
        padding: 0,
        margin: 0,
        boxShadow: 'none'
    },
    logIcon: {
        padding: 0,
        marginTop: theme.spacing(-1)
    },
    logIconBox: {
        marginRight: theme.spacing(3)
    },
    timelineContent: {
        display: 'flex',
        padding: 0
    },
    nameText: {
        marginLeft: theme.spacing(4.25),
        marginRight: theme.spacing(3),
        width: theme.spacing(25.45),
        overflow: 'hidden'
    },
    startedText: {
        width: theme.spacing(10.5),
        marginRight: theme.spacing(3),
        color: theme.palette.text.secondary
    },
    durationText: {
        marginRight: theme.spacing(3),
        width: theme.spacing(12),
        color: theme.palette.text.secondary
    },
    typography: {
        whiteSpace: 'nowrap',
        lineHeight: 1.1,
        height: 'min-content'
    }
}));
