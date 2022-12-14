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

const RemoveDuplicates = props => {
    return (
        <SvgIcon width="16" height="16" viewBox="0 0 16 16" {...props}>
            <path
                fill="none"
                d="M3.5 9H8.5M2.66667 14H9.33333C10.2538 14 11 13.2538 11 12.3333V5.66667C11 4.74619 10.2538 4 9.33333 4H2.66667C1.74619 4 1 4.74619 1 5.66667V12.3333C1 13.2538 1.74619 14 2.66667 14Z"
                stroke="rgba(0, 0, 0, 0.54)"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.0566 3.66667H5.02765C5.06781 3.4273 5.15049 3.20234 5.26765 2.99984L5.70043 3.25024L6.13321 3.50065C6.10286 3.55311 6.07712 3.60859 6.0566 3.66667ZM11.6667 11V12H13C13.3643 12 13.7059 11.9026 14.0002 11.7323L13.7498 11.2996L13.4993 10.8668C13.3533 10.9513 13.1838 11 13 11H11.6667ZM14.5 6H15V4C15 3.63565 14.9026 3.29405 14.7323 2.99984L14.2996 3.25024L13.8668 3.50065C13.9513 3.64673 14 3.81616 14 4V6H14.5ZM7 2H9V2.5V3H7C6.81616 3 6.64673 3.04869 6.50064 3.13322L6.25024 2.70044L5.99984 2.26766C6.29405 2.09743 6.63564 2 7 2ZM11 2.5V2H13C13.3643 2 13.7059 2.09743 14.0002 2.26766L13.7498 2.70044L13.4993 3.13322C13.3533 3.04869 13.1838 3 13 3H11V2.5ZM14.5 8H15V10C15 10.3644 14.9026 10.7059 14.7323 11.0002L14.2996 10.7498L13.8668 10.4994C13.9513 10.3533 14 10.1838 14 10V8H14.5Z"
            />
        </SvgIcon>
    );
};
export default RemoveDuplicates;
