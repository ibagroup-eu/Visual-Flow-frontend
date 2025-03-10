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
    icon: {
        cursor: 'pointer',
        fill: theme.palette.text.secondary,
        marginLeft: 'auto'
    },
    iconDisabled: {
        fill: theme.palette.grey[400],
        marginLeft: 'auto',
        pointerEvents: 'none'
    },
    error: {
        fill: theme.palette.error.light,
        marginLeft: 'auto',
        position: 'absolute',
        right: 75,
        top: 36,
        cursor: 'pointer'
    },
    spinner: {
        position: 'absolute',
        right: -90,
        top: -60,
        color: theme.palette.success.dark
    },
    rowCountContainer: {
        position: 'absolute',
        right: 0,
        top: 36,
        textAlign: 'left',
        width: 100
    },
    rowCount: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        border: `1px solid ${theme.palette.grey[700]}`,
        borderRadius: 4,
        padding: '0 8px',
        color: theme.palette.grey[700],
        backgroundColor: 'transparent',
        fontSize: '0.75rem',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        display: 'inline-block',
        cursor: 'pointer'
    }
}));
