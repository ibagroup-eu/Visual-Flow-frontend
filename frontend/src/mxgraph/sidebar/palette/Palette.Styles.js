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

export default () => ({
    stages: {
        border: '1px solid rgba(0, 0, 0, 0.12)',
        'border-radius': '15px',
        width: 120,
        height: 72,
        cursor: 'pointer',
        display: 'grid',
        'align-content': 'center',
        '-webkit-touch-callout': ' none' /* iOS Safari */,
        '-webkit-user-select': 'none' /* Safari */,
        '-khtml-user-select': 'none' /* Konqueror HTML */,
        '-moz-user-select': 'none' /* Old versions of Firefox */,
        '-ms-user-select': 'none' /* Internet Explorer/Edge */,
        'user-select':
            'none' /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */,
        '& .MuiCardContent-root:last-child': {
            'padding-bottom': 16
        }
    },
    stage: {
        'text-align': 'center'
    }
});
