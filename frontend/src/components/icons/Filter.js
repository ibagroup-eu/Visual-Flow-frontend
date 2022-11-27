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

const Filter = props => {
    return (
        <SvgIcon width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
            <path
                fill="none"
                stroke="black"
                d="M9.33332 8L13.3333 2H2.66666L6.66666 8M9.33332 8V11.6667L6.66666 14V8M9.33332 8H6.66666"
            />
        </SvgIcon>
    );
};
export default Filter;
