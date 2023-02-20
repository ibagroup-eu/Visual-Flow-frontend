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
    title: {
        display: 'flex',
        alignItems: 'center'
    },

    text: {
        flexGrow: 1
    },

    row: {
        display: 'flex',
        alignItems: 'center'
    },

    rows: {
        marginTop: theme.spacing(-0.5)
    },

    icon: {
        marginTop: theme.spacing(2)
    },

    formControl: {
        margin: theme.spacing(2, 1, 0, 0),
        minWidth: theme.spacing(9)
    },

    orderColumn: {
        width: '75px'
    },

    required: {
        '&::after': {
            content: '"\\A0*"',
            color: theme.palette.text.secondary
        }
    },

    column: {
        marginRight: theme.spacing(1),
        width: theme.spacing(12)
    }
});
