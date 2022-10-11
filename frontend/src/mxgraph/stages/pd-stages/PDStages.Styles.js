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
import { alpha } from '@material-ui/core';

export default makeStyles(theme => ({
    root: {
        position: 'relative'
    },
    title: {
        position: 'absolute',
        left: -100,
        top: -60,
        display: 'flex',
        flexWrap: 'nowrap',
        whiteSpace: 'normal',
        width: 204,
        '& span': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left'
        }
    },
    name: {
        paddingLeft: theme.spacing(1),
        overflow: 'hidden',
        flexGrow: 1
    },
    tooltip: {
        position: 'absolute',
        left: -99,
        top: -30,
        color: 'white',
        borderRadius: 4,
        maxWidth: 190,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    },
    image: {
        backgroundColor: theme.palette.primary.border,
        whiteSpace: 'pre-wrap'
    },
    jobName: {
        backgroundColor: alpha(theme.palette.secondary.dark, 0.8)
    },
    pipelineName: {
        backgroundColor: theme.palette.warning.light
    },
    logIcon: {
        cursor: 'pointer',
        fill: theme.palette.text.secondary,
        marginLeft: 'auto'
    }
}));
