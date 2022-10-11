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
    count: {
        marginLeft: theme.spacing(0.68),
        cursor: 'pointer',
        color: theme.palette.text.secondary
    },
    buttonName: {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary
    },
    onOpenTags: {
        transition: theme.transitions.create('transform'),
        transform: 'rotate(0deg)'
    },
    onCloseTags: {
        transition: theme.transitions.create('transform'),
        transform: 'rotate(180deg)'
    }
}));
