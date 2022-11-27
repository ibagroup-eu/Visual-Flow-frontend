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

import React from 'react';
import { SvgIcon } from '@material-ui/core';

const Transform = props => {
    return (
        <SvgIcon width="16" height="17" viewBox="0 0 16 17" {...props} fill="none">
            <path
                fill="none"
                stroke="black"
                d="M7.74359 8.33329L10.4103 1.66663L14.4103 11.6666C13.7721 12.1452 12.2941 12.4711 10.7436 12.5347"
            />
            <path
                fill="none"
                stroke="black"
                d="M2.0769 10.3333V14.3333L6.0769 16.3333M2.0769 10.3333L6.0769 12.3333M2.0769 10.3333L6.0769 8.33325L10.0769 10.3333M6.0769 16.3333L10.0769 14.3333V10.3333M6.0769 16.3333V12.3333M10.0769 10.3333L6.0769 12.3333"
            />
            <path fill="none" stroke="black" d="M11.053 6.87622L12.0769 10.3333" />
            <path
                fill="none"
                stroke="black"
                d="M2.81543 8.34349C2.76403 7.01944 3.16097 6.35451 3.66775 5.84246C4.00767 5.49901 4.44267 5.26814 4.89675 5.10287L7.3423 4.21276M7.3423 4.21276C7.3423 4.21276 5.39815 3.62319 4.15242 3.24543M7.3423 4.21276L5.5205 7.0042"
            />
        </SvgIcon>
    );
};
export default Transform;
