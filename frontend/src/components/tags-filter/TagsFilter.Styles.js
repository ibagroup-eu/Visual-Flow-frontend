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
    paper: {
        border: `1px solid ${theme.palette.grey[400]}`,
        width: 500,
        padding: theme.spacing(1.5),
        marginTop: theme.spacing(0.5),
        transition: theme.transitions.create(['transform']),
        transform: 'translateY(4px)'
    },
    paperClose: {
        transform: 'translateY(4px) !important'
    },
    filteredTags: {
        paddingBottom: theme.spacing(1.5)
    },
    tags: {
        overflowY: 'auto',
        marginTop: theme.spacing(1.5),
        maxHeight: '35vh'
    },
    button: {
        textTransform: 'none',
        color: theme.palette.secondary.dark,
        fontWeight: 400,
        marginTop: theme.spacing(0.5)
    },
    collapse: {
        visibility: 'visible',
        maxHeight: '35vh'
    },
    noResult: {
        paddingLeft: theme.spacing(1.5),
        color: theme.palette.primary.main
    }
}));
