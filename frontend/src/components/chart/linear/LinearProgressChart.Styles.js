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
        minWidth: theme.spacing(19),
        maxWidth: theme.spacing(19),
        margin: '0 auto',
        padding: theme.spacing(0, 0.5),
        position: 'relative',
        textAlign: 'center'
    },

    statusDraft: {
        backgroundColor: theme.palette.grey[300]
    },
    statusRunning: {
        backgroundColor: '#9FD2EE'
    },
    statusSucceeded: {
        backgroundColor: theme.palette.success.light
    },
    statusError: {
        backgroundColor: '#FBB7B3'
    },

    statusBarDraft: {
        backgroundColor: theme.palette.grey[600]
    },
    statusBarRunning: {
        backgroundColor: theme.palette.primary.main
    },
    statusBarSucceeded: {
        backgroundColor: theme.palette.success.main
    },
    statusBarError: {
        backgroundColor: theme.palette.error.main
    },

    statusColorDraft: {
        color: theme.palette.grey[600]
    },
    statusColorRunning: {
        color: theme.palette.primary.main
    },
    statusColorSucceeded: {
        color: theme.palette.success.main
    },
    statusColorError: {
        color: theme.palette.error.main
    },
    caption: {
        ...theme.typography.h6
    },
    margins: {
        marginTop: '0',
        marginBottom: '0'
    }
});
