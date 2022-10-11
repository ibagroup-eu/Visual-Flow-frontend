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
    header: {
        display: 'flex',
        alignItems: 'center'
    },

    name: {
        fontWeight: 400,
        paddingLeft: '6%'
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3)
    },
    avatar: {
        backgroundColor: '#BDBDBD',
        marginLeft: theme.spacing(7),
        width: '70px',
        height: '70px'
    },
    titles: {
        marginLeft: theme.spacing(7),
        display: 'block',
        color: '#9E9E9E'
    },
    values: {
        marginLeft: theme.spacing(2),
        display: 'block',

        color: '#757575',
        marginRight: theme.spacing(13)
    },
    wrapper: {
        display: 'flex',
        fontWeight: 500,
        marginBottom: theme.spacing(10)
    },
    token: {
        padding: theme.spacing(1),
        marginLeft: theme.spacing(-1)
    }
}));
