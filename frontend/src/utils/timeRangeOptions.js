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

import moment from 'moment';
import { DATE_FORMAT } from '../globalConstants';

const getLocalTime = data =>
    moment
        .utc(data)
        .local()
        .format(DATE_FORMAT);

export default {
    'last hour': date =>
        moment()
            .subtract({ hours: 1, minutes: 30 })
            .isBefore(getLocalTime(date)),
    'last 3 hours': date =>
        moment()
            .subtract({ hours: 3, minutes: 30 })
            .isBefore(getLocalTime(date)),
    'last 8 hours': date =>
        moment()
            .subtract({ hours: 8, minutes: 30 })
            .isBefore(getLocalTime(date)),
    '1 day ago': date =>
        moment()
            .subtract({ days: 1, hours: 12 })
            .isBefore(getLocalTime(date)),
    '3 days ago': date =>
        moment()
            .subtract({ days: 3, hours: 12 })
            .isBefore(getLocalTime(date)),
    '7 days ago': date =>
        moment()
            .subtract({ days: 7, hours: 12 })
            .isBefore(getLocalTime(date))
};
