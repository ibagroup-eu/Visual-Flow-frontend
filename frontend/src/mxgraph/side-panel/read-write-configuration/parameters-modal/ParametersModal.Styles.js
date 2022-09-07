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
    wrapper: {
        maxHeight: 900,
        overflow: 'hidden'
    },
    hidden: {
        visibility: 'hidden'
    },
    flex: {
        display: 'flex'
    },
    spaceBetween: {
        justifyContent: 'space-between'
    },
    end: {
        justifyContent: 'end'
    },
    paddedTop: {
        paddingTop: theme.spacing(3)
    },
    paddedBottom: {
        paddingBottom: theme.spacing(3)
    },
    parameterList: {
        overflow: 'auto',
        maxHeight: 500
    },
    cell: {
        '&:first-child': {
            paddingLeft: '16px !important'
        },
        '&:last-child': {
            paddingRight: '16px !important'
        },
        '& div': {
            backgroundColor: theme.palette.background.paper
        },
        backgroundColor: theme.palette.background.default,
        padding: '8px 4px'
    },
    keyCell: {
        width: 254
    },
    valueCell: {
        width: 710
    },
    buttonsGroup: {
        marginTop: 82,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    button: {
        width: 100,
        margin: theme.spacing(0, 2, 7, 2),
        color: theme.palette.primary.contrastText
    },
    cancelBtn: {
        background: theme.palette.grey[600]
    }
}));
