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

const drawerWidth = 360;

export default theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        left: 'auto'
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflow: 'hidden',
        width: 0
    },
    content: {
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    hidden: {
        display: 'none'
    },
    form: {
        width: 350,
        padding: '10px 30px'
    },
    separated: {
        display: 'flex',
        alignItems: 'center'
    },
    infoIcon: {
        margin: 5,
        cursor: 'pointer',
        color: 'grey'
    },
    leftAuto: {
        marginLeft: 'auto'
    }
});
