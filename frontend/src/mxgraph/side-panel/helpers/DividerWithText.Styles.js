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
    container: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(-1)
    },
    borderLeft: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        width: theme.spacing(1.75)
    },
    borderRight: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        width: '100%'
    },
    content: {
        padding: theme.spacing(0, 0.5),
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        flexShrink: 0
    }
}));
