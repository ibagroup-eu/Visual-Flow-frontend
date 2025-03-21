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
    cell: {
        textAlign: 'center',
        verticalAlign: 'top'
    },
    hint: {
        color: theme.palette.text.hint
    },
    chip: {
        minWidth: theme.spacing(11)
    },
    chipDraft: {
        color: theme.palette.grey[600],
        borderColor: theme.palette.grey[600]
    },
    chipRunning: {
        color: theme.palette.info.main,
        borderColor: theme.palette.info.main
    },
    chipDebugging: {
        color: theme.palette.info.main,
        borderColor: theme.palette.info.main
    },
    chipSucceeded: {
        color: theme.palette.success.main,
        borderColor: theme.palette.success.main
    },
    chipError: {
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main,
        '&:hover': {
            color: theme.palette.error.main
        }
    },
    chipFailed: {
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main
    },
    chipTerminated: {
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main
    },
    chipSuspended: {
        color: theme.palette.warning.main,
        borderColor: theme.palette.warning.main
    }
});
