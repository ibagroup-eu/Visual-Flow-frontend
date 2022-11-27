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

const Union = props => {
    return (
        <SvgIcon width="16" height="16" viewBox="0 0 16 16" {...props}>
            <ellipse cx="8" cy="8" rx="1" ry="3" fill="#757575" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.25021 11.3075C6.60912 11.7445 5.83439 12 5 12C2.79086 12 1 10.2091 1 8C1 5.79086 2.79086 4 5 4C5.83439 4 6.60912 4.25548 7.25021 4.69248C6.47213 5.57393 6 6.73183 6 8C6 9.26817 6.47213 10.4261 7.25021 11.3075ZM8 12.0004C7.16434 12.6281 6.12561 13 5 13C2.23858 13 0 10.7614 0 8C0 5.23858 2.23858 3 5 3C6.12561 3 7.16434 3.37194 8 3.99963C8.83566 3.37194 9.87439 3 11 3C13.7614 3 16 5.23858 16 8C16 10.7614 13.7614 13 11 13C9.87439 13 8.83566 12.6281 8 12.0004ZM8.74979 4.69249C9.39089 4.25548 10.1656 4 11 4C13.2091 4 15 5.79086 15 8C15 10.2091 13.2091 12 11 12C10.1656 12 9.39089 11.7445 8.74979 11.3075C9.52787 10.4261 10 9.26817 10 8C10 6.73183 9.52787 5.57393 8.74979 4.69249ZM8 5.35418C8.62236 6.05931 9 6.98555 9 8C9 9.01445 8.62236 9.94069 8 10.6458C7.37764 9.94069 7 9.01445 7 8C7 6.98555 7.37764 6.05931 8 5.35418Z"
            />
        </SvgIcon>
    );
};
export default Union;
