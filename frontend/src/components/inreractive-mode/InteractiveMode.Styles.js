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
    generalSettings: {
        width: '75%',
        flexShrink: 0,
        marginLeft: 10
    },
    accordionText: {
        right: 40,
        color: theme.palette.text.secondary
    },
    root: {
        height: 400,
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    card: {
        margin: '5% 0',
        maxWidth: '70%',
        width: '70%',
        minWidth: '40%',
        height: 'max-content',
        overflow: 'auto',
        borderRadius: 10,
        maxHeight: '95%',
        outline: 'none'
    },
    inputTable: {
        maxHeight: 390,
        minHeight: 390
    },
    exemplarTable: {
        maxHeight: 570,
        minHeight: 570
    },
    tableContainer: {
        padding: 24
    },
    exemplarPaper: {
        height: 570,
        padding: 24,
        textAlign: 'center'
    },
    exemplarPaperOpen: {
        height: '100%',
        width: '100%',
        padding: 24,
        textAlign: 'center'
    },
    outputCard: {
        padding: 24,
        height: 515
    },
    inputCard: {
        height: 515
    },
    checkbox: {
        padding: 3
    },
    schemaWarning: {
        paddingBottom: 24,
        paddingTop: 24,
        textAlign: 'center',
        fontSize: 14
    },
    popoverContainer: {
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
    },
    popoverText: {
        fontSize: 14,
        color: theme.palette.grey[800],
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap'
    },
    popoverIcon: {
        color: theme.palette.error.light,
        verticalAlign: 'middle',
        paddingRight: 5
    }
}));
