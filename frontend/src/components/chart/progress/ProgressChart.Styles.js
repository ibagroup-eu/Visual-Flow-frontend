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
        position: 'relative'
    },
    bottom: {
        color: theme.palette.grey[theme.palette.type === 'light' ? 400 : 700],
        display: 'block'
    },
    top: {
        color: theme.palette.primary.main,
        animationDuration: '550ms',
        position: 'absolute',
        left: 0,
        top: 0,
        display: 'block'
    },
    circle: {
        strokeLinecap: 'round'
    },
    caption: {
        ...theme.typography.h6,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& small': {
            fontSize: '0.75em'
        }
    }
});
